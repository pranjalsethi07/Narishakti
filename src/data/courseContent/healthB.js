// Health & Wellness Literacy, Levels 3 and 4 (sections 9 to 16).
// General health education, not medical advice. It does not replace a doctor. Anything that worries you,
// or any symptom that is severe or keeps coming back, should be checked by a qualified health professional.
// Scheme details (amounts, eligibility) change: confirm them on the official website or at a health centre.

export const HEALTH_B = [
  // ------------------------------------------------------------------ Level 3: Reproductive and Sexual Health
  {
    id: 9, level: 3, min: 7,
    title: ['Reproductive Health and Fertility', 'प्रजनन स्वास्थ्य और प्रजनन क्षमता'],
    summary: ['How ovulation and fertility work, what affects them, and when to ask a doctor for help.', 'ओव्यूलेशन और प्रजनन क्षमता कैसे काम करती है, उन पर क्या असर डालता है, और डॉक्टर से मदद कब माँगें।'],
    points: [
      ['🌷', 'Understanding reproductive health', 'प्रजनन स्वास्थ्य को समझना', 'Reproductive health means a healthy reproductive system and the freedom to make safe, informed choices about sex, pregnancy and children, without pressure.', 'प्रजनन स्वास्थ्य का मतलब है स्वस्थ प्रजनन प्रणाली और बिना दबाव के सेक्स, गर्भावस्था और बच्चों के बारे में सुरक्षित, जानकारी भरे फ़ैसले लेने की आज़ादी।'],
      ['🥚', 'Ovulation and the menstrual cycle', 'ओव्यूलेशन और माहवारी चक्र', 'Ovulation is when an ovary releases an egg, usually about 12 to 16 days before the next period. The days around it are the most fertile.', 'ओव्यूलेशन वह है जब अंडाशय एक अंडा छोड़ता है, आम तौर पर अगले पीरियड से लगभग 12 से 16 दिन पहले। इसके आसपास के दिन सबसे ज़्यादा उपजाऊ होते हैं।'],
      ['🌡️', 'Fertility and factors affecting fertility', 'प्रजनन क्षमता और उसे प्रभावित करने वाले कारक', 'Age, weight, stress, smoking, alcohol, infections and conditions such as PCOS or thyroid problems can affect fertility. The health of both partners matters.', 'उम्र, वज़न, तनाव, धूम्रपान, शराब, संक्रमण और PCOS या थायरॉइड जैसी समस्याएँ प्रजनन क्षमता पर असर डाल सकती हैं। दोनों साथियों का स्वास्थ्य मायने रखता है।'],
      ['❌', 'Understanding fertility myths', 'प्रजनन से जुड़े मिथक समझना', 'It is not true that pregnancy can happen only on one day, or that the woman alone is to blame if there is no baby. Difficulty conceiving can come from either partner or from both.', 'यह सच नहीं है कि गर्भ सिर्फ़ एक दिन ठहर सकता है, या बच्चा न होने के लिए अकेली महिला दोषी है। गर्भधारण में कठिनाई किसी एक साथी या दोनों की वजह से हो सकती है।'],
      ['🩺', 'Common reproductive health conditions', 'आम प्रजनन स्वास्थ्य समस्याएँ', 'PCOS, endometriosis, fibroids, infections and blocked tubes can affect periods, pain or fertility. Most of them can be treated or managed.', 'PCOS, एंडोमेट्रियोसिस, फ़ाइब्रॉइड, संक्रमण और बंद नलियाँ पीरियड्स, दर्द या प्रजनन क्षमता पर असर डाल सकती हैं। इनमें से ज़्यादातर का इलाज या प्रबंधन हो सकता है।'],
      ['⏰', 'When to seek fertility evaluation', 'प्रजनन जाँच कब करवाएँ', 'If you are under 35 and have tried for 12 months, or over 35 and have tried for 6 months, without a pregnancy, see a doctor together with your partner.', 'अगर आप 35 से कम उम्र की हैं और 12 महीने से, या 35 से ज़्यादा की हैं और 6 महीने से कोशिश कर रही हैं और गर्भ नहीं ठहरा है, तो अपने साथी के साथ डॉक्टर को दिखाएँ।'],
      ['✅', 'Reproductive choices and informed consent', 'प्रजनन संबंधी चुनाव और सूचित सहमति', 'You have the right to decide whether and when to have children, with full information. Informed consent means a clear, free yes, given after you understand the choices and risks.', 'आपको पूरी जानकारी के साथ यह तय करने का अधिकार है कि बच्चे हों या नहीं और कब। सूचित सहमति का मतलब है विकल्प और जोखिम समझने के बाद दी गई साफ़, स्वतंत्र "हाँ"।'],
    ],
    quiz: [
      ['Ovulation is when…', ['An ovary releases an egg', 'A period starts', 'The thyroid releases hormones'], 'An ovary releases an egg'],
      ['If there is difficulty having a baby, the cause is…', ['Always the woman', 'Always the man', 'Either partner or both'], 'Either partner or both'],
      ['Informed consent means…', ['A clear, free yes after understanding the choices', 'Staying silent', 'Doing what others say'], 'A clear, free yes after understanding the choices'],
    ],
  },
  {
    id: 10, level: 3, min: 7,
    title: ['Sexual Health and Awareness', 'यौन स्वास्थ्य और जागरूकता'],
    summary: ['Consent, safety and protection from infections, explained plainly and without judgement.', 'सहमति, सुरक्षा और संक्रमण से बचाव, सरल भाषा में और बिना किसी निर्णय के।'],
    points: [
      ['🌿', 'Understanding sexual health', 'यौन स्वास्थ्य को समझना', 'Sexual health means physical, emotional and social well-being related to sexuality. It includes safe, respectful relationships free from fear, pressure and violence.', 'यौन स्वास्थ्य का मतलब है कामुकता से जुड़ा शारीरिक, भावनात्मक और सामाजिक कल्याण। इसमें डर, दबाव और हिंसा से मुक्त, सुरक्षित और सम्मानजनक रिश्ते शामिल हैं।'],
      ['🛑', 'Consent, boundaries and communication', 'सहमति, सीमाएँ और संवाद', 'Consent is a clear, willing "yes" that can be taken back at any time. No one may pressure you. You can set boundaries and say no, in any relationship, including marriage.', 'सहमति एक साफ़, स्वेच्छा की "हाँ" है जिसे कभी भी वापस लिया जा सकता है। कोई आप पर दबाव नहीं डाल सकता। किसी भी रिश्ते में, शादी में भी, आप सीमाएँ तय कर सकती हैं और "ना" कह सकती हैं।'],
      ['🙋', 'Sexual health and personal autonomy', 'यौन स्वास्थ्य और व्यक्तिगत स्वायत्तता', 'Your body belongs to you. You decide who touches you and when. Autonomy also means you can seek health care without shame or needing anyone\'s permission.', 'आपका शरीर आपका है। कौन आपको छुए और कब, यह आप तय करती हैं। स्वायत्तता का यह भी मतलब है कि आप बिना शर्म या किसी की इजाज़त के स्वास्थ्य सेवा ले सकती हैं।'],
      ['🦠', 'Sexually transmitted infections (STIs)', 'यौन संचारित संक्रमण (STI)', 'STIs are infections passed through sexual contact, such as chlamydia, gonorrhoea, syphilis, HPV, herpes and HIV. Many have no symptoms at first.', 'STI वे संक्रमण हैं जो यौन संपर्क से फैलते हैं, जैसे क्लैमाइडिया, गोनोरिया, सिफ़लिस, HPV, हर्पीज़ और HIV। कई में शुरुआत में कोई लक्षण नहीं होते।'],
      ['🧪', 'STI prevention, testing and treatment', 'STI की रोकथाम, जाँच और इलाज', 'Condoms lower the risk of most STIs. Testing is simple and confidential, and many STIs can be cured or controlled. The HPV vaccine protects against cervical cancer. Government ICTC centres offer free, confidential HIV testing.', 'कंडोम ज़्यादातर STI का जोखिम घटाते हैं। जाँच आसान और गोपनीय है, और कई STI ठीक या नियंत्रित हो सकते हैं। HPV का टीका सर्वाइकल कैंसर से बचाता है। सरकारी ICTC केंद्र मुफ़्त, गोपनीय HIV जाँच करते हैं।'],
      ['❌', 'Understanding sexual health myths', 'यौन स्वास्थ्य के मिथक समझना', 'You cannot tell by looking at someone if they have an infection, and washing with hot water or special products does not prevent STIs. Anyone can get an STI, and testing is the only way to know.', 'किसी को देखकर यह नहीं पता चलता कि उसे संक्रमण है, और गर्म पानी या ख़ास उत्पादों से धोना STI से नहीं बचाता। किसी को भी STI हो सकता है, और जाँच ही जानने का एकमात्र तरीका है।'],
      ['🔒', 'Accessing confidential sexual healthcare', 'गोपनीय यौन स्वास्थ्य सेवा पाना', 'Government hospitals, ICTC centres and adolescent-friendly health clinics offer confidential care. You can ask how your privacy will be protected. Health workers should not judge you.', 'सरकारी अस्पताल, ICTC केंद्र और किशोर-अनुकूल स्वास्थ्य क्लिनिक गोपनीय सेवा देते हैं। आप पूछ सकती हैं कि आपकी निजता कैसे सुरक्षित रखी जाएगी। स्वास्थ्यकर्मियों को आपको जज नहीं करना चाहिए।'],
    ],
    quiz: [
      ['Consent can be…', ['Taken back at any time', 'Given once for always', 'Given by someone else for you'], 'Taken back at any time'],
      ['Which lowers the risk of most STIs?', ['Using condoms', 'Washing with hot water', 'Special sprays'], 'Using condoms'],
      ['Can you tell by looking that someone has an STI?', ['Yes, always', 'No, many show no signs', 'Only in winter'], 'No, many show no signs'],
    ],
  },
  {
    id: 11, level: 3, min: 7,
    title: ['Contraception and Family Planning', 'गर्भनिरोधक और परिवार नियोजन'],
    summary: ['The main contraceptive methods, how well they work, and how to choose with a health professional.', 'मुख्य गर्भनिरोधक तरीके, वे कितने कारगर हैं, और स्वास्थ्य विशेषज्ञ के साथ चुनाव कैसे करें।'],
    points: [
      ['🧭', 'Understanding contraception', 'गर्भनिरोधक को समझना', 'Contraception prevents pregnancy. Different methods suit different needs, and you can change your method at any time.', 'गर्भनिरोधक गर्भ को रोकता है। अलग-अलग तरीके अलग ज़रूरतों के हिसाब से ठीक बैठते हैं, और आप कभी भी अपना तरीका बदल सकती हैं।'],
      ['💊', 'Barrier methods and hormonal contraception', 'बैरियर तरीके और हार्मोनल गर्भनिरोधक', 'Condoms (male and female) are barrier methods and also protect against STIs. Hormonal methods include pills, injectables, patches and rings, which use hormones to stop ovulation.', 'कंडोम (पुरुष और महिला) बैरियर तरीके हैं और STI से भी बचाते हैं। हार्मोनल तरीकों में गोलियाँ, इंजेक्शन, पैच और रिंग शामिल हैं, जो हार्मोन से ओव्यूलेशन रोकते हैं।'],
      ['🔧', 'Intrauterine devices (IUDs)', 'इंट्रायूटरिन डिवाइस (IUD)', 'An IUD, such as the copper T, is a small device placed in the uterus by a trained provider. It works for several years, can be removed at any time, and fertility returns after removal.', 'IUD, जैसे कॉपर-टी, एक छोटा उपकरण है जो प्रशिक्षित प्रदाता गर्भाशय में लगाता है। यह कई साल काम करता है, कभी भी निकाला जा सकता है, और निकालने के बाद प्रजनन क्षमता लौट आती है।'],
      ['🚨', 'Emergency contraception', 'आपातकालीन गर्भनिरोधक', 'An emergency pill can lower the chance of pregnancy if taken as soon as possible after unprotected sex, ideally within 72 hours. It is not for regular use and does not protect against STIs.', 'असुरक्षित यौन संबंध के बाद जितनी जल्दी हो सके, आदर्श रूप से 72 घंटे के भीतर, आपातकालीन गोली लेने से गर्भ की संभावना घट सकती है। यह नियमित इस्तेमाल के लिए नहीं है और STI से नहीं बचाती।'],
      ['📊', 'Effectiveness and side effects of methods', 'तरीकों की प्रभावशीलता और दुष्प्रभाव', 'No method is 100% effective, and results depend on using it correctly. Side effects such as spotting, nausea or headaches can happen. Talk to your provider if they bother you.', 'कोई भी तरीका 100% कारगर नहीं है, और नतीजा सही इस्तेमाल पर निर्भर है। हल्का ख़ून, जी मिचलाना या सिरदर्द जैसे दुष्प्रभाव हो सकते हैं। परेशान करें तो अपने प्रदाता से बात करें।'],
      ['🩺', 'Choosing contraception with a healthcare professional', 'स्वास्थ्य विशेषज्ञ के साथ गर्भनिरोधक चुनना', 'Discuss your health, age, plans and preferences with a doctor or ANM. Many methods and counselling are available free at government health facilities.', 'अपने स्वास्थ्य, उम्र, योजनाओं और पसंद के बारे में डॉक्टर या ANM से बात करें। कई तरीके और परामर्श सरकारी स्वास्थ्य केंद्रों में मुफ़्त मिलते हैं।'],
      ['👪', 'Understanding family planning and reproductive choices', 'परिवार नियोजन और प्रजनन चुनाव को समझना', 'Family planning means deciding if and when to have children and how far apart. A gap of at least 2 years between births is healthier for the mother and the baby.', 'परिवार नियोजन का मतलब है यह तय करना कि बच्चे हों या नहीं, कब हों और कितने अंतर पर हों। जन्मों के बीच कम से कम 2 साल का अंतर माँ और बच्चे दोनों के लिए बेहतर है।'],
    ],
    quiz: [
      ['Which contraceptive also protects against STIs?', ['Condoms', 'The pill', 'A copper T'], 'Condoms'],
      ['An emergency contraceptive pill works best…', ['As soon as possible after unprotected sex', 'A week later', 'Every day as a routine'], 'As soon as possible after unprotected sex'],
      ['Who can you ask about choosing a method?', ['A doctor or ANM', 'A stranger online', 'Nobody'], 'A doctor or ANM'],
    ],
  },
  {
    id: 12, level: 3, min: 7,
    title: ['Pregnancy and Maternal Health', 'गर्भावस्था और मातृ स्वास्थ्य'],
    summary: ['Care before, during and after birth: what to eat, which checks to have and which signs to act on.', 'प्रसव से पहले, दौरान और बाद की देखभाल: क्या खाएँ, कौन सी जाँचें करवाएँ और किन संकेतों पर तुरंत कदम उठाएँ।'],
    points: [
      ['🤰', 'Understanding pregnancy and prenatal care', 'गर्भावस्था और प्रसव-पूर्व देखभाल को समझना', 'Prenatal care is regular medical care during pregnancy to protect you and your baby. Register the pregnancy early with an ASHA, ANM or doctor.', 'प्रसव-पूर्व देखभाल गर्भावस्था में नियमित चिकित्सा देखभाल है जो आपकी और बच्चे की रक्षा करती है। गर्भावस्था का पंजीकरण जल्दी किसी आशा, ANM या डॉक्टर के पास करवाएँ।'],
      ['🥬', 'Pregnancy nutrition and supplements', 'गर्भावस्था में पोषण और सप्लीमेंट', 'Eat extra healthy food and take the iron and folic acid tablets and calcium as advised. They are free at government centres. Do not take any medicine or supplement without asking your doctor.', 'अतिरिक्त पौष्टिक खाना खाएँ और सलाह के अनुसार आयरन-फ़ोलिक एसिड की गोलियाँ और कैल्शियम लें। ये सरकारी केंद्रों में मुफ़्त मिलती हैं। डॉक्टर से पूछे बिना कोई दवा या सप्लीमेंट न लें।'],
      ['🚩', 'Common pregnancy symptoms and warning signs', 'गर्भावस्था के आम लक्षण और चेतावनी के संकेत', 'Nausea, tiredness and backache are common. Go to a hospital at once for heavy bleeding, severe headache or blurred vision, swelling of the face or hands, fever, fits, severe belly pain, leaking water, or the baby moving much less.', 'जी मिचलाना, थकान और पीठ दर्द आम हैं। भारी ख़ून, तेज़ सिरदर्द या धुँधला दिखना, चेहरे या हाथों में सूजन, बुख़ार, दौरे, पेट में तेज़ दर्द, पानी का रिसाव, या बच्चे की हलचल बहुत कम होने पर तुरंत अस्पताल जाएँ।'],
      ['🩺', 'Antenatal checkups and medical tests', 'प्रसव-पूर्व जाँच और चिकित्सा परीक्षण', 'Have at least 4 antenatal checkups, with blood pressure, weight, blood and urine tests and ultrasound as advised. Free check-ups are offered on the 9th of every month under the PMSMA programme.', 'कम से कम 4 प्रसव-पूर्व जाँचें करवाएँ, जिनमें रक्तचाप, वज़न, ख़ून व पेशाब की जाँच और सलाह के अनुसार अल्ट्रासाउंड शामिल हों। PMSMA कार्यक्रम में हर महीने की 9 तारीख़ को मुफ़्त जाँच होती है।'],
      ['🚶', 'Safe physical activity during pregnancy', 'गर्भावस्था में सुरक्षित शारीरिक गतिविधि', 'Gentle walking and light household work are usually fine. Avoid heavy lifting and risky activity. Check with your doctor first, especially if you have any complication.', 'हल्की सैर और घर के हल्के काम आम तौर पर ठीक हैं। भारी वज़न उठाने और जोखिम वाली गतिविधि से बचें। पहले डॉक्टर से पूछें, ख़ासकर अगर कोई जटिलता हो।'],
      ['🏥', 'Childbirth and delivery options', 'प्रसव और डिलीवरी के विकल्प', 'Plan to deliver in a health facility with trained staff. Normal delivery and caesarean are the options, and a caesarean is done only when it is medically needed. Janani Suraksha Yojana supports delivery in a facility.', 'प्रशिक्षित कर्मचारियों वाले स्वास्थ्य केंद्र में प्रसव की योजना बनाएँ। सामान्य प्रसव और सिज़ेरियन विकल्प हैं, और सिज़ेरियन तभी होता है जब चिकित्सकीय रूप से ज़रूरी हो। जननी सुरक्षा योजना केंद्र में प्रसव में मदद करती है।'],
      ['🍼', 'Postpartum recovery and maternal health', 'प्रसव के बाद की रिकवरी और मातृ स्वास्थ्य', 'Rest, eat well, keep clean and go for postnatal check-ups. Give your baby only breast milk for the first 6 months. Seek help for heavy bleeding, fever, severe pain or deep sadness.', 'आराम करें, अच्छा खाएँ, साफ़-सफ़ाई रखें और प्रसव के बाद की जाँच करवाएँ। पहले 6 महीने बच्चे को सिर्फ़ माँ का दूध दें। भारी ख़ून, बुख़ार, तेज़ दर्द या गहरी उदासी हो तो मदद लें।'],
    ],
    quiz: [
      ['Which is an emergency sign in pregnancy?', ['Heavy bleeding', 'Feeling a little hungry', 'A good night\'s sleep'], 'Heavy bleeding'],
      ['A baby should have only breast milk for the first…', ['6 months', '2 weeks', '3 years'], '6 months'],
      ['Iron and folic acid tablets for pregnant women are…', ['Free at government centres', 'Sold only abroad', 'Not needed'], 'Free at government centres'],
    ],
  },

  // ------------------------------------------------------------------ Level 4: Prevention, Diagnosis, and Healthcare Access
  {
    id: 13, level: 4, min: 7,
    title: ["Common Women's Health Conditions", 'महिलाओं की आम स्वास्थ्य समस्याएँ'],
    summary: ['What PCOS, thyroid problems, anaemia and other common conditions are, and why a diagnosis matters.', 'PCOS, थायरॉइड, ख़ून की कमी और अन्य आम समस्याएँ क्या हैं, और सही निदान क्यों ज़रूरी है।'],
    points: [
      ['🩺', 'PCOS and PCOD', 'PCOS और PCOD', 'A hormone condition that can cause irregular periods, acne, extra hair growth and weight gain. A healthy diet, exercise and medical care help manage it.', 'एक हार्मोन संबंधी स्थिति जिससे अनियमित पीरियड्स, मुहाँसे, ज़्यादा बाल और वज़न बढ़ना हो सकता है। स्वस्थ खान-पान, कसरत और चिकित्सा देखभाल से इसे सँभाला जा सकता है।'],
      ['🔥', 'Endometriosis', 'एंडोमेट्रियोसिस', 'Tissue like the lining of the uterus grows outside it. It can cause very painful periods, pelvic pain and trouble conceiving. It is often missed, so describe your pain clearly to a doctor.', 'गर्भाशय की परत जैसा ऊतक उसके बाहर उगता है। इससे बहुत दर्दनाक पीरियड्स, पेड़ू में दर्द और गर्भधारण में कठिनाई हो सकती है। यह अक्सर पकड़ में नहीं आता, इसलिए डॉक्टर को अपना दर्द साफ़ बताएँ।'],
      ['🫧', 'Uterine fibroids', 'गर्भाशय के फ़ाइब्रॉइड', 'Non-cancerous growths in the uterus. They may cause heavy periods or pelvic pressure, and many women have no symptoms. A scan can find them.', 'गर्भाशय में बनने वाली कैंसर रहित गाँठें। इनसे भारी पीरियड्स या पेड़ू में दबाव हो सकता है, और कई महिलाओं में कोई लक्षण नहीं होता। स्कैन से ये पता चलती हैं।'],
      ['🦋', 'Thyroid disorders', 'थायरॉइड की समस्याएँ', 'An underactive or overactive thyroid can cause tiredness, weight change, hair loss and irregular periods. A simple blood test checks it, and it can be treated.', 'थायरॉइड कम या ज़्यादा सक्रिय होने से थकान, वज़न में बदलाव, बाल झड़ना और अनियमित पीरियड्स हो सकते हैं। एक साधारण ख़ून की जाँच से पता चलता है, और इलाज हो सकता है।'],
      ['🩸', 'Anaemia and iron deficiency', 'एनीमिया और आयरन की कमी', 'Tiredness, pale skin, dizziness and breathlessness can mean anaemia. It is very common in Indian women. Iron-rich food, iron tablets and treating the cause help.', 'थकान, पीली त्वचा, चक्कर और साँस फूलना एनीमिया का संकेत हो सकते हैं। भारतीय महिलाओं में यह बहुत आम है। आयरन वाला खाना, आयरन की गोलियाँ और कारण का इलाज मदद करते हैं।'],
      ['🚽', 'Urinary tract infections', 'मूत्र मार्ग संक्रमण', 'Burning when passing urine, going very often and lower belly pain are signs. Drink water, do not hold your urine, and see a doctor, because untreated infections can reach the kidneys.', 'पेशाब में जलन, बहुत बार जाना और पेट के निचले हिस्से में दर्द इसके संकेत हैं। पानी पिएँ, पेशाब न रोकें और डॉक्टर को दिखाएँ, क्योंकि इलाज न हो तो संक्रमण गुर्दों तक पहुँच सकता है।'],
      ['🔎', 'Understanding symptoms, diagnosis and treatment options', 'लक्षण, निदान और इलाज के विकल्प समझना', 'Do not guess. A doctor will ask about your symptoms, examine you and may order tests such as blood tests or an ultrasound. Treatment can be lifestyle change, medicine or a procedure.', 'अंदाज़ा न लगाएँ। डॉक्टर आपके लक्षण पूछेंगे, जाँच करेंगे और ख़ून की जाँच या अल्ट्रासाउंड जैसे टेस्ट लिख सकते हैं। इलाज जीवनशैली में बदलाव, दवा या प्रक्रिया हो सकता है।'],
    ],
    quiz: [
      ['Tiredness, pale skin and dizziness can be signs of…', ['Anaemia', 'A cold only', 'Good health'], 'Anaemia'],
      ['A simple blood test can check for…', ['Thyroid problems', 'A broken bone', 'Eye colour'], 'Thyroid problems'],
      ['If you have burning while passing urine, you should…', ['Drink water and see a doctor', 'Hold your urine', 'Ignore it for months'], 'Drink water and see a doctor'],
    ],
  },
  {
    id: 14, level: 4, min: 7,
    title: ['Preventive Screenings and Medical Checkups', 'रोकथाम की जाँच और स्वास्थ्य परीक्षण'],
    summary: ['The checks that find problems early, and a simple guide to when to have them.', 'वे जाँचें जो समस्या जल्दी पकड़ती हैं, और उन्हें कब करवाएँ इसकी आसान गाइड।'],
    points: [
      ['🛡️', 'Understanding preventive healthcare', 'रोकथाम वाली स्वास्थ्य सेवा को समझना', 'Screening looks for a disease before you have any symptoms, when treatment works best. Many serious conditions are easier to treat when found early.', 'स्क्रीनिंग किसी बीमारी को लक्षण आने से पहले खोजती है, जब इलाज सबसे अच्छा काम करता है। कई गंभीर बीमारियों का इलाज जल्दी पकड़ने पर आसान होता है।'],
      ['📋', 'Routine health checkups', 'नियमित स्वास्थ्य जाँच', 'As an adult, have a general checkup about once a year, with your weight, blood pressure and blood tests, and a talk about your health. Ask your doctor how often is right for you.', 'वयस्क के रूप में साल में लगभग एक बार सामान्य जाँच करवाएँ, जिसमें वज़न, रक्तचाप, ख़ून की जाँच और आपकी सेहत पर बात हो। डॉक्टर से पूछें कि आपके लिए कितनी बार सही है।'],
      ['🎗️', 'Cervical cancer screening', 'सर्वाइकल कैंसर की जाँच', 'Cervical cancer is largely preventable. Screening such as a Pap smear, HPV test or VIA can find early changes. Women usually start from about age 30, so ask your doctor.', 'सर्वाइकल कैंसर काफ़ी हद तक रोका जा सकता है। पैप स्मियर, HPV टेस्ट या VIA जैसी जाँच शुरुआती बदलाव पकड़ सकती है। महिलाएँ आम तौर पर लगभग 30 साल की उम्र से शुरू करती हैं, इसलिए डॉक्टर से पूछें।'],
      ['🩷', 'Breast health and breast cancer awareness', 'स्तन स्वास्थ्य और स्तन कैंसर जागरूकता', 'Know how your breasts normally look and feel. Report any lump, nipple discharge, skin change or pain. A clinical breast exam and, from the right age, a mammogram can find cancer early.', 'जानें कि आपके स्तन सामान्य रूप से कैसे दिखते और महसूस होते हैं। कोई गाँठ, निप्पल से स्राव, त्वचा में बदलाव या दर्द हो तो बताएँ। क्लिनिकल जाँच और सही उम्र से मैमोग्राम कैंसर जल्दी पकड़ सकते हैं।'],
      ['💉', 'Understanding HPV and HPV vaccination', 'HPV और HPV टीकाकरण को समझना', 'HPV is a common virus that can cause cervical cancer. The vaccine works best when given to girls before exposure, usually around ages 9 to 14. Ask your doctor.', 'HPV एक आम वायरस है जिससे सर्वाइकल कैंसर हो सकता है। टीका तब सबसे अच्छा काम करता है जब लड़कियों को संपर्क से पहले लगे, आम तौर पर लगभग 9 से 14 साल की उम्र में। अपने डॉक्टर से पूछें।'],
      ['❤️', 'Blood pressure, blood sugar and cholesterol screening', 'रक्तचाप, ब्लड शुगर और कोलेस्ट्रॉल की जाँच', 'Check these regularly from about age 30, or earlier if you have risk factors such as family history or being overweight. High blood pressure and high sugar often have no symptoms.', 'इन्हें लगभग 30 साल की उम्र से नियमित जाँचें, या पहले अगर परिवार का इतिहास या ज़्यादा वज़न जैसे जोखिम हों। उच्च रक्तचाप और ज़्यादा शुगर में अक्सर कोई लक्षण नहीं होते।'],
      ['🗓️', 'Age- and risk-appropriate screening schedules', 'उम्र और जोखिम के अनुसार जाँच का समय', 'How often you need each test depends on your age, health and family history. Ask your doctor for a personal schedule and keep a written record.', 'हर जाँच कितनी बार चाहिए, यह आपकी उम्र, सेहत और परिवार के इतिहास पर निर्भर है। डॉक्टर से अपनी व्यक्तिगत समय-सारणी पूछें और लिखित रिकॉर्ड रखें।'],
    ],
    quiz: [
      ['Screening tests look for disease…', ['Before you have symptoms', 'Only after you are very sick', 'Only in hospitals abroad'], 'Before you have symptoms'],
      ['The HPV vaccine helps protect against…', ['Cervical cancer', 'Broken bones', 'Short sight'], 'Cervical cancer'],
      ['High blood pressure often has…', ['No symptoms', 'Always loud symptoms', 'Only skin signs'], 'No symptoms'],
    ],
  },
  {
    id: 15, level: 4, min: 7,
    title: ['Understanding Medical Tests and Health Records', 'मेडिकल जाँच और स्वास्थ्य रिकॉर्ड को समझना'],
    summary: ['Read a lab report, understand a prescription, keep your records and ask the right questions.', 'लैब रिपोर्ट पढ़ें, पर्ची समझें, अपने रिकॉर्ड रखें और सही सवाल पूछें।'],
    points: [
      ['🧪', 'Understanding blood tests and laboratory reports', 'ख़ून की जाँच और लैब रिपोर्ट को समझना', 'A lab report lists each test, your result, the normal range and a mark for high or low. A result outside the range is a reason to ask your doctor, not to panic.', 'लैब रिपोर्ट में हर जाँच, आपका नतीजा, सामान्य सीमा और ज़्यादा या कम का निशान होता है। सीमा से बाहर नतीजा डॉक्टर से पूछने की वजह है, घबराने की नहीं।'],
      ['🩸', 'Haemoglobin, blood sugar and thyroid tests', 'हीमोग्लोबिन, ब्लड शुगर और थायरॉइड जाँच', 'Haemoglobin shows whether you may be anaemic (below about 12 g/dL in a woman who is not pregnant). Blood sugar checks for diabetes. TSH checks the thyroid.', 'हीमोग्लोबिन बताता है कि आपको एनीमिया हो सकता है या नहीं (जो महिला गर्भवती नहीं है उसमें लगभग 12 g/dL से कम)। ब्लड शुगर डायबिटीज़ जाँचता है। TSH थायरॉइड जाँचता है।'],
      ['📏', 'Understanding reference ranges and abnormal results', 'सामान्य सीमा और असामान्य नतीजे समझना', 'Normal ranges can differ a little between labs, and by age or pregnancy. Ask your doctor what an abnormal result means for you and whether to repeat the test.', 'सामान्य सीमाएँ अलग-अलग लैब में, और उम्र या गर्भावस्था के हिसाब से, थोड़ी बदल सकती हैं। डॉक्टर से पूछें कि असामान्य नतीजे का आपके लिए क्या मतलब है और क्या जाँच दोहरानी है।'],
      ['🗂️', 'Maintaining personal health records', 'अपने स्वास्थ्य रिकॉर्ड रखना', 'Keep reports, prescriptions and vaccination cards in one folder, with dates. You can also take photos or use an ABHA health account to store them digitally.', 'रिपोर्ट, पर्चियाँ और टीकाकरण कार्ड तारीख़ों के साथ एक फ़ोल्डर में रखें। आप फ़ोटो ले सकती हैं या उन्हें डिजिटल रखने के लिए ABHA स्वास्थ्य खाता इस्तेमाल कर सकती हैं।'],
      ['💊', 'Understanding prescriptions and medication instructions', 'पर्ची और दवा के निर्देश समझना', 'Check the medicine name, the dose, how often, for how long and what to avoid. Finish a full course of antibiotics. Ask the pharmacist if anything is unclear.', 'दवा का नाम, मात्रा, कितनी बार, कितने दिन और किस चीज़ से बचना है, यह देखें। एंटीबायोटिक का पूरा कोर्स करें। कुछ साफ़ न हो तो फ़ार्मासिस्ट से पूछें।'],
      ['📝', 'Preparing for a medical appointment', 'डॉक्टर से मिलने की तैयारी', 'Write down your symptoms, when they started, the medicines you take and your questions. Bring old reports, and a family member or friend if you wish.', 'अपने लक्षण, वे कब शुरू हुए, आप कौन सी दवाएँ लेती हैं और अपने सवाल लिख लें। पुरानी रिपोर्ट लाएँ, और चाहें तो परिवार के किसी सदस्य या दोस्त को साथ ले जाएँ।'],
      ['❓', 'Asking informed questions about treatment', 'इलाज के बारे में समझदारी से सवाल पूछना', 'Good questions: What is the problem? What are my options? What are the risks and costs? What happens if I wait? You may also ask for a second opinion.', 'अच्छे सवाल: समस्या क्या है? मेरे पास क्या विकल्प हैं? जोखिम और ख़र्च क्या हैं? इंतज़ार करूँ तो क्या होगा? आप दूसरी राय भी माँग सकती हैं।'],
    ],
    quiz: [
      ['A lab result outside the normal range means you should…', ['Ask your doctor what it means', 'Panic', 'Throw the report away'], 'Ask your doctor what it means'],
      ['Which test checks for possible anaemia?', ['Haemoglobin', 'TSH', 'Blood sugar'], 'Haemoglobin'],
      ['When you get antibiotics, you should…', ['Finish the full course', 'Stop when you feel better', 'Share them with a friend'], 'Finish the full course'],
    ],
  },
  {
    id: 16, level: 4, min: 7,
    title: ['Accessing Healthcare and Patient Rights', 'स्वास्थ्य सेवा तक पहुँच और मरीज़ के अधिकार'],
    summary: ['Where to get care in India, how to pay less, and the rights you have as a patient.', 'भारत में इलाज कहाँ मिलता है, कम ख़र्च कैसे करें, और मरीज़ के रूप में आपके अधिकार।'],
    points: [
      ['🇮🇳', "Understanding India's healthcare system", 'भारत की स्वास्थ्य प्रणाली को समझना', 'India has government and private care. Public care starts at sub-centres and primary health centres, then community and district hospitals. Private care costs more but may be quicker.', 'भारत में सरकारी और निजी स्वास्थ्य सेवा है। सरकारी सेवा उप-केंद्रों और प्राथमिक स्वास्थ्य केंद्रों से शुरू होती है, फिर सामुदायिक और ज़िला अस्पताल आते हैं। निजी सेवा महँगी है पर जल्दी हो सकती है।'],
      ['🏥', 'Government hospitals and primary healthcare centres', 'सरकारी अस्पताल और प्राथमिक स्वास्थ्य केंद्र', 'Primary health centres and Ayushman Arogya Mandirs offer checkups, medicines, vaccines and antenatal care, often free. An ASHA worker in your area can guide you.', 'प्राथमिक स्वास्थ्य केंद्र और आयुष्मान आरोग्य मंदिर जाँच, दवाइयाँ, टीके और प्रसव-पूर्व देखभाल देते हैं, अक्सर मुफ़्त। आपके इलाक़े की आशा कार्यकर्ता आपका मार्गदर्शन कर सकती है।'],
      ['💳', 'Ayushman Bharat and relevant health schemes', 'आयुष्मान भारत और संबंधित स्वास्थ्य योजनाएँ', 'Ayushman Bharat PM-JAY gives eligible families cashless hospital cover of up to ₹5 lakh a year. Check eligibility on the official website or at a hospital\'s Ayushman Mitra desk. Other schemes include JSY for delivery.', 'आयुष्मान भारत PM-JAY पात्र परिवारों को साल में ₹5 लाख तक का कैशलेस अस्पताल कवर देता है। पात्रता आधिकारिक वेबसाइट या अस्पताल के आयुष्मान मित्र डेस्क पर जाँचें। अन्य योजनाओं में प्रसव के लिए JSY है।'],
      ['⚖️', 'Understanding patient rights and informed consent', 'मरीज़ के अधिकार और सूचित सहमति', 'You have the right to information about your illness and treatment, to say yes or no to treatment, to a second opinion, and to be treated with respect.', 'आपको अपनी बीमारी और इलाज की जानकारी पाने, इलाज के लिए हाँ या ना कहने, दूसरी राय लेने और सम्मान से पेश आने का अधिकार है।'],
      ['🔒', 'Medical confidentiality and privacy', 'चिकित्सकीय गोपनीयता और निजता', 'Doctors must keep your health information private, and examinations should be done with privacy. You can refuse to have your details shared.', 'डॉक्टरों को आपकी स्वास्थ्य जानकारी निजी रखनी चाहिए, और जाँच निजता के साथ होनी चाहिए। आप अपनी जानकारी साझा करने से मना कर सकती हैं।'],
      ['👩‍⚕️', 'Finding qualified healthcare professionals', 'योग्य स्वास्थ्य विशेषज्ञ ढूँढना', 'Look for a doctor registered with the National Medical Commission or the state medical council. Be careful of anyone who promises miracle cures or tells you to stop prescribed medicines.', 'राष्ट्रीय चिकित्सा आयोग या राज्य चिकित्सा परिषद में पंजीकृत डॉक्टर चुनें। चमत्कारी इलाज का वादा करने वाले या बताई गई दवाएँ बंद करने को कहने वाले से सावधान रहें।'],
      ['🚑', 'Accessing affordable and reliable healthcare', 'सस्ती और भरोसेमंद स्वास्थ्य सेवा पाना', 'Use government facilities, generic medicines and health schemes. Compare costs, ask for an itemised bill, and call 108 or 102 for an ambulance in an emergency.', 'सरकारी केंद्र, जेनेरिक दवाएँ और स्वास्थ्य योजनाएँ इस्तेमाल करें। ख़र्च की तुलना करें, विस्तृत बिल माँगें, और आपात स्थिति में एम्बुलेंस के लिए 108 या 102 पर कॉल करें।'],
    ],
    quiz: [
      ['Ayushman Bharat PM-JAY gives eligible families…', ['Cashless hospital cover up to ₹5 lakh a year', 'Free gold', 'A free phone'], 'Cashless hospital cover up to ₹5 lakh a year'],
      ['You have the right to…', ['A second opinion', 'Be shouted at', 'Have your report shown to neighbours'], 'A second opinion'],
      ['In an emergency you can call an ambulance on…', ['108', '000', '999999'], '108'],
    ],
  },
];
