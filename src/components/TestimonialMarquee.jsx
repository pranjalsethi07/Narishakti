import { Quote } from 'lucide-react';
import { useLanguage } from '../context/languageContextValue';

// Placeholder stories for the landing page. Replace with real, consented quotes before launch.
const STORIES = [
  { en: 'NariShakti helped me understand how to open my first bank account without depending on anyone.', hi: 'नारीशक्ति ने मुझे किसी पर निर्भर हुए बिना अपना पहला बैंक खाता खोलने का तरीका समझने में मदद की।', who: ['Sunita, 28', 'सुनीता, 28'] },
  { en: "The Ask AI feature is like a doctor in my pocket. I don't feel shy asking questions about my body anymore.", hi: 'एआई से पूछें सुविधा मेरी जेब में एक डॉक्टर की तरह है। मुझे अब अपने शरीर के बारे में सवाल पूछने में शर्म नहीं आती।', who: ['Priya, 22', 'प्रिया, 22'] },
  { en: 'I finally understand my budget. I now put a little aside every month, even from a small income.', hi: 'अब मैं अपना बजट समझती हूँ। छोटी कमाई में से भी हर महीने थोड़ा बचा लेती हूँ।', who: ['Meena, 34', 'मीना, 34'] },
  { en: 'My daughter is 12. The lessons explain periods so gently that she now talks to me openly.', hi: 'मेरी बेटी 12 साल की है। पीरियड्स के पाठ इतने प्यार से समझाते हैं कि अब वह मुझसे खुलकर बात करती है।', who: ['Kavita, 38', 'कविता, 38'] },
  { en: 'I learned how to spot a fake loan app before I lost any money. That one lesson was worth it.', hi: 'पैसे गँवाने से पहले ही मैंने नकली लोन ऐप पहचानना सीख लिया। यही एक पाठ काफ़ी था।', who: ['Rukhsar, 30', 'रुख़सार, 30'] },
  { en: 'Hindi voice questions are so easy. My mother-in-law uses it more than I do now!', hi: 'हिंदी में बोलकर पूछना बहुत आसान है। अब तो मेरी सास मुझसे ज़्यादा इस्तेमाल करती हैं!', who: ['Anjali, 26', 'अंजलि, 26'] },
  { en: 'The games made learning about SIP and savings fun. I keep going back for the badges.', hi: 'गेम्स ने SIP और बचत सीखना मज़ेदार बना दिया। बैज के लिए मैं बार-बार लौटती हूँ।', who: ['Divya, 19', 'दिव्या, 19'] },
  { en: 'During my pregnancy I could check small worries at night without feeling judged.', hi: 'गर्भावस्था में रात को छोटी-छोटी चिंताएँ बिना किसी के जज किए पूछ पाती थी।', who: ['Farah, 31', 'फ़राह, 31'] },
];

const TestimonialMarquee = () => {
  const { lang } = useLanguage();
  const pick = (s) => (lang === 'hi' ? s.hi : s.en);

  const card = (s, i, hidden) => (
    <figure key={`${hidden ? 'b' : 'a'}${i}`} className="tm-card" aria-hidden={hidden || undefined}>
      <Quote size={32} color="var(--primary-light)" style={{ marginBottom: 12 }} />
      <blockquote style={{ margin: 0, fontSize: '1.02rem', fontStyle: 'italic', lineHeight: 1.6 }}>{pick(s)}</blockquote>
      <figcaption style={{ marginTop: 16, fontWeight: 700, color: 'var(--primary-dark)' }}>- {lang === 'hi' ? s.who[1] : s.who[0]}</figcaption>
    </figure>
  );

  return (
    <div className="tm-viewport">
      <style>{`
        .tm-viewport { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
        .tm-track { display: flex; gap: 24px; width: max-content; animation: tm-scroll 70s linear infinite; padding: 8px 0 16px; }
        .tm-viewport:hover .tm-track, .tm-viewport:focus-within .tm-track { animation-play-state: paused; }
        .tm-card { flex: 0 0 340px; margin: 0; padding: 28px; text-align: left; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
        @keyframes tm-scroll { to { transform: translateX(calc(-50% - 12px)); } }
        @media (prefers-reduced-motion: reduce) {
          .tm-viewport { -webkit-mask-image: none; mask-image: none; overflow-x: auto; }
          .tm-track { animation: none; }
        }
      `}</style>
      <div className="tm-track">
        {STORIES.map((s, i) => card(s, i, false))}
        {STORIES.map((s, i) => card(s, i, true))}
      </div>
    </div>
  );
};

export default TestimonialMarquee;
