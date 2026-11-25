import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MessageCircle, Heart, Volume2, VolumeX, UserCircle2, Send, Mic, Search, Flag, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/languageContextValue';
import {
  CATEGORIES, MAX_POST_LENGTH, MAX_REPLY_LENGTH, POSTS_STORE_KEY,
  loadPosts, savePosts, makeAlias, timeAgo, containsPhoneNumber,
} from '../../data/communityData';

const CATEGORY_STYLE = {
  Health: { color: '#b83280', bg: '#fff5f7', label: { en: 'Health', hi: 'स्वास्थ्य' } },
  Finance: { color: '#2c7a7b', bg: '#e6fffa', label: { en: 'Finance', hi: 'वित्त' } },
  Safety: { color: '#c05621', bg: '#fffaf0', label: { en: 'Safety', hi: 'सुरक्षा' } },
};

const TEXT = {
  en: {
    title: 'Didi Connect',
    subtitle: 'A safe, anonymous space by women, for women',
    opportunities: 'Opportunities for Women',
    safe: 'Safe & Anonymous Space',
    placeholder: 'Ask anything anonymously without fear... (Health, Finance, Safety)',
    voicePost: 'Voice Post',
    listening: 'Listening... tap to stop',
    anon: 'Post Anonymously',
    post: 'Post',
    all: 'All',
    search: 'Search posts and replies',
    sortNew: 'Newest',
    sortHelpful: 'Most helpful',
    sortDiscussed: 'Most discussed',
    statPosts: 'Posts',
    statToday: 'Today',
    statReplies: 'Replies',
    you: 'You',
    helpful: 'Helpful',
    replies: 'Replies',
    expert: 'Expert reply inside',
    expertTag: 'Expert',
    noReplies: 'No replies yet. Be the first to help.',
    replyPlaceholder: 'Write a supportive reply...',
    reply: 'Reply',
    listen: 'Listen',
    stop: 'Stop',
    report: 'Report post',
    del: 'Delete my post',
    confirmDelete: 'Delete this post? This cannot be undone.',
    reported: 'Thanks for reporting. The post is hidden for you.',
    deleted: 'Your post was deleted.',
    posted: 'Your post is live.',
    noPhone: 'Please do not share phone numbers. Posts are public.',
    empty: 'No posts match yet. Try another filter or create the first one above.',
    privacy: 'Posts are saved on this device only for now. Never share your phone number or address.',
  },
  hi: {
    title: 'दीदी कनेक्ट',
    subtitle: 'महिलाओं द्वारा, महिलाओं के लिए एक सुरक्षित और गुमनाम जगह',
    opportunities: 'महिलाओं के लिए अवसर',
    safe: 'सुरक्षित और गुमनाम जगह',
    placeholder: 'बिना डरे गुमनाम होकर कुछ भी पूछें... (स्वास्थ्य, वित्त, सुरक्षा)',
    voicePost: 'बोलकर लिखें',
    listening: 'सुन रहे हैं... रोकने के लिए टैप करें',
    anon: 'गुमनाम पोस्ट करें',
    post: 'पोस्ट करें',
    all: 'सभी',
    search: 'पोस्ट और जवाब खोजें',
    sortNew: 'सबसे नए',
    sortHelpful: 'सबसे उपयोगी',
    sortDiscussed: 'सबसे ज़्यादा चर्चा',
    statPosts: 'पोस्ट',
    statToday: 'आज',
    statReplies: 'जवाब',
    you: 'आप',
    helpful: 'उपयोगी',
    replies: 'जवाब',
    expert: 'विशेषज्ञ का जवाब मौजूद',
    expertTag: 'विशेषज्ञ',
    noReplies: 'अभी कोई जवाब नहीं। मदद करने वाली पहली बनें।',
    replyPlaceholder: 'एक सहयोगी जवाब लिखें...',
    reply: 'जवाब दें',
    listen: 'सुनें',
    stop: 'रोकें',
    report: 'पोस्ट की रिपोर्ट करें',
    del: 'मेरी पोस्ट हटाएं',
    confirmDelete: 'यह पोस्ट हटाएं? इसे वापस नहीं लाया जा सकता।',
    reported: 'रिपोर्ट के लिए धन्यवाद। यह पोस्ट आपके लिए छिपा दी गई है।',
    deleted: 'आपकी पोस्ट हटा दी गई।',
    posted: 'आपकी पोस्ट प्रकाशित हो गई।',
    noPhone: 'कृपया फ़ोन नंबर न डालें। पोस्ट सबको दिखती हैं।',
    empty: 'अभी कोई पोस्ट नहीं मिली। दूसरा फ़िल्टर आज़माएं या ऊपर पहली पोस्ट बनाएं।',
    privacy: 'फ़िलहाल पोस्ट सिर्फ़ इसी डिवाइस पर सेव होती हैं। अपना फ़ोन नंबर या पता कभी न डालें।',
  },
};

