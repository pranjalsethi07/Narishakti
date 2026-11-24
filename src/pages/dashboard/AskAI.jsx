import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mic, Send, Volume2, StopCircle, Sparkles, ArrowRight, Clapperboard } from 'lucide-react';
import { suggestFeatures } from '../../utils/featureSuggest';
import { useLanguage } from '../../context/languageContextValue';
import { incrementQuestionsAsked } from '../../utils/userProgress';
import { apiFetch } from '../../utils/api';

const AskAI = () => {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Namaste! Meri madad aapko kaise chahiye? (How can I help you today?)', time: '10:00 AM' }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const sendMessageRef = useRef(null);
  // NariShakti features that fit what is being typed, shown live above the input
  const liveFeatures = useMemo(() => suggestFeatures(input), [input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      transcriptRef.current = '';
      setInput('');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim();

      transcriptRef.current = transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: 'ai',
            text: 'Mic permission denied hai. Browser settings me microphone allow karein.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    };

    recognition.onend = async () => {
      setIsRecording(false);
      const spokenText = transcriptRef.current.trim();
      if (spokenText) {
        await sendMessageRef.current?.(spokenText);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    }
  }, [lang]);

  const sendMessage = async (text) => {
    const userText = text.trim();
    if (!userText || isThinking) return;

    // the features that fit the question go with the answer, so they stay in the chat
    const features = suggestFeatures(userText);
    const newMsg = { id: Date.now(), sender: 'user', text: userText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, newMsg]);
    incrementQuestionsAsked();
    setInput('');
    transcriptRef.current = '';
    setIsThinking(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        // Only the age group is sent (never the name), so the answer can match her age.
        body: JSON.stringify({ message: userText, ageGroup: localStorage.getItem('userAge') || '' }),
      });
      clearTimeout(timeout);

      const rawText = await response.text();
      let data = {};
      if (rawText) {
        try {
          data = JSON.parse(rawText);
        } catch {
          data = { error: rawText };
        }
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to get response from assistant.');
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: data.reply || 'Maaf kijiye, assistant ne empty response diya. Kripya dobara try karein.',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        hasAudio: true,
        features,
      }]);
    } catch (error) {
      const message = error?.name === 'AbortError'
        ? 'Request timed out. Kripya dobara try karein.'
        : error.message;
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: `Maaf kijiye, abhi server se connect nahi ho pa raha. (${message})`,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        features,
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  // Keep the latest sendMessage reachable from the speech recognition handlers
  // without re-creating the recognizer whenever chat state changes.
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  });

  const handleSend = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleMicToggle = () => {
    if (!isSpeechSupported) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'ai',
          text: 'Aapke browser me voice input support nahi hai. Chrome ya Edge use karein.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }

    if (!recognitionRef.current || isThinking) return;

    if (isRecording) {
      recognitionRef.current.stop();
      return;
    }

    transcriptRef.current = '';
    recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    try {
      recognitionRef.current.start();
    } catch {
      // Ignore "already started" errors raised by some browsers.
    }
  };

  // The header's search box sends you here as /dashboard/ask?q=... and its mic
  // button as ?voice=1. Handle each once, then clear it from the address.
  const [searchParams, setSearchParams] = useSearchParams();
  const incomingQuestion = searchParams.get('q');
  const wantsVoice = searchParams.get('voice');
  const handledRef = useRef({ q: null, voice: false });
  const micToggleRef = useRef(null);

  useEffect(() => {
    micToggleRef.current = handleMicToggle;
  });

  useEffect(() => {
    if (!incomingQuestion) { handledRef.current.q = null; return; }
    if (handledRef.current.q === incomingQuestion) return;
    handledRef.current.q = incomingQuestion;
    sendMessageRef.current?.(incomingQuestion);
    setSearchParams({}, { replace: true });
  }, [incomingQuestion, setSearchParams]);

  useEffect(() => {
    if (!wantsVoice) { handledRef.current.voice = false; return; }
    if (handledRef.current.voice) return;
    handledRef.current.voice = true;
    micToggleRef.current?.();
    setSearchParams({}, { replace: true });
  }, [wantsVoice, setSearchParams]);

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <div style={styles.avatar}>
            <span style={{color: 'white', fontWeight: 'bold'}}>AI</span>
          </div>
          <div>
            <h1 className="h2" style={{fontSize: '1.2rem', color: 'var(--text-dark)'}}>NariShakti Assistant</h1>
            <p className="subtext" style={{color: 'var(--success)'}}>● Online (Private & Secure)</p>
          </div>
        </div>
      </header>

      <div style={styles.chatArea}>
        <div style={styles.dateLabel}>Today</div>
        
        {messages.map(msg => (
          <React.Fragment key={msg.id}>
          <div style={{
            ...styles.messageWrapper,
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              ...styles.messageBubble,
              backgroundColor: msg.sender === 'user' ? '#d9fdd3' : 'var(--surface)',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : 'var(--radius-lg)',
              borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : 'var(--radius-lg)',
            }}>
              <p style={{marginBottom: '4px', fontSize: '1rem'}}>{msg.text}</p>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'}}>
                <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{msg.time}</span>
                {msg.sender === 'ai' && (
                  <button style={styles.inlinePlayBtn}>
                    <Volume2 size={16} /> Play
                  </button>
                )}
              </div>
            </div>
          </div>
          {msg.features?.length > 0 && <FeatureCards features={msg.features} lang={lang} />}
          </React.Fragment>
        ))}

        {/* starter ideas, until the conversation begins or she starts typing */}
        {messages.length === 1 && !input.trim() && (
          <div style={styles.suggestionsContainer}>
            <button style={styles.suggestionBtn} onClick={() => setInput("Ask about periods")}>"Ask about periods"</button>
            <button style={styles.suggestionBtn} onClick={() => setInput("Check bank balance")}>"Check bank balance"</button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {liveFeatures.length > 0 && !isThinking && (
        <div style={styles.liveStrip} aria-live="polite">
          <span style={styles.liveLabel}><Sparkles size={14} /> {lang === 'hi' ? 'नारीशक्ति पर देखें:' : 'Related on NariShakti:'}</span>
          {liveFeatures.map((f) => (
            <Link key={f.id} to={f.path} style={styles.livePill}>
              <f.icon size={14} /> {f.title[lang] || f.title.en}
              {f.video && <span style={styles.videoTag}>AI video</span>}
            </Link>
          ))}
        </div>
      )}

      <form style={styles.inputArea} onSubmit={handleSend}>
        <button 
          type="button"
          onClick={handleMicToggle}
          style={{...styles.micBtn, backgroundColor: isRecording ? 'var(--danger)' : 'var(--primary)'}}
          className={isRecording ? 'mic-pulse' : ''}
          disabled={isThinking}
        >
          {isRecording ? <StopCircle size={24} color="#fff" /> : <Mic size={24} color="#fff" />}
        </button>
        
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isRecording ? "Listening... bolte rahiye" : "Message type karein ya mic dabayein..."}
          style={styles.input}
          disabled={isThinking}
        />
        
        <button type="submit" style={styles.sendBtn} disabled={!input.trim() || isThinking}>
          <Send size={24} color={input.trim() ? "var(--primary)" : "var(--text-light)"} />
        </button>
      </form>
    </div>
  );
};

