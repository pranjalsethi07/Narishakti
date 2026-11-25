import { notifyProgressChanged } from '../lib/sync';

// Content, level rules and progress helpers for the Play Games section.
// Every piece of text is { en, hi }.

const L = (en, hi) => ({ en, hi });

export const TOPICS = {
  mix: { label: L('Mixed', 'मिक्स'), color: '#7a4bb7', bg: '#f3ecff' },
  health: { label: L('Health', 'स्वास्थ्य'), color: '#d53f8c', bg: '#fff5f7' },
  finance: { label: L('Finance', 'वित्त'), color: '#2c7a7b', bg: '#e6fffa' },
};
export const SUBJECTS = ['health', 'finance'];

export const GAME_TYPES = {
  memory: {
    title: L('Memory Match', 'मेमोरी मैच'),
    desc: L('Flip cards and find each matching pair.', 'कार्ड पलटें और सही जोड़ियां खोजें।'),
    color: '#805ad5', bg: '#faf5ff',
  },
  match: {
    title: L('Match the Following', 'सही जोड़ी मिलाएं'),
    desc: L('Connect each problem or goal to its answer.', 'हर समस्या या लक्ष्य को उसके सही उत्तर से जोड़ें।'),
    color: '#2c7a7b', bg: '#e6fffa',
  },
  tf: {
    title: L('True or False', 'सही या गलत'),
    desc: L('Tell facts from myths. Learn why after each answer.', 'तथ्य और मिथक में फ़र्क पहचानें। हर जवाब के बाद कारण जानें।'),
    color: '#dd6b20', bg: '#fffaf0',
  },
  sort: {
    title: L('Sort It', 'छांटें'),
    desc: L('Put every item in the bucket where it belongs.', 'हर चीज़ को उसकी सही टोकरी में रखें।'),
    color: '#3182ce', bg: '#ebf8ff',
  },
};
export const GAME_KEYS = Object.keys(GAME_TYPES);

// ---------------------------------------------------------------- levels
export const LEVEL_COUNT = 10;

// How much each level asks for (index 0 = level 1).
const SIZES = {
  memory: [3, 3, 4, 4, 5, 5, 6, 6, 7, 8], // pairs
  match: [3, 3, 4, 4, 5, 5, 6, 6, 7, 8], // pairs
  tf: [5, 5, 6, 6, 7, 7, 8, 8, 9, 10], // questions
  sort: [4, 4, 6, 6, 6, 8, 8, 10, 10, 12], // items
};
export const levelSize = (type, level) => SIZES[type][level - 1];
export const passMark = (total) => Math.ceil(total * 0.6); // True/False pass rule

export const BADGES = [
  { name: L('Spark', 'चिंगारी'), tier: '#cd7f32' },
  { name: L('Seedling', 'अंकुर'), tier: '#cd7f32' },
  { name: L('Bud', 'कली'), tier: '#cd7f32' },
  { name: L('Leaf', 'पत्ती'), tier: '#8a94a6' },
  { name: L('Blossom', 'फूल'), tier: '#8a94a6' },
  { name: L('Lotus', 'कमल'), tier: '#8a94a6' },
  { name: L('Rising Star', 'उभरता सितारा'), tier: '#d69e2e' },
  { name: L('Champion', 'चैंपियन'), tier: '#d69e2e' },
  { name: L('Shakti', 'शक्ति'), tier: '#d69e2e' },
  { name: L('Master', 'महारथी'), tier: '#805ad5' },
];

export const normaliseTopic = (value) => (TOPICS[value] ? value : 'mix');

