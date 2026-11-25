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
  // ---- Learn: Health & Wellness ----
  lesson('health', 3, ['period', 'menstruation', 'menstrual', 'mahwari', 'mahavari', 'maahvari', 'masik', 'mc ', 'mens', 'cycle', 'chakra', 'irregular', 'late period', 'periods late', 'पीरियड', 'माहवारी', 'मासिक', 'मासिक धर्म', 'चक्र', 'pad', 'sanitary', 'napkin', 'hygiene', 'safai', 'saaf', 'cloth', 'kapda', 'kapde', 'menstrual cup', 'tampon', 'पैड', 'सफ़ाई', 'सफाई', 'cramp', 'pain', 'dard', 'ainthan', 'pet dard', 'stomach ache', 'back pain', 'kamar dard', 'painkiller', 'दर्द', 'ऐंठन', 'myth', 'impure', 'ashuddh', 'kitchen', 'rasoi', 'achar', 'pickle', 'mandir', 'temple', 'sach hai', 'is it true', 'मिथक', 'अशुद्ध', 'रसोई']),
  lesson('health', 5, ['infection', 'itching', 'khujli', 'jalan', 'smell', 'badbu', 'discharge', 'खुजली', 'बदबू', 'संक्रमण', 'hygiene', 'intimate', 'vaginal', 'white discharge', 'safai', 'योनि स्राव', 'स्वच्छता']),
  lesson('health', 2, ['uterus', 'ovary', 'ovaries', 'vagina', 'fallopian', 'reproductive', 'garbhashay', 'body parts', 'anatomy', 'गर्भाशय', 'अंडाशय', 'योनि', 'hormone', 'puberty', 'hormones', 'हार्मोन']),
  lesson('health', 8, ['mood', 'pms', 'chidchida', 'gussa', 'udaas', 'sad', 'tired', 'thakan', 'मूड', 'थकान', 'उदास', 'anxiety', 'stress', 'tension', 'depression', 'mental health', 'ghabrahat', 'चिंता', 'तनाव', 'अवसाद']),
  lesson('health', 4, ['nutrition', 'diet', 'iron', 'calcium', 'vitamin', 'protein', 'khana', 'poshan', 'anemia', 'anaemia', 'khoon ki kami', 'पोषण', 'आहार', 'आयरन', 'ख़ून की कमी']),
  lesson('health', 6, ['exercise', 'fitness', 'yoga', 'workout', 'walking', 'kasrat', 'वर्कआउट', 'कसरत', 'व्यायाम']),
  lesson('health', 7, ['sleep', 'insomnia', 'neend', 'sleeping', 'नींद']),
  lesson('health', 11, ['contraception', 'contraceptive', 'birth control', 'condom', 'copper t', 'iud', 'family planning', 'pregnancy rokna', 'गर्भनिरोधक', 'परिवार नियोजन']),
  lesson('health', 12, ['pregnant', 'pregnancy', 'garbh', 'garbhavastha', 'prenatal', 'antenatal', 'delivery', 'baby', 'breastfeeding', 'गर्भावस्था', 'गर्भवती', 'प्रसव']),
  lesson('health', 13, ['pcos', 'pcod', 'thyroid', 'endometriosis', 'fibroid', 'uti', 'urine infection', 'थायरॉइड']),
  lesson('health', 14, ['screening', 'pap smear', 'cervical cancer', 'breast cancer', 'mammogram', 'hpv', 'checkup', 'सर्वाइकल', 'स्तन कैंसर']),
  lesson('health', 19, ['abuse', 'violence', 'domestic violence', 'unsafe', 'harassment', 'marpit', 'हिंसा', 'मारपीट', 'उत्पीड़न']),
  // ---- Learn: Financial Literacy ----
  lesson('finance', 4, ['upi', 'gpay', 'google pay', 'phonepe', 'phone pe', 'paytm', 'bhim', 'qr', 'online payment', 'digital payment', 'payment', 'send money', 'paise bhej', 'transfer', 'यूपीआई', 'भुगतान', 'bank', 'account', 'khata', 'khaata', 'passbook', 'atm', 'debit card', 'kyc', 'balance', 'zero balance', 'खाता', 'बैंक', 'statement', 'neft', 'rtgs', 'imps']),
  lesson('finance', 20, ['fraud', 'scam', 'otp', 'dhokha', 'thagi', 'cyber', 'hack', 'fake call', 'lottery', 'prize', 'inaam', 'kyc update', '1930', 'paise kat', 'money deducted', 'धोखा', 'ठगी', 'साइबर', 'phishing', 'upi fraud', 'password', 'pin', 'online safety']),
  lesson('finance', 3, ['budget', 'kharcha', 'kharch', 'expense', 'ख़र्च', 'खर्च', 'monthly budget', '50/30/20', 'income expense']),
  lesson('finance', 5, ['save', 'saving', 'bachat', 'bachana', 'bachaye', 'बचत', 'fd', 'fixed deposit', 'interest', 'byaj', 'byaaj', 'rd', 'recurring deposit', 'deposit', 'ब्याज']),
  lesson('finance', 6, ['emergency fund', 'gullak', 'piggy', 'emergency', 'job loss', 'sudden expense', 'इमरजेंसी']),
  lesson('finance', 7, ['loan', 'emi', 'udhaar', 'udhar', 'borrow', 'moneylender', 'loan app', 'gold loan', 'लोन', 'उधार', 'कर्ज़']),
  lesson('finance', 8, ['credit score', 'cibil', 'credit card', 'credit report', 'क्रेडिट स्कोर', 'क्रेडिट कार्ड']),
  lesson('finance', 9, ['financial goal', 'goal', 'plan my money', 'lakshya', 'लक्ष्य']),
  lesson('finance', 10, ['insurance', 'bima', 'premium', 'health insurance', 'term insurance', 'claim', 'बीमा']),
  lesson('finance', 12, ['jan dhan', 'sukanya', 'atal pension', 'ppf', 'nps', 'government scheme', 'sarkari yojana', 'सुकन्या', 'अटल पेंशन', 'योजना']),
  lesson('finance', 13, ['invest', 'निवेश', 'investing', 'inflation', 'compounding', 'mahangai', 'महँगाई']),
  lesson('finance', 15, ['mutual fund', 'sip', 'nav', 'म्यूचुअल फ़ंड', 'म्यूचुअल फंड']),
  lesson('finance', 17, ['tax', 'income tax', 'itr', 'form 16', 'tds', 'कर', 'टैक्स', 'आयकर']),
  lesson('finance', 18, ['retirement', 'pension', 'epf', 'budhapa', 'रिटायरमेंट', 'पेंशन']),
  lesson('finance', 19, ['business', 'shop', 'dukaan', 'mudra', 'stand up india', 'self employed', 'व्यवसाय', 'दुकान', 'मुद्रा']),

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
