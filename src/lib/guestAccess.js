// Which parts of the app need an account. A guest (no account) sees a lock on these and is
// asked to sign in. To lock or unlock a feature, add or remove a line here. Nothing else changes.
//
// Rule of thumb: lock what is shared with other women (Didi Connect) or holds private records
// that should be backed up and kept away from the next person on a shared computer.
export const GUEST_LOCKED = [
  {
    path: '/dashboard/community',
    label: { en: 'Didi Connect', hi: 'दीदी कनेक्ट' },
    why: {
      en: 'Didi Connect is a shared space. An account keeps your posts and replies yours, under a made-up name, and helps keep the community safe.',
      hi: 'दीदी कनेक्ट एक साझा जगह है। अकाउंट से आपकी पोस्ट और जवाब आपके रहते हैं, एक बनाए हुए नाम से, और समुदाय सुरक्षित रहता है।',
    },
  },
  {
    path: '/dashboard/tracker',
    label: { en: 'Health Tracker', hi: 'हेल्थ ट्रैकर' },
    why: {
      en: 'Your tracker holds private health records. An account lets you back them up and keeps them away from other people who use this computer.',
      hi: 'आपके ट्रैकर में निजी स्वास्थ्य रिकॉर्ड होते हैं। अकाउंट से आप उनका बैकअप रख सकती हैं और इस कंप्यूटर के दूसरे लोग उन्हें नहीं देख पाते।',
    },
  },
  {
    path: '/dashboard/digital-doctor',
    label: { en: 'Digital Doctor', hi: 'डिजिटल डॉक्टर' },
    why: {
      en: 'Digital Doctor keeps your prescriptions and health notes. An account backs them up and keeps them private.',
      hi: 'डिजिटल डॉक्टर में आपकी पर्चियां और स्वास्थ्य नोट्स रहते हैं। अकाउंट से उनका बैकअप रहता है और वे निजी रहते हैं।',
    },
  },
  {
    path: '/dashboard/profile',
    label: { en: 'Profile', hi: 'प्रोफ़ाइल' },
    why: {
      en: 'Your profile and backup settings belong to your account.',
      hi: 'आपकी प्रोफ़ाइल और बैकअप सेटिंग आपके अकाउंट की होती हैं।',
    },
  },
];

// The locked entry for a page address (also matches pages inside it), or undefined if it is open to guests.
export const lockedInfoFor = (pathname = '') => {
  const path = pathname.replace(/\/+$/, '');
  return GUEST_LOCKED.find((entry) => path === entry.path || path.startsWith(`${entry.path}/`));
};
