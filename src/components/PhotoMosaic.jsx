import { useRef, useState } from 'react';
import { useLanguage } from '../context/languageContextValue';
import { useMediaQuery } from '../utils/useMediaQuery';
import { LANDING_PHOTOS } from '../data/landingPhotos';

// A wall of photos under the landing hero. On wide screens it uses CSS columns, so every picture keeps its own
// proportions (nothing is cropped, faces stay whole). On a phone it becomes a swipeable carousel with dots.
const PhotoMosaic = () => {
  const { t } = useLanguage();
  const phone = useMediaQuery('(max-width: 600px)');

  return (
    <section style={phone ? styles.sectionPhone : styles.section} aria-labelledby="women-title">
      <div style={styles.inner}>
        <h2 id="women-title" className="h2" style={styles.title}>{t('photosTitle')}</h2>
        <p style={styles.sub}>{t('photosSub')}</p>

        {phone ? (
          <Carousel />
        ) : (
          <div style={styles.masonry}>
            {LANDING_PHOTOS.map((photo) => (
              <figure key={photo.src} style={styles.figure}>
                <img src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} loading="lazy" decoding="async" style={styles.img} />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Swipe sideways; each photo snaps into place. The dots show where you are and jump to a photo when tapped.
const Carousel = () => {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.firstElementChild;
    const step = slide ? slide.offsetWidth + 12 : el.clientWidth;
    setActive(Math.min(LANDING_PHOTOS.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  };
  const goTo = (i) => {
    const el = trackRef.current;
    const slide = el?.children[i];
    if (slide) el.scrollTo({ left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2, behavior: 'smooth' });
  };

  return (
    <div>
      <div ref={trackRef} onScroll={onScroll} style={styles.track}>
        {LANDING_PHOTOS.map((photo, i) => (
          <figure key={photo.src} style={styles.slide}>
            <img src={photo.src} alt={photo.alt} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" draggable="false" style={styles.slideImg} />
          </figure>
        ))}
      </div>
      <div style={styles.dots} role="tablist" aria-label="Photos">
        {LANDING_PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Photo ${i + 1}`}
            onClick={() => goTo(i)}
            style={{ ...styles.dot, ...(i === active ? styles.dotActive : {}) }}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  section: { padding: '72px 24px 56px', backgroundColor: 'var(--bg-color)' },
  sectionPhone: { padding: '36px 0 28px', backgroundColor: 'var(--bg-color)' },
  inner: { maxWidth: '1200px', margin: '0 auto' },
  title: { color: 'var(--primary-dark)', marginBottom: '10px', textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', padding: '0 16px' },
  sub: { color: 'var(--text-muted)', fontSize: '1.1rem', textAlign: 'center', maxWidth: '58ch', margin: '0 auto 36px', lineHeight: 1.6, padding: '0 16px' },
  masonry: { columnWidth: '220px', columnGap: '14px' },
  figure: { margin: '0 0 14px', breakInside: 'avoid', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', backgroundColor: 'var(--primary-light)' },
  img: { display: 'block', width: '100%', height: 'auto' },
  track: { display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '0 16px 6px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' },
  slide: { flex: '0 0 82%', margin: 0, height: 380, scrollSnapAlign: 'center', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', backgroundColor: 'var(--primary-light)' },
  slideImg: { display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' },
  dots: { display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14, flexWrap: 'wrap', padding: '0 16px' },
  dot: { width: 8, height: 8, borderRadius: 999, padding: 0, backgroundColor: 'var(--border-color)', transition: 'width .2s, background-color .2s' },
  dotActive: { width: 22, backgroundColor: 'var(--primary)' },
};

export default PhotoMosaic;
