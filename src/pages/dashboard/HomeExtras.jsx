import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Wallet, Flame, HelpCircle, BookOpen, Award, Gamepad2, ArrowRight, Phone, Landmark, Baby, PiggyBank, Store } from 'lucide-react';
import { useLanguage } from '../../context/languageContextValue';
import { getDayStreakCount, getQuestionsAskedCount, getTopicsCompletedCount } from '../../utils/userProgress';
import { getStoredLearnProgress, LEARNING_MODULE_SEQUENCE } from '../../utils/learningProgress';
import { getProgress, totalBadges, GAME_KEYS, LEVEL_COUNT } from '../../data/gamesData';
import ProgressRing from '../../components/ProgressRing';
import { useCountUp } from '../../utils/useCountUp';

// Short bilingual tips. One of each is shown per day (rotates by day of the year).
const HEALTH_TIPS = [
  { en: 'Keep a water bottle with you and sip through the day.', hi: 'पानी की बोतल साथ रखें और दिन भर थोड़ा-थोड़ा पानी पीती रहें।' },
  { en: 'Add a green vegetable or a bowl of dal to every meal for iron and protein.', hi: 'हर खाने में हरी सब्ज़ी या एक कटोरी दाल शामिल करें। इससे आयरन और प्रोटीन मिलता है।' },
  { en: 'Wash your hands with soap for 20 seconds before eating and after using the toilet.', hi: 'खाने से पहले और शौचालय के बाद साबुन से 20 सेकंड तक हाथ धोएं।' },
  { en: 'A 20 to 30 minute walk every day is good for your heart, bones and mood.', hi: 'रोज़ 20 से 30 मिनट टहलना दिल, हड्डियों और मन के लिए अच्छा है।' },
  { en: 'Sleep 7 to 8 hours. Good sleep helps your body recover and keeps your mood steady.', hi: '7 से 8 घंटे सोएं। अच्छी नींद से शरीर ठीक होता है और मन शांत रहता है।' },
  { en: 'Change a sanitary pad every 4 to 6 hours to stay comfortable and avoid infections.', hi: 'आराम और संक्रमण से बचाव के लिए सैनिटरी पैड हर 4 से 6 घंटे में बदलें।' },
  { en: 'Get regular check-ups even when you feel well. Problems are easier to treat early.', hi: 'ठीक महसूस करने पर भी नियमित जांच करवाएं। शुरुआत में समस्या का इलाज आसान होता है।' },
];

const FINANCE_TIPS = [
  { en: 'Save first, spend the rest. Even ₹50 a week adds up over time.', hi: 'पहले बचत करें, फिर बाकी खर्च करें। हफ़्ते के ₹50 भी समय के साथ बड़ी रकम बन जाते हैं।' },
  { en: 'Never share your OTP, PIN or CVV with anyone, even if they say they are from your bank.', hi: 'अपना OTP, PIN या CVV किसी को न बताएं, भले ही वे खुद को बैंक वाला बताएं।' },
  { en: 'Write down your income and spending for one week. You will see where your money goes.', hi: 'एक हफ़्ते की आमदनी और खर्च लिखें। आपको दिखेगा कि पैसा कहां जा रहा है।' },
  { en: 'Build an emergency fund for sudden needs like illness. Start small and add every month.', hi: 'बीमारी जैसी अचानक ज़रूरतों के लिए इमरजेंसी फंड बनाएं। छोटी शुरुआत करें और हर महीने जोड़ें।' },
  { en: 'Read your bank SMS alerts. If you see a payment you did not make, tell your bank at once.', hi: 'बैंक के SMS अलर्ट पढ़ें। कोई ऐसा भुगतान दिखे जो आपने नहीं किया, तो तुरंत बैंक को बताएं।' },
  { en: 'Check the interest rate and charges before taking a loan, and compare at least two lenders.', hi: 'लोन लेने से पहले ब्याज दर और शुल्क देखें और कम से कम दो जगह तुलना करें।' },
  { en: 'Take loans and open accounts only with banks and lenders registered with the RBI.', hi: 'लोन और खाते सिर्फ़ बैंकों और RBI में पंजीकृत संस्थाओं से ही लें।' },
];