// ---------------------------------------------------------------- content
export const CONTENT = {
  memory: {
    health: [
      { term: L('Iron', 'आयरन'), meaning: L('Prevents anaemia', 'खून की कमी (एनीमिया) से बचाता है') },
      { term: L('Calcium', 'कैल्शियम'), meaning: L('Builds strong bones', 'हड्डियों को मज़बूत बनाता है') },
      { term: L('Folic acid', 'फोलिक एसिड'), meaning: L('Helps the baby grow well in pregnancy', 'गर्भावस्था में शिशु के सही विकास में मदद करता है') },
      { term: L('Vitamin D', 'विटामिन D'), meaning: L('Comes from sunlight', 'धूप से मिलता है') },
      { term: L('Handwashing', 'हाथ धोना'), meaning: L('20 seconds with soap', 'साबुन से 20 सेकंड तक') },
      { term: L('Sanitary pad', 'सैनिटरी पैड'), meaning: L('Change every 4 to 6 hours', 'हर 4 से 6 घंटे में बदलें') },
      { term: L('ORS', 'ओआरएस (ORS)'), meaning: L('Replaces water and salts lost in diarrhoea', 'दस्त में खोया पानी और नमक वापस देता है') },
      { term: L('Mosquito net', 'मच्छरदानी'), meaning: L('Protects from malaria and dengue', 'मलेरिया और डेंगू से बचाती है') },
      { term: L('Vaccines', 'टीके'), meaning: L('Protect children from serious diseases', 'बच्चों को गंभीर बीमारियों से बचाते हैं') },
      { term: L('Protein', 'प्रोटीन'), meaning: L('Helps the body grow and repair', 'शरीर को बढ़ने और ठीक होने में मदद करता है') },
    ],
    finance: [
      { term: L('Budget', 'बजट'), meaning: L('A plan for income and spending', 'आमदनी और खर्च की योजना') },
      { term: L('Savings account', 'बचत खाता'), meaning: L('Keeps money safe and earns interest', 'पैसे सुरक्षित रखता है और ब्याज देता है') },
      { term: L('UPI', 'UPI'), meaning: L('Instant payment from your phone', 'फ़ोन से तुरंत भुगतान') },
      { term: L('Emergency fund', 'इमरजेंसी फंड'), meaning: L('Savings for sudden expenses', 'अचानक खर्चों के लिए बचत') },
      { term: L('Insurance', 'बीमा'), meaning: L('Protection against big losses', 'बड़े नुकसान से सुरक्षा') },
      { term: L('Jan Dhan account', 'जन धन खाता'), meaning: L('A zero-balance bank account', 'ज़ीरो बैलेंस बैंक खाता') },
      { term: L('PIN and OTP', 'पिन और OTP'), meaning: L('Never share them with anyone', 'किसी को भी न बताएं') },
      { term: L('Interest', 'ब्याज'), meaning: L('Extra money paid on savings or charged on loans', 'बचत पर मिलने वाला या लोन पर देना पड़ने वाला अतिरिक्त पैसा') },
      { term: L('Self Help Group', 'स्वयं सहायता समूह'), meaning: L('Women save and lend together', 'महिलाएं मिलकर बचत करती हैं और एक-दूसरे को उधार देती हैं') },
      { term: L('Passbook', 'पासबुक'), meaning: L('Record of money coming in and going out', 'खाते में आए और गए पैसों का रिकॉर्ड') },
    ],
  },

  match: {
    health: [
      { term: L('Feeling tired and pale', 'थकान और चेहरा पीला पड़ना'), meaning: L('Eat iron-rich food like spinach and jaggery', 'पालक और गुड़ जैसे आयरन वाले आहार लें') },
      { term: L('Loose motions', 'दस्त'), meaning: L('Drink ORS to avoid dehydration', 'पानी की कमी से बचने के लिए ORS पिएं') },
      { term: L('Period cramps', 'पीरियड्स में दर्द'), meaning: L('Warm compress and rest', 'गर्म सिंकाई और आराम') },
      { term: L('Weak bones', 'कमज़ोर हड्डियां'), meaning: L('Eat calcium-rich food like milk and ragi', 'दूध और रागी जैसे कैल्शियम वाले आहार लें') },
      { term: L('Dirty hands before eating', 'खाने से पहले गंदे हाथ'), meaning: L('Wash with soap and water', 'साबुन और पानी से धोएं') },
      { term: L('Mosquitoes at night', 'रात में मच्छर'), meaning: L('Sleep under a mosquito net', 'मच्छरदानी लगाकर सोएं') },
      { term: L('You are pregnant', 'आप गर्भवती हैं'), meaning: L('Go for regular check-ups', 'नियमित जांच करवाएं') },
      { term: L('Child’s vaccine is due', 'बच्चे का टीका बाकी है'), meaning: L('Visit the nearest health centre or anganwadi', 'नज़दीकी स्वास्थ्य केंद्र या आंगनवाड़ी जाएं') },
      { term: L('Fever for many days', 'कई दिन से बुखार'), meaning: L('See a doctor', 'डॉक्टर को दिखाएं') },
      { term: L('Water from an unsafe source', 'असुरक्षित स्रोत का पानी'), meaning: L('Boil or filter it first', 'पहले उबालें या छानें') },
    ],
    finance: [
      { term: L('Keep money safe', 'पैसे सुरक्षित रखना'), meaning: L('Bank savings account', 'बैंक बचत खाता') },
      { term: L('Pay a shopkeeper from your phone', 'फ़ोन से दुकानदार को भुगतान'), meaning: L('UPI', 'UPI') },
      { term: L('Save a fixed amount every month', 'हर महीने तय रकम बचाना'), meaning: L('Recurring Deposit (RD)', 'रेकरिंग डिपॉज़िट (RD)') },
      { term: L('Cover hospital costs', 'अस्पताल के खर्च की सुरक्षा'), meaning: L('Health insurance', 'स्वास्थ्य बीमा') },
      { term: L('Start a small business', 'छोटा व्यवसाय शुरू करना'), meaning: L('Mudra loan', 'मुद्रा लोन') },
      { term: L('Someone asks for your OTP', 'कोई आपका OTP मांगे'), meaning: L('Never share it, end the call', 'कभी न बताएं, कॉल काट दें') },
      { term: L('Save together with other women', 'दूसरी महिलाओं के साथ मिलकर बचत'), meaning: L('Self Help Group (SHG)', 'स्वयं सहायता समूह (SHG)') },
      { term: L('Check money coming in and going out', 'आने-जाने वाले पैसे जांचना'), meaning: L('Passbook or bank statement', 'पासबुक या बैंक स्टेटमेंट') },
      { term: L('Plan monthly spending', 'हर महीने का खर्च तय करना'), meaning: L('Make a budget', 'बजट बनाएं') },
      { term: L('Money for sudden illness or job loss', 'अचानक बीमारी या नौकरी जाने पर पैसा'), meaning: L('Emergency fund', 'इमरजेंसी फंड') },
    ],
  },

  tf: {
    health: [
      { text: L('Drinking enough water helps keep your body healthy.', 'पर्याप्त पानी पीना शरीर को स्वस्थ रखने में मदद करता है।'), answer: true,
        why: L('Water helps digestion, energy and keeps you cool.', 'पानी पाचन और ऊर्जा में मदद करता है और शरीर को ठंडा रखता है।') },
      { text: L('During periods, a woman must stay out of the kitchen.', 'पीरियड्स में महिला को रसोई से दूर रहना चाहिए।'), answer: false,
        why: L('Periods are natural. There is no health reason to avoid the kitchen.', 'पीरियड्स एक प्राकृतिक प्रक्रिया है। रसोई से दूर रहने का कोई स्वास्थ्य संबंधी कारण नहीं है।') },
      { text: L('Spinach and jaggery can help prevent anaemia.', 'पालक और गुड़ खून की कमी रोकने में मदद कर सकते हैं।'), answer: true,
        why: L('Both are rich in iron, which your blood needs.', 'दोनों में आयरन भरपूर होता है, जो खून के लिए ज़रूरी है।') },
      { text: L('A pregnant woman who feels fine can skip check-ups.', 'जो गर्भवती महिला ठीक महसूस करती है, वह जांच छोड़ सकती है।'), answer: false,
        why: L('Regular check-ups catch problems early, even when you feel fine.', 'नियमित जांच से समस्याएं जल्दी पकड़ में आती हैं, भले ही आप ठीक महसूस करें।') },
      { text: L('A disposable sanitary pad can be washed and reused.', 'इस्तेमाल किया हुआ डिस्पोज़ेबल पैड धोकर दोबारा लगाया जा सकता है।'), answer: false,
        why: L('Disposable pads are for one use only. Reusing them can cause infections.', 'डिस्पोज़ेबल पैड सिर्फ़ एक बार के लिए होते हैं। दोबारा इस्तेमाल से संक्रमण हो सकता है।') },
      { text: L('A baby should have only breast milk for the first 6 months.', 'पहले 6 महीने शिशु को सिर्फ़ मां का दूध देना चाहिए।'), answer: true,
        why: L('Doctors advise exclusive breastfeeding for the first 6 months.', 'डॉक्टर पहले 6 महीने सिर्फ़ मां का दूध देने की सलाह देते हैं।') },
      { text: L('A cloth used during periods only needs a quick rinse before reuse.', 'पीरियड्स में इस्तेमाल किए कपड़े को दोबारा लेने से पहले बस हल्का धो लेना काफ़ी है।'), answer: false,
        why: L('Wash it with soap and dry it fully in the sun.', 'इसे साबुन से धोएं और धूप में पूरी तरह सुखाएं।') },
      { text: L('Walking regularly is good for a woman’s health at any age.', 'नियमित रूप से चलना किसी भी उम्र में महिला की सेहत के लिए अच्छा है।'), answer: true,
        why: L('Daily walking helps the heart, bones and mood.', 'रोज़ चलना दिल, हड्डियों और मन के लिए अच्छा है।') },
      { text: L('Washing hands with soap before eating helps prevent infections.', 'खाने से पहले साबुन से हाथ धोने से संक्रमण से बचाव होता है।'), answer: true,
        why: L('Soap removes germs that plain water can miss.', 'साबुन उन कीटाणुओं को हटाता है जो सादे पानी से रह जाते हैं।') },
      { text: L('You should stop an antibiotic as soon as you feel better.', 'आराम मिलते ही एंटीबायोटिक बंद कर देनी चाहिए।'), answer: false,
        why: L('Finish the full course the doctor prescribed, or the infection can return.', 'डॉक्टर का बताया पूरा कोर्स करें, वरना संक्रमण वापस आ सकता है।') },
      { text: L('Malaria and dengue spread through mosquito bites.', 'मलेरिया और डेंगू मच्छर के काटने से फैलते हैं।'), answer: true,
        why: L('Nets, covered clothes and no stagnant water help prevent them.', 'मच्छरदानी, ढके कपड़े और रुके हुए पानी को हटाना बचाव में मदद करता है।') },
      { text: L('Boiling or filtering water makes it safer to drink.', 'पानी उबालने या छानने से वह पीने के लिए ज़्यादा सुरक्षित हो जाता है।'), answer: true,
        why: L('It removes or kills germs that cause stomach infections.', 'इससे पेट के संक्रमण फैलाने वाले कीटाणु हट जाते हैं या मर जाते हैं।') },
      { text: L('Children only need vaccines after they fall sick.', 'बच्चों को टीके तभी चाहिए जब वे बीमार पड़ जाएं।'), answer: false,
        why: L('Vaccines work best when given on time, before illness.', 'टीके बीमारी से पहले, सही समय पर लगवाने पर सबसे अच्छा काम करते हैं।') },
      { text: L('A meal with dal, vegetables and roti is more balanced than only rice.', 'दाल, सब्ज़ी और रोटी वाला खाना सिर्फ़ चावल से ज़्यादा संतुलित है।'), answer: true,
        why: L('It gives protein, fibre and energy together.', 'इससे प्रोटीन, फ़ाइबर और ऊर्जा एक साथ मिलते हैं।') },
      { text: L('Feeling sad or worried for a long time is not a health problem.', 'लंबे समय तक उदास या चिंतित रहना सेहत की समस्या नहीं है।'), answer: false,
        why: L('Mental health matters. Talk to someone you trust or a counsellor.', 'मानसिक स्वास्थ्य ज़रूरी है। किसी भरोसेमंद व्यक्ति या काउंसलर से बात करें।') },
      { text: L('Very painful or very irregular periods are worth showing to a doctor.', 'बहुत दर्दनाक या बहुत अनियमित पीरियड्स डॉक्टर को दिखाने लायक हैं।'), answer: true,
        why: L('A doctor can find the cause and help you feel better.', 'डॉक्टर कारण पता कर सकते हैं और आपको आराम दिला सकते हैं।') },
      { text: L('Sleeping 7 to 8 hours helps your body and mind recover.', '7 से 8 घंटे की नींद शरीर और मन को स्वस्थ होने में मदद करती है।'), answer: true,
        why: L('Good sleep supports mood, immunity and energy.', 'अच्छी नींद से मूड, रोग प्रतिरोधक क्षमता और ऊर्जा बेहतर होती है।') },
      { text: L('A breast lump does not need a check-up if it does not hurt.', 'अगर स्तन में गांठ में दर्द नहीं है, तो जांच की ज़रूरत नहीं।'), answer: false,
        why: L('Show any lump to a doctor, even if it is painless.', 'कोई भी गांठ हो, दर्द न हो तब भी डॉक्टर को दिखाएं।') },
      { text: L('Home remedies are always enough for a fever that lasts many days.', 'कई दिन चलने वाले बुखार के लिए घरेलू नुस्खे हमेशा काफ़ी होते हैं।'), answer: false,
        why: L('A long fever can be serious. See a doctor.', 'लंबा बुखार गंभीर हो सकता है। डॉक्टर को दिखाएं।') },
      { text: L('The first yellowish milk after birth is good for the baby.', 'जन्म के बाद आने वाला पहला पीला दूध शिशु के लिए अच्छा होता है।'), answer: true,
        why: L('This milk, called colostrum, helps protect the baby from infections.', 'इस दूध को कोलोस्ट्रम कहते हैं और यह शिशु को संक्रमण से बचाने में मदद करता है।') },
    ],
    finance: [
      { text: L('A budget helps you plan your spending.', 'बजट से आप अपने खर्च की योजना बना सकती हैं।'), answer: true,
        why: L('Knowing your income and spending helps you save.', 'आमदनी और खर्च पता होने से बचत करना आसान होता है।') },
      { text: L('It is fine to tell your OTP to a caller who says they are from the bank.', 'बैंक का कर्मचारी बताने वाले कॉलर को OTP बता देना ठीक है।'), answer: false,
        why: L('Banks never ask for your OTP or PIN. Never share them.', 'बैंक कभी आपका OTP या PIN नहीं मांगता। इन्हें किसी को न बताएं।') },
      { text: L('Keeping all your savings as cash at home is safer than a bank.', 'सारी बचत घर में नकद रखना बैंक से ज़्यादा सुरक्षित है।'), answer: false,
        why: L('Cash can be stolen or lost, and it earns no interest.', 'नकद चोरी या खो सकता है और उस पर ब्याज भी नहीं मिलता।') },
      { text: L('A Jan Dhan account can be opened with zero balance.', 'जन धन खाता ज़ीरो बैलेंस पर खोला जा सकता है।'), answer: true,
        why: L('Jan Dhan accounts need no minimum balance.', 'जन धन खाते में न्यूनतम बैलेंस की ज़रूरत नहीं होती।') },
      { text: L('A woman can open a bank account in her own name.', 'महिला अपने नाम से बैंक खाता खोल सकती है।'), answer: true,
        why: L('Any adult can open an account in her own name with valid ID.', 'कोई भी वयस्क महिला सही पहचान पत्र के साथ अपने नाम से खाता खोल सकती है।') },
      { text: L('You do not need to read loan terms if the money is urgent.', 'अगर पैसे की ज़रूरत जल्दी है, तो लोन की शर्तें पढ़ना ज़रूरी नहीं।'), answer: false,
        why: L('Always check the interest rate and charges before you borrow.', 'उधार लेने से पहले ब्याज दर और शुल्क ज़रूर देखें।') },
      { text: L('An emergency fund is money saved for sudden needs.', 'इमरजेंसी फंड अचानक ज़रूरतों के लिए बचाया गया पैसा है।'), answer: true,
        why: L('It helps you handle illness or job loss without borrowing.', 'इससे बीमारी या नौकरी जाने पर उधार लिए बिना काम चल जाता है।') },
      { text: L('An SMS saying you won a lottery and asking for a fee is genuine.', 'लॉटरी जीतने और शुल्क मांगने वाला SMS असली होता है।'), answer: false,
        why: L('This is a common scam. Never pay to receive a prize.', 'यह एक आम धोखाधड़ी है। इनाम पाने के लिए कभी पैसे न दें।') },
      { text: L('You should write your PIN on the back of your ATM card.', 'अपना PIN ATM कार्ड के पीछे लिख लेना चाहिए।'), answer: false,
        why: L('If the card is lost, anyone could use it. Memorise your PIN.', 'कार्ड खो जाए तो कोई भी इसका इस्तेमाल कर सकता है। PIN याद रखें।') },
      { text: L('Reading your bank SMS alerts helps you spot unknown transactions.', 'बैंक के SMS अलर्ट पढ़ने से अनजान लेन-देन पकड़ में आते हैं।'), answer: true,
        why: L('If you see a payment you did not make, tell your bank at once.', 'अगर कोई ऐसा भुगतान दिखे जो आपने नहीं किया, तो तुरंत बैंक को बताएं।') },
      { text: L('Interest on a loan is the extra money you pay back.', 'लोन पर ब्याज वह अतिरिक्त पैसा है जो आप वापस चुकाती हैं।'), answer: true,
        why: L('A lower interest rate means you repay less overall.', 'कम ब्याज दर का मतलब है कि कुल मिलाकर आप कम चुकाती हैं।') },
      { text: L('Self Help Groups let women save together and lend to each other.', 'स्वयं सहायता समूह में महिलाएं मिलकर बचत करती हैं और एक-दूसरे को उधार देती हैं।'), answer: true,
        why: L('Small regular savings grow into a fund the group can use.', 'छोटी नियमित बचत मिलकर एक ऐसा फंड बन जाती है जिसे समूह इस्तेमाल कर सकता है।') },
      { text: L('To receive money by UPI, you must enter your UPI PIN.', 'UPI से पैसे पाने के लिए अपना UPI PIN डालना पड़ता है।'), answer: false,
        why: L('You only enter the PIN to send money. If someone asks you to enter it to receive, it is a scam.', 'PIN सिर्फ़ पैसे भेजने के लिए डालना होता है। कोई पाने के लिए PIN डालने को कहे तो यह धोखाधड़ी है।') },
      { text: L('Saving a small amount early helps your money grow over time.', 'जल्दी शुरू की गई छोटी बचत समय के साथ बढ़ती है।'), answer: true,
        why: L('Regular saving adds up, and interest is added on top.', 'नियमित बचत जुड़ती जाती है और उस पर ब्याज भी मिलता है।') },
      { text: L('A loan app that hides who runs it can be risky.', 'जो लोन ऐप यह छिपाए कि उसे कौन चलाता है, वह जोखिम भरा हो सकता है।'), answer: true,
        why: L('Borrow only from banks and lenders registered with the RBI.', 'सिर्फ़ बैंकों और RBI में पंजीकृत संस्थाओं से ही उधार लें।') },
      { text: L('It is safe to post your Aadhaar and bank details on social media.', 'अपना आधार और बैंक विवरण सोशल मीडिया पर डालना सुरक्षित है।'), answer: false,
        why: L('Keep these private. Scammers can misuse them.', 'इन्हें निजी रखें। ठग इनका गलत इस्तेमाल कर सकते हैं।') },
      { text: L('Spending more than you earn every month is sustainable.', 'हर महीने कमाई से ज़्यादा खर्च करना लंबे समय तक चल सकता है।'), answer: false,
        why: L('It leads to debt. A budget helps you stay within your income.', 'इससे कर्ज़ बढ़ता है। बजट आपको कमाई के भीतर रहने में मदद करता है।') },
      { text: L('Insurance can protect a family from large hospital bills.', 'बीमा परिवार को अस्पताल के बड़े बिलों से बचा सकता है।'), answer: true,
        why: L('It pays part or all of the cost, so savings are not wiped out.', 'यह खर्च का कुछ या पूरा हिस्सा देता है, जिससे बचत खत्म नहीं होती।') },
      { text: L('You should click quickly on an SMS link asking you to update your KYC.', 'KYC अपडेट करने के लिए SMS में आए लिंक पर तुरंत क्लिक कर देना चाहिए।'), answer: false,
        why: L('Update KYC only at the bank or its official app. Such links are often fake.', 'KYC सिर्फ़ बैंक में या उसके आधिकारिक ऐप से अपडेट करें। ऐसे लिंक अक्सर नकली होते हैं।') },
      { text: L('Comparing interest rates before a loan can save you money.', 'लोन लेने से पहले ब्याज दरों की तुलना करने से पैसे बच सकते हैं।'), answer: true,
        why: L('Even a small difference in rate adds up over the years.', 'दर में थोड़ा सा फ़र्क भी सालों में बड़ी रकम बन जाता है।') },
    ],
  },

  // bucket 0 = do this, bucket 1 = avoid this
  sort: {
    health: {
      buckets: [L('Healthy habit', 'अच्छी आदत'), L('Unhealthy habit', 'बुरी आदत')],
      items: [
        { text: L('Wash hands with soap', 'साबुन से हाथ धोना'), bucket: 0 },
        { text: L('Eat green vegetables', 'हरी सब्ज़ियां खाना'), bucket: 0 },
        { text: L('Sleep 7 to 8 hours', '7 से 8 घंटे सोना'), bucket: 0 },
        { text: L('Walk every day', 'रोज़ टहलना'), bucket: 0 },
        { text: L('Drink boiled or filtered water', 'उबला या छना हुआ पानी पीना'), bucket: 0 },
        { text: L('Vaccinate children on time', 'बच्चों को समय पर टीके लगवाना'), bucket: 0 },
        { text: L('Skip breakfast every day', 'रोज़ नाश्ता छोड़ना'), bucket: 1 },
        { text: L('Ignore pain for weeks', 'हफ़्तों तक दर्द को नज़रअंदाज़ करना'), bucket: 1 },
        { text: L('Reuse an unwashed cloth', 'बिना धोया कपड़ा दोबारा इस्तेमाल करना'), bucket: 1 },
        { text: L('Take medicine without a doctor’s advice', 'डॉक्टर की सलाह के बिना दवा लेना'), bucket: 1 },
        { text: L('Stop antibiotics when you feel better', 'आराम मिलते ही एंटीबायोटिक बंद करना'), bucket: 1 },
        { text: L('Drink water from an unsafe source', 'असुरक्षित स्रोत का पानी पीना'), bucket: 1 },
      ],
    },
    finance: {
      buckets: [L('Smart money habit', 'समझदारी की आदत'), L('Money mistake', 'पैसों की गलती')],
      items: [
        { text: L('Make a monthly budget', 'हर महीने बजट बनाना'), bucket: 0 },
        { text: L('Save a little every month', 'हर महीने थोड़ी बचत करना'), bucket: 0 },
        { text: L('Check bank SMS alerts', 'बैंक के SMS अलर्ट देखना'), bucket: 0 },
        { text: L('Keep an emergency fund', 'इमरजेंसी फंड रखना'), bucket: 0 },
        { text: L('Read loan terms before signing', 'साइन करने से पहले लोन की शर्तें पढ़ना'), bucket: 0 },
        { text: L('Keep your PIN secret', 'अपना PIN गुप्त रखना'), bucket: 0 },
        { text: L('Share your OTP with a caller', 'कॉल करने वाले को OTP बताना'), bucket: 1 },
        { text: L('Click an unknown KYC link', 'अनजान KYC लिंक पर क्लिक करना'), bucket: 1 },
        { text: L('Pay a fee to claim a lottery prize', 'लॉटरी का इनाम पाने के लिए फ़ीस देना'), bucket: 1 },
        { text: L('Borrow from an unknown loan app', 'अनजान लोन ऐप से उधार लेना'), bucket: 1 },
        { text: L('Spend more than you earn', 'कमाई से ज़्यादा खर्च करना'), bucket: 1 },
        { text: L('Write your PIN on your card', 'PIN कार्ड पर लिख देना'), bucket: 1 },
      ],
    },
  },
};

