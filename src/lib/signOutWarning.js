// The warning shown before signing out, or clearing a guest's device.
// Signing out wipes this browser. Progress is backed up to her account and comes back when she signs
// in again, but some things live ONLY on the device and are lost for good. The warning lists the ones
// she actually has, so it is honest and never cries wolf.
//
// No imports on purpose: this file only reads localStorage, so it is easy to test.

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const readJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
};

const nonEmpty = (value) => (Array.isArray(value) ? value.length > 0 : Boolean(value) && Object.keys(value).length > 0);

// Which device-only things exist right now, by id.
export const getLocalOnlyData = () => {
  const found = [];

  if (read('userProfile') || read('userProfileDraft') || read('profileComplete')) found.push('nameProfile');
  else if (read('userName')) found.push('name');

  if (read('userPhoto')) found.push('photo');
  if (nonEmpty(readJson('trackerData'))) found.push('tracker');
  if (nonEmpty(readJson('digitalDoctorParchiBookings'))) found.push('prescriptions');
  if (nonEmpty(readJson('sosContacts'))) found.push('sos');

  const posts = readJson('didi_connect_posts_v2');
  if (Array.isArray(posts) && posts.some((post) => post && post.mine)) found.push('posts');

  return found;
};

const LABELS = {
  en: {
    nameProfile: 'Your name and profile details',
    name: 'Your name',
    photo: 'Your photo',
    tracker: 'Health Tracker records',
    prescriptions: 'Digital Doctor prescriptions',
    sos: 'SOS contacts',
    posts: 'Your Didi Connect posts',
    progress: 'Your progress (lessons, games, tests and streak)',
  },
  hi: {
    nameProfile: 'आपका नाम और प्रोफ़ाइल की जानकारी',
    name: 'आपका नाम',
    photo: 'आपकी फ़ोटो',
    tracker: 'हेल्थ ट्रैकर के रिकॉर्ड',
    prescriptions: 'डिजिटल डॉक्टर की पर्चियां',
    sos: 'SOS संपर्क',
    posts: 'दीदी कनेक्ट पर आपकी पोस्ट',
    progress: 'आपकी प्रगति (पाठ, गेम्स, टेस्ट और स्ट्रीक)',
  },
};

const COPY = {
  en: {
    signOutTitle: 'Sign out on this device?',
    safe: 'Your progress stays safe in your account and comes back when you sign in again: lessons, games, tests, streak, age and language.',
    deleted: 'These are saved only on this device and will be deleted for good:',
    nothingElse: 'Nothing else is saved on this device.',
    offline: 'You are offline right now, so your latest progress may not be saved to your account yet.',
    guestTitle: 'Clear everything on this device?',
    guestBody: 'As a guest, nothing is backed up, so all of this will be deleted for good:',
    ask: 'Continue?',
  },
  hi: {
    signOutTitle: 'इस डिवाइस से साइन आउट करें?',
    safe: 'आपकी प्रगति आपके अकाउंट में सुरक्षित रहती है और दोबारा साइन इन करने पर वापस आ जाएगी: पाठ, गेम्स, टेस्ट, स्ट्रीक, उम्र और भाषा।',
    deleted: 'ये सिर्फ़ इसी डिवाइस पर सेव हैं और हमेशा के लिए मिट जाएंगे:',
    nothingElse: 'इस डिवाइस पर और कुछ सेव नहीं है।',
    offline: 'आप अभी ऑफ़लाइन हैं, इसलिए आपकी ताज़ा प्रगति अकाउंट में अभी सेव न हुई हो।',
    guestTitle: 'इस डिवाइस का सारा डेटा साफ़ करें?',
    guestBody: 'गेस्ट के रूप में कुछ भी बैकअप नहीं होता, इसलिए यह सब हमेशा के लिए मिट जाएगा:',
    ask: 'जारी रखें?',
  },
};

const bullets = (lang, ids) => ids.map((id) => `• ${LABELS[lang][id]}`).join('\n');

// Text for a signed-in woman signing out.
export const signOutMessage = (lang = 'en') => {
  const l = lang === 'hi' ? 'hi' : 'en';
  const found = getLocalOnlyData();
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;

  return [
    COPY[l].signOutTitle,
    COPY[l].safe,
    found.length ? `${COPY[l].deleted}\n${bullets(l, found)}` : COPY[l].nothingElse,
    ...(offline ? [COPY[l].offline] : []),
    COPY[l].ask,
  ].join('\n\n');
};

// Text for a guest clearing the device (she has no account to come back to).
export const guestClearMessage = (lang = 'en') => {
  const l = lang === 'hi' ? 'hi' : 'en';
  const found = getLocalOnlyData();
  return [COPY[l].guestTitle, `${COPY[l].guestBody}\n${bullets(l, ['progress', ...found])}`, COPY[l].ask].join('\n\n');
};

export const confirmSignOut = (lang) => window.confirm(signOutMessage(lang));
export const confirmClearDevice = (lang) => window.confirm(guestClearMessage(lang));