// Cards under an answer that take her to the NariShakti features that fit her question.
const FeatureCards = ({ features, lang }) => (
  <div style={styles.featureWrap}>
    <p style={styles.featureHead}><Sparkles size={14} /> {lang === 'hi' ? 'नारीशक्ति पर यह भी मदद करेगा' : 'This can help too, on NariShakti'}</p>
    <div style={styles.featureRow}>
      {features.map((f) => (
        <Link key={f.id} to={f.path} style={styles.featureCard} className="hover-card">
          <span style={styles.featureIcon}><f.icon size={20} /></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={styles.featureTitle}>{f.title[lang] || f.title.en}</span>
            <span style={styles.featureReason}>
              {f.video && <><Clapperboard size={12} style={{ verticalAlign: '-1px' }} /> {lang === 'hi' ? 'AI वीडियो · ' : 'AI video · '}</>}
              {f.reason[lang] || f.reason.en}
            </span>
          </span>
          <ArrowRight size={16} color="var(--primary)" />
        </Link>
      ))}
    </div>
  </div>
);

const styles = {
  featureWrap: { maxWidth: '70%', marginTop: '-4px' },
  featureHead: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-dark)', margin: '0 0 6px 4px' },
  featureRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  featureCard: { display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 220px', maxWidth: '320px', padding: '10px 12px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid #e9ddff', boxShadow: 'var(--shadow-sm)', color: 'var(--text-dark)' },
  featureIcon: { width: '38px', height: '38px', flexShrink: 0, borderRadius: '10px', display: 'grid', placeItems: 'center', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)' },
  featureTitle: { display: 'block', fontWeight: 600, fontSize: '0.92rem', lineHeight: 1.25 },
  featureReason: { display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.3, marginTop: '2px' },
  liveStrip: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', padding: '10px 24px', backgroundColor: '#faf7ff', borderTop: '1px solid #ece4fb' },
  liveLabel: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-dark)' },
  livePill: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--surface)', border: '1px solid var(--primary)', color: 'var(--primary-dark)', fontSize: '0.85rem', fontWeight: 500 },
  videoTag: { fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#2d2640', color: '#fff', borderRadius: '4px', padding: '1px 5px' },
  container: {
    width: '100%',
    margin: '0 auto',
    // viewport minus top bar, page padding and the Back button above the chat
    height: 'calc(100vh - 230px)',
    minHeight: '420px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#efeae2', // WhatsApp-like bg
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
  },
  header: {
    backgroundColor: 'var(--surface)',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    zIndex: 10
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatArea: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  dateLabel: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: '4px 12px',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '16px'
  },
  messageWrapper: {
    display: 'flex',
    width: '100%'
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    position: 'relative'
  },
  inlinePlayBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: 'var(--primary)',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  suggestionsContainer: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
    paddingTop: '20px',
    overflowX: 'auto',
    paddingBottom: '8px'
  },
  suggestionBtn: {
    whiteSpace: 'nowrap',
    padding: '8px 16px',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--primary)',
    color: 'var(--primary-dark)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.9rem',
    boxShadow: 'var(--shadow-sm)'
  },
  inputArea: {
    backgroundColor: 'var(--surface)',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  micBtn: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background-color 0.2s'
  },
  input: {
    flex: 1,
    padding: '16px 20px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-color)',
    fontSize: '1rem',
    outline: 'none',
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
};

export default AskAI;
