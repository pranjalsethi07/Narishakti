// The courses in Learn: two courses, each with 20 sections (lessons) in 5 levels of 4.
// Each lesson is taken step by step: Watch (when it has a video) → Read → Quiz.
// Lesson ids (1 to 20) are what learnProgress stores (see utils/learningProgress.js), so keep them stable.
//
// The lesson text lives in data/courseContent/: financeA/B/C.js and healthA/B/C.js, one entry per section.
// Every bullet of the course outline is one "key point" card there. To change a lesson, edit its entry.
// Videos marked `ai` are built by tools/lesson-video/build.py from tools/lesson-video/lessons/<course>-<id>.json.

import { buildLesson, level } from './courseContent/build.js';
import { FINANCE_A } from './courseContent/financeA.js';
import { FINANCE_B } from './courseContent/financeB.js';
import { FINANCE_C } from './courseContent/financeC.js';
import { HEALTH_A } from './courseContent/healthA.js';
import { HEALTH_B } from './courseContent/healthB.js';
import { HEALTH_C } from './courseContent/healthC.js';

const aiVideo = (key) => ({
  ai: true,
  src: `/videos/learn/${key}.mp4`,
  poster: `/videos/learn/${key}.jpg`,
  tracks: [
    { lang: 'hi', label: 'हिंदी', src: `/videos/learn/${key}.hi.vtt` },
    { lang: 'en', label: 'English', src: `/videos/learn/${key}.en.vtt` },
  ],
});

// AI videos that already exist, and the section each one belongs to: { courseId: { lessonId: videoKey } }.
const VIDEOS = {
  health: { 3: 'health-2' }, // Menstrual Health and Hygiene
  finance: { 4: 'finance-2' }, // Banking and Financial Accounts (UPI)
};

const lessonsFor = (courseId, definitions) =>
  definitions.map((def) => {
    const lesson = buildLesson(def);
    const videoKey = VIDEOS[courseId]?.[def.id];
    return videoKey ? { ...lesson, video: aiVideo(videoKey) } : lesson;
  });

export const COURSES = {
  health: {
    id: 'health',
    title: { en: 'Health & Wellness Literacy', hi: 'स्वास्थ्य और वेलनेस साक्षरता' },
    native: 'स्वास्थ्य और वेलनेस',
    tagline: {
      en: 'From understanding your body to confidently managing your physical, reproductive, mental and long-term health.',
      hi: 'अपने शरीर को समझने से लेकर शारीरिक, प्रजनन, मानसिक और लंबे समय की सेहत को आत्मविश्वास से सँभालने तक।',
    },
    emoji: '🌸',
    gradient: 'linear-gradient(135deg, #4a2378 0%, #7a3fb8 55%, #c2557f 100%)',
    accent: '#d53f8c',
    levels: [
      level(1, 'Understanding Your Body', 'अपने शरीर को समझना', 'Build the foundation for informed health decisions.', 'समझदारी भरे स्वास्थ्य फ़ैसलों की नींव बनाएँ।'),
      level(2, 'Everyday Health and Self-Care', 'रोज़मर्रा की सेहत और देखभाल', 'Develop practical habits for physical and emotional well-being.', 'शारीरिक और भावनात्मक कल्याण के लिए व्यावहारिक आदतें बनाएँ।'),
      level(3, 'Reproductive and Sexual Health', 'प्रजनन और यौन स्वास्थ्य', 'Understand reproductive choices, sexual health and personal autonomy.', 'प्रजनन संबंधी चुनाव, यौन स्वास्थ्य और व्यक्तिगत स्वायत्तता को समझें।'),
      level(4, 'Prevention, Diagnosis, and Healthcare Access', 'रोकथाम, जाँच और स्वास्थ्य सेवा तक पहुँच', 'Learn to recognise health risks and navigate healthcare with confidence.', 'स्वास्थ्य जोखिम पहचानना और आत्मविश्वास से स्वास्थ्य सेवाओं का उपयोग करना सीखें।'),
      level(5, 'Advanced Health Management and Lifelong Wellness', 'उन्नत स्वास्थ्य प्रबंधन और जीवन भर की सेहत', 'Build long-term health awareness and independent decision-making.', 'लंबे समय की स्वास्थ्य जागरूकता और स्वतंत्र फ़ैसले लेने की क्षमता बनाएँ।'),
    ],
    lessons: lessonsFor('health', [...HEALTH_A, ...HEALTH_B, ...HEALTH_C]),
  },
  finance: {
    id: 'finance',
    title: { en: 'Financial Literacy', hi: 'वित्तीय साक्षरता' },
    native: 'वित्तीय साक्षरता',
    tagline: {
      en: 'From the basics of money to managing your finances on your own, building wealth and making informed decisions.',
      hi: 'पैसे की बुनियादी बातों से लेकर अपने वित्त को ख़ुद सँभालने, संपत्ति बनाने और समझदारी से फ़ैसले लेने तक।',
    },
    emoji: '💰',
    gradient: 'linear-gradient(135deg, #0f3d4a 0%, #19727a 55%, #2dc6b1 100%)',
    accent: '#1f9e8c',
    levels: [
      level(1, 'Understanding Money', 'पैसे को समझना', 'Build financial awareness and confidence.', 'वित्तीय जागरूकता और आत्मविश्वास बनाएँ।'),
      level(2, 'Financial Security and Control', 'आर्थिक सुरक्षा और नियंत्रण', 'Learn to save, borrow and protect your money.', 'बचत करना, उधार लेना और पैसे की सुरक्षा करना सीखें।'),
      level(3, 'Financial Planning and Protection', 'आर्थिक योजना और सुरक्षा', 'Plan for life events and protect your financial stability.', 'जीवन की घटनाओं की योजना बनाएँ और अपनी आर्थिक स्थिरता की रक्षा करें।'),
      level(4, 'Wealth Creation and Investment', 'संपत्ति निर्माण और निवेश', 'Move from saving money to growing wealth.', 'पैसे बचाने से आगे बढ़कर संपत्ति बढ़ाना सीखें।'),
      level(5, 'Financial Independence and Advanced Planning', 'आर्थिक आज़ादी और उन्नत योजना', 'Build long-term financial independence and decision-making skills.', 'लंबे समय की आर्थिक आज़ादी और फ़ैसले लेने की क्षमता बनाएँ।'),
    ],
    lessons: lessonsFor('finance', [...FINANCE_A, ...FINANCE_B, ...FINANCE_C]),
  },
};

export const COURSE_ORDER = ['health', 'finance'];

// The steps a lesson is taken in.
export const stepsOf = (lesson) => [...(lesson.video ? ['watch'] : []), 'read', 'quiz'];

// The level a lesson belongs to.
export const levelOf = (course, lesson) => course.levels?.find((l) => l.id === lesson.level);
