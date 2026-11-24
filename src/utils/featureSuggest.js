import {
  Activity, BookOpen, Briefcase, FileText, Gamepad2, Landmark, Lightbulb, ShieldCheck, Stethoscope, Users,
} from 'lucide-react';
import { COURSES } from '../data/courses';

// Points a question at the NariShakti features (and Learn lessons) that can help with it, by keyword.
// Keywords are English, Hinglish (Hindi in Latin letters) and Hindi (Devanagari). Latin keywords match
// at the start of a word ("period" matches "periods"); Devanagari ones match anywhere in the text.
// A keyword with a space in it is a phrase and counts double.

const lesson = (courseId, id, keywords) => {
  const l = COURSES[courseId].lessons.find((x) => x.id === id);
  return {
    id: `lesson-${courseId}-${id}`,
    path: `/dashboard/learn/${courseId}?lesson=${id}`,
    icon: BookOpen,
    title: l.title,
    reason: { en: `Lesson · ${COURSES[courseId].title.en}`, hi: `पाठ · ${COURSES[courseId].title.hi}` },
    video: !!l.video,
    keywords,
  };
};

export const FEATURES = [
  // ---- Learn: menstrual health ----
  lesson('health', 2, ['period', 'menstruation', 'menstrual', 'mahwari', 'mahavari', 'maahvari', 'masik', 'mc ', 'mens', 'cycle', 'chakra', 'irregular', 'late period', 'periods late', 'पीरियड', 'माहवारी', 'मासिक', 'मासिक धर्म', 'चक्र']),
  lesson('health', 3, ['pad', 'sanitary', 'napkin', 'hygiene', 'safai', 'saaf', 'cloth', 'kapda', 'kapde', 'menstrual cup', 'tampon', 'infection', 'itching', 'khujli', 'jalan', 'smell', 'badbu', 'discharge', 'पैड', 'सफ़ाई', 'सफाई', 'खुजली', 'बदबू', 'संक्रमण']),
  lesson('health', 5, ['cramp', 'pain', 'dard', 'ainthan', 'pet dard', 'stomach ache', 'back pain', 'kamar dard', 'painkiller', 'दर्द', 'ऐंठन']),
  lesson('health', 4, ['hormone', 'mood', 'pms', 'chidchida', 'gussa', 'udaas', 'sad', 'tired', 'thakan', 'हार्मोन', 'मूड', 'थकान', 'उदास']),
  lesson('health', 1, ['uterus', 'ovary', 'ovaries', 'vagina', 'fallopian', 'reproductive', 'garbhashay', 'body parts', 'anatomy', 'गर्भाशय', 'अंडाशय', 'योनि']),
  lesson('health', 6, ['myth', 'impure', 'ashuddh', 'kitchen', 'rasoi', 'achar', 'pickle', 'mandir', 'temple', 'sach hai', 'is it true', 'मिथक', 'अशुद्ध', 'रसोई']),
  // ---- Learn: money ----
  lesson('finance', 2, ['upi', 'gpay', 'google pay', 'phonepe', 'phone pe', 'paytm', 'bhim', 'qr', 'online payment', 'digital payment', 'payment', 'send money', 'paise bhej', 'transfer', 'यूपीआई', 'भुगतान']),
  lesson('finance', 5, ['fraud', 'scam', 'otp', 'dhokha', 'thagi', 'cyber', 'hack', 'fake call', 'lottery', 'prize', 'inaam', 'kyc update', '1930', 'paise kat', 'money deducted', 'धोखा', 'ठगी', 'साइबर']),
  lesson('finance', 1, ['bank', 'account', 'khata', 'khaata', 'passbook', 'atm', 'debit card', 'kyc', 'balance', 'jan dhan', 'zero balance', 'खाता', 'बैंक']),
  lesson('finance', 3, ['save', 'saving', 'bachat', 'bachana', 'bachaye', 'emergency fund', 'gullak', 'piggy', 'budget', 'kharcha', 'kharch', 'expense', 'बचत', 'ख़र्च', 'खर्च']),
  lesson('finance', 4, ['fd', 'fixed deposit', 'interest', 'byaj', 'byaaj', 'invest', 'rd', 'recurring deposit', 'deposit', 'ब्याज', 'निवेश']),

  // ---- Features ----
  {
    id: 'tracker', path: '/dashboard/tracker', icon: Activity,
    title: { en: 'Tracker', hi: 'ट्रैकर' },
    reason: { en: 'Log your period dates and savings', hi: 'पीरियड की तारीख और बचत दर्ज करें' },
    keywords: ['track', 'next period', 'period late', 'late period', 'late hai', 'missed period', 'kab aayega', 'kab ayega', 'kab aaega', 'period date', 'date', 'tarikh', 'cycle length', 'record', 'log', 'hisab', 'hisaab', 'savings goal', 'ट्रैक', 'तारीख', 'हिसाब'],
  },
  {
    id: 'doctor', path: '/dashboard/digital-doctor', icon: Stethoscope,
    title: { en: 'Digital Doctor', hi: 'डिजिटल डॉक्टर' },
    reason: { en: 'Find a doctor and book a visit', hi: 'डॉक्टर खोजें और मिलने का समय लें' },
    keywords: ['doctor', 'daktar', 'clinic', 'hospital', 'appointment', 'gynec', 'gynaec', 'specialist', 'checkup', 'check-up', 'jaanch', 'janch', 'fever', 'bukhar', 'symptom', 'heavy bleeding', 'pregnan', 'garbh', 'delivery', 'pcos', 'pcod', 'thyroid', 'anemia', 'khoon ki kami', 'डॉक्टर', 'अस्पताल', 'बुखार', 'गर्भ', 'जाँच', 'जांच'],
  },
  {
    id: 'scanner', path: '/dashboard/scanner', icon: FileText,
    title: { en: 'Doc Scanner', hi: 'डॉक स्कैनर' },
    reason: { en: 'Upload a report or document for a simple summary', hi: 'रिपोर्ट या दस्तावेज़ का आसान सार पाएँ' },
    keywords: ['report', 'document', 'pdf', 'scan', 'prescription', 'parcha', 'parchi', 'bill', 'statement', 'blood test', 'test result', 'letter', 'form', 'samajh nahi', 'रिपोर्ट', 'दस्तावेज़', 'पर्चा'],
  },
  {
    id: 'schemes', path: '/dashboard/schemes', icon: Landmark,
    title: { en: 'Govt Schemes', hi: 'सरकारी योजनाएँ' },
    reason: { en: 'Schemes for women, and who can apply', hi: 'महिलाओं की योजनाएँ, और कौन आवेदन कर सकता है' },
    keywords: ['scheme', 'yojana', 'yojna', 'sarkari', 'government', 'govt', 'subsidy', 'pension', 'sukanya', 'matru vandana', 'pmmvy', 'janani', 'jsy', 'mudra', 'loan', 'beti bachao', 'mahila samman', 'benefit', 'pregnan', 'garbh', 'योजना', 'सरकारी', 'लोन'],
  },
  {
    id: 'jobs', path: '/dashboard/opportunities-women', icon: Briefcase,
    title: { en: 'Opportunities for Women', hi: 'महिलाओं के लिए अवसर' },
    reason: { en: 'Jobs, government exams and openings', hi: 'नौकरियाँ, सरकारी परीक्षाएँ और भर्तियाँ' },
    keywords: ['job', 'naukri', 'work from home', 'kaam chahiye', 'career', 'vacancy', 'recruitment', 'bharti', 'ssc', 'railway', 'rrb', 'interview', 'resume', 'income', 'kamai', 'kamana', 'earn', 'business', 'नौकरी', 'रोज़गार', 'रोजगार', 'भर्ती', 'कमाई'],
  },
  {
    id: 'community', path: '/dashboard/community', icon: Users,
    title: { en: 'Didi Connect', hi: 'दीदी कनेक्ट' },
    reason: { en: 'Talk to other women who have been there', hi: 'दूसरी महिलाओं से बात करें' },
    keywords: ['didi', 'community', 'friend', 'saheli', 'group', 'lonely', 'akela', 'akeli', 'support', 'share', 'talk to someone', 'baat karni', 'experience', 'दीदी', 'सहेली', 'अकेली', 'अकेला'],
  },
  {
    id: 'games', path: '/dashboard/games', icon: Gamepad2,
    title: { en: 'Play Games', hi: 'खेल खेलें' },
    reason: { en: 'Learn while you play', hi: 'खेल-खेल में सीखें' },
    keywords: ['game', 'play', 'khel', 'bored', 'fun', 'खेल'],
  },
  {
    id: 'test', path: '/dashboard/test', icon: ShieldCheck,
    title: { en: 'Test Your Knowledge', hi: 'अपना ज्ञान परखें' },
    reason: { en: 'A quick quiz on health and money', hi: 'सेहत और पैसों पर छोटा क्विज़' },
    keywords: ['quiz', 'take a test', 'mock test', 'test my knowledge', 'check my knowledge', 'pariksha', 'क्विज़', 'परीक्षा'],
  },
  {
    id: 'daily', path: '/dashboard/daily-question', icon: Lightbulb,
    title: { en: 'Aaj Ka Sawaal', hi: 'आज का सवाल' },
    reason: { en: 'One new question every day', hi: 'हर दिन एक नया सवाल' },
    keywords: ['aaj ka sawaal', 'aaj ka sawal', 'daily question', 'question of the day', 'आज का सवाल'],
  },
];

const DEVANAGARI = /[ऀ-ॿ]/;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matchers = FEATURES.map((f) => ({
  feature: f,
  tests: f.keywords.map((k) => {
    const kw = k.trim().toLowerCase();
    const weight = kw.includes(' ') ? 2 : 1;
    // a short Latin keyword ("fd", "rd", "qr", "atm") must be a whole word, a longer one only has to start one
    const re = DEVANAGARI.test(kw) ? null : new RegExp(`(^|[^a-z0-9])${escape(kw)}${kw.length <= 3 ? '($|[^a-z0-9])' : ''}`, 'i');
    return { kw, weight, re };
  }),
}));

// The features that best fit `text`, best first (at most `limit`).
export const suggestFeatures = (text, limit = 3) => {
  const q = ` ${String(text || '').toLowerCase()} `;
  if (q.trim().length < 2) return [];
  return matchers
    .map(({ feature, tests }) => ({
      feature,
      score: tests.reduce((s, t) => s + ((t.re ? t.re.test(q) : q.includes(t.kw)) ? t.weight : 0), 0),
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((m) => m.feature);
};