const SCHEMES = [
  { icon: Landmark, color: '#17806f', name: { en: 'PM Jan Dhan Yojana', hi: 'पीएम जन धन योजना' }, line: { en: 'A zero-balance bank account for every adult.', hi: 'हर वयस्क के लिए ज़ीरो बैलेंस बैंक खाता।' } },
  { icon: Baby, color: '#b83280', name: { en: 'Matru Vandana Yojana', hi: 'मातृ वंदना योजना' }, line: { en: 'Cash support for pregnant and nursing mothers.', hi: 'गर्भवती और स्तनपान कराने वाली माताओं के लिए नकद सहायता।' } },
  { icon: PiggyBank, color: '#6b46c1', name: { en: 'Sukanya Samriddhi Yojana', hi: 'सुकन्या समृद्धि योजना' }, line: { en: 'A savings scheme for a girl child’s future.', hi: 'बेटी के भविष्य के लिए बचत योजना।' } },
  { icon: Store, color: '#c05621', name: { en: 'PM Mudra Yojana', hi: 'पीएम मुद्रा योजना' }, line: { en: 'Collateral-free loans for small businesses.', hi: 'छोटे व्यवसायों के लिए बिना गारंटी का लोन।' } },
];

const HELPLINES = [
  { number: '112', color: '#c53030', tint: ['#fff5f5', '#fed7d7'], pulse: true, label: { en: 'Emergency', hi: 'आपातकालीन सेवा' }, note: { en: 'Police, fire and ambulance', hi: 'पुलिस, फ़ायर और एम्बुलेंस' } },
  { number: '181', color: '#b83280', tint: ['#fff5f7', '#fed7e2'], label: { en: 'Women Helpline', hi: 'महिला हेल्पलाइन' }, note: { en: 'Help for women in distress', hi: 'संकट में महिलाओं के लिए मदद' } },
  { number: '1930', color: '#c05621', tint: ['#fffaf0', '#feebc8'], label: { en: 'Cyber Fraud', hi: 'साइबर ठगी' }, note: { en: 'Report online money fraud', hi: 'ऑनलाइन पैसों की ठगी की शिकायत' } },
  { number: '14416', color: '#2c7a7b', tint: ['#e6fffa', '#b2f5ea'], label: { en: 'Tele-MANAS', hi: 'टेली-मानस' }, note: { en: 'Free mental health support', hi: 'मुफ़्त मानसिक स्वास्थ्य सहायता' } },
];