const MIX_BUCKETS = [L('Do this', 'यह करें'), L('Avoid this', 'इससे बचें')];

// ---------------------------------------------------------------- UI text
export const UI = {
  en: {
    title: 'Play Games',
    subtitle: 'Learn while you play. Pass levels to earn badges.',
    badgesEarned: 'Badges earned',
    levelsDone: (n) => `${n}/${LEVEL_COUNT} levels`,
    play: 'Play',
    chooseTopic: 'What do you want to play?',
    chooseTopicSub: 'Pick a topic for this game. You can change it any time.',
    mixedDesc: 'Health and finance questions together',
    healthDesc: 'Only health questions',
    financeDesc: 'Only finance questions',
    close: 'Close',
    topic: 'Topic',
    changeTopic: 'Change topic',
    level: 'Level',
    locked: 'Locked',
    passToUnlock: 'Pass the previous level to unlock.',
    backToGames: 'Back to Games',
    backToLevels: 'Back to Levels',
    playAgain: 'Play again',
    nextLevel: 'Next level',
    moves: 'Moves',
    mistakes: 'Mistakes',
    score: 'Score',
    question: 'Question',
    trueLabel: 'True',
    falseLabel: 'False',
    next: 'Next',
    seeResult: 'See result',
    right: 'Correct!',
    wrong: 'Not quite.',
    memoryHint: 'Flip two cards to find each matching pair.',
    matchHint: 'Tap an item on the left, then tap its match on the right.',
    sortHint: 'Tap an item, then tap the bucket where it belongs.',
    badgeEarned: 'Badge earned',
    levelCleared: (n) => `Level ${n} complete`,
    allDone: 'You finished all 10 levels. Amazing!',
    resultTitle: ['', 'Nice try!', 'Good job!', 'Excellent!'],
    failTitle: 'Almost there!',
    needToPass: (n) => `You need at least ${n} correct answers to earn this badge. Try again.`,
    stars: 'stars',
    pairs: (n) => `${n} pairs`,
    questions: (n) => `${n} questions`,
    items: (n) => `${n} items`,
  },
  hi: {
    title: 'गेम्स खेलें',
    subtitle: 'खेलते-खेलते सीखें। लेवल पास करें और बैज पाएं।',
    badgesEarned: 'मिले हुए बैज',
    levelsDone: (n) => `${n}/${LEVEL_COUNT} लेवल`,
    play: 'खेलें',
    chooseTopic: 'आप क्या खेलना चाहती हैं?',
    chooseTopicSub: 'इस गेम के लिए विषय चुनें। इसे आप कभी भी बदल सकती हैं।',
    mixedDesc: 'स्वास्थ्य और वित्त के सवाल एक साथ',
    healthDesc: 'सिर्फ़ स्वास्थ्य के सवाल',
    financeDesc: 'सिर्फ़ वित्त के सवाल',
    close: 'बंद करें',
    topic: 'विषय',
    changeTopic: 'विषय बदलें',
    level: 'लेवल',
    locked: 'बंद',
    passToUnlock: 'खोलने के लिए पिछला लेवल पास करें।',
    backToGames: 'गेम्स पर वापस',
    backToLevels: 'लेवल पर वापस',
    playAgain: 'फिर से खेलें',
    nextLevel: 'अगला लेवल',
    moves: 'चालें',
    mistakes: 'गलतियां',
    score: 'स्कोर',
    question: 'प्रश्न',
    trueLabel: 'सही',
    falseLabel: 'गलत',
    next: 'आगे',
    seeResult: 'नतीजा देखें',
    right: 'सही जवाब!',
    wrong: 'सही नहीं।',
    memoryHint: 'दो-दो कार्ड पलटकर सही जोड़ियां खोजें।',
    matchHint: 'बाईं ओर की कोई चीज़ चुनें, फिर दाईं ओर उसका सही जोड़ चुनें।',
    sortHint: 'कोई चीज़ चुनें, फिर उस टोकरी पर टैप करें जिसमें वह आती है।',
    badgeEarned: 'बैज मिला',
    levelCleared: (n) => `लेवल ${n} पूरा`,
    allDone: 'आपने सभी 10 लेवल पूरे कर लिए। शानदार!',
    resultTitle: ['', 'अच्छी कोशिश!', 'बहुत बढ़िया!', 'शानदार!'],
    failTitle: 'बस थोड़ी कसर रह गई!',
    needToPass: (n) => `यह बैज पाने के लिए कम से कम ${n} सही जवाब चाहिए। फिर से कोशिश करें।`,
    stars: 'स्टार',
    pairs: (n) => `${n} जोड़ियां`,
    questions: (n) => `${n} प्रश्न`,
    items: (n) => `${n} चीज़ें`,
  },
};

