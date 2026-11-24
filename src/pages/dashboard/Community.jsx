import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MessageCircle, Heart, Volume2, UserCircle2, Send, Mic } from 'lucide-react';

const STORAGE_KEY = 'didi_connect_posts_v1';

const INITIAL_POSTS = [
  {
    id: 1,
    category: 'Health',
    author: 'Anonymous',
    time: '2 hours ago',
    content: 'Meri period cycle irregular hai pichle 3 mahine se. Kya mujhe doctor ko dikhana chahiye? Ghar pe sab bolte hai normal hai par mujhe tension ho rahi hai.',
    contentEn: 'My period cycle has been irregular for 3 months. Should I see a doctor?',
    helpfulCount: 24,
    helpfulByMe: false,
    replyCount: 5,
    hasExpertReply: true,
    showReplies: false,
    replyDraft: '',
    replyMessages: [
      { id: 'r-1', author: 'Sehat Saheli', text: 'Agar cycle 3 months se irregular hai, doctor consultation lena best rahega.' },
    ],
  },
  {
    id: 2,
    category: 'Safety',
    author: 'Anonymous',
    time: '5 hours ago',
    content: 'Local bus me travel karte waqt agar koi pareshan kare toh emergency helpline 112 pe turant call karni chahiye. Maine kal use kiya tha, police 10 min me aa gayi.',
    contentEn: 'If someone bothers you on local buses, immediately call 112.',
    helpfulCount: 156,
    helpfulByMe: false,
    replyCount: 12,
    hasExpertReply: false,
    showReplies: false,
    replyDraft: '',
    replyMessages: [
      { id: 'r-2', author: 'Safety Volunteer', text: 'Great that you used 112 quickly. Sharing helpline awareness helps everyone.' },
    ],
  },
  {
    id: 3,
    category: 'Finance',
    author: 'Anonymous',
    time: '1 day ago',
    content: 'Silai ke business ke liye bina collateral ke loan kahan se mil sakta hai? Mudra yojna try kiya tha par paperwork samajh nahi aa raha.',
    contentEn: 'Where can I get a collateral-free loan for my tailoring business?',
    helpfulCount: 42,
    helpfulByMe: false,
    replyCount: 8,
    hasExpertReply: true,
    showReplies: false,
    replyDraft: '',
    replyMessages: [
      { id: 'r-3', author: 'Finance Mentor', text: 'Jan Dhan + Mudra support center par documents verify karwa kar apply karein.' },
    ],
  },
];