const HomeExtras = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const hi = lang === 'hi';

  // Read once on load (random/date values must not be recomputed on every render).
  const [dayIndex] = useState(() => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000));
  const [stats] = useState(() => {
    const learn = getStoredLearnProgress();
    return {
      streak: getDayStreakCount(),
      questions: getQuestionsAskedCount(),
      topics: getTopicsCompletedCount(),
      badges: totalBadges(getProgress()),
      healthDone: Math.min(learn.health.length, LEARNING_MODULE_SEQUENCE.health.length),
      financeDone: Math.min(learn.finance.length, LEARNING_MODULE_SEQUENCE.finance.length),
    };
  });
  const healthTotal = LEARNING_MODULE_SEQUENCE.health.length;
  const financeTotal = LEARNING_MODULE_SEQUENCE.finance.length;

  const healthTip = HEALTH_TIPS[dayIndex % HEALTH_TIPS.length];
  const financeTip = FINANCE_TIPS[dayIndex % FINANCE_TIPS.length];
  const totalBadgeSlots = GAME_KEYS.length * LEVEL_COUNT;

  return (
    <>
      <section style={styles.section}>
        <h2 className="h3" style={styles.heading}>{hi ? 'आज की सलाह' : 'Tip of the Day'}</h2>
        <div style={styles.twoCol}>
          <div style={{ ...styles.tipCard, background: 'linear-gradient(135deg, #fff5f7, #fed7e2)', borderColor: '#fbb6ce' }}>
            <HeartPulse size={110} color="#d53f8c" style={styles.tipWatermark} aria-hidden="true" />
            <span style={{ ...styles.tipIcon, backgroundColor: '#d53f8c' }}><HeartPulse size={20} color="#fff" /></span>
            <div>
              <strong style={styles.tipTitle}>{hi ? 'स्वास्थ्य' : 'Health'}</strong>
              <p style={styles.tipText}>{healthTip[lang]}</p>
            </div>
          </div>
          <div style={{ ...styles.tipCard, background: 'linear-gradient(135deg, #e6fffa, #b2f5ea)', borderColor: '#81e6d9' }}>
            <Wallet size={110} color="#2c7a7b" style={styles.tipWatermark} aria-hidden="true" />
            <span style={{ ...styles.tipIcon, backgroundColor: '#2c7a7b' }}><Wallet size={20} color="#fff" /></span>
            <div>
              <strong style={styles.tipTitle}>{hi ? 'वित्त' : 'Finance'}</strong>
              <p style={styles.tipText}>{financeTip[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 className="h3" style={styles.heading}>{hi ? 'आपकी प्रगति' : 'Your Progress'}</h2>
        <div style={styles.journey}>
          <Journey
            color="#d53f8c" track="#fed7e2"
            value={stats.healthDone / healthTotal}
            center={`${stats.healthDone}/${healthTotal}`}
            label={hi ? 'स्वास्थ्य पाठ' : 'Health lessons'}
          />
          <Journey
            color="#2c7a7b" track="#b2f5ea"
            value={stats.financeDone / financeTotal}
            center={`${stats.financeDone}/${financeTotal}`}
            label={hi ? 'वित्त पाठ' : 'Finance lessons'}
          />
          <Journey
            color="#d69e2e" track="#fefcbf"
            value={stats.badges / totalBadgeSlots}
            center={`${stats.badges}/${totalBadgeSlots}`}
            label={hi ? 'गेम बैज' : 'Game badges'}
            icon={<Award size={14} color="#d69e2e" />}
          />
        </div>
        <div style={styles.statsGrid}>
          <Stat icon={<Flame size={20} color="#dd6b20" />} tint={['#fffaf0', '#feebc8']} value={stats.streak} label={hi ? 'दिन की स्ट्रीक' : 'Day streak'} />
          <Stat icon={<HelpCircle size={20} color="#3182ce" />} tint={['#ebf8ff', '#bee3f8']} value={stats.questions} label={hi ? 'पूछे गए प्रश्न' : 'Questions asked'} />
          <Stat icon={<BookOpen size={20} color="#2c7a7b" />} tint={['#e6fffa', '#b2f5ea']} value={stats.topics} label={hi ? 'पूरे किए गए विषय' : 'Topics completed'} />
        </div>
        <button type="button" className="btn btn-secondary" style={{ marginTop: '16px' }} onClick={() => navigate('/dashboard/games')}>
          <Gamepad2 size={18} /> {hi ? 'गेम खेलकर और बैज जीतें' : 'Play games and earn more badges'}
        </button>
      </section>

      <section style={styles.section}>
        <div style={styles.headingRow}>
          <h2 className="h3" style={{ ...styles.heading, marginBottom: 0 }}>{hi ? 'जानने लायक सरकारी योजनाएं' : 'Schemes Worth Knowing'}</h2>
          <button type="button" style={styles.linkBtn} onClick={() => navigate('/dashboard/schemes')}>
            {hi ? 'पात्रता जांचें' : 'Check eligibility'} <ArrowRight size={16} />
          </button>
        </div>
        <div style={styles.schemeGrid}>
          {SCHEMES.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.name.en}
                type="button"
                className="hover-card action-card"
                style={{ ...styles.schemeCard, background: `linear-gradient(135deg, color-mix(in srgb, ${s.color} 92%, #1a1030), color-mix(in srgb, ${s.color} 58%, #1a1030))` }}
                onClick={() => navigate('/dashboard/schemes')}
              >
                <span className="bubble" style={styles.schemeBubble}><Icon size={22} color="#fff" /></span>
                <strong style={styles.schemeName}>{s.name[lang]}</strong>
                <span style={styles.schemeLine}>{s.line[lang]}</span>
                <Icon className="watermark" size={92} color="#fff" style={styles.schemeWatermark} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ ...styles.section, marginBottom: '16px' }}>
        <h2 className="h3" style={styles.heading}>{hi ? 'ज़रूरी हेल्पलाइन' : 'Important Helplines'}</h2>
        <div style={styles.schemeGrid}>
          {HELPLINES.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number}`}
              className="hover-card"
              style={{ ...styles.helpCard, background: `linear-gradient(135deg, ${h.tint[0]}, ${h.tint[1]})`, borderLeftColor: h.color }}
            >
              <span className={h.pulse ? 'pulse-ring' : undefined} style={{ ...styles.helpIcon, backgroundColor: h.color, '--pulse': h.color }}>
                <Phone size={18} color="#fff" />
              </span>
              <span style={{ ...styles.helpNumber, color: h.color }}>{h.number}</span>
              <strong style={{ color: 'var(--text-dark)' }}>{h.label[lang]}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{h.note[lang]}</span>
            </a>
          ))}
        </div>
        <p className="subtext" style={{ marginTop: '14px' }}>
          {hi
            ? 'NariShakti सामान्य जानकारी देता है और डॉक्टर या वित्तीय सलाहकार का विकल्प नहीं है।'
            : 'NariShakti shares general information. It is not a substitute for a doctor or a financial adviser.'}
        </p>
      </section>
    </>
  );
};

const Stat = ({ icon, tint, value, label }) => {
  const shown = useCountUp(value);
  return (
    <div style={{ ...styles.stat, background: `linear-gradient(135deg, ${tint[0]}, ${tint[1]})` }}>
      <span style={styles.statIcon}>{icon}</span>
      <strong style={styles.statNumber}>{shown}</strong>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
};

// One ring with its number in the middle and a caption underneath.
const Journey = ({ color, track, value, center, label, icon }) => (
  <div style={styles.journeyItem}>
    <ProgressRing value={value} size={108} stroke={11} color={color} track={track} label={`${label}: ${center}`}>
      {icon}
      <strong style={{ fontSize: '1.25rem', color: 'var(--text-dark)' }}>{center}</strong>
    </ProgressRing>
    <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{label}</span>
  </div>
);

const styles = {
  section: { marginBottom: '40px' },
  heading: { marginBottom: '16px' },
  headingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' },
  linkBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-dark)', fontWeight: '600', fontFamily: 'inherit', fontSize: '0.95rem' },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  tipCard: { position: 'relative', overflow: 'hidden', display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid' },
  tipWatermark: { position: 'absolute', right: '-16px', bottom: '-22px', opacity: 0.13, transform: 'rotate(-10deg)', pointerEvents: 'none' },
  tipIcon: { width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tipTitle: { display: 'block', fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '4px' },
  tipText: { color: 'var(--text-dark)', lineHeight: 1.5, fontSize: '0.98rem' },
  journey: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', padding: '28px 20px', marginBottom: '16px', backgroundColor: 'var(--surface)', backgroundImage: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 60%)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' },
  journeyItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', padding: '18px', border: '1px solid rgba(0,0,0,0.04)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' },
  statIcon: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statNumber: { fontSize: '1.8rem', color: 'var(--text-dark)', lineHeight: 1.1 },
  statLabel: { fontSize: '0.88rem', color: 'var(--text-muted)' },
  schemeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '16px' },
  schemeCard: { position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', minHeight: '168px', padding: '20px', border: 'none', borderRadius: 'var(--radius-lg)', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer', color: '#fff', boxShadow: 'var(--shadow-md)' },
  schemeBubble: { width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.25s ease', marginBottom: '4px' },
  schemeName: { position: 'relative', fontSize: '1.05rem', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.25)' },
  schemeLine: { position: 'relative', color: 'rgba(255,255,255,0.94)', fontSize: '0.92rem', lineHeight: 1.4 },
  schemeWatermark: { position: 'absolute', right: '-14px', bottom: '-18px', opacity: 0.16, transform: 'rotate(-12deg)', pointerEvents: 'none', transition: 'transform 0.3s ease' },
  helpCard: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '18px 20px', border: '1px solid rgba(0,0,0,0.05)', borderLeft: '6px solid', borderRadius: 'var(--radius-md)', textDecoration: 'none' },
  helpIcon: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' },
  helpNumber: { fontSize: '1.6rem', fontWeight: '700', lineHeight: 1.1 },
};

export default HomeExtras;
