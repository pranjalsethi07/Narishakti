"""Build an AI-narrated lesson video from a lesson script (lessons/<id>.json).

  python tools/lesson-video/build.py health-2        # one lesson
  python tools/lesson-video/build.py --all           # every script in lessons/

For each lesson it writes, into public/videos/learn/:
  <id>.mp4      1920x1080 video: slides whose points appear as the narrator says them
  <id>.hi.vtt   Hindi subtitles (the narration, word for word)
  <id>.en.vtt   English subtitles (a translation of each line)
  <id>.jpg      the poster (the title slide)

Needs: ffmpeg/ffprobe on PATH, Google Chrome, and `pip install edge-tts` (Microsoft's neural
voices; it needs internet). The lesson script is the only thing sent to the voice service.
"""
import asyncio
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

import edge_tts

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = ROOT / 'public' / 'videos' / 'learn'
WORK = HERE / '.work'
CHROME = next(
    (p for p in [
        os.environ.get('CHROME'),
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        shutil.which('google-chrome') or '',
        shutil.which('chromium') or '',
    ] if p and Path(p).exists()),
    None,
)
LEAD, TAIL = 0.25, 0.45        # silence before and after each spoken line (seconds)
FADE_IN, FADE_SLIDE = 0.35, 0.6  # crossfade when a point appears / when the slide changes
END_HOLD = 1.2                 # the last frame stays this long after the narration ends


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    if r.returncode != 0:
        raise SystemExit(f"command failed: {' '.join(map(str, cmd[:6]))} …\n{r.stderr[-2500:]}")
    return r.stdout


def duration(path):
    return float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)]).strip())


async def speak(text, voice, rate, path):
    await edge_tts.Communicate(text, voice, rate=rate).save(str(path))


def render(state, path):
    html = (HERE / 'slide.html').read_text(encoding='utf-8').replace('/*DATA*/null', json.dumps(state, ensure_ascii=False))
    page = path.with_suffix('.html')
    page.write_text(html, encoding='utf-8')
    run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1.5',
         '--window-size=1280,720', '--virtual-time-budget=4000', f'--user-data-dir={WORK / "chrome"}',
         f'--screenshot={path}', page.as_uri()])


def key(*parts):
    return hashlib.sha1(json.dumps(parts, ensure_ascii=False).encode()).hexdigest()[:10]


def ts(t):
    h, rem = divmod(max(t, 0), 3600)
    m, s = divmod(rem, 60)
    return f'{int(h):02d}:{int(m):02d}:{s:06.3f}'


def cues(text, start, end):
    """Split a long line into subtitle-sized pieces, timed by their share of the characters."""
    parts = [p.strip() for p in re.split(r'(?<=[।.!?,:])\s+', text) if p.strip()]
    pieces, cur = [], ''
    for p in parts:  # join short pieces so a cue is not a word or two
        cur = f'{cur} {p}'.strip()
        if len(cur) >= 38:
            pieces.append(cur)
            cur = ''
    if cur:
        if pieces and len(cur) < 20:
            pieces[-1] += ' ' + cur
        else:
            pieces.append(cur)
    total = sum(len(p) for p in pieces) or 1
    out, t = [], start
    for p in pieces:
        d = (end - start) * len(p) / total
        out.append((t, t + d, p))
        t += d
    return out


