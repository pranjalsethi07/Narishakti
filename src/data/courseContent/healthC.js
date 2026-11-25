// Health & Wellness Literacy, Level 5 (sections 17 to 20).
// General health education, not medical advice. It does not replace a doctor. Anything that worries you,
// or any symptom that is severe or keeps coming back, should be checked by a qualified health professional.
// Helpline numbers are checked at the time of writing. Confirm them if one does not connect.

export const HEALTH_C = [
  // ------------------------------------------------------------------ Level 5: Advanced Health Management and Lifelong Wellness
  {
    id: 17, level: 5, min: 7,
    title: ['Chronic Diseases and Long-Term Health', 'दीर्घकालिक बीमारियाँ और लंबे समय की सेहत'],
    summary: ['Understand diabetes, heart disease, blood pressure and bone health, and how to lower your risk.', 'डायबिटीज़, हृदय रोग, रक्तचाप और हड्डियों की सेहत को समझें, और अपना जोखिम घटाएँ।'],
    points: [
      ['⏳', 'Understanding chronic diseases', 'दीर्घकालिक बीमारियों को समझना', 'Chronic diseases last a long time, like diabetes, heart disease and high blood pressure. Many can be prevented or kept under control with healthy habits and regular treatment.', 'दीर्घकालिक बीमारियाँ लंबे समय तक चलती हैं, जैसे डायबिटीज़, हृदय रोग और उच्च रक्तचाप। इनमें से कई को स्वस्थ आदतों और नियमित इलाज से रोका या क़ाबू में रखा जा सकता है।'],
      ['🫀', 'Diabetes and cardiovascular disease', 'डायबिटीज़ और हृदय रोग', 'Diabetes means too much sugar in the blood. Heart disease is a leading cause of death in women too, and the signs, such as tiredness, breathlessness or jaw and back pain, can look different from the classic chest pain.', 'डायबिटीज़ का मतलब है ख़ून में शुगर का ज़्यादा होना। हृदय रोग महिलाओं में भी मौत का एक प्रमुख कारण है, और थकान, साँस फूलना या जबड़े व पीठ में दर्द जैसे संकेत छाती के जाने-पहचाने दर्द से अलग दिख सकते हैं।'],
      ['🧂', 'Hypertension and cholesterol', 'उच्च रक्तचाप और कोलेस्ट्रॉल', 'High blood pressure and high cholesterol quietly damage blood vessels. Less salt, regular exercise, a healthy weight and medicines when prescribed keep them in check.', 'उच्च रक्तचाप और ज़्यादा कोलेस्ट्रॉल चुपचाप रक्त नलिकाओं को नुक़सान पहुँचाते हैं। कम नमक, नियमित कसरत, स्वस्थ वज़न और ज़रूरत होने पर दवाएँ इन्हें क़ाबू में रखती हैं।'],
      ['🦴', 'Osteoporosis and bone health', 'ऑस्टियोपोरोसिस और हड्डियों की सेहत', 'Bones become thinner with age, especially after menopause, and can break easily. Calcium, vitamin D, sunlight and weight-bearing exercise such as walking build and protect bones.', 'उम्र के साथ, ख़ासकर रजोनिवृत्ति के बाद, हड्डियाँ पतली हो जाती हैं और आसानी से टूट सकती हैं। कैल्शियम, विटामिन D, धूप और चलने जैसी वज़न उठाने वाली कसरत हड्डियों को बनाती और बचाती है।'],
      ['⚠️', 'Understanding risk factors and prevention', 'जोखिम कारकों और रोकथाम को समझना', 'Risk factors include family history, age, tobacco, alcohol, being overweight and being inactive. You cannot change your age or genes, but you can change many of the others.', 'जोखिम कारकों में परिवार का इतिहास, उम्र, तंबाकू, शराब, ज़्यादा वज़न और निष्क्रियता शामिल हैं। आप अपनी उम्र या जीन नहीं बदल सकतीं, पर बाकी कई कारक बदल सकती हैं।'],
      ['💊', 'Managing long-term health conditions', 'लंबी बीमारियों को सँभालना', 'Take medicines as prescribed, keep your appointments, check your numbers and learn the warning signs. Do not stop medicines just because you feel fine.', 'दवाएँ बताए अनुसार लें, अपॉइंटमेंट निभाएँ, अपने आँकड़े जाँचती रहें और चेतावनी के संकेत सीखें। सिर्फ़ ठीक महसूस करने पर दवाएँ बंद न करें।'],
      ['🔁', 'Lifestyle changes and medical follow-up', 'जीवनशैली में बदलाव और डॉक्टर से नियमित मुलाक़ात', 'Small steady changes in food, activity and sleep, and quitting tobacco, matter a great deal. Regular follow-up lets your doctor adjust the treatment early.', 'खान-पान, गतिविधि और नींद में छोटे, लगातार बदलाव, और तंबाकू छोड़ना, बहुत मायने रखते हैं। नियमित फ़ॉलो-अप से डॉक्टर इलाज को जल्दी ठीक कर पाते हैं।'],
    ],
    quiz: [
      ['A chronic disease is one that…', ['Lasts a long time', 'Lasts one day', 'Only affects children'], 'Lasts a long time'],
      ['What helps protect bones?', ['Calcium, vitamin D and walking', 'Skipping meals', 'Sitting all day'], 'Calcium, vitamin D and walking'],
      ['If you feel fine, you should…', ['Keep taking prescribed medicines', 'Stop all medicines at once', 'Double the dose'], 'Keep taking prescribed medicines'],
    ],
  },
  {
    id: 18, level: 5, min: 7,
    title: ["Women's Health Across the Life Span", 'जीवन के हर चरण में महिला स्वास्थ्य'],
    summary: ['What matters most at each age, from the teenage years to menopause and beyond.', 'किशोरावस्था से रजोनिवृत्ति और उसके बाद तक, हर उम्र में सबसे ज़रूरी क्या है।'],
    points: [
      ['🌱', 'Health during adolescence', 'किशोरावस्था में स्वास्थ्य', 'Adolescence brings fast growth, periods and emotional changes. Good nutrition, iron, vaccines, accurate information and supportive adults matter most.', 'किशोरावस्था में तेज़ विकास, पीरियड्स और भावनात्मक बदलाव आते हैं। अच्छा पोषण, आयरन, टीके, सही जानकारी और सहयोगी बड़े सबसे ज़्यादा मायने रखते हैं।'],
      ['🌸', 'Health during the reproductive years', 'प्रजनन के वर्षों में स्वास्थ्य', 'Focus on regular periods, contraception, safe sex, screenings, mental health and a healthy weight. Plan pregnancies for when you are ready.', 'नियमित पीरियड्स, गर्भनिरोधक, सुरक्षित सेक्स, स्क्रीनिंग, मानसिक स्वास्थ्य और स्वस्थ वज़न पर ध्यान दें। गर्भावस्था की योजना तब बनाएँ जब आप तैयार हों।'],
      ['🤱', 'Pregnancy and postpartum health', 'गर्भावस्था और प्रसव के बाद का स्वास्थ्य', 'Antenatal care, good nutrition, a safe delivery and postnatal checks protect both mother and baby. Mental health after birth matters too.', 'प्रसव-पूर्व देखभाल, अच्छा पोषण, सुरक्षित प्रसव और प्रसव के बाद की जाँच माँ और बच्चे दोनों की रक्षा करती है। प्रसव के बाद का मानसिक स्वास्थ्य भी मायने रखता है।'],
      ['🍂', 'Perimenopause and menopause', 'पेरिमेनोपॉज़ और रजोनिवृत्ति', 'Perimenopause is the years before periods stop, often in the 40s. Menopause is when you have had no period for 12 months, usually around age 45 to 55. Hot flushes, mood changes and poor sleep are common and can be treated.', 'पेरिमेनोपॉज़ पीरियड्स रुकने से पहले के साल हैं, अक्सर 40 के दशक में। रजोनिवृत्ति तब है जब 12 महीने तक पीरियड न आए, आम तौर पर लगभग 45 से 55 साल की उम्र में। गरमी की लहरें, मूड में बदलाव और कम नींद आम हैं और इनका इलाज हो सकता है।'],
      ['🌅', 'Postmenopausal health', 'रजोनिवृत्ति के बाद का स्वास्थ्य', 'After menopause the risk of bone loss and heart disease rises. Keep up checkups, exercise, calcium and vitamin D. Tell a doctor about any bleeding after menopause.', 'रजोनिवृत्ति के बाद हड्डियाँ कमज़ोर होने और हृदय रोग का जोखिम बढ़ता है। जाँच, कसरत, कैल्शियम और विटामिन D जारी रखें। रजोनिवृत्ति के बाद कोई भी ख़ून आए तो डॉक्टर को बताएँ।'],
      ['🧠', 'Bone, heart and brain health with ageing', 'उम्र बढ़ने पर हड्डी, दिल और दिमाग़ की सेहत', 'Walk daily, eat well, stay socially active, keep your mind busy, control blood pressure and sugar, and avoid tobacco. These protect your bones, heart and memory.', 'रोज़ चलें, अच्छा खाएँ, लोगों से जुड़ी रहें, दिमाग़ को व्यस्त रखें, रक्तचाप और शुगर क़ाबू में रखें और तंबाकू से बचें। ये आपकी हड्डियों, दिल और याददाश्त की रक्षा करते हैं।'],
      ['🔄', 'Adapting health practices to different life stages', 'अलग-अलग चरणों के हिसाब से आदतें बदलना', 'What you need changes with each stage. Once a year or so, review your habits, checkups and medicines with your doctor.', 'हर चरण में आपकी ज़रूरतें बदलती हैं। साल में एक बार के आसपास अपनी आदतें, जाँचें और दवाएँ डॉक्टर के साथ देख लें।'],
    ],
    quiz: [
      ['Menopause is when you have had no period for…', ['12 months', '1 week', '3 days'], '12 months'],
      ['Bleeding after menopause should be…', ['Reported to a doctor', 'Ignored', 'Treated with home remedies only'], 'Reported to a doctor'],
      ['What protects bones as you age?', ['Walking, calcium and vitamin D', 'Staying in bed', 'Skipping sunlight'], 'Walking, calcium and vitamin D'],
    ],
  },
  {
    id: 19, level: 5, min: 7,
    title: ["Women's Safety, Trauma, and Well-being", 'महिलाओं की सुरक्षा, सदमा और कल्याण'],
    summary: ['Recognise abuse and control, know that it is never your fault, and know exactly who to call.', 'दुर्व्यवहार और नियंत्रण को पहचानें, जानें कि यह कभी आपकी ग़लती नहीं है, और जानें कि किसे कॉल करना है।'],
    points: [
      ['🛡️', 'Understanding personal safety and bodily autonomy', 'व्यक्तिगत सुरक्षा और शारीरिक स्वायत्तता को समझना', 'You have the right to feel safe and to control your own body. Trust your instincts, know safe people and places, and keep emergency numbers handy.', 'आपको सुरक्षित महसूस करने और अपने शरीर पर नियंत्रण रखने का अधिकार है। अपनी अंतर्दृष्टि पर भरोसा करें, सुरक्षित लोगों और जगहों को जानें, और आपातकालीन नंबर पास रखें।'],
      ['🚫', 'Recognising abuse and coercive control', 'दुर्व्यवहार और ज़बरदस्ती के नियंत्रण को पहचानना', 'Abuse can be physical, sexual, emotional or financial. Coercive control means controlling your money, movement, friends or phone, with threats or humiliation. It is never your fault.', 'दुर्व्यवहार शारीरिक, यौन, भावनात्मक या आर्थिक हो सकता है। ज़बरदस्ती के नियंत्रण का मतलब है धमकी या अपमान से आपके पैसे, आने-जाने, दोस्तों या फ़ोन पर क़ाबू रखना। यह कभी आपकी ग़लती नहीं है।'],
      ['🩹', 'Understanding the health impact of violence', 'हिंसा का स्वास्थ्य पर प्रभाव समझना', 'Violence can cause injuries, pain, poor sleep, anxiety, depression and problems in pregnancy. Getting help protects your health as well as your safety.', 'हिंसा से चोटें, दर्द, कम नींद, घबराहट, अवसाद और गर्भावस्था में समस्याएँ हो सकती हैं। मदद लेने से आपकी सेहत और सुरक्षा, दोनों बचती हैं।'],
      ['📞', 'Accessing support for domestic and sexual violence', 'घरेलू और यौन हिंसा के लिए सहायता', 'Call the Women Helpline on 181, the police on 112 or 1091. One Stop Centres (Sakhi) give medical, police and legal help and shelter in one place. The Domestic Violence Act protects you.', 'महिला हेल्पलाइन 181, पुलिस 112 या 1091 पर कॉल करें। वन स्टॉप सेंटर (सखी) एक ही जगह चिकित्सा, पुलिस और क़ानूनी मदद और आश्रय देते हैं। घरेलू हिंसा अधिनियम आपकी रक्षा करता है।'],
      ['🤝', 'Understanding trauma-informed care', 'ट्रॉमा-जागरूक देखभाल को समझना', 'Trauma-informed care means health workers who understand trauma, listen without blaming, explain each step and let you stay in control. You can ask for a woman provider.', 'ट्रॉमा-जागरूक देखभाल का मतलब है ऐसे स्वास्थ्यकर्मी जो सदमे को समझते हैं, बिना दोष दिए सुनते हैं, हर कदम समझाते हैं और आपको नियंत्रण में रखते हैं। आप महिला प्रदाता माँग सकती हैं।'],
      ['⛓️', 'Understanding reproductive coercion', 'प्रजनन संबंधी ज़बरदस्ती को समझना', 'Reproductive coercion is pressure or force over your reproductive choices, such as being made to become pregnant or to end a pregnancy, or having contraception hidden or sabotaged. It is a form of abuse.', 'प्रजनन संबंधी ज़बरदस्ती आपके प्रजनन के फ़ैसलों पर दबाव या ज़ोर है, जैसे गर्भवती होने या गर्भ गिराने के लिए मजबूर करना, या गर्भनिरोधक छिपाना या बेकार करना। यह दुर्व्यवहार का एक रूप है।'],
      ['📒', 'Finding emergency and professional support in India', 'भारत में आपातकालीन और पेशेवर सहायता खोजना', 'Emergency: 112. Women Helpline: 181. Women in distress: 1091. Childline: 1098. Mental health: Tele-MANAS 14416. Cyber fraud: 1930. Save these numbers and tell someone you trust your safety plan.', 'आपातकाल: 112। महिला हेल्पलाइन: 181। संकट में महिलाएँ: 1091। चाइल्डलाइन: 1098। मानसिक स्वास्थ्य: टेली-मानस 14416। साइबर धोखाधड़ी: 1930। ये नंबर सेव करें और अपनी सुरक्षा योजना किसी भरोसेमंद को बताएँ।'],
    ],
    quiz: [
      ['The Women Helpline number is…', ['181', '555', '1010'], '181'],
      ['Abuse is…', ['Never the victim\'s fault', 'Always the victim\'s fault', 'Only physical'], 'Never the victim\'s fault'],
      ['Controlling your money, phone and friends is a sign of…', ['Coercive control', 'Normal friendship', 'Good budgeting'], 'Coercive control'],
    ],
  },
  {
    id: 20, level: 5, min: 7,
    title: ['Holistic Wellness and Personal Health Management', 'संपूर्ण कल्याण और व्यक्तिगत स्वास्थ्य प्रबंधन'],
    summary: ['Bring body, mind and reproductive health together, spot misinformation, and plan your own wellness.', 'शरीर, मन और प्रजनन स्वास्थ्य को साथ देखें, ग़लत जानकारी पहचानें, और अपनी सेहत की योजना बनाएँ।'],
    points: [
      ['🔗', 'Integrating physical, mental and reproductive health', 'शारीरिक, मानसिक और प्रजनन स्वास्थ्य को जोड़ना', 'These are linked: stress can change your periods, poor sleep affects mood, and low iron drains energy. Look at your whole health, not one part at a time.', 'ये आपस में जुड़े हैं: तनाव पीरियड्स बदल सकता है, कम नींद मूड बिगाड़ती है और आयरन की कमी ऊर्जा घटाती है। पूरी सेहत को देखें, एक-एक हिस्से को नहीं।'],
      ['📝', 'Creating a personalised wellness plan', 'अपनी निजी वेलनेस योजना बनाना', 'Write down your goals, your habits (food, movement, sleep), checkups that are due, medicines, and who supports you. Review it every few months.', 'अपने लक्ष्य, आदतें (खाना, चलना-फिरना, नींद), बाक़ी जाँचें, दवाएँ और आपका साथ देने वाले लोग लिखें। हर कुछ महीने में इसे दोहराएँ।'],
      ['🔍', 'Evaluating health information and misinformation', 'स्वास्थ्य जानकारी और ग़लत सूचना परखना', 'Ask who wrote it, whether it gives evidence, and whether it is selling something. Be careful of forwards, miracle cures and claims that "doctors do not want you to know".', 'पूछें कि किसने लिखा, क्या वह सबूत देता है, और क्या कुछ बेच रहा है। फ़ॉरवर्ड, चमत्कारी इलाज और "डॉक्टर आपको यह नहीं बताना चाहते" जैसे दावों से सावधान रहें।'],
      ['🔬', 'Understanding evidence-based healthcare', 'प्रमाण-आधारित स्वास्थ्य सेवा को समझना', 'Evidence-based care means treatments that have been tested in good studies, not only tradition or opinion. Doctors and trusted health sources use evidence to guide their advice.', 'प्रमाण-आधारित देखभाल का मतलब है ऐसे इलाज जो अच्छे अध्ययनों में परखे गए हैं, सिर्फ़ परंपरा या राय पर आधारित नहीं। डॉक्टर और भरोसेमंद स्वास्थ्य स्रोत अपनी सलाह के लिए प्रमाण इस्तेमाल करते हैं।'],
      ['⚖️', 'Making informed healthcare decisions', 'जानकारी के साथ स्वास्थ्य फ़ैसले लेना', 'Understand your options, risks and costs, ask questions, consider a second opinion, and decide in line with your own values. The final choice is yours.', 'अपने विकल्प, जोखिम और ख़र्च समझें, सवाल पूछें, दूसरी राय पर विचार करें और अपने मूल्यों के अनुसार फ़ैसला करें। अंतिम चुनाव आपका है।'],
      ['🌱', 'Building sustainable health habits', 'टिकाऊ स्वास्थ्य आदतें बनाना', 'Change one small habit at a time, link it to something you already do, keep track and be kind to yourself when you slip.', 'एक बार में एक छोटी आदत बदलें, उसे किसी ऐसे काम से जोड़ें जो आप पहले से करती हैं, हिसाब रखें और चूक जाने पर ख़ुद के प्रति दयालु रहें।'],
      ['🗓️', 'Developing a lifelong preventive healthcare routine', 'जीवन भर की रोकथाम की दिनचर्या बनाना', 'Plan yearly checkups, vaccines and screenings, and a daily routine of food, movement, sleep and calm. Prevention is a lifelong habit.', 'सालाना जाँच, टीके और स्क्रीनिंग की योजना बनाएँ, और खाने, चलने-फिरने, नींद व शांति की रोज़ की दिनचर्या रखें। रोकथाम जीवन भर की आदत है।'],
    ],
    quiz: [
      ['A good first question about a health claim is…', ['Who wrote it and what is the evidence?', 'How many people forwarded it?', 'Does it sound exciting?'], 'Who wrote it and what is the evidence?'],
      ['Evidence-based healthcare means…', ['Treatments tested in good studies', 'Only old traditions', 'Whatever is popular online'], 'Treatments tested in good studies'],
      ['The best way to build a health habit is to…', ['Change one small habit at a time', 'Change everything at once', 'Wait for motivation'], 'Change one small habit at a time'],
    ],
  },
];