// ---------------------------------------------------------------- building a level
// Fisher-Yates. Only call from event handlers or lazy useState initialisers.
export const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Take `count` items, spread evenly across the pools (so "Mixed" really mixes).
const pickBalanced = (pools, count) => {
  const bags = pools.map(shuffle);
  const out = [];
  let i = 0;
  while (out.length < count && bags.some((b) => b.length)) {
    const bag = bags[i % bags.length];
    if (bag.length) out.push(bag.pop());
    i += 1;
  }
  return shuffle(out);
};

const subjectsFor = (topic) => (topic === 'mix' ? SUBJECTS : [topic]);

// Returns the content for one play of a level. Random: call it from an event
// handler or a lazy useState initialiser, never directly during render.
export const buildLevel = (type, topic, level) => {
  const count = levelSize(type, level);
  const subjects = subjectsFor(topic);

  if (type === 'sort') {
    const pools = subjects.flatMap((s) => [0, 1].map((b) => CONTENT.sort[s].items.filter((it) => it.bucket === b)));
    return {
      buckets: topic === 'mix' ? MIX_BUCKETS : CONTENT.sort[topic].buckets,
      items: pickBalanced(pools, count),
    };
  }
  return pickBalanced(subjects.map((s) => CONTENT[type][s]), count);
};

// ---------------------------------------------------------------- progress
// { [gameType]: { [level]: bestStars } }. A level is "complete" once it has stars.
const PROGRESS_KEY = 'gameProgress';

export const getProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveLevel = (type, level, stars) => {
  try {
    const all = getProgress();
    const game = all[type] || {};
    if (!game[level] || stars > game[level]) game[level] = stars;
    all[type] = game;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    notifyProgressChanged();
  } catch {
    // storage unavailable: progress just isn't remembered
  }
};

export const isUnlocked = (progress, type, level) => level === 1 || Boolean(progress[type]?.[level - 1]);
export const completedCount = (progress, type) => Object.keys(progress[type] || {}).length;
export const totalBadges = (progress) => GAME_KEYS.reduce((n, t) => n + completedCount(progress, t), 0);