const Community = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return INITIAL_POSTS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length ? parsed : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Health');
  const [postAnonymous, setPostAnonymous] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const filteredPosts = activeTab === 'all'
    ? posts
    : posts.filter((post) => post.category.toLowerCase() === activeTab);

  const handleCreatePost = () => {
    const text = newPostText.trim();
    if (!text) return;

    const newPost = {
      id: Date.now(),
      category: newPostCategory,
      author: postAnonymous ? 'Anonymous' : 'You',
      time: 'Just now',
      content: text,
      contentEn: '',
      helpfulCount: 0,
      helpfulByMe: false,
      replyCount: 0,
      hasExpertReply: false,
      showReplies: true,
      replyDraft: '',
      replyMessages: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostText('');
  };

  const handleHelpfulToggle = (postId) => {
    setPosts((prev) => prev.map((post) => {
      if (post.id !== postId) return post;
      const nextHelpfulByMe = !post.helpfulByMe;
      return {
        ...post,
        helpfulByMe: nextHelpfulByMe,
        helpfulCount: Math.max(0, post.helpfulCount + (nextHelpfulByMe ? 1 : -1)),
      };
    }));
  };

  const handleToggleReplies = (postId) => {
    setPosts((prev) => prev.map((post) => (
      post.id === postId ? { ...post, showReplies: !post.showReplies } : post
    )));
  };

  const handleReplyDraftChange = (postId, value) => {
    setPosts((prev) => prev.map((post) => (
      post.id === postId ? { ...post, replyDraft: value } : post
    )));
  };

  const handleAddReply = (postId) => {
    setPosts((prev) => prev.map((post) => {
      if (post.id !== postId) return post;
      const text = post.replyDraft.trim();
      if (!text) return post;

      const newReply = {
        id: `reply-${Date.now()}`,
        author: 'You',
        text,
      };

      return {
        ...post,
        replyDraft: '',
        showReplies: true,
        replyCount: post.replyCount + 1,
        replyMessages: [...post.replyMessages, newReply],
      };
    }));
  };

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 className="h2" style={{color: 'var(--text-dark)'}}>Didi Connect</h1>
          <p className="subtext">A safe, anonymous space by women, for women</p>
        </div>
        <div style={styles.headerActions}>
          <button className="btn btn-secondary" style={styles.opportunityBtn} onClick={() => navigate('/dashboard/opportunities-women')}>
            Opportunities for Women
          </button>
          <div style={styles.badge}>
            <ShieldCheck color="var(--success)" size={20} />
            <span style={styles.badgeText}>Safe & Verified Space</span>
          </div>
        </div>
      </header>

      <div style={styles.createPostCard} className="hover-card">
        <div style={{display: 'flex', gap: '16px'}}>
          <UserCircle2 size={40} color="var(--text-light)" />
          <div style={{flex: 1}}>
            <textarea 
              placeholder="Ask anything anonymously without fear... (Health, Finance, Safety)"
              style={styles.textarea}
              rows={3}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            ></textarea>
            <div style={styles.postActions}>
              <div style={{display: 'flex', gap: '16px'}}>
                <button type="button" style={{...styles.actionBtn, color: 'var(--primary)', cursor: 'not-allowed', opacity: 0.75}}>
                  <Mic size={18} /> Voice Post
                </button>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  style={styles.categorySelect}
                >
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="Safety">Safety</option>
                </select>
                <div style={styles.anonToggle}>
                  <input
                    type="checkbox"
                    id="anon"
                    checked={postAnonymous}
                    onChange={(e) => setPostAnonymous(e.target.checked)}
                  />
                  <label htmlFor="anon" style={{fontSize: '0.9rem'}}>Post Anonymously</label>
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{padding: '8px 20px'}}
                onClick={handleCreatePost}
                disabled={!newPostText.trim()}
              >
                <Send size={16} /> Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        {['All', 'Health', 'Finance', 'Safety'].map(tab => (
          <button 
            key={tab}
            style={{
              ...styles.tab, 
              backgroundColor: activeTab === tab.toLowerCase() ? 'var(--primary)' : 'var(--bg-color)',
              color: activeTab === tab.toLowerCase() ? '#fff' : 'var(--text-muted)'
            }}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.feed}>
        {filteredPosts.map(post => (
          <div key={post.id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div style={styles.avatar}>
                  <UserCircle2 size={32} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{fontSize: '1rem', fontWeight: '600'}}>{post.author}</h4>
                  <span className="subtext" style={{fontSize: '0.8rem'}}>{post.time} • {post.category}</span>
                </div>
              </div>
              <button className="btn btn-secondary" style={styles.listenBtn}>
                <Volume2 size={16} />
              </button>
            </div>
            
            <p style={styles.postContent}>{post.content}</p>
            {!!post.contentEn && <p style={styles.postContentEn}>{post.contentEn}</p>}

            {post.hasExpertReply && (
              <div style={styles.expertBadge}>
                <ShieldCheck size={14} color="#000" />
                <span>Verified Expert Reply inside</span>
              </div>
            )}

            <div style={styles.postFooter}>
              <button
                type="button"
                style={{
                  ...styles.footerBtn,
                  color: post.helpfulByMe ? 'var(--primary)' : 'var(--text-muted)',
                }}
                onClick={() => handleHelpfulToggle(post.id)}
              >
                <Heart size={18} color={post.helpfulByMe ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>{post.helpfulCount} Helpful</span>
              </button>
              <button type="button" style={styles.footerBtn} onClick={() => handleToggleReplies(post.id)}>
                <MessageCircle size={18} color="var(--text-muted)" />
                <span>{post.replyCount} Replies</span>
              </button>
            </div>

            {post.showReplies && (
              <div style={styles.repliesSection}>
                <h5 style={styles.repliesHeading}>Replies</h5>
                {post.replyMessages.length === 0 && (
                  <p className="subtext" style={{ marginBottom: '10px' }}>No replies yet. Be the first to help.</p>
                )}
                {post.replyMessages.map((reply) => (
                  <div key={reply.id} style={styles.replyItem}>
                    <strong style={{ fontSize: '0.9rem' }}>{reply.author}:</strong>
                    <span style={{ fontSize: '0.92rem' }}>{reply.text}</span>
                  </div>
                ))}
                <div style={styles.replyComposer}>
                  <input
                    type="text"
                    value={post.replyDraft}
                    onChange={(e) => handleReplyDraftChange(post.id, e.target.value)}
                    placeholder="Write a supportive reply..."
                    style={styles.replyInput}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleAddReply(post.id)}
                    disabled={!post.replyDraft.trim()}
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!filteredPosts.length && (
          <div style={styles.emptyState}>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>No posts in this category yet. Create the first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 'none',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  opportunityBtn: {
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#f0fff4',
    border: '1px solid #c6f6d5',
    borderRadius: 'var(--radius-full)',
  },
  badgeText: {
    color: 'var(--success)',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  createPostCard: {
    backgroundColor: 'var(--surface)',
    padding: '24px',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-color)',
    marginBottom: '32px'
  },
  textarea: {
    width: '100%',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    resize: 'none',
    outline: 'none',
    marginBottom: '12px',
    backgroundColor: 'var(--bg-color)'
  },
  postActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  categorySelect: {
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '6px 10px',
    backgroundColor: 'var(--surface)',
    color: 'var(--text-dark)',
    fontSize: '0.9rem',
  },
  anonToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  tab: {
    padding: '8px 20px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border-color)',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  feed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  postCard: {
    backgroundColor: 'var(--surface)',
    padding: '24px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)'
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listenBtn: {
    padding: '8px',
    borderRadius: '50%'
  },
  postContent: {
    fontSize: '1.05rem',
    lineHeight: 1.5,
    marginBottom: '8px',
    color: 'var(--text-dark)'
  },
  postContentEn: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginBottom: '16px'
  },
  expertBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#ffd84c',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '16px'
  },
  postFooter: {
    display: 'flex',
    gap: '24px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px'
  },
  footerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-muted)',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
  },
  repliesSection: {
    marginTop: '16px',
    borderTop: '1px dashed var(--border-color)',
    paddingTop: '12px',
  },
  repliesHeading: {
    fontSize: '0.92rem',
    marginBottom: '10px',
    color: 'var(--text-dark)',
  },
  replyItem: {
    display: 'flex',
    gap: '6px',
    alignItems: 'flex-start',
    marginBottom: '8px',
    color: 'var(--text-dark)',
  },
  replyComposer: {
    marginTop: '10px',
    display: 'flex',
    gap: '8px',
  },
  replyInput: {
    flex: 1,
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '8px 10px',
    fontSize: '0.9rem',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-dark)',
    outline: 'none',
  },
  emptyState: {
    backgroundColor: 'var(--surface)',
    border: '1px dashed var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
    textAlign: 'center',
  },
};

export default Community;
