// The courses in Learn. Each lesson is taken step by step: Watch (when it has a video) → Read → Quiz.
// Lesson ids are what learnProgress stores (see utils/learningProgress.js), so keep them stable.
// Videos marked `ai` are built by tools/lesson-video/build.py from tools/lesson-video/lessons/<course>-<id>.json.

const aiVideo = (key) => ({
  ai: true,
  src: `/videos/learn/${key}.mp4`,
  poster: `/videos/learn/${key}.jpg`,
  tracks: [
    { lang: 'hi', label: 'हिंदी', src: `/videos/learn/${key}.hi.vtt` },
    { lang: 'en', label: 'English', src: `/videos/learn/${key}.en.vtt` },
  ],
});

export const COURSES = {
  health: {
    id: 'health',
    title: { en: 'Menstrual Health', hi: 'माहवारी स्वास्थ्य' },
    native: 'माहवारी स्वास्थ्य',
    tagline: {
      en: 'Your body, your cycle and how to care for it — without shame or myths.',
      hi: 'आपका शरीर, आपका चक्र और उसकी देखभाल — बिना शर्म, बिना मिथक।',
    },
    emoji: '🌸',
    gradient: 'linear-gradient(135deg, #4a2378 0%, #7a3fb8 55%, #c2557f 100%)',
    accent: '#d53f8c',
    lessons: [
      {
        id: 1,
        title: { en: 'Basic Female Anatomy', hi: 'महिला शरीर की बुनियादी रचना' },
        minutes: 5,
        summary: {
          en: 'The uterus, ovaries, fallopian tubes and vagina, and what each one does.',
          hi: 'गर्भाशय, अंडाशय, फैलोपियन ट्यूब और योनि — और हर एक का काम।',
        },
        related: { url: 'https://www.youtube.com/watch?v=RFDatCchpus', title: 'Female Reproductive System — Crash Course (English)' },
        read: [
          { icon: '🌷', title: { en: 'The uterus', hi: 'गर्भाशय' }, body: { en: 'A small, pear-shaped organ. A baby grows here in pregnancy, and period blood comes from its lining.', hi: 'नाशपाती के आकार का एक छोटा अंग। गर्भ में बच्चा यहीं बढ़ता है, और पीरियड का खून इसी की परत से आता है।' } },
          { icon: '🥚', title: { en: 'The ovaries', hi: 'अंडाशय' }, body: { en: 'Two small glands on either side of the uterus. They store eggs, release one about once a month, and make hormones.', hi: 'गर्भाशय के दोनों ओर दो छोटी ग्रंथियाँ। ये अंडे रखती हैं, लगभग हर महीने एक अंडा छोड़ती हैं, और हार्मोन बनाती हैं।' } },
          { icon: '〰️', title: { en: 'The fallopian tubes', hi: 'फैलोपियन ट्यूब' }, body: { en: 'Two thin tubes that carry the egg from an ovary to the uterus.', hi: 'दो पतली नलियाँ जो अंडे को अंडाशय से गर्भाशय तक ले जाती हैं।' } },
          { icon: '🚪', title: { en: 'The vagina', hi: 'योनि' }, body: { en: 'The passage from the uterus to the outside of the body. Period blood flows out through it.', hi: 'गर्भाशय से शरीर के बाहर तक का रास्ता। पीरियड का खून इसी से बाहर आता है।' } },
        ],
        quiz: [
          { question: 'Uterus ka kya kaam hai?', options: ['Digestion', 'Pregnancy support', 'Breathing'], answer: 'Pregnancy support' },
          { question: 'Ovaries kya karti hain?', options: ['Egg release', 'Blood pump', 'Breathing'], answer: 'Egg release' },
          { question: 'Fallopian tube ka role kya hai?', options: ['Egg transport', 'Food digestion'], answer: 'Egg transport' },
          { question: 'Female reproductive system ka main kaam kya hai?', options: ['Movement', 'Reproduction'], answer: 'Reproduction' },
          { question: 'Egg kaha banta hai?', options: ['Heart', 'Ovary'], answer: 'Ovary' },
        ],
      },
      {
        id: 2,
        title: { en: 'Menstruation Basics', hi: 'पीरियड्स क्या होते हैं' },
        minutes: 3,
        summary: {
          en: 'What a period is, how long a cycle lasts, and when to see a doctor.',
          hi: 'पीरियड क्या है, चक्र कितने दिन का होता है, और डॉक्टर से कब मिलें।',
        },
        video: aiVideo('health-2'),
        related: { url: 'https://www.youtube.com/watch?v=ayzN5f3qN8g', title: 'How menstruation works — TED-Ed (English)' },
        read: [
          { icon: '🌸', title: { en: 'Periods are normal', hi: 'पीरियड्स सामान्य हैं' }, body: { en: 'A period is the monthly shedding of the uterus lining. It is a sign of a healthy body, not an illness.', hi: 'पीरियड गर्भाशय की परत का हर महीने बाहर निकलना है। यह स्वस्थ शरीर का संकेत है, बीमारी नहीं।' } },
          { icon: '📅', title: { en: 'The cycle', hi: 'मासिक चक्र' }, body: { en: 'Counted from day 1 of one period to day 1 of the next: about 28 days, and anything from 21 to 35 is normal.', hi: 'एक पीरियड के पहले दिन से अगले के पहले दिन तक: लगभग 28 दिन; 21 से 35 दिन भी सामान्य है।' } },
          { icon: '💧', title: { en: 'How long, and when', hi: 'कितने दिन, कब से' }, body: { en: 'Bleeding usually lasts 3 to 7 days. Periods usually start between ages 10 and 15.', hi: 'खून आम तौर पर 3 से 7 दिन आता है। पीरियड्स आम तौर पर 10 से 15 साल की उम्र में शुरू होते हैं।' } },
          { icon: '🩺', title: { en: 'See a doctor if…', hi: 'डॉक्टर से मिलें अगर…' }, body: { en: 'Bleeding lasts beyond 7 days, a pad soaks through every 1–2 hours, pain stops your daily work, or there is no period for 3 months.', hi: '7 दिन से ज़्यादा खून आए, हर 1–2 घंटे में पैड भर जाए, दर्द से रोज़ का काम रुके, या 3 महीने तक पीरियड न आए।' } },
        ],
        quiz: [
          { question: 'Periods kitne din chal sakte hain?', options: ['3-7 days', '1 day'], answer: '3-7 days' },
          { question: 'Periods kya hai?', options: ['Disease', 'Natural process'], answer: 'Natural process' },
          { question: 'Cycle kitne din ka hota hai?', options: ['28 days approx', '10 days'], answer: '28 days approx' },
          { question: 'Periods kis age me start hote hain?', options: ['10-15 years', '30 years'], answer: '10-15 years' },
          { question: 'Periods dangerous hote hain?', options: ['Yes', 'No'], answer: 'No' },
        ],
      },
      {
        id: 3,
        title: { en: 'Menstrual Hygiene', hi: 'माहवारी में साफ़-सफ़ाई' },
        minutes: 3,
        summary: {
          en: 'Choosing a product, changing on time, washing cloth pads and safe disposal.',
          hi: 'प्रोडक्ट चुनना, समय पर बदलना, कपड़े के पैड धोना और सही तरीके से फेंकना।',
        },
        video: aiVideo('health-3'),
        read: [
          { icon: '⏰', title: { en: 'Change every 4–6 hours', hi: 'हर 4–6 घंटे में बदलें' }, body: { en: 'Change your pad every 4 to 6 hours, even on light days, so germs cannot grow.', hi: 'कीटाणु न बढ़ें, इसके लिए हर 4–6 घंटे में पैड बदलें, कम खून वाले दिनों में भी।' } },
          { icon: '☀️', title: { en: 'Cloth pads: wash and sun-dry', hi: 'कपड़े के पैड: धोएँ और धूप में सुखाएँ' }, body: { en: 'Wash with soap and clean water, dry fully in direct sunlight, and store in a clean, dry bag.', hi: 'साबुन और साफ़ पानी से धोएँ, पूरी तरह धूप में सुखाएँ, और साफ़, सूखी थैली में रखें।' } },
          { icon: '👐', title: { en: 'Clean hands, front to back', hi: 'साफ़ हाथ, आगे से पीछे' }, body: { en: 'Wash your hands before and after changing. Clean the genital area with plain water, front to back.', hi: 'पैड बदलने से पहले और बाद में हाथ धोएँ। जननांग को सादे पानी से, आगे से पीछे की ओर साफ़ करें।' } },
          { icon: '🗑️', title: { en: 'Dispose safely', hi: 'सही तरीके से फेंकें' }, body: { en: 'Wrap used pads in paper and put them in a covered bin. Never flush them.', hi: 'इस्तेमाल किए पैड कागज़ में लपेटकर ढक्कन वाले कूड़ेदान में डालें। टॉयलेट में कभी न बहाएँ।' } },
        ],
        quiz: [
          { question: 'Pad kab change karna chahiye?', options: ['4-6 hours', '12 hours'], answer: '4-6 hours' },
          { question: 'Dirty pad se kya ho sakta hai?', options: ['Infection', 'Nothing'], answer: 'Infection' },
          { question: 'Cloth use safe hai?', options: ['Yes if clean', 'Always unsafe'], answer: 'Yes if clean' },
          { question: 'Hygiene kyun important hai?', options: ['Health safety', 'Fashion'], answer: 'Health safety' },
          { question: 'Reusable pad ka use?', options: ['Possible', 'Not possible'], answer: 'Possible' },
        ],
      },
      {
        id: 4,
        title: { en: 'Hormones & Mood', hi: 'हार्मोन और मूड' },
        minutes: 6,
        summary: {
          en: 'How hormones run the cycle, why mood changes, and what helps.',
          hi: 'हार्मोन चक्र कैसे चलाते हैं, मूड क्यों बदलता है, और क्या मदद करता है।',
        },
        read: [
          { icon: '🧪', title: { en: 'Hormones are messengers', hi: 'हार्मोन संदेशवाहक हैं' }, body: { en: 'Hormones are chemical messengers made by glands. Estrogen and progesterone run the monthly cycle.', hi: 'हार्मोन ग्रंथियों में बनने वाले रासायनिक संदेशवाहक हैं। एस्ट्रोजन और प्रोजेस्टेरोन मासिक चक्र चलाते हैं।' } },
          { icon: '🎢', title: { en: 'Mood changes are real', hi: 'मूड बदलना सच है' }, body: { en: 'Before a period, hormone levels drop. Feeling irritable, sad or tired for a few days is common (PMS).', hi: 'पीरियड से पहले हार्मोन का स्तर गिरता है। कुछ दिन चिड़चिड़ापन, उदासी या थकान होना आम है (PMS)।' } },
          { icon: '🥗', title: { en: 'What helps', hi: 'क्या मदद करता है' }, body: { en: 'Sleep well, eat iron-rich food like green leafy vegetables and jaggery, stay active and drink water.', hi: 'अच्छी नींद लें, हरी पत्तेदार सब्ज़ियाँ और गुड़ जैसा आयरन वाला खाना खाएँ, सक्रिय रहें और पानी पिएँ।' } },
          { icon: '💬', title: { en: 'Ask for help', hi: 'मदद माँगें' }, body: { en: 'If low mood lasts for weeks or affects daily life, talk to a doctor or someone you trust.', hi: 'अगर उदासी हफ़्तों तक रहे या रोज़ की ज़िंदगी पर असर डाले, तो डॉक्टर या किसी भरोसेमंद व्यक्ति से बात करें।' } },
        ],
        quiz: [
          { question: 'Hormones kya hote hain?', options: ['Chemicals', 'Organs'], answer: 'Chemicals' },
          { question: 'Mood swings kis wajah se hote hain?', options: ['Hormones', 'Weather'], answer: 'Hormones' },
          { question: 'Periods ke time mood change normal hai?', options: ['Yes', 'No'], answer: 'Yes' },
          { question: 'Hormones body ko control karte hain?', options: ['Yes', 'No'], answer: 'Yes' },
          { question: 'Hormones kaha bante hain?', options: ['Glands', 'Bones'], answer: 'Glands' },
        ],
      },
      {
        id: 5,
        title: { en: 'Period Pain & Self-care', hi: 'पीरियड का दर्द और देखभाल' },
        minutes: 5,
        summary: {
          en: 'Why cramps happen, how to ease them at home, and when pain is not normal.',
          hi: 'ऐंठन क्यों होती है, घर पर आराम कैसे पाएँ, और कब दर्द सामान्य नहीं है।',
        },
        read: [
          { icon: '🌀', title: { en: 'Why cramps happen', hi: 'ऐंठन क्यों होती है' }, body: { en: 'The uterus squeezes to push out its lining. This can cause cramps in the lower belly, back or thighs.', hi: 'गर्भाशय अपनी परत बाहर निकालने के लिए सिकुड़ता है। इससे पेट के निचले हिस्से, कमर या जाँघों में ऐंठन हो सकती है।' } },
          { icon: '♨️', title: { en: 'Relief at home', hi: 'घर पर आराम' }, body: { en: 'A hot water bottle, gentle stretching or walking, warm drinks and rest can ease the pain.', hi: 'गर्म पानी की बोतल, हल्की स्ट्रेचिंग या सैर, गर्म पेय और आराम से दर्द कम हो सकता है।' } },
          { icon: '💊', title: { en: 'Medicine', hi: 'दवा' }, body: { en: 'A pain-relief tablet can help, but take it as a doctor or pharmacist advises.', hi: 'दर्द की गोली मदद कर सकती है, लेकिन डॉक्टर या फ़ार्मासिस्ट की सलाह से ही लें।' } },
          { icon: '⚠️', title: { en: 'When it is not normal', hi: 'कब सामान्य नहीं है' }, body: { en: 'Pain so strong that you faint, vomit, or miss school or work every month needs a doctor’s check-up.', hi: 'अगर इतना दर्द हो कि चक्कर आए, उल्टी हो, या हर महीने स्कूल या काम छूटे, तो डॉक्टर से जाँच कराएँ।' } },
        ],
        quiz: [
          { question: 'Period cramps kyun hote hain?', options: ['Uterus sikudta hai', 'Khana kam khane se'], answer: 'Uterus sikudta hai' },
          { question: 'Dard me kya madad karta hai?', options: ['Garam sek', 'Kuch nahi'], answer: 'Garam sek' },
          { question: 'Dard ki goli kaise leni chahiye?', options: ['Doctor ki salah se', 'Jitni marzi utni'], answer: 'Doctor ki salah se' },
          { question: 'Periods me halki exercise?', options: ['Madad karti hai', 'Nuksaan karti hai'], answer: 'Madad karti hai' },
          { question: 'Har mahine behosh karne wala dard ho to?', options: ['Doctor ko dikhaye', 'Normal hai, ignore kare'], answer: 'Doctor ko dikhaye' },
        ],
      },
      {
        id: 6,
        title: { en: 'Period Myths vs Facts', hi: 'पीरियड: मिथक और सच' },
        minutes: 5,
        summary: {
          en: 'Common beliefs about periods, and what science actually says.',
          hi: 'पीरियड से जुड़ी आम बातें, और विज्ञान असल में क्या कहता है।',
        },
        read: [
          { icon: '🍋', title: { en: 'Food', hi: 'खाना' }, body: { en: 'Myth: sour or cold food is harmful. Fact: you can eat normally; a balanced diet helps.', hi: 'मिथक: खट्टा या ठंडा खाना नुक़सान करता है। सच: आप सामान्य खाना खा सकती हैं; संतुलित आहार मदद करता है।' } },
          { icon: '🍳', title: { en: '“Impure”', hi: '“अशुद्ध”' }, body: { en: 'Myth: a woman on her period is impure and must stay out of the kitchen. Fact: periods are a natural body process; nothing about them is impure.', hi: 'मिथक: पीरियड में महिला अशुद्ध होती है, रसोई से दूर रहे। सच: पीरियड शरीर की प्राकृतिक प्रक्रिया है; इसमें कुछ भी अशुद्ध नहीं।' } },
          { icon: '🏃‍♀️', title: { en: 'Bathing and exercise', hi: 'नहाना और व्यायाम' }, body: { en: 'Myth: don’t bathe or exercise. Fact: bathing keeps you clean, and light exercise eases cramps.', hi: 'मिथक: नहाना या व्यायाम नहीं करना चाहिए। सच: नहाने से सफ़ाई रहती है और हल्का व्यायाम ऐंठन कम करता है।' } },
          { icon: '🔬', title: { en: 'Trust science', hi: 'विज्ञान पर भरोसा करें' }, body: { en: 'When in doubt, ask a doctor, an ASHA worker or NariShakti’s Ask AI, not hearsay.', hi: 'शक हो तो सुनी-सुनाई बातों पर नहीं, डॉक्टर, आशा दीदी या नारीशक्ति के Ask AI से पूछें।' } },
        ],
        quiz: [
          { question: 'Periods me exercise safe hai?', options: ['Yes', 'No'], answer: 'Yes' },
          { question: 'Cold food harmful hai periods me?', options: ['No', 'Yes'], answer: 'No' },
          { question: 'Myths hamesha sahi hote hain?', options: ['No', 'Yes'], answer: 'No' },
          { question: 'Scientific info important hai?', options: ['Yes', 'No'], answer: 'Yes' },
          { question: 'Periods disease hai?', options: ['No', 'Yes'], answer: 'No' },
        ],
      },
    ],
  },

  finance: {
    id: 'finance',
    title: { en: 'Money Matters', hi: 'पैसों की समझ' },
    native: 'पैसों की समझ',
    tagline: {
      en: 'Bank accounts, UPI, saving and staying safe from fraud — one step at a time.',
      hi: 'बैंक खाता, UPI, बचत और धोखाधड़ी से बचाव — एक-एक कदम।',
    },
    emoji: '💰',
    gradient: 'linear-gradient(135deg, #0f3d4a 0%, #19727a 55%, #2dc6b1 100%)',
    accent: '#1f9e8c',
    lessons: [
      {
        id: 1,
        title: { en: 'Bank Account Basics', hi: 'बैंक खाते की बुनियादी बातें' },
        minutes: 5,
        summary: {
          en: 'Why a bank account in your own name matters, and how to open one.',
          hi: 'अपने नाम का बैंक खाता क्यों ज़रूरी है, और उसे कैसे खोलें।',
        },
        read: [
          { icon: '🏦', title: { en: 'A safe place for money', hi: 'पैसे के लिए सुरक्षित जगह' }, body: { en: 'A bank account keeps your money safe from theft and loss, and it can earn interest.', hi: 'बैंक खाता आपके पैसे को चोरी और नुक़सान से बचाता है, और उस पर ब्याज भी मिल सकता है।' } },
          { icon: '🆓', title: { en: 'Zero-balance account', hi: 'शून्य बैलेंस खाता' }, body: { en: 'Under the Jan Dhan Yojana you can open an account with zero balance at any bank.', hi: 'जन धन योजना में आप किसी भी बैंक में शून्य बैलेंस से खाता खोल सकती हैं।' } },
          { icon: '🪪', title: { en: 'What you need', hi: 'क्या चाहिए' }, body: { en: 'Usually your Aadhaar card and a photo. The bank does a KYC check.', hi: 'आम तौर पर आधार कार्ड और एक फ़ोटो। बैंक KYC जाँच करता है।' } },
          { icon: '👩', title: { en: 'In your own name', hi: 'अपने नाम पर' }, body: { en: 'An account in your own name gives you control over your money and brings government benefits (DBT) straight to you.', hi: 'आपके अपने नाम का खाता आपको अपने पैसे पर नियंत्रण देता है और सरकारी लाभ (DBT) सीधे आप तक पहुँचाता है।' } },
        ],
        quiz: [
          { question: 'Bank account ka use?', options: ['Store money', 'Cooking'], answer: 'Store money' },
          { question: 'Account safe hota hai?', options: ['Yes', 'No'], answer: 'Yes' },
          { question: 'Bank kaha hota hai?', options: ['Financial institution', 'School'], answer: 'Financial institution' },
          { question: 'Account ka owner kaun?', options: ['User', 'Bank'], answer: 'User' },
          { question: 'Account ka fayda?', options: ['Security', 'Loss'], answer: 'Security' },
        ],
      },
      {
        id: 2,
        title: { en: 'UPI & Digital Payments', hi: 'UPI और डिजिटल भुगतान' },
        minutes: 3,
        summary: {
          en: 'Setting up UPI, paying safely, and the one rule that stops most scams.',
          hi: 'UPI शुरू करना, सुरक्षित भुगतान, और वह एक नियम जो ज़्यादातर धोखे रोकता है।',
        },
        video: aiVideo('finance-2'),
        read: [
          { icon: '⚡', title: { en: 'Instant, 24×7', hi: 'तुरंत, चौबीसों घंटे' }, body: { en: 'UPI moves money directly between bank accounts in seconds, at any time.', hi: 'UPI पैसे को सेकंडों में, किसी भी समय, सीधे बैंक खातों के बीच भेजता है।' } },
          { icon: '👀', title: { en: 'Check before you pay', hi: 'भुगतान से पहले जाँचें' }, body: { en: 'Scan the QR code or enter the UPI ID, then check the name and amount before entering your PIN.', hi: 'QR कोड स्कैन करें या UPI ID डालें, फिर PIN डालने से पहले नाम और रकम जाँचें।' } },
          { icon: '🚫', title: { en: 'No PIN to receive', hi: 'पैसे पाने में PIN नहीं' }, body: { en: 'You never need a PIN to receive money. A “prize” that needs your PIN is a scam.', hi: 'पैसे पाने के लिए PIN कभी नहीं लगता। जिस “इनाम” के लिए PIN माँगा जाए, वह धोखा है।' } },
          { icon: '📞', title: { en: 'Fraud? Call 1930', hi: 'धोखा? 1930 पर कॉल करें' }, body: { en: 'Call the cyber helpline 1930 at once, report at cybercrime.gov.in and tell your bank.', hi: 'तुरंत साइबर हेल्पलाइन 1930 पर कॉल करें, cybercrime.gov.in पर शिकायत करें और बैंक को बताएँ।' } },
        ],
        quiz: [
          { question: 'UPI ka full form?', options: ['Unified Payments Interface', 'User Payment Info'], answer: 'Unified Payments Interface' },
          { question: 'UPI ka use?', options: ['Money transfer', 'Calling'], answer: 'Money transfer' },
          { question: 'PIN share safe hai?', options: ['No', 'Yes'], answer: 'No' },
          { question: 'Paise receive karne ke liye PIN chahiye?', options: ['Nahi, kabhi nahi', 'Haan'], answer: 'Nahi, kabhi nahi' },
          { question: 'UPI fraud hone par kis number par call kare?', options: ['1930', '100'], answer: '1930' },
        ],
      },
      {
        id: 3,
        title: { en: 'Saving Money', hi: 'पैसे बचाना' },
        minutes: 7,
        summary: {
          en: 'Small, regular saving, an emergency fund, and where to keep it.',
          hi: 'छोटी, नियमित बचत, मुश्किल के लिए फ़ंड, और उसे कहाँ रखें।',
        },
        read: [
          { icon: '🐷', title: { en: 'Pay yourself first', hi: 'पहले ख़ुद को दें' }, body: { en: 'Set a small amount aside as soon as you get money, before spending. Even ₹10 a day is ₹3,650 a year.', hi: 'पैसा मिलते ही, ख़र्च से पहले, थोड़ा अलग रखें। रोज़ ₹10 भी साल में ₹3,650 बन जाते हैं।' } },
          { icon: '🛟', title: { en: 'Emergency fund', hi: 'मुश्किल के लिए फ़ंड' }, body: { en: 'Aim to save 3 months of household expenses for illness or loss of work.', hi: 'बीमारी या काम छूटने जैसी मुश्किल के लिए 3 महीने के घर-ख़र्च जितनी बचत का लक्ष्य रखें।' } },
          { icon: '📝', title: { en: 'Needs vs wants', hi: 'ज़रूरत और शौक़' }, body: { en: 'Write down your spending for a month. Cut wants, not needs.', hi: 'एक महीने का ख़र्च लिखें। ज़रूरतें नहीं, शौक़ कम करें।' } },
          { icon: '🏦', title: { en: 'Keep it in the bank', hi: 'बैंक में रखें' }, body: { en: 'Money at home can be lost or spent. A savings account, RD or post-office scheme keeps it safe and growing.', hi: 'घर में रखा पैसा खो या ख़र्च हो सकता है। बचत खाता, RD या डाकघर योजना उसे सुरक्षित रखती है और बढ़ाती है।' } },
        ],
        quiz: [
          { question: 'Saving kyun zaruri hai?', options: ['Future security', 'Fun'], answer: 'Future security' },
          { question: 'Har month save karna chahiye?', options: ['Yes', 'No'], answer: 'Yes' },
          { question: 'Saving kaha rakhe?', options: ['Bank', 'Road'], answer: 'Bank' },
          { question: 'Emergency fund kya hai?', options: ['Savings', 'Loan'], answer: 'Savings' },
          { question: 'Saving habit kab start kare?', options: ['Early', 'Late'], answer: 'Early' },
        ],
      },
      {
        id: 4,
        title: { en: 'Fixed Deposit (FD)', hi: 'फ़िक्स्ड डिपॉज़िट (FD)' },
        minutes: 5,
        summary: {
          en: 'How an FD works, why it is safe, and what happens if you break it early.',
          hi: 'FD कैसे काम करती है, सुरक्षित क्यों है, और जल्दी तोड़ने पर क्या होता है।',
        },
        read: [
          { icon: '🔒', title: { en: 'What is an FD', hi: 'FD क्या है' }, body: { en: 'You deposit a lump sum for a fixed time, from 7 days to 10 years, at a fixed interest rate.', hi: 'आप एक तय रकम, 7 दिन से 10 साल तक के लिए, तय ब्याज दर पर जमा करती हैं।' } },
          { icon: '📈', title: { en: 'Earns more', hi: 'ज़्यादा कमाई' }, body: { en: 'FDs usually pay more interest than a savings account.', hi: 'FD पर आम तौर पर बचत खाते से ज़्यादा ब्याज मिलता है।' } },
          { icon: '🛡️', title: { en: 'Safe', hi: 'सुरक्षित' }, body: { en: 'Deposits up to ₹5 lakh per bank are insured by DICGC.', hi: 'हर बैंक में ₹5 लाख तक की जमा राशि DICGC से बीमित है।' } },
          { icon: '⏳', title: { en: 'Breaking it early', hi: 'समय से पहले तोड़ना' }, body: { en: 'You can withdraw early, but the bank may cut a small penalty from the interest.', hi: 'आप समय से पहले पैसा निकाल सकती हैं, लेकिन बैंक ब्याज में से थोड़ा जुर्माना काट सकता है।' } },
        ],
        quiz: [
          { question: 'FD safe hai?', options: ['Yes', 'No'], answer: 'Yes' },
          { question: 'FD me paisa lock hota hai?', options: ['Yes', 'No'], answer: 'Yes' },
          { question: 'Interest milta hai?', options: ['Yes', 'No'], answer: 'Yes' },
          { question: 'FD risky hai?', options: ['No', 'Yes'], answer: 'No' },
          { question: 'FD bank me hota hai?', options: ['Yes', 'No'], answer: 'Yes' },
        ],
      },
      {
        id: 5,
        title: { en: 'Fraud Awareness', hi: 'धोखाधड़ी से बचाव' },
        minutes: 6,
        summary: {
          en: 'The tricks scammers use, the warning signs, and what to do if it happens.',
          hi: 'धोखेबाज़ों की चालें, ख़तरे के संकेत, और ऐसा होने पर क्या करें।',
        },
        read: [
          { icon: '🔐', title: { en: 'Never share OTP or PIN', hi: 'OTP या PIN कभी न बताएँ' }, body: { en: 'No bank, police or company will ever ask for your OTP, PIN or CVV.', hi: 'कोई बैंक, पुलिस या कंपनी कभी आपका OTP, PIN या CVV नहीं माँगेगी।' } },
          { icon: '🔗', title: { en: 'Suspicious links', hi: 'संदिग्ध लिंक' }, body: { en: 'Don’t click links in SMS or WhatsApp that promise prizes, KYC updates or jobs.', hi: 'SMS या WhatsApp पर इनाम, KYC अपडेट या नौकरी का वादा करने वाले लिंक पर क्लिक न करें।' } },
          { icon: '⏱️', title: { en: 'Pressure is a red flag', hi: 'जल्दबाज़ी = ख़तरा' }, body: { en: 'Scammers rush you: “your account will be blocked today”. Stop, hang up and call your bank yourself.', hi: 'धोखेबाज़ जल्दी मचाते हैं: “आज खाता बंद हो जाएगा”। रुकें, फ़ोन काटें और ख़ुद बैंक को कॉल करें।' } },
          { icon: '📞', title: { en: 'Report: 1930', hi: 'शिकायत: 1930' }, body: { en: 'Lost money? Call 1930 immediately and report at cybercrime.gov.in.', hi: 'पैसा गया? तुरंत 1930 पर कॉल करें और cybercrime.gov.in पर शिकायत करें।' } },
        ],
        quiz: [
          { question: 'OTP share karna safe hai?', options: ['No', 'Yes'], answer: 'No' },
          { question: 'Unknown link click karna?', options: ['No', 'Yes'], answer: 'No' },
          { question: 'Bank kabhi PIN mangta hai?', options: ['No', 'Yes'], answer: 'No' },
          { question: 'Fraud call ka kya kare?', options: ['Ignore/report', 'Share info'], answer: 'Ignore/report' },
          { question: 'Security important hai?', options: ['Yes', 'No'], answer: 'Yes' },
        ],
      },
    ],
  },
};

export const COURSE_ORDER = ['health', 'finance'];

// The steps a lesson is taken in.
export const stepsOf = (lesson) => [...(lesson.video ? ['watch'] : []), 'read', 'quiz'];