// One post with its replies. Pure display; the page owns all the data.
const PostCard = ({ post, lang, ui, now, repliesOpen, draft, speaking, canSpeak, onHelpful, onToggleReplies, onDraft, onReply, onSpeak, onDelete, onReport }) => {
  const cat = CATEGORY_STYLE[post.category] || CATEGORY_STYLE.Health;
  const hasExpert = post.replies.some((r) => r.expert);

  return (
    <article style={styles.postCard}>
      <div style={styles.postHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <div style={styles.avatar}><UserCircle2 size={32} color="var(--primary)" /></div>
          <div style={{ minWidth: 0 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {post.alias}
              {post.mine && <span style={styles.youTag}>{ui.you}</span>}
            </h4>
            <span className="subtext" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {timeAgo(post.createdAt, now, lang)}
              <span style={{ ...styles.catChip, color: cat.color, backgroundColor: cat.bg }}>{cat.label[lang]}</span>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {canSpeak && (
            <button type="button" className="btn btn-secondary" style={styles.iconBtn} onClick={() => onSpeak(post)} aria-label={speaking ? ui.stop : ui.listen} title={speaking ? ui.stop : ui.listen}>
              {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
          {post.mine ? (
            <button type="button" className="btn btn-secondary" style={styles.iconBtn} onClick={() => onDelete(post.id)} aria-label={ui.del} title={ui.del}>
              <Trash2 size={16} />
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" style={styles.iconBtn} onClick={() => onReport(post.id)} aria-label={ui.report} title={ui.report}>
              <Flag size={16} />
            </button>
          )}
        </div>
      </div>

      <p style={styles.postContent}>{post.content}</p>
      {!!post.contentEn && <p style={styles.postContentEn}>{post.contentEn}</p>}

      {hasExpert && (
        <div style={styles.expertBadge}>
          <ShieldCheck size={14} color="#000" />
          <span>{ui.expert}</span>
        </div>
      )}

      <div style={styles.postFooter}>
        <button
          type="button"
          style={{ ...styles.footerBtn, color: post.helpfulByMe ? 'var(--primary)' : 'var(--text-muted)' }}
          onClick={() => onHelpful(post.id)}
          aria-pressed={post.helpfulByMe}
        >
          <Heart size={18} color={post.helpfulByMe ? 'var(--primary)' : 'var(--text-muted)'} fill={post.helpfulByMe ? 'var(--primary)' : 'none'} />
          <span>{post.helpfulCount} {ui.helpful}</span>
        </button>
        <button type="button" style={styles.footerBtn} onClick={() => onToggleReplies(post.id)} aria-expanded={repliesOpen}>
          <MessageCircle size={18} color="var(--text-muted)" />
          <span>{post.replies.length} {ui.replies}</span>
        </button>
      </div>

      {repliesOpen && (
        <div style={styles.repliesSection}>
          {post.replies.length === 0 && (
            <p className="subtext" style={{ marginBottom: '10px' }}>{ui.noReplies}</p>
          )}
          {post.replies.map((reply) => (
            <div key={reply.id} style={styles.replyItem}>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>{reply.author}</strong>
                {reply.expert && <span style={styles.expertTag}>{ui.expertTag}</span>}
                {reply.mine && <span style={styles.youTag}>{ui.you}</span>}
                <span className="subtext" style={{ fontSize: '0.78rem', marginLeft: '8px' }}>{timeAgo(reply.createdAt, now, lang)}</span>
                <div style={{ fontSize: '0.95rem', marginTop: '2px' }}>{reply.text}</div>
              </div>
            </div>
          ))}
          <form
            style={styles.replyComposer}
            onSubmit={(e) => { e.preventDefault(); onReply(post.id); }}
          >
            <input
              type="text"
              value={draft}
              maxLength={MAX_REPLY_LENGTH}
              onChange={(e) => onDraft(post.id, e.target.value)}
              placeholder={ui.replyPlaceholder}
              aria-label={ui.replyPlaceholder}
              style={styles.replyInput}
            />
            <button type="submit" className="btn btn-secondary" disabled={!draft.trim()}>{ui.reply}</button>
          </form>
        </div>
      )}
    </article>
  );
};

const Community = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const ui = TEXT[lang];

  const [posts, setPosts] = useState(loadPosts);
  const [now, setNow] = useState(() => Date.now());
  const [activeTab, setActiveTab] = useState('all');
  const [sort, setSort] = useState('new');
  const [query, setQuery] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Health');
  const [postAnonymous, setPostAnonymous] = useState(true);
  const [openReplies, setOpenReplies] = useState({});
  const [drafts, setDrafts] = useState({});
  const [notice, setNotice] = useState('');
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [canListenToSpeech] = useState(() => typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
  const [canSpeak] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const recognitionRef = useRef(null);
  const noticeTimer = useRef(null);

  // Save every change.
  useEffect(() => { savePosts(posts); }, [posts]);

  // Keep "2 hours ago" fresh, and pick up posts made in another tab.
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60000);
    const onStorage = (e) => { if (e.key === POSTS_STORE_KEY) setPosts(loadPosts()); };
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(tick);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Stop listening, speaking and timers when you leave the page.
  useEffect(() => () => {
    recognitionRef.current?.abort?.();
    window.speechSynthesis?.cancel();
    clearTimeout(noticeTimer.current);
  }, []);

  const flash = (text) => {
    setNotice(text);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 4000);
  };

  // ---------- creating things ----------
  const handleCreatePost = () => {
    const text = newPostText.trim();
    if (!text) return;
    if (containsPhoneNumber(text)) { flash(ui.noPhone); return; }

    const firstName = (localStorage.getItem('userName') || '').trim().split(/\s+/)[0] || ui.you;
    const created = Date.now();
    const newPost = {
      id: `mine-${created}`,
      category: newPostCategory,
      alias: postAnonymous ? makeAlias() : firstName,
      createdAt: created,
      content: text,
      contentEn: '',
      helpfulCount: 0,
      helpfulByMe: false,
      mine: true,
      reported: false,
      replies: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostText('');
    setNow(created);
    flash(ui.posted);
  };

  const handleAddReply = (postId) => {
    const text = (drafts[postId] || '').trim();
    if (!text) return;
    if (containsPhoneNumber(text)) { flash(ui.noPhone); return; }

    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const earlier = post.replies.find((r) => r.mine);
    const created = Date.now();
    const reply = {
      id: `r-${created}`,
      author: earlier ? earlier.author : (post.mine ? post.alias : makeAlias()), // same name throughout one thread
      expert: false,
      mine: true,
      createdAt: created,
      text,
    };
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, reply] } : p)));
    setDrafts((prev) => ({ ...prev, [postId]: '' }));
    setNow(created);
  };

  // ---------- changing things ----------
  const handleHelpful = (postId) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      const next = !p.helpfulByMe;
      return { ...p, helpfulByMe: next, helpfulCount: Math.max(0, p.helpfulCount + (next ? 1 : -1)) };
    }));
  };

  const handleDelete = (postId) => {
    if (!window.confirm(ui.confirmDelete)) return;
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    flash(ui.deleted);
  };

  const handleReport = (postId) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, reported: true } : p)));
    flash(ui.reported);
  };

  const toggleReplies = (postId) => setOpenReplies((prev) => ({ ...prev, [postId]: !prev[postId] }));
  const changeDraft = (postId, value) => setDrafts((prev) => ({ ...prev, [postId]: value }));

  // ---------- voice ----------
  const toggleVoicePost = () => {
    if (listening) { recognitionRef.current?.stop(); return; }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const heard = Array.from(event.results).map((r) => r[0]?.transcript || '').join(' ').trim();
      if (heard) setNewPostText((prev) => `${prev ? `${prev} ` : ''}${heard}`.slice(0, MAX_POST_LENGTH));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    try { recognition.start(); } catch { setListening(false); }
  };

  const toggleSpeak = (post) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (speakingId === post.id) { synth.cancel(); setSpeakingId(null); return; }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(post.content);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    synth.speak(utterance);
    setSpeakingId(post.id);
  };

  // ---------- what to show ----------
  const live = posts.filter((p) => !p.reported);
  const counts = { all: live.length };
  CATEGORIES.forEach((c) => { counts[c] = live.filter((p) => p.category === c).length; });

  const needle = query.trim().toLowerCase();
  const matches = (p) => !needle
    || [p.content, p.contentEn, p.alias, ...p.replies.map((r) => r.text)].some((s) => (s || '').toLowerCase().includes(needle));

  const visible = live
    .filter((p) => activeTab === 'all' || p.category === activeTab)
    .filter(matches)
    .sort((a, b) => {
      if (sort === 'helpful') return b.helpfulCount - a.helpfulCount;
      if (sort === 'discussed') return b.replies.length - a.replies.length;
      return b.createdAt - a.createdAt;
    });

  const postsToday = live.filter((p) => now - p.createdAt < 86400000).length;
  const totalReplies = live.reduce((n, p) => n + p.replies.length, 0);

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 className="h2" style={{ color: 'var(--text-dark)' }}>{ui.title}</h1>
          <p className="subtext">{ui.subtitle}</p>
        </div>
        <div style={styles.headerActions}>
          <button className="btn btn-secondary" style={styles.opportunityBtn} onClick={() => navigate('/dashboard/opportunities-women')}>
            {ui.opportunities}
          </button>
          <div style={styles.badge}>
            <ShieldCheck color="var(--success)" size={20} />
            <span style={styles.badgeText}>{ui.safe}</span>
          </div>
        </div>
      </header>

      <div style={styles.statsRow}>
        {[[ui.statPosts, live.length], [ui.statToday, postsToday], [ui.statReplies, totalReplies]].map(([label, value]) => (
          <div key={label} style={styles.statChip}>
            <strong style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{value}</strong>
            <span className="subtext" style={{ fontSize: '0.85rem' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={styles.createPostCard}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <UserCircle2 size={40} color="var(--text-light)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <textarea
              placeholder={ui.placeholder}
              aria-label={ui.placeholder}
              style={styles.textarea}
              rows={3}
              maxLength={MAX_POST_LENGTH}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
            <div style={styles.postActions}>
              <div style={styles.postOptions}>
                {canListenToSpeech && (
                  <button
                    type="button"
                    onClick={toggleVoicePost}
                    aria-pressed={listening}
                    style={{ ...styles.actionBtn, color: listening ? 'var(--danger)' : 'var(--primary)' }}
                  >
                    <Mic size={18} /> {listening ? ui.listening : ui.voicePost}
                  </button>
                )}
                <select value={newPostCategory} onChange={(e) => setNewPostCategory(e.target.value)} style={styles.categorySelect} aria-label="Category">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_STYLE[c].label[lang]}</option>)}
                </select>
                <label style={styles.anonToggle}>
                  <input type="checkbox" checked={postAnonymous} onChange={(e) => setPostAnonymous(e.target.checked)} />
                  <span style={{ fontSize: '0.9rem' }}>{ui.anon}</span>
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="subtext" style={{ fontSize: '0.8rem' }}>{newPostText.length}/{MAX_POST_LENGTH}</span>
                <button className="btn btn-primary" style={{ padding: '8px 20px' }} onClick={handleCreatePost} disabled={!newPostText.trim()}>
                  <Send size={16} /> {ui.post}
                </button>
              </div>
            </div>
            <p className="subtext" style={{ fontSize: '0.8rem', marginTop: '10px' }}>{ui.privacy}</p>
          </div>
        </div>
      </div>

      {notice && <div style={styles.notice} role="status">{notice}</div>}

      <div style={styles.toolbar}>
        <div style={styles.tabs} role="tablist">
          {['all', ...CATEGORIES].map((tab) => {
            const active = activeTab === tab;
            const label = tab === 'all' ? ui.all : CATEGORY_STYLE[tab].label[lang];
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                style={{ ...styles.tab, backgroundColor: active ? 'var(--primary)' : 'var(--bg-color)', color: active ? '#fff' : 'var(--text-muted)' }}
                onClick={() => setActiveTab(tab)}
              >
                {label} <span style={{ opacity: 0.8, fontSize: '0.8rem' }}>({counts[tab]})</span>
              </button>
            );
          })}
        </div>
        <div style={styles.searchSort}>
          <div style={styles.searchBox}>
            <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '12px' }} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ui.search}
              aria-label={ui.search}
              style={styles.searchInput}
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={styles.categorySelect} aria-label="Sort">
            <option value="new">{ui.sortNew}</option>
            <option value="helpful">{ui.sortHelpful}</option>
            <option value="discussed">{ui.sortDiscussed}</option>
          </select>
        </div>
      </div>

      <div style={styles.feed}>
        {visible.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            lang={lang}
            ui={ui}
            now={now}
            repliesOpen={Boolean(openReplies[post.id])}
            draft={drafts[post.id] || ''}
            speaking={speakingId === post.id}
            canSpeak={canSpeak}
            onHelpful={handleHelpful}
            onToggleReplies={toggleReplies}
            onDraft={changeDraft}
            onReply={handleAddReply}
            onSpeak={toggleSpeak}
            onDelete={handleDelete}
            onReport={handleReport}
          />
        ))}
        {!visible.length && (
          <div style={styles.emptyState}>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{ui.empty}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: 'none', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' },
  headerActions: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' },
  opportunityBtn: { fontSize: '0.9rem', whiteSpace: 'nowrap' },
  badge: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 'var(--radius-full)' },
  badgeText: { color: 'var(--success)', fontWeight: '600', fontSize: '0.9rem' },
  statsRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' },
  statChip: { display: 'flex', alignItems: 'baseline', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)' },
  createPostCard: { backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', marginBottom: '20px' },
  textarea: { width: '100%', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px', fontFamily: 'inherit', fontSize: '1rem', resize: 'none', outline: 'none', marginBottom: '12px', backgroundColor: 'var(--bg-color)' },
  postActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  postOptions: { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'inherit' },
  categorySelect: { border: '1px solid var(--border-color)', borderRadius: '10px', padding: '6px 10px', backgroundColor: 'var(--surface)', color: 'var(--text-dark)', fontSize: '0.9rem', fontFamily: 'inherit' },
  anonToggle: { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' },
  notice: { padding: '12px 16px', marginBottom: '16px', backgroundColor: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: 'var(--radius-md)', color: '#2c5282', fontWeight: '500' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' },
  tabs: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  tab: { padding: '8px 18px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontWeight: '500', fontFamily: 'inherit', transition: 'all 0.2s' },
  searchSort: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  searchBox: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchInput: { padding: '8px 12px 8px 34px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', minWidth: '220px' },
  feed: { display: 'flex', flexDirection: 'column', gap: '20px' },
  postCard: { backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' },
  postHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  youTag: { marginLeft: '6px', padding: '1px 8px', borderRadius: '999px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: '0.72rem', fontWeight: '600' },
  catChip: { padding: '1px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' },
  iconBtn: { padding: '8px', borderRadius: '50%' },
  postContent: { fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '8px', color: 'var(--text-dark)' },
  postContentEn: { fontSize: '0.95rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px' },
  expertBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#ffd84c', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '16px' },
  expertTag: { marginLeft: '6px', padding: '1px 8px', borderRadius: '999px', backgroundColor: '#ffd84c', fontSize: '0.72rem', fontWeight: '600' },
  postFooter: { display: 'flex', gap: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' },
  footerBtn: { display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'color 0.2s' },
  repliesSection: { marginTop: '16px', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' },
  replyItem: { display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '12px', color: 'var(--text-dark)' },
  replyComposer: { marginTop: '10px', display: 'flex', gap: '8px' },
  replyInput: { flex: 1, minWidth: 0, border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 10px', fontSize: '0.9rem', fontFamily: 'inherit', backgroundColor: 'var(--bg-color)', color: 'var(--text-dark)', outline: 'none' },
  emptyState: { backgroundColor: 'var(--surface)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center' },
};

export default Community;