def build(lesson_id):
    spec = json.loads((HERE / 'lessons' / f'{lesson_id}.json').read_text(encoding='utf-8'))
    voice, rate = spec.get('voice', 'hi-IN-SwaraNeural'), spec.get('rate', '-4%')
    work = WORK / lesson_id
    work.mkdir(parents=True, exist_ok=True)  # kept between runs: voice clips and slides are cached by content
    OUT.mkdir(parents=True, exist_ok=True)

    slides = spec['slides']
    segs = []  # one segment per spoken line: its picture, its audio, its length
    for si, slide in enumerate(slides):
        for pi, part in enumerate(slide['parts']):
            reveal = part.get('reveal', 0)
            state = {**{k: v for k, v in slide.items() if k != 'parts'}, 'reveal': reveal, 'index': si, 'total': len(slides),
                     'course': spec['course'], 'lessonNo': spec['lessonNo'], 'isTitle': si == 0}
            img = work / f's{si:02d}-r{reveal}-{key(state, (HERE / "slide.html").read_text(encoding="utf-8"))}.png'
            if not img.exists():
                render(state, img)
            mp3 = work / f's{si:02d}-p{pi}-{key(part["hi"], voice, rate)}.mp3'
            if not mp3.exists():
                asyncio.run(speak(part['hi'], voice, rate, mp3))
            wav = work / f's{si:02d}-p{pi}.wav'
            run(['ffmpeg', '-y', '-v', 'error', '-i', str(mp3), '-af',
                 f'adelay={int(LEAD * 1000)}:all=1,apad=pad_dur={TAIL}', '-ar', '48000', '-ac', '1', str(wav)])
            spoken = duration(mp3)
            segs.append({'img': img, 'wav': wav, 'len': duration(wav), 'spoken': spoken, 'part': part,
                         'new_slide': pi == 0 and si > 0})
            print(f'  slide {si + 1}/{len(slides)} line {pi + 1}: {spoken:.1f}s')

    # Video: each segment is a still that crossfades into the next. A segment lasts its audio plus the
    # fade that follows it, so every fade starts exactly when the next line begins to be spoken.
    fades = [(FADE_SLIDE if segs[k + 1]['new_slide'] else FADE_IN) for k in range(len(segs) - 1)] + [END_HOLD]
    inputs, chain = [], []
    for k, s in enumerate(segs):
        inputs += ['-loop', '1', '-framerate', '30', '-t', f"{s['len'] + fades[k]:.3f}", '-i', str(s['img'])]
    label, elapsed = '[0:v]', 0.0
    for k in range(len(segs) - 1):
        elapsed += segs[k]['len']
        nxt = f'[v{k + 1}]'
        chain.append(f"{label}[{k + 1}:v]xfade=transition={'smoothleft' if segs[k + 1]['new_slide'] else 'fade'}:"
                     f"duration={fades[k]}:offset={elapsed:.3f}{nxt}")
        label = nxt
    chain.append(f'{label}scale=1920:1080:flags=lanczos,format=yuv420p[vout]')
    listing = work / 'audio.txt'
    listing.write_text(''.join(f"file '{s['wav'].as_posix()}'\n" for s in segs), encoding='utf-8')
    audio = work / 'narration.wav'
    run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', str(listing),
         '-af', f'apad=pad_dur={END_HOLD}', str(audio)])
    graph = work / 'graph.txt'
    graph.write_text(';\n'.join(chain), encoding='utf-8')
    mp4 = OUT / f'{lesson_id}.mp4'
    run(['ffmpeg', '-y', '-v', 'error', *inputs, '-i', str(audio), '-/filter_complex', str(graph),
         '-map', '[vout]', '-map', f'{len(segs)}:a', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'stillimage',
         '-crf', '27', '-r', '30', '-c:a', 'aac', '-b:a', '96k', '-shortest', '-movflags', '+faststart', str(mp4)])

    # Subtitles: the Hindi line as spoken, and its English translation, on the same timings
    for lang in ('hi', 'en'):
        lines, t = ['WEBVTT', ''], 0.0
        for s in segs:
            for a, b, text in cues(s['part'][lang], t + LEAD, t + LEAD + s['spoken']):
                lines += [f'{ts(a)} --> {ts(b)}', text, '']
            t += s['len']
        (OUT / f'{lesson_id}.{lang}.vtt').write_text('\n'.join(lines), encoding='utf-8')
    run(['ffmpeg', '-y', '-v', 'error', '-i', str(segs[0]['img']), '-vf', 'scale=1280:-2', '-q:v', '4',
         str(OUT / f'{lesson_id}.jpg')])
    print(f'{lesson_id}: {duration(mp4):.1f}s, {mp4.stat().st_size / 1e6:.1f} MB -> {mp4.relative_to(ROOT)}')


if __name__ == '__main__':
    if not CHROME:
        raise SystemExit('Chrome or Edge not found; set CHROME to its path.')
    ids = sys.argv[1:]
    if ids == ['--all']:
        ids = sorted(p.stem for p in (HERE / 'lessons').glob('*.json'))
    if not ids:
        raise SystemExit(__doc__)
    for lesson in ids:
        print(f'building {lesson}')
        build(lesson)
