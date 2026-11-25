// Health & Wellness Literacy, Levels 1 and 2 (sections 1 to 8).
// General health education, not medical advice. It does not replace a doctor. Anything that worries you,
// or any symptom that is severe or keeps coming back, should be checked by a qualified health professional.

export const HEALTH_A = [
  // ------------------------------------------------------------------ Level 1: Understanding Your Body
  {
    id: 1, level: 1, min: 6,
    title: ["Introduction to Women's Health", 'महिला स्वास्थ्य का परिचय'],
    summary: ['What health really means, and why understanding it helps you make good choices.', 'स्वास्थ्य का असली मतलब क्या है, और इसे समझना अच्छे फ़ैसले लेने में कैसे मदद करता है।'],
    points: [
      ['🌿', 'What is health and wellness?', 'स्वास्थ्य और कल्याण क्या है?', 'Health is more than not being sick. It means your body, mind and relationships are working well together. Wellness is the daily habits that keep you that way.', 'स्वास्थ्य सिर्फ़ बीमार न होना नहीं है। इसका मतलब है कि आपका शरीर, मन और रिश्ते मिलकर अच्छे से चल रहे हैं। वेलनेस वे रोज़ की आदतें हैं जो आपको ऐसा बनाए रखती हैं।'],
      ['🧠', 'Physical, mental and social well-being', 'शारीरिक, मानसिक और सामाजिक कल्याण', 'Physical health is how your body works. Mental health is how you think and feel. Social health is your relationships and support. All three affect each other.', 'शारीरिक स्वास्थ्य यानी आपका शरीर कैसे काम करता है। मानसिक स्वास्थ्य यानी आप कैसे सोचती और महसूस करती हैं। सामाजिक स्वास्थ्य यानी आपके रिश्ते और सहारा। तीनों एक-दूसरे को प्रभावित करते हैं।'],
      ['🌸', "Women's health across life stages", 'जीवन के अलग-अलग चरणों में महिला स्वास्थ्य', 'Needs change from girlhood and puberty to the reproductive years, pregnancy, and then menopause and older age. Knowing what is normal at each stage helps you act early.', 'ज़रूरतें बचपन और किशोरावस्था से लेकर प्रजनन के वर्षों, गर्भावस्था, फिर रजोनिवृत्ति और बुढ़ापे तक बदलती रहती हैं। हर चरण में क्या सामान्य है, यह जानने से आप जल्दी कदम उठा पाती हैं।'],
      ['🛡️', 'Preventive healthcare vs. treatment', 'रोकथाम बनाम इलाज', 'Prevention means staying healthy and finding problems early, through good food, exercise, vaccines and checkups. It is usually easier and cheaper than treating a serious illness later.', 'रोकथाम का मतलब है अच्छे खान-पान, कसरत, टीकों और जाँचों से स्वस्थ रहना और समस्या जल्दी पकड़ना। यह आम तौर पर बाद में गंभीर बीमारी के इलाज से आसान और सस्ता होता है।'],
      ['📚', 'Health literacy and informed decision-making', 'स्वास्थ्य साक्षरता और समझदारी से फ़ैसले', 'Health literacy is understanding health information well enough to decide. Ask your doctor questions, and check where a claim comes from before you believe it.', 'स्वास्थ्य साक्षरता का मतलब है स्वास्थ्य की जानकारी को इतना समझना कि फ़ैसला ले सकें। डॉक्टर से सवाल पूछें, और किसी दावे पर यक़ीन करने से पहले देखें कि वह कहाँ से आया है।'],
      ['🙋', 'Understanding personal health responsibilities', 'अपनी सेहत की ज़िम्मेदारी समझना', 'You are the main person who looks after your health: eat well, move, sleep, go for checkups and speak up about symptoms. Family and doctors support you, but the first step is yours.', 'अपनी सेहत की देखभाल की मुख्य ज़िम्मेदारी आपकी है: अच्छा खाएँ, चलें-फिरें, सोएँ, जाँच करवाएँ और लक्षणों के बारे में बोलें। परिवार और डॉक्टर आपका साथ देते हैं, लेकिन पहला कदम आपका है।'],
    ],
    quiz: [
      ['Health means…', ['Only not being sick', 'Body, mind and relationships working well together', 'Only having a good diet'], 'Body, mind and relationships working well together'],
      ['Preventive healthcare is about…', ['Finding problems early and staying healthy', 'Waiting until you are very ill', 'Avoiding all doctors'], 'Finding problems early and staying healthy'],
      ['Before believing a health claim, you should…', ['Share it with everyone', 'Check where it comes from', 'Ignore all health advice'], 'Check where it comes from'],
    ],
  },
  {
    id: 2, level: 1, min: 6,
    title: ['Understanding the Female Body', 'महिला शरीर को समझना'],
    summary: ['The body and its reproductive system, what hormones do, and which myths to drop.', 'शरीर और उसकी प्रजनन प्रणाली, हार्मोन क्या करते हैं, और कौन से मिथक छोड़ने चाहिए।'],
    points: [
      ['🫀', 'Basic anatomy and physiology', 'बुनियादी शारीरिक रचना और कार्य', 'The body is made of systems that work together, like the heart and blood vessels, the lungs, bones and muscles. Knowing the basics helps you notice when something changes.', 'शरीर ऐसी प्रणालियों से बना है जो मिलकर काम करती हैं, जैसे दिल और रक्त नलिकाएँ, फेफड़े, हड्डियाँ और मांसपेशियाँ। बुनियादी बातें जानने से आप बदलाव को पहचान पाती हैं।'],
      ['🌷', 'The female reproductive system', 'महिला प्रजनन प्रणाली', 'It includes the uterus, ovaries, fallopian tubes, cervix and vagina. Together they allow periods, pregnancy and childbirth.', 'इसमें गर्भाशय, अंडाशय, फैलोपियन ट्यूब, गर्भाशय ग्रीवा और योनि शामिल हैं। ये मिलकर पीरियड्स, गर्भावस्था और प्रसव को संभव बनाते हैं।'],
      ['⚗️', 'Hormones and their functions', 'हार्मोन और उनके कार्य', 'Hormones are chemical messengers. Oestrogen and progesterone control the menstrual cycle, while thyroid and other hormones affect energy, mood and growth.', 'हार्मोन रासायनिक संदेशवाहक हैं। एस्ट्रोजन और प्रोजेस्टेरोन मासिक चक्र को चलाते हैं, जबकि थायरॉइड और अन्य हार्मोन ऊर्जा, मूड और विकास पर असर डालते हैं।'],
      ['🌱', 'Puberty and bodily changes', 'किशोरावस्था और शरीर में बदलाव', 'Puberty usually starts between ages 8 and 13. Breasts develop, body hair grows, hips widen and periods begin. Every girl\'s timing is a little different, and that is normal.', 'किशोरावस्था आम तौर पर 8 से 13 साल के बीच शुरू होती है। स्तन विकसित होते हैं, शरीर पर बाल आते हैं, कूल्हे चौड़े होते हैं और पीरियड्स शुरू होते हैं। हर लड़की का समय थोड़ा अलग होता है, और यह सामान्य है।'],
      ['❌', "Common misconceptions about women's bodies", 'महिलाओं के शरीर के बारे में आम भ्रांतियाँ', 'Beliefs such as "periods make a woman impure" or "exercise harms the uterus" are false. When you are unsure, ask a doctor or a trained health worker.', '"पीरियड्स से महिला अशुद्ध हो जाती है" या "कसरत से गर्भाशय को नुकसान होता है" जैसी बातें ग़लत हैं। पक्का न हो तो डॉक्टर या प्रशिक्षित स्वास्थ्यकर्मी से पूछें।'],
      ['🩺', 'When to seek medical advice', 'डॉक्टर की सलाह कब लें', 'See a doctor for severe pain, very heavy bleeding, bleeding between periods or after menopause, a breast lump, unusual discharge, or any change that worries you.', 'तेज़ दर्द, बहुत ज़्यादा ख़ून, पीरियड्स के बीच या रजोनिवृत्ति के बाद ख़ून आना, स्तन में गाँठ, असामान्य स्राव, या कोई भी बदलाव जो आपको चिंतित करे, तो डॉक्टर को दिखाएँ।'],
    ],
    quiz: [
      ['Hormones are…', ['Chemical messengers in the body', 'Types of food', 'Medicines only'], 'Chemical messengers in the body'],
      ['Puberty usually starts at around…', ['Age 8 to 13', 'Age 25', 'Age 40'], 'Age 8 to 13'],
      ['Which is a reason to see a doctor?', ['A breast lump', 'Drinking water', 'Going for a walk'], 'A breast lump'],
    ],
  },
  {
    id: 3, level: 1, min: 7,
    title: ['Menstrual Health and Hygiene', 'माहवारी का स्वास्थ्य और स्वच्छता'],
    summary: ['How your cycle works, how to stay clean and comfortable, and what is not normal.', 'आपका चक्र कैसे काम करता है, साफ़ और आरामदेह कैसे रहें, और क्या सामान्य नहीं है।'],
    points: [
      ['📅', 'Understanding the menstrual cycle', 'माहवारी चक्र को समझना', 'The cycle is counted from day 1 of one period to day 1 of the next. It is usually 21 to 35 days. Bleeding lasts about 2 to 7 days.', 'चक्र एक पीरियड के पहले दिन से अगले के पहले दिन तक गिना जाता है। यह आम तौर पर 21 से 35 दिन का होता है। ख़ून लगभग 2 से 7 दिन आता है।'],
      ['🔄', 'Menstruation and hormonal changes', 'माहवारी और हार्मोन के बदलाव', 'Rising and falling hormones thicken and then shed the lining of the uterus. Mood, energy and skin can change through the month, which is very common.', 'हार्मोन के बढ़ने और घटने से गर्भाशय की परत मोटी होती है और फिर निकल जाती है। महीने भर में मूड, ऊर्जा और त्वचा बदल सकती है, जो बहुत आम है।'],
      ['🧼', 'Menstrual hygiene practices', 'माहवारी में साफ़-सफ़ाई', 'Wash your hands before and after changing. Change on time, wash the outer genital area with plain water, and wrap used products before putting them in a bin. Never flush them.', 'बदलने से पहले और बाद में हाथ धोएँ। समय पर बदलें, जननांग के बाहरी हिस्से को सादे पानी से धोएँ, और इस्तेमाल किए उत्पाद लपेटकर कूड़ेदान में डालें। उन्हें कभी फ़्लश न करें।'],
      ['🩸', 'Pads, tampons, menstrual cups and period underwear', 'पैड, टैम्पोन, मेंस्ट्रुअल कप और पीरियड अंडरवियर', 'Change a pad every 4 to 6 hours. Change a tampon at least every 4 to 8 hours, never longer. A cup can usually stay up to 12 hours. Period underwear is washable. Choose what is comfortable and safe for you.', 'पैड हर 4 से 6 घंटे में बदलें। टैम्पोन कम से कम हर 4 से 8 घंटे में बदलें, इससे ज़्यादा कभी नहीं। कप आम तौर पर 12 घंटे तक लगा रह सकता है। पीरियड अंडरवियर धोकर दोबारा पहना जाता है। वही चुनें जो आपके लिए आरामदेह और सुरक्षित हो।'],
      ['🤕', 'Managing menstrual discomfort', 'माहवारी की तकलीफ़ सँभालना', 'For cramps, try a warm compress, rest, gentle movement and enough water. Ask a doctor or pharmacist about a suitable pain-relief medicine. See a doctor if pain stops your daily life.', 'ऐंठन में गर्म सिंकाई, आराम, हल्की चहल-क़दमी और भरपूर पानी आज़माएँ। उपयुक्त दर्द की दवा के बारे में डॉक्टर या फ़ार्मासिस्ट से पूछें। अगर दर्द से रोज़ का काम रुक जाए तो डॉक्टर को दिखाएँ।'],
      ['⚠️', 'Irregular periods and warning signs', 'अनियमित पीरियड्स और चेतावनी के संकेत', 'See a doctor for missed periods, cycles shorter than 21 or longer than 35 days, very heavy bleeding (soaking a pad every 1 to 2 hours), or bleeding between periods. Stress, weight change, PCOS and thyroid problems can cause irregularity.', 'पीरियड्स न आने, 21 दिन से छोटे या 35 दिन से लंबे चक्र, बहुत भारी ख़ून (हर 1 से 2 घंटे में पैड भीगना), या पीरियड्स के बीच ख़ून आने पर डॉक्टर को दिखाएँ। तनाव, वज़न में बदलाव, PCOS और थायरॉइड की समस्या से अनियमितता हो सकती है।'],
      ['🗣️', 'Menstrual stigma and myths', 'माहवारी से जुड़ा कलंक और मिथक', 'A period is natural, not impure. You can cook, enter the kitchen, wash your hair, go to school or work, and exercise. Talking about it openly helps other girls too.', 'पीरियड्स प्राकृतिक हैं, अशुद्ध नहीं। आप खाना बना सकती हैं, रसोई में जा सकती हैं, बाल धो सकती हैं, स्कूल या काम पर जा सकती हैं और कसरत कर सकती हैं। इस पर खुलकर बात करने से दूसरी लड़कियों को भी मदद मिलती है।'],
    ],
    quiz: [
      ['A usual menstrual cycle lasts…', ['21 to 35 days', '3 to 5 days', '60 to 90 days'], '21 to 35 days'],
      ['How often should a pad usually be changed?', ['Once a day', 'Every 4 to 6 hours', 'Once a week'], 'Every 4 to 6 hours'],
      ['Does a period make a woman impure?', ['Yes', 'No, it is natural'], 'No, it is natural'],
    ],
  },
  {
    id: 4, level: 1, min: 7,
    title: ['Nutrition and Healthy Eating', 'पोषण और स्वस्थ आहार'],
    summary: ['What your body needs from food, key nutrients for women, and eating well on a budget.', 'आपके शरीर को भोजन से क्या चाहिए, महिलाओं के लिए ज़रूरी पोषक तत्व, और कम बजट में अच्छा खाना।'],
    points: [
      ['🥗', 'Macronutrients and micronutrients', 'मैक्रोन्यूट्रिएंट और माइक्रोन्यूट्रिएंट', 'Macronutrients (carbohydrates, protein and fat) give energy and build the body. Micronutrients (vitamins and minerals) are needed in small amounts but are just as important.', 'मैक्रोन्यूट्रिएंट (कार्बोहाइड्रेट, प्रोटीन और वसा) ऊर्जा देते हैं और शरीर बनाते हैं। माइक्रोन्यूट्रिएंट (विटामिन और खनिज) कम मात्रा में चाहिए पर उतने ही ज़रूरी हैं।'],
      ['🍽️', 'Balanced diets and food groups', 'संतुलित आहार और खाद्य समूह', 'A balanced plate has grains, dal or other protein, vegetables, fruit and some milk products. Variety matters more than any single "superfood".', 'संतुलित थाली में अनाज, दाल या अन्य प्रोटीन, सब्ज़ियाँ, फल और कुछ दूध से बनी चीज़ें होती हैं। कोई एक "सुपरफ़ूड" नहीं, विविधता ज़्यादा मायने रखती है।'],
      ['🫘', 'Protein, carbohydrates, fats, vitamins and minerals', 'प्रोटीन, कार्बोहाइड्रेट, वसा, विटामिन और खनिज', 'Protein from dal, eggs, milk, paneer, soya or fish builds and repairs the body. Carbohydrates from roti, rice and millets give energy. Healthy fats from nuts, seeds and oils are needed in small amounts.', 'दाल, अंडे, दूध, पनीर, सोया या मछली का प्रोटीन शरीर बनाता और मरम्मत करता है। रोटी, चावल और मोटे अनाज के कार्बोहाइड्रेट ऊर्जा देते हैं। मेवे, बीज और तेल की अच्छी वसा थोड़ी मात्रा में चाहिए।'],
      ['🩸', 'Iron, calcium, folate and vitamin D', 'आयरन, कैल्शियम, फ़ोलेट और विटामिन D', 'Iron (leafy greens, jaggery, dals, meat) prevents anaemia. Calcium (milk, curd, ragi, sesame) builds bones. Folate (green leafy vegetables, pulses) supports healthy cells. Vitamin D comes from sunlight and some foods.', 'आयरन (हरी पत्तेदार सब्ज़ियाँ, गुड़, दालें, मांस) ख़ून की कमी रोकता है। कैल्शियम (दूध, दही, रागी, तिल) हड्डियाँ बनाता है। फ़ोलेट (हरी पत्तेदार सब्ज़ियाँ, दालें) स्वस्थ कोशिकाओं में मदद करता है। विटामिन D धूप और कुछ खाद्य पदार्थों से मिलता है।'],
      ['🧬', 'Nutrition needs across different life stages', 'जीवन के अलग-अलग चरणों में पोषण की ज़रूरतें', 'Teenage girls, pregnant and breastfeeding women, and women after menopause each need more of certain nutrients, such as iron, folate or calcium. Ask a doctor or health worker what is right for you.', 'किशोरियों, गर्भवती व स्तनपान कराने वाली महिलाओं और रजोनिवृत्ति के बाद की महिलाओं को कुछ पोषक तत्व, जैसे आयरन, फ़ोलेट या कैल्शियम, ज़्यादा चाहिए। आपके लिए क्या सही है, यह डॉक्टर या स्वास्थ्यकर्मी से पूछें।'],
      ['🏷️', 'Reading food labels', 'खाद्य लेबल पढ़ना', 'Check the ingredient list, the sugar, salt and fat per serving, and the expiry date. Ingredients are listed from most to least. Prefer foods with short, simple ingredient lists.', 'सामग्री की सूची, प्रति सर्विंग चीनी, नमक और वसा, और समाप्ति तारीख़ देखें। सामग्री ज़्यादा से कम के क्रम में लिखी होती है। छोटी, सरल सामग्री वाली चीज़ें चुनें।'],
      ['💰', 'Healthy eating on a budget', 'कम बजट में स्वस्थ खाना', 'Seasonal vegetables, dals, eggs, millets, groundnuts and local fruit give strong nutrition at low cost. Cook at home, plan meals and avoid packaged snacks.', 'मौसमी सब्ज़ियाँ, दालें, अंडे, मोटे अनाज, मूँगफली और स्थानीय फल कम ख़र्च में अच्छा पोषण देते हैं। घर पर पकाएँ, खाने की योजना बनाएँ और पैकेट वाले स्नैक्स से बचें।'],
    ],
    quiz: [
      ['Which food helps prevent anaemia?', ['Leafy greens and jaggery', 'Cold drinks', 'Fried snacks'], 'Leafy greens and jaggery'],
      ['Calcium helps build…', ['Strong bones', 'Longer hair only', 'Better eyesight only'], 'Strong bones'],
      ['On a food label, ingredients are listed…', ['From least to most', 'In alphabetical order', 'From most to least'], 'From most to least'],
    ],
  },

  // ------------------------------------------------------------------ Level 2: Everyday Health and Self-Care
  {
    id: 5, level: 2, min: 7,
    title: ['Personal Hygiene and Preventive Care', 'व्यक्तिगत स्वच्छता और रोकथाम'],
    summary: ['Daily hygiene, how to care for intimate health, and the myths that can do harm.', 'रोज़ की स्वच्छता, अंतरंग स्वास्थ्य की देखभाल कैसे करें, और नुक़सान करने वाले मिथक।'],
    points: [
      ['🚿', 'Personal hygiene and daily self-care', 'व्यक्तिगत स्वच्छता और रोज़ की देखभाल', 'Bathe regularly, wash your hands with soap before eating and after using the toilet, trim your nails, wear clean clothes and keep your surroundings clean.', 'नियमित नहाएँ, खाने से पहले और शौचालय के बाद साबुन से हाथ धोएँ, नाख़ून काटें, साफ़ कपड़े पहनें और आसपास की जगह साफ़ रखें।'],
      ['🪥', 'Skin, hair and oral hygiene', 'त्वचा, बाल और मुँह की सफ़ाई', 'Brush twice a day, wash your face gently, keep your hair and scalp clean and use sunscreen if you are outdoors a lot. See a dentist once or twice a year.', 'दिन में दो बार ब्रश करें, चेहरा हल्के से धोएँ, बाल और सिर की त्वचा साफ़ रखें और ज़्यादा बाहर रहती हों तो सनस्क्रीन लगाएँ। साल में एक-दो बार दाँतों के डॉक्टर को दिखाएँ।'],
      ['🌺', 'Intimate hygiene and vaginal health', 'अंतरंग स्वच्छता और योनि का स्वास्थ्य', 'The vagina cleans itself. Wash only the outer area (the vulva) with plain water, wipe front to back, change out of wet clothes and wear breathable cotton underwear. Do not douche.', 'योनि अपने आप साफ़ होती रहती है। सिर्फ़ बाहरी हिस्से (वल्वा) को सादे पानी से धोएँ, आगे से पीछे की ओर पोंछें, गीले कपड़े बदलें और हवादार सूती अंडरवियर पहनें। अंदर धुलाई (डूश) न करें।'],
      ['💧', 'Understanding normal vaginal discharge', 'सामान्य योनि स्राव को समझना', 'Clear to white discharge, with little or mild smell, is normal and changes through the cycle. See a doctor for green, grey or yellow discharge, a strong smell, itching, burning or pain.', 'साफ़ से सफ़ेद स्राव, जिसमें गंध न हो या हल्की हो, सामान्य है और चक्र के साथ बदलता है। हरे, भूरे या पीले स्राव, तेज़ गंध, खुजली, जलन या दर्द हो तो डॉक्टर को दिखाएँ।'],
      ['🦠', 'Common hygiene-related infections', 'स्वच्छता से जुड़े आम संक्रमण', 'Yeast infections, bacterial vaginosis and urinary infections are common and treatable. Damp clothes, harsh soaps and poor hygiene can raise the risk.', 'यीस्ट संक्रमण, बैक्टीरियल वैजिनोसिस और मूत्र संक्रमण आम हैं और इनका इलाज हो सकता है। गीले कपड़े, तेज़ साबुन और कम सफ़ाई से जोखिम बढ़ सकता है।'],
      ['🧴', 'Myths surrounding intimate hygiene', 'अंतरंग स्वच्छता से जुड़े मिथक', 'You do not need special washes, sprays or "tightening" products. They can upset the natural balance and cause infection. Plain water is enough.', 'आपको ख़ास वॉश, स्प्रे या "टाइट करने वाले" उत्पाद नहीं चाहिए। ये प्राकृतिक संतुलन बिगाड़कर संक्रमण कर सकते हैं। सादा पानी काफ़ी है।'],
      ['🩺', 'When to consult a healthcare professional', 'स्वास्थ्य विशेषज्ञ से कब मिलें', 'See a doctor if symptoms last more than a few days, keep coming back or are severe: pain, fever, unusual discharge, sores, blood in the urine or burning when passing urine. Do not treat yourself with leftover medicines.', 'अगर लक्षण कुछ दिन से ज़्यादा रहें, बार-बार लौटें या गंभीर हों, जैसे दर्द, बुख़ार, असामान्य स्राव, घाव, पेशाब में ख़ून या पेशाब में जलन, तो डॉक्टर को दिखाएँ। बची हुई दवाओं से अपना इलाज ख़ुद न करें।'],
    ],
    quiz: [
      ['For intimate hygiene, it is best to wash the outer area with…', ['Plain water', 'Strong antiseptic', 'Perfumed spray'], 'Plain water'],
      ['The vagina…', ['Cleans itself', 'Must be washed inside daily', 'Needs special sprays'], 'Cleans itself'],
      ['A strong smell, itching and unusual discharge mean you should…', ['Ignore it', 'See a doctor', 'Use more soap'], 'See a doctor'],
    ],
  },
  {
    id: 6, level: 2, min: 7,
    title: ['Physical Fitness and Movement', 'शारीरिक फ़िटनेस और चलना-फिरना'],
    summary: ['Why moving matters, how much to do, and how to make exercise a habit that lasts.', 'चलना-फिरना क्यों ज़रूरी है, कितना करें, और कसरत को टिकाऊ आदत कैसे बनाएँ।'],
    points: [
      ['💪', 'Benefits of regular physical activity', 'नियमित शारीरिक गतिविधि के लाभ', 'Regular activity helps your heart, bones, weight, sleep and mood, and lowers the risk of diabetes and some cancers.', 'नियमित गतिविधि दिल, हड्डियों, वज़न, नींद और मूड के लिए अच्छी है, और डायबिटीज़ व कुछ कैंसर का जोखिम घटाती है।'],
      ['🫁', 'Understanding cardiovascular fitness', 'हृदय संबंधी फ़िटनेस को समझना', 'Brisk walking, cycling, swimming or dancing raises your heart rate. Aim for about 150 minutes of moderate activity a week, for example 30 minutes on 5 days.', 'तेज़ चलना, साइकिल चलाना, तैरना या नाचना दिल की धड़कन बढ़ाता है। हफ़्ते में लगभग 150 मिनट की मध्यम गतिविधि का लक्ष्य रखें, जैसे 5 दिन 30 मिनट।'],
      ['🏋️', 'Strength training and muscle health', 'ताक़त की कसरत और मांसपेशियों का स्वास्थ्य', 'Lifting weights, using resistance bands or your own body weight (squats, push-ups) twice a week keeps muscles and bones strong. This matters more as you get older.', 'हफ़्ते में दो बार वज़न उठाना, रेज़िस्टेंस बैंड या अपने शरीर के वज़न (स्क्वाट, पुश-अप) की कसरत मांसपेशियों और हड्डियों को मज़बूत रखती है। उम्र बढ़ने पर यह और ज़रूरी हो जाता है।'],
      ['🧘', 'Flexibility, mobility and balance', 'लचीलापन, गतिशीलता और संतुलन', 'Stretching and yoga keep your joints moving and reduce stiffness. Balance exercises lower the risk of falls, especially in older age.', 'स्ट्रेचिंग और योग जोड़ों को चलता रखते हैं और अकड़न घटाते हैं। संतुलन की कसरतें, ख़ासकर बड़ी उम्र में, गिरने का जोखिम कम करती हैं।'],
      ['🌈', 'Exercise across different life stages', 'जीवन के अलग-अलग चरणों में कसरत', 'Girls need active play. Pregnant women can do gentle exercise if their doctor agrees. Older women gain from walking, strength and balance work. Start where you are.', 'लड़कियों को सक्रिय खेल चाहिए। गर्भवती महिलाएँ डॉक्टर की सहमति से हल्की कसरत कर सकती हैं। बड़ी उम्र की महिलाओं को चलने, ताक़त और संतुलन की कसरत से लाभ होता है। जहाँ हैं, वहीं से शुरू करें।'],
      ['🌸', 'Fitness during menstruation', 'माहवारी के दौरान फ़िटनेस', 'Exercise is safe during periods and can ease cramps and low mood. Listen to your body, rest on heavy days and use a product that feels secure.', 'पीरियड्स में कसरत सुरक्षित है और ऐंठन व उदासी कम कर सकती है। अपने शरीर की सुनें, भारी दिनों में आराम करें और ऐसा उत्पाद इस्तेमाल करें जो सुरक्षित लगे।'],
      ['📆', 'Creating a sustainable exercise routine', 'टिकाऊ कसरत की दिनचर्या बनाना', 'Pick activities you enjoy, start with 10 minutes, fix a time and build up slowly. A routine you can keep is better than a hard one you drop.', 'ऐसी गतिविधियाँ चुनें जो आपको पसंद हों, 10 मिनट से शुरू करें, समय तय करें और धीरे-धीरे बढ़ाएँ। जो दिनचर्या आप निभा सकें, वह उस कठिन दिनचर्या से बेहतर है जिसे आप छोड़ दें।'],
    ],
    quiz: [
      ['About how much moderate activity per week is a good goal for adults?', ['About 150 minutes', 'About 10 minutes', 'None, rest is best'], 'About 150 minutes'],
      ['Exercise during periods is…', ['Usually safe and can ease cramps', 'Always dangerous', 'Only for athletes'], 'Usually safe and can ease cramps'],
      ['A good way to start a routine is to…', ['Begin with 10 minutes and build up', 'Do two hours on day one', 'Wait for the perfect time'], 'Begin with 10 minutes and build up'],
    ],
  },
  {
    id: 7, level: 2, min: 7,
    title: ['Sleep and Recovery', 'नींद और रिकवरी'],
    summary: ['Why sleep matters, what disturbs it, and simple habits for better rest.', 'नींद क्यों ज़रूरी है, उसे क्या बिगाड़ता है, और बेहतर आराम की आसान आदतें।'],
    points: [
      ['😴', 'Understanding sleep and its importance', 'नींद और उसका महत्व', 'Sleep lets the body repair itself and the brain sort memories and emotions. Most adults need about 7 to 9 hours.', 'नींद में शरीर अपनी मरम्मत करता है और दिमाग़ यादों व भावनाओं को सहेजता है। ज़्यादातर वयस्कों को लगभग 7 से 9 घंटे चाहिए।'],
      ['🌙', 'Sleep cycles and sleep quality', 'नींद के चक्र और नींद की गुणवत्ता', 'You pass through light, deep and dreaming sleep several times a night. Waking often or sleeping very lightly means less restful sleep, even when the hours look enough.', 'आप रात में कई बार हल्की, गहरी और सपनों वाली नींद से गुज़रती हैं। बार-बार जागना या बहुत हल्की नींद का मतलब है कम आरामदेह नींद, भले ही घंटे पूरे दिखें।'],
      ['🔁', 'Hormonal changes and sleep', 'हार्मोन के बदलाव और नींद', 'Periods, pregnancy and menopause can disturb sleep through discomfort, nausea or hot flushes. Knowing the cause makes it easier to manage.', 'पीरियड्स, गर्भावस्था और रजोनिवृत्ति में बेचैनी, जी मिचलाने या गरमी की लहरों से नींद बिगड़ सकती है। कारण पता हो तो सँभालना आसान होता है।'],
      ['😵', 'Common sleep problems', 'नींद की आम समस्याएँ', 'Insomnia (trouble falling or staying asleep), loud snoring with breathing pauses (sleep apnoea) and restless legs are common. They are real conditions, not weakness.', 'अनिद्रा (नींद न आना या बीच में टूटना), तेज़ खर्राटों के साथ साँस रुकना (स्लीप एप्निया) और बेचैन पैर आम हैं। ये असली समस्याएँ हैं, कमज़ोरी नहीं।'],
      ['🛏️', 'Sleep hygiene and healthy routines', 'नींद की स्वच्छता और स्वस्थ दिनचर्या', 'Sleep and wake at the same times, keep the room dark, quiet and cool, avoid screens and tea or coffee late in the day, and wind down for about 30 minutes before bed.', 'रोज़ एक ही समय पर सोएँ और जागें, कमरा अँधेरा, शांत और ठंडा रखें, दिन में देर से स्क्रीन और चाय-कॉफ़ी से बचें, और सोने से लगभग 30 मिनट पहले शांत हो जाएँ।'],
      ['🔋', 'Managing fatigue and recovery', 'थकान और रिकवरी सँभालना', 'If you are always tired, ask whether it could be anaemia, a thyroid problem, poor sleep or stress. Regular meals, water, short rests and light movement help.', 'अगर आप हमेशा थकी रहती हैं, तो सोचें कि कहीं ख़ून की कमी, थायरॉइड की समस्या, कम नींद या तनाव तो नहीं। नियमित भोजन, पानी, छोटे आराम और हल्का चलना-फिरना मदद करते हैं।'],
      ['🩺', 'When sleep problems need medical attention', 'नींद की समस्या में डॉक्टर कब ज़रूरी', 'See a doctor if poor sleep lasts more than a few weeks, you snore loudly and gasp, or you feel very sleepy in the day, low or anxious.', 'अगर ख़राब नींद कुछ हफ़्तों से ज़्यादा चले, आप तेज़ खर्राटे लें और हाँफें, या दिन में बहुत नींद, उदासी या घबराहट महसूस करें, तो डॉक्टर को दिखाएँ।'],
    ],
    quiz: [
      ['Most adults need about how many hours of sleep?', ['7 to 9 hours', '2 to 3 hours', '12 to 14 hours'], '7 to 9 hours'],
      ['Which helps you sleep better?', ['Same sleep and wake times', 'Phone in bed all night', 'Coffee at midnight'], 'Same sleep and wake times'],
      ['Loud snoring with gasping at night may be…', ['Sleep apnoea, so see a doctor', 'Always normal', 'A sign of good sleep'], 'Sleep apnoea, so see a doctor'],
    ],
  },
  {
    id: 8, level: 2, min: 7,
    title: ['Mental Health and Emotional Well-being', 'मानसिक स्वास्थ्य और भावनात्मक कल्याण'],
    summary: ['Understand stress, anxiety and low mood, build coping skills, and know when and where to get help.', 'तनाव, घबराहट और उदासी को समझें, सामना करने की ताक़त बनाएँ, और जानें कि मदद कब और कहाँ मिलेगी।'],
    points: [
      ['🧠', 'Understanding mental health', 'मानसिक स्वास्थ्य को समझना', 'Mental health is how you think, feel and cope. Everyone has ups and downs. A mental health problem is not weakness, and it can be treated.', 'मानसिक स्वास्थ्य यानी आप कैसे सोचती, महसूस करती और सामना करती हैं। सबके जीवन में उतार-चढ़ाव आते हैं। मानसिक स्वास्थ्य की समस्या कमज़ोरी नहीं है, और इसका इलाज हो सकता है।'],
      ['🌬️', 'Stress, anxiety and emotional regulation', 'तनाव, घबराहट और भावनाओं को सँभालना', 'Stress is the body\'s reaction to pressure. Anxiety is ongoing worry or fear. Slow breathing, talking it out, movement and routine help you steady your feelings.', 'तनाव दबाव पर शरीर की प्रतिक्रिया है। घबराहट लगातार चिंता या डर है। धीमी साँस, बात करना, चलना-फिरना और दिनचर्या भावनाओं को स्थिर करने में मदद करते हैं।'],
      ['🌧️', 'Recognising signs of depression', 'अवसाद के संकेत पहचानना', 'Warning signs lasting 2 weeks or more: constant sadness, loss of interest, tiredness, changes in sleep or appetite, feeling worthless, or thoughts of harming yourself. This needs help.', '2 हफ़्ते या उससे ज़्यादा रहने वाले संकेत: लगातार उदासी, दिलचस्पी ख़त्म होना, थकान, नींद या भूख में बदलाव, ख़ुद को बेकार समझना, या ख़ुद को नुक़सान पहुँचाने के विचार। इसमें मदद चाहिए।'],
      ['🔄', 'Understanding hormonal changes and mood', 'हार्मोन के बदलाव और मूड को समझना', 'Mood can shift before periods (PMS), after childbirth and around menopause. Depression after a baby is common and treatable, so tell your doctor.', 'पीरियड्स से पहले (PMS), प्रसव के बाद और रजोनिवृत्ति के आसपास मूड बदल सकता है। बच्चे के बाद का अवसाद आम है और इलाज योग्य है, इसलिए डॉक्टर को बताएँ।'],
      ['🌻', 'Coping strategies and self-care', 'सामना करने के तरीके और आत्म-देखभाल', 'Talk to someone you trust, take breaks, move your body, eat and sleep regularly, limit alcohol and do one thing you enjoy each day.', 'किसी भरोसेमंद से बात करें, ब्रेक लें, शरीर चलाएँ, नियमित खाएँ और सोएँ, शराब सीमित रखें और रोज़ एक पसंद का काम करें।'],
      ['🌳', 'Building emotional resilience', 'भावनात्मक मज़बूती बनाना', 'Resilience grows with support, realistic goals, learning from setbacks and being kind to yourself. Reach out early instead of waiting until you cannot cope.', 'मज़बूती सहारे, यथार्थवादी लक्ष्यों, झटकों से सीखने और ख़ुद के प्रति दयालु होने से बढ़ती है। जब सँभालना मुश्किल हो जाए, उससे पहले ही मदद माँगें।'],
      ['📞', 'Seeking professional mental health support', 'पेशेवर मानसिक स्वास्थ्य सहायता लेना', 'A counsellor, psychologist or psychiatrist can help. Tele-MANAS is a free, confidential helpline on 14416. If you are in danger of harming yourself, call 112 or go to the nearest hospital.', 'काउंसलर, मनोवैज्ञानिक या मनोचिकित्सक मदद कर सकते हैं। टेली-मानस 14416 पर एक मुफ़्त, गोपनीय हेल्पलाइन है। अगर आप ख़ुद को नुक़सान पहुँचाने के ख़तरे में हों, तो 112 पर कॉल करें या नज़दीकी अस्पताल जाएँ।'],
    ],
    quiz: [
      ['A mental health problem is…', ['A sign of weakness', 'Common and treatable', 'Always permanent'], 'Common and treatable'],
      ['Tele-MANAS is…', ['A free, confidential mental health helpline (14416)', 'A shopping app', 'A bank scheme'], 'A free, confidential mental health helpline (14416)'],
      ['Low mood lasting 2 weeks or more means you should…', ['Ignore it', 'Talk to someone and consider getting help', 'Stop eating'], 'Talk to someone and consider getting help'],
    ],
  },
];
