import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, Flame, Lightbulb, BookOpen, RotateCcw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/languageContextValue';
import { COURSES } from '../../data/courses';
import { COIN_RULES, MAX_RESTORES_PER_MONTH, RESTORE_COSTS, getLedgerNewestFirst, getRestoreOffer, restoreStreak, useCoinBalance } from '../../utils/coins';
import { getDayStreakCount, recordDailyActivity, RESTORE_WINDOW_DAYS } from '../../utils/userProgress';

const read = () => ({ offer: getRestoreOffer(), streak: getDayStreakCount(), history: getLedgerNewestFirst().slice(0, 30) });

const CoinBag = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const hi = lang === 'hi';
  const tr = (en, hi_) => (hi ? hi_ : en);
  const balance = useCoinBalance();
  const [data, setData] = useState(() => {
    recordDailyActivity(); // today counts; also notices a break so the restore offer is up to date
    return read();
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const refresh = () => setData(read());
    window.addEventListener('naari-progress-synced', refresh);
    window.addEventListener('naari-coins-changed', refresh);
    return () => {
      window.removeEventListener('naari-progress-synced', refresh);
      window.removeEventListener('naari-coins-changed', refresh);
    };
  }, []);

  const { offer, streak, history } = data;
  const date = (iso) => new Date(iso).toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' });
  const dayText = (iso) => new Date(iso).toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long' });

  const describe = (e) => {
    if (e.kind === 'lesson') {
      const [, course, lessonId] = e.id.split(':');
      const lesson = COURSES[course]?.lessons.find((l) => String(l.id) === lessonId);
      return tr(`Finished a lesson: ${lesson?.title.en ?? ''}`, `पाठ पूरा किया: ${lesson?.title.hi ?? ''}`);
    }
    if (e.kind === 'daily') return tr("Answered today's question", 'आज का सवाल हल किया');
    return tr('Restored a broken streak', 'टूटी हुई स्ट्रीक वापस पाई');
  };

  const restore = () => {
    const result = restoreStreak();
    if (result.ok) {
      setMessage(tr(`Your streak is back at ${result.streak} days. ${result.cost} coins spent.`, `आपकी स्ट्रीक वापस ${result.streak} दिन की हो गई। ${result.cost} सिक्के खर्च हुए।`));
    } else if (result.reason === 'coins') {
      setMessage(tr('You do not have enough coins yet.', 'अभी आपके पास पर्याप्त सिक्के नहीं हैं।'));
    } else if (result.reason === 'limit') {
      setMessage(tr('You have used all 3 restores this month.', 'इस महीने के तीनों रीस्टोर इस्तेमाल हो चुके हैं।'));
    }
    setData(read());
  };

  const { lost, used, cost, canRestore } = offer;

  return (
    <div style={styles.page}>
      <button className="page-back" onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        <ArrowLeft size={20} /> {tr('Back', 'वापस')}
      </button>

      <section style={styles.hero}>
        <span style={styles.bag} aria-hidden="true"><Coins size={40} color="#fff" /></span>
        <div>
          <p style={{ opacity: 0.9 }}>{tr('Your Coin Bag', 'आपका कॉइन बैग')}</p>
          <h1 className="h2" style={{ color: '#fff', fontSize: '2.4rem' }} aria-live="polite">{balance} {tr('coins', 'सिक्के')}</h1>
        </div>
      </section>

      <section style={styles.card}>
        <h2 className="h3" style={styles.h}>{tr('How to earn coins', 'सिक्के कैसे कमाएँ')}</h2>
        <div style={styles.earn}>
          <div style={styles.earnItem}><BookOpen size={22} color="#1f9e8c" /><span><strong>+{COIN_RULES.lesson}</strong> {tr('for each lesson you finish (once per lesson)', 'हर पूरे किए पाठ पर (हर पाठ पर एक बार)')}</span></div>
          <div style={styles.earnItem}><Lightbulb size={22} color="#b7791f" /><span><strong>+{COIN_RULES.daily}</strong> {tr("for answering today's question correctly (once a day)", 'आज का सवाल सही हल करने पर (दिन में एक बार)')}</span></div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 className="h3" style={styles.h}><Flame size={22} color="#dd6b20" /> {tr('Your streak', 'आपकी स्ट्रीक')}: {streak} {tr('days', 'दिन')}</h2>

        {lost ? (
          <div style={styles.restore}>
            <p style={{ fontWeight: 700, marginBottom: 6 }}>
              {tr(`Your ${lost.lostStreak}-day streak broke.`, `आपकी ${lost.lostStreak} दिन की स्ट्रीक टूट गई।`)}
            </p>
            <p style={styles.muted}>
              {tr(
                `Win it back and you will have ${lost.lostStreak + lost.current} days. You can restore until ${dayText(lost.expiresOn)}.`,
                `वापस पाने पर आपकी स्ट्रीक ${lost.lostStreak + lost.current} दिन की हो जाएगी। आप ${dayText(lost.expiresOn)} तक रीस्टोर कर सकती हैं।`,
              )}
            </p>
            {cost == null ? (
              <p style={{ ...styles.muted, marginTop: 10 }}>{tr('You have used all 3 restores this month. They come back next month.', 'इस महीने के तीनों रीस्टोर इस्तेमाल हो चुके हैं। अगले महीने फिर मिलेंगे।')}</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 14 }}>
                <button type="button" onClick={restore} disabled={!canRestore} style={{ ...styles.restoreBtn, ...(canRestore ? null : styles.restoreOff) }}>
                  <RotateCcw size={18} /> {tr(`Restore for ${cost} coins`, `${cost} सिक्कों में रीस्टोर करें`)}
                </button>
                {!canRestore && <span style={styles.muted}>{tr(`You need ${cost - offer.balance} more coins.`, `आपको ${cost - offer.balance} सिक्के और चाहिए।`)}</span>}
              </div>
            )}
          </div>
        ) : (
          <p style={styles.muted}>
            {tr(
              `If you miss a day, your streak breaks, but you can win it back with coins for ${RESTORE_WINDOW_DAYS} days.`,
              `अगर एक दिन छूट जाए तो स्ट्रीक टूट जाती है, पर आप ${RESTORE_WINDOW_DAYS} दिन तक सिक्कों से उसे वापस पा सकती हैं।`,
            )}
          </p>
        )}

        {message && <p role="status" style={{ marginTop: 12, fontWeight: 600, color: 'var(--primary-dark)' }}>{message}</p>}

        <div style={styles.rules}>
          <ShieldCheck size={18} color="var(--text-muted)" />
          <span>
            {tr(
              `Up to ${MAX_RESTORES_PER_MONTH} restores a month, and each costs more: ${RESTORE_COSTS.join(', ')} coins. This month: ${used} of ${MAX_RESTORES_PER_MONTH} used.`,
              `महीने में ${MAX_RESTORES_PER_MONTH} तक रीस्टोर, और हर बार ज़्यादा सिक्के: ${RESTORE_COSTS.join(', ')}। इस महीने: ${MAX_RESTORES_PER_MONTH} में से ${used} इस्तेमाल हुए।`,
            )}
          </span>
        </div>
      </section>

      <section style={styles.card}>
        <h2 className="h3" style={styles.h}>{tr('Recent coins', 'हाल के सिक्के')}</h2>
        {history.length === 0 ? (
          <p style={styles.muted}>{tr('No coins yet. Finish a lesson to fill your bag.', 'अभी कोई सिक्का नहीं। बैग भरने के लिए एक पाठ पूरा करें।')}</p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((e) => (
              <li key={e.id} style={styles.row}>
                <span style={{ flex: 1, minWidth: 0 }}>{describe(e)}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '.88rem' }}>{date(e.at)}</span>
                <strong style={{ color: e.amount > 0 ? '#2f855a' : '#c53030', minWidth: 56, textAlign: 'right' }}>{e.amount > 0 ? `+${e.amount}` : e.amount}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const styles = {
  page: { padding: '24px', maxWidth: 860, margin: '0 auto' },
  backBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: 28 },
  hero: { display: 'flex', alignItems: 'center', gap: 20, padding: 28, borderRadius: 'var(--radius-lg)', color: '#fff', background: 'linear-gradient(135deg, #d69e2e, #dd6b20)', marginBottom: 24, boxShadow: 'var(--shadow-md)' },
  bag: { width: 72, height: 72, borderRadius: 22, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' },
  card: { background: 'var(--surface)', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: 24 },
  h: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 },
  earn: { display: 'flex', flexDirection: 'column', gap: 12 },
  earnItem: { display: 'flex', alignItems: 'center', gap: 12 },
  muted: { color: 'var(--text-muted)' },
  restore: { padding: 18, borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)' },
  restoreBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  restoreOff: { opacity: 0.5, cursor: 'not-allowed' },
  rules: { display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, color: 'var(--text-muted)', fontSize: '.92rem' },
  row: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)' },
};

export default CoinBag;
