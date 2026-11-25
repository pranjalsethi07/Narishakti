// Storage and helpers for Didi Connect.
// Posts live in this browser (localStorage) for now. Everything that reads or writes
// them goes through loadPosts / savePosts, so a database can replace them later.

const STORE_KEY = 'didi_connect_posts_v2';
const OLD_KEY = 'didi_connect_posts_v1';

export const CATEGORIES = ['Health', 'Finance', 'Safety'];
export const MAX_POST_LENGTH = 500;
export const MAX_REPLY_LENGTH = 300;

// Sample posts shown the first time. `ageMinutes` is how long ago they were "posted".
const SEEDS = [
  {
    id: 'seed-1', category: 'Health', alias: 'Anonymous Jasmine 214', ageMinutes: 125, helpful: 24,
    content: 'Meri period cycle irregular hai pichle 3 mahine se. Kya mujhe doctor ko dikhana chahiye? Ghar pe sab bolte hai normal hai par mujhe tension ho rahi hai.',
    contentEn: 'My period cycle has been irregular for 3 months. Should I see a doctor?',
    replies: [
      { id: 'r-1a', author: 'Sehat Saheli', expert: true, ageMinutes: 90, text: 'Agar cycle 3 months se irregular hai, doctor consultation lena best rahega.' },
      { id: 'r-1b', author: 'Anonymous Tulsi 402', ageMinutes: 60, text: 'Mere saath bhi aisa hua tha. Doctor ne simple blood test karwaye aur sab theek ho gaya.' },
    ],
  },
  {
    id: 'seed-2', category: 'Safety', alias: 'Anonymous Marigold 087', ageMinutes: 310, helpful: 156,
    content: 'Local bus me travel karte waqt agar koi pareshan kare toh emergency helpline 112 pe turant call karni chahiye. Maine kal use kiya tha, police 10 min me aa gayi.',
    contentEn: 'If someone bothers you on local buses, immediately call 112.',
    replies: [
      { id: 'r-2a', author: 'Safety Volunteer', ageMinutes: 280, text: 'Great that you used 112 quickly. Sharing helpline awareness helps everyone.' },
    ],
  },
  {
    id: 'seed-3', category: 'Finance', alias: 'Anonymous Champa 351', ageMinutes: 1500, helpful: 42,
    content: 'Silai ke business ke liye bina collateral ke loan kahan se mil sakta hai? Mudra yojna try kiya tha par paperwork samajh nahi aa raha.',
    contentEn: 'Where can I get a collateral-free loan for my tailoring business?',
    replies: [
      { id: 'r-3a', author: 'Finance Mentor', expert: true, ageMinutes: 1400, text: 'Jan Dhan + Mudra support center par documents verify karwa kar apply karein.' },
      { id: 'r-3b', author: 'Anonymous Rose 119', ageMinutes: 1300, text: 'Apne bank ki nazdeeki branch me jaakar Mudra ke baare me pooch lijiye. Wo form bharne me madad karte hain.' },
    ],
  },
  {
    id: 'seed-4', category: 'Health', alias: 'Anonymous Neem 560', ageMinutes: 2900, helpful: 67,
    content: 'Mujhe aksar thakaan aur chakkar aate hain. Kya khana chahiye jisse khoon ki kami door ho?',
    contentEn: 'I often feel tired and dizzy. What should I eat to fix low iron?',
    replies: [
      { id: 'r-4a', author: 'Sehat Saheli', expert: true, ageMinutes: 2800, text: 'Palak, gud, chana aur dal khayein, saath me nimbu ya santra jaisa vitamin C. Agar thakaan bani rahe toh khoon ki jaanch karwayein.' },
    ],
  },
  {
    id: 'seed-5', category: 'Finance', alias: 'Anonymous Banyan 933', ageMinutes: 4300, helpful: 98,
    content: 'Kisi ne call karke bola ki bank se hoon, OTP batao warna account band ho jayega. Maine nahi bataya. Aage kya karun?',
    contentEn: 'Someone called saying they were from the bank and asked for my OTP. I did not share it. What now?',
    replies: [
      { id: 'r-5a', author: 'Finance Mentor', expert: true, ageMinutes: 4200, text: 'Bahut accha kiya. Bank kabhi OTP ya PIN nahi mangta. Aise call ki shikayat 1930 par ya cybercrime.gov.in par karein.' },
    ],
  },
];

const buildSeedPosts = (now) =>
  SEEDS.map((s) => ({
    id: s.id,
    category: s.category,
    alias: s.alias,
    createdAt: now - s.ageMinutes * 60000,
    content: s.content,
    contentEn: s.contentEn,
    helpfulCount: s.helpful,
    helpfulByMe: false,
    mine: false,
    reported: false,
    replies: s.replies.map((r) => ({
      id: r.id,
      author: r.author,
      expert: Boolean(r.expert),
      mine: false,
      createdAt: now - r.ageMinutes * 60000,
      text: r.text,
    })),
  }));

// Posts you wrote with the first version of the page are kept; only they carry a real timestamp.
const migrateOldPosts = () => {
  try {
    const old = JSON.parse(localStorage.getItem(OLD_KEY) || '[]');
    if (!Array.isArray(old)) return [];
    return old
      .filter((p) => typeof p.id === 'number' && p.id > 1e12)
      .map((p) => ({
        id: `mine-${p.id}`,
        category: p.category || 'Health',
        alias: p.author === 'You' ? 'You' : 'Anonymous',
        createdAt: p.id,
        content: p.content || '',
        contentEn: '',
        helpfulCount: p.helpfulCount || 0,
        helpfulByMe: Boolean(p.helpfulByMe),
        mine: true,
        reported: false,
        replies: (p.replyMessages || []).map((r, i) => ({
          id: `m-${p.id}-${i}`,
          author: r.author || 'You',
          expert: false,
          mine: r.author === 'You',
          createdAt: p.id + (i + 1) * 60000,
          text: r.text || '',
        })),
      }));
  } catch {
    return [];
  }
};

export const loadPosts = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fall through to the starting posts
  }
  return [...migrateOldPosts(), ...buildSeedPosts(Date.now())];
};

export const savePosts = (posts) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(posts));
  } catch {
    // storage full or blocked: posts just won't be remembered
  }
};

export const POSTS_STORE_KEY = STORE_KEY;

// ---- names -------------------------------------------------------------
const ALIAS_WORDS = ['Lotus', 'Jasmine', 'Marigold', 'Tulsi', 'Champa', 'Rose', 'Neem', 'Banyan', 'Mango', 'Peacock'];

// A fresh random name, so two posts from the same person can't be linked by name.
export const makeAlias = () =>
  `Anonymous ${ALIAS_WORDS[Math.floor(Math.random() * ALIAS_WORDS.length)]} ${String(Math.floor(Math.random() * 900) + 100)}`;

// ---- time --------------------------------------------------------------
export const timeAgo = (timestamp, now, lang) => {
  const minutes = Math.max(0, Math.floor((now - timestamp) / 60000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (lang === 'hi') {
    if (minutes < 1) return 'अभी';
    if (minutes < 60) return `${minutes} मिनट पहले`;
    if (hours < 24) return `${hours} घंटे पहले`;
    return `${days} दिन पहले`;
  }
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

// ---- safety check ------------------------------------------------------
// Posts are public, so keep phone numbers out of them (10 or more digits in a row, with spaces or dashes).
export const containsPhoneNumber = (text) => /(?:\d[\s-]?){10,}/.test(text);
