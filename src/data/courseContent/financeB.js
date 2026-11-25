// Financial Literacy, Levels 3 and 4 (sections 9 to 16).
// General education, not financial advice. Rules, limits and rates change: always check current details
// with the official scheme website, your bank or post office, SEBI or IRDAI before you act.

export const FINANCE_B = [
  // ------------------------------------------------------------------ Level 3: Financial Planning and Protection
  {
    id: 9, level: 3, min: 6,
    title: ['Financial Goal Setting and Planning', 'वित्तीय लक्ष्य और योजना बनाना'],
    summary: ['Turn wishes into goals with an amount and a date, then make a roadmap to reach them.', 'इच्छाओं को रकम और तारीख़ वाले लक्ष्य बनाएँ, फिर उन तक पहुँचने का रास्ता तैयार करें।'],
    points: [
      ['🎯', 'Identifying financial goals', 'वित्तीय लक्ष्य पहचानना', 'A goal is something you want to pay for, such as your child\'s education, a home, a business or a safe retirement. Write each one down in plain words.', 'लक्ष्य वह है जिसके लिए आप पैसा जुटाना चाहती हैं, जैसे बच्चे की पढ़ाई, घर, व्यवसाय या सुरक्षित रिटायरमेंट। हर लक्ष्य को सीधे शब्दों में लिख लें।'],
      ['⏳', 'Short-term, medium-term and long-term goals', 'छोटी, मध्यम और लंबी अवधि के लक्ष्य', 'Short-term goals are within about 1 year, medium-term within about 1 to 5 years, and long-term after 5 years. The time left decides where to keep the money.', 'छोटी अवधि के लक्ष्य लगभग 1 साल के भीतर, मध्यम अवधि के 1 से 5 साल में, और लंबी अवधि के 5 साल के बाद के होते हैं। बचे हुए समय से तय होता है कि पैसा कहाँ रखें।'],
      ['🥇', 'Prioritising financial goals', 'लक्ष्यों को प्राथमिकता देना', 'You cannot fund everything at once. Put safety first (emergency fund, insurance), then the goals that cannot wait, then the nice-to-haves.', 'आप सब कुछ एक साथ पूरा नहीं कर सकतीं। पहले सुरक्षा (इमरजेंसी फंड, बीमा), फिर वे लक्ष्य जो टल नहीं सकते, और फिर बाकी चाहतें।'],
      ['🧮', 'Calculating the cost of future goals', 'भविष्य के लक्ष्यों की लागत निकालना', 'Prices rise over time because of inflation, so a goal will cost more later than today. Add a margin when you estimate, and ask how much you need to save each month.', 'महँगाई के कारण समय के साथ दाम बढ़ते हैं, इसलिए लक्ष्य आज से ज़्यादा महँगा पड़ेगा। अंदाज़ा लगाते समय थोड़ा ज़्यादा जोड़ें, और देखें कि हर महीने कितना बचाना होगा।'],
      ['🗺️', 'Creating a personal financial roadmap', 'अपना वित्तीय रोडमैप बनाना', 'For each goal write the amount, the date, the monthly saving and where the money will sit. One page is enough.', 'हर लक्ष्य के लिए रकम, तारीख़, मासिक बचत और पैसा कहाँ रखा जाएगा, यह लिखें। एक पन्ना काफ़ी है।'],
      ['🔁', 'Reviewing and adjusting financial plans', 'योजना की समीक्षा और बदलाव', 'Life changes, so review your plan every 6 to 12 months or after a big event such as a new baby, a job change or a loss. Adjust the amounts and dates.', 'ज़िंदगी बदलती है, इसलिए हर 6 से 12 महीने में या किसी बड़ी घटना के बाद, जैसे नया बच्चा, नौकरी बदलना या कोई नुकसान, अपनी योजना देखें। रकम और तारीख़ें बदलें।'],
    ],
    quiz: [
      ['Which goal is short-term?', ['Retirement in 25 years', 'School fees due next term', 'Buying a home in 12 years'], 'School fees due next term'],
      ['Because of inflation, a future goal will usually cost…', ['More than it does today', 'The same as today', 'Less than today'], 'More than it does today'],
      ['What should come first when you prioritise goals?', ['Safety: an emergency fund and insurance', 'A luxury holiday', 'A new gadget'], 'Safety: an emergency fund and insurance'],
    ],
  },
  {
    id: 10, level: 3, min: 6,
    title: ['Insurance and Financial Protection', 'बीमा और आर्थिक सुरक्षा'],
    summary: ['How insurance protects your family from big costs, and how to avoid common mistakes.', 'बीमा बड़े खर्चों से आपके परिवार को कैसे बचाता है, और आम गलतियों से कैसे बचें।'],
    points: [
      ['🛡️', 'What is insurance and why is it needed?', 'बीमा क्या है और क्यों ज़रूरी है?', 'You pay a small amount regularly, called a premium. If something big and unexpected happens, the insurer pays. It protects your savings from one bad event.', 'आप नियमित रूप से थोड़ी रकम देती हैं, जिसे प्रीमियम कहते हैं। अगर कोई बड़ी अनपेक्षित घटना हो, तो बीमा कंपनी भुगतान करती है। यह आपकी बचत को एक बुरी घटना से बचाता है।'],
      ['🏥', 'Health insurance and hospitalisation cover', 'स्वास्थ्य बीमा और अस्पताल का खर्च', 'Health insurance pays for hospital stays, within limits. A hospital bill can wipe out years of savings, so cover for you and your family is worth having.', 'स्वास्थ्य बीमा सीमा के भीतर अस्पताल में भर्ती का खर्च देता है। एक अस्पताल का बिल सालों की बचत ख़त्म कर सकता है, इसलिए अपने और परिवार के लिए बीमा लेना समझदारी है।'],
      ['👪', 'Life insurance and term insurance', 'जीवन बीमा और टर्म बीमा', 'Term insurance pays your family a fixed amount if you die during the policy. It is the simplest and usually cheapest cover. It matters most if others depend on your income.', 'टर्म बीमा में पॉलिसी के दौरान आपकी मृत्यु होने पर परिवार को तय रकम मिलती है। यह सबसे सरल और आम तौर पर सबसे सस्ता है। जब दूसरे आपकी आय पर निर्भर हों, तब यह सबसे ज़रूरी है।'],
      ['🚑', 'Personal accident insurance', 'व्यक्तिगत दुर्घटना बीमा', 'It pays if an accident causes death or disability. Premiums are usually low, which makes it a useful add-on, especially for people who earn by physical work.', 'दुर्घटना से मृत्यु या विकलांगता होने पर यह भुगतान करता है। प्रीमियम आम तौर पर कम होता है, इसलिए यह एक काम का अतिरिक्त कवर है, ख़ासकर शारीरिक काम से कमाने वालों के लिए।'],
      ['📋', 'Premiums, deductibles and exclusions', 'प्रीमियम, डिडक्टिबल और अपवाद', 'The premium is what you pay. A deductible is the part you pay first before the insurer pays. Exclusions are what the policy does not cover. Read all three before you buy.', 'प्रीमियम वह है जो आप देती हैं। डिडक्टिबल वह हिस्सा है जो बीमा कंपनी के भुगतान से पहले आप देती हैं। अपवाद वे चीज़ें हैं जो पॉलिसी में शामिल नहीं हैं। ख़रीदने से पहले तीनों पढ़ें।'],
      ['⚠️', 'Claim procedures and common insurance mistakes', 'क्लेम की प्रक्रिया और बीमा की आम गलतियाँ', 'Tell the insurer quickly and keep every bill and report. Common mistakes: hiding a health condition, missing a premium so the policy lapses, and not reading the waiting periods.', 'बीमा कंपनी को जल्दी बताएँ और हर बिल व रिपोर्ट सँभालकर रखें। आम गलतियाँ: किसी बीमारी को छिपाना, प्रीमियम चूकने से पॉलिसी का बंद हो जाना, और प्रतीक्षा अवधि न पढ़ना।'],
    ],
    quiz: [
      ['The regular amount you pay for an insurance policy is called the…', ['Premium', 'Principal', 'Pension'], 'Premium'],
      ['Term insurance pays your family if…', ['You get a promotion', 'You die during the policy period', 'You change banks'], 'You die during the policy period'],
      ['Which is a common insurance mistake?', ['Keeping all bills for a claim', 'Reading the exclusions', 'Hiding a health condition when applying'], 'Hiding a health condition when applying'],
    ],
  },
  {
    id: 11, level: 3, min: 7,
    title: ['Financial Rights and Legal Awareness', 'आर्थिक अधिकार और क़ानूनी जागरूकता'],
    summary: ['Know what is yours in a bank account, in marriage and in a family, and where to go for help.', 'जानें कि बैंक खाते, शादी और परिवार में आपका क्या है, और मदद के लिए कहाँ जाएँ।'],
    points: [
      ['⚖️', "Women's financial rights in India", 'भारत में महिलाओं के आर्थिक अधिकार', 'A woman has the right to open and run her own bank account, earn and keep her income, own property in her own name and sign contracts. No one else needs to approve it.', 'महिला को अपना बैंक खाता खोलने और चलाने, अपनी कमाई रखने, अपने नाम पर संपत्ति रखने और अनुबंध करने का अधिकार है। इसके लिए किसी और की मंज़ूरी ज़रूरी नहीं।'],
      ['👫', 'Joint and individual bank accounts', 'संयुक्त और व्यक्तिगत बैंक खाते', 'An individual account is yours alone. In a joint account, the operating mode matters: "either or survivor" lets either holder withdraw, while "jointly" needs both. Keep one account in your own name.', 'व्यक्तिगत खाता सिर्फ़ आपका होता है। संयुक्त खाते में संचालन का तरीका मायने रखता है: "कोई एक या उत्तरजीवी" में दोनों में से कोई निकाल सकता है, जबकि "संयुक्त रूप से" में दोनों चाहिए। एक खाता अपने नाम पर ज़रूर रखें।'],
      ['💍', 'Financial rights in marriage and inheritance', 'शादी और विरासत में आर्थिक अधिकार', 'Gifts and money given to a woman, called stridhan, belong to her. Under Hindu law, daughters have equal rights with sons in a parent\'s ancestral property. Rules differ by religion, so get legal advice.', 'महिला को दिए गए उपहार और पैसे, जिन्हें स्त्रीधन कहते हैं, उसी के होते हैं। हिंदू क़ानून में बेटियों का माता-पिता की पैतृक संपत्ति में बेटों के बराबर हक़ है। धर्म के अनुसार नियम अलग होते हैं, इसलिए क़ानूनी सलाह लें।'],
      ['🏡', 'Ownership of property and assets', 'संपत्ति और परिसंपत्तियों का स्वामित्व', 'Ownership is decided by whose name is on the papers, such as the sale deed or the registration. A home bought in your name, or jointly, gives you a legal claim. Check the papers before you sign.', 'स्वामित्व इससे तय होता है कि काग़ज़ों पर, जैसे रजिस्ट्री या बिक्री-पत्र में, किसका नाम है। आपके नाम पर या संयुक्त रूप से ख़रीदा घर आपको क़ानूनी हक़ देता है। दस्तख़त से पहले काग़ज़ देखें।'],
      ['👤', 'Nominees vs. legal heirs', 'नामांकित व्यक्ति बनाम क़ानूनी वारिस', 'A nominee receives the money after the owner dies, but the legal heirs have the final claim under succession law. Add a nominee to every account and policy, and keep it up to date.', 'नामांकित व्यक्ति मालिक की मृत्यु के बाद पैसा पाता है, लेकिन उत्तराधिकार क़ानून में अंतिम हक़ क़ानूनी वारिसों का होता है। हर खाते और पॉलिसी में नॉमिनी जोड़ें और उसे अपडेट रखें।'],
      ['🗂️', 'Financial documentation and record keeping', 'वित्तीय दस्तावेज़ और रिकॉर्ड रखना', 'Keep copies of your ID, bank details, insurance policies, loan papers and property documents together. Keep a digital copy in a safe place, such as DigiLocker, and tell someone you trust where it is.', 'अपनी पहचान, बैंक विवरण, बीमा पॉलिसी, लोन के काग़ज़ और संपत्ति के दस्तावेज़ों की प्रतियाँ एक जगह रखें। एक डिजिटल कॉपी किसी सुरक्षित जगह, जैसे डिजिलॉकर, में रखें और किसी भरोसेमंद को बता दें।'],
      ['📣', 'Financial grievance redressal', 'आर्थिक शिकायत निवारण', 'Complain to the bank or company first, in writing. If it is not solved, use the RBI Ombudsman for banks, IRDAI Bima Bharosa for insurance, or SEBI SCORES for investments.', 'पहले बैंक या कंपनी से लिखित शिकायत करें। हल न हो तो बैंकों के लिए RBI लोकपाल, बीमा के लिए IRDAI बीमा भरोसा, या निवेश के लिए SEBI SCORES का इस्तेमाल करें।'],
    ],
    quiz: [
      ['Gifts and money given to a woman (stridhan) belong to…', ['Her husband', 'Her in-laws', 'Her'], 'Her'],
      ['A nominee…', ['Receives the money after the owner dies', 'Pays the bank charges', 'Owns the bank'], 'Receives the money after the owner dies'],
      ['If a bank does not solve your complaint, you can approach the…', ['Local shopkeeper', 'RBI Ombudsman', 'A loan app'], 'RBI Ombudsman'],
    ],
  },
  {
    id: 12, level: 3, min: 7,
    title: ['Government Financial Schemes and Social Security', 'सरकारी वित्तीय योजनाएँ और सामाजिक सुरक्षा'],
    summary: ['Safe, government-backed ways to bank, save for a girl child and plan for old age.', 'बैंकिंग, बेटी के लिए बचत और बुढ़ापे की योजना के सुरक्षित, सरकार समर्थित तरीके।'],
    points: [
      ['🇮🇳', 'Financial inclusion in India', 'भारत में वित्तीय समावेशन', 'Financial inclusion means every person can use a bank account, savings, credit, insurance and pension at a fair price. Government schemes try to reach people who were left out.', 'वित्तीय समावेशन का मतलब है कि हर व्यक्ति उचित कीमत पर बैंक खाता, बचत, ऋण, बीमा और पेंशन का उपयोग कर सके। सरकारी योजनाएँ उन लोगों तक पहुँचने की कोशिश करती हैं जो छूट गए थे।'],
      ['🏦', 'Jan Dhan Yojana', 'जन धन योजना', 'A bank account with no minimum balance, a RuPay debit card and a way to receive government benefits directly. Anyone without an account can open one.', 'बिना न्यूनतम बैलेंस वाला बैंक खाता, एक RuPay डेबिट कार्ड और सरकारी लाभ सीधे पाने की सुविधा। जिसके पास खाता नहीं है, वह खोल सकता है।'],
      ['👧', 'Sukanya Samriddhi Yojana', 'सुकन्या समृद्धि योजना', 'A savings account for a girl child, opened by a parent or guardian before she turns 10. The government sets the interest rate. It is meant for her education and future.', 'बेटी के लिए बचत खाता, जो माता-पिता या अभिभावक उसके 10 साल की होने से पहले खोलते हैं। ब्याज दर सरकार तय करती है। यह उसकी पढ़ाई और भविष्य के लिए है।'],
      ['🧓', 'Atal Pension Yojana', 'अटल पेंशन योजना', 'A pension scheme for ages 18 to 40 who have a savings account. You pay a small amount each month and get a fixed pension from age 60. It is not open to income tax payers.', 'बचत खाते वाले 18 से 40 साल के लोगों के लिए पेंशन योजना। आप हर महीने थोड़ी रकम देती हैं और 60 साल की उम्र से तय पेंशन पाती हैं। आयकर दाताओं के लिए यह खुली नहीं है।'],
      ['📘', 'Public Provident Fund (PPF)', 'पब्लिक प्रोविडेंट फंड (PPF)', 'A long-term, government-backed savings account with a 15-year term. You can open it at a bank or post office. There is a yearly minimum and maximum deposit.', 'लंबी अवधि का, सरकार समर्थित बचत खाता, जिसकी अवधि 15 साल है। इसे बैंक या डाकघर में खोला जा सकता है। सालाना जमा की न्यूनतम और अधिकतम सीमा होती है।'],
      ['🌅', 'National Pension System (NPS)', 'राष्ट्रीय पेंशन प्रणाली (NPS)', 'A voluntary retirement scheme regulated by PFRDA. You invest regularly while you work, and at retirement part of the money must buy a pension. Check the current rules.', 'PFRDA द्वारा नियंत्रित एक स्वैच्छिक रिटायरमेंट योजना। काम करते हुए आप नियमित निवेश करती हैं, और रिटायरमेंट पर कुछ रकम से पेंशन ख़रीदनी होती है। मौजूदा नियम देख लें।'],
      ['📝', 'Eligibility, benefits and how to apply', 'पात्रता, लाभ और आवेदन कैसे करें', 'Each scheme has its own age limit, deposit rules and benefits. Apply at a bank or post office with your ID. Never pay an agent to "get you" a scheme, because applying is free or low cost.', 'हर योजना की अपनी उम्र सीमा, जमा के नियम और लाभ हैं। अपनी पहचान के साथ बैंक या डाकघर में आवेदन करें। योजना "दिलाने" के नाम पर किसी एजेंट को पैसे न दें, क्योंकि आवेदन मुफ़्त या बहुत कम शुल्क का होता है।'],
    ],
    quiz: [
      ['Sukanya Samriddhi Yojana is a savings scheme for…', ['A girl child', 'Senior citizens only', 'Businesses'], 'A girl child'],
      ['Jan Dhan accounts need…', ['A minimum balance of ₹10,000', 'No minimum balance', 'A government job'], 'No minimum balance'],
      ['If someone asks you for money to "get" you a government scheme, you should…', ['Pay quickly', 'Be careful and apply directly at a bank or post office', 'Share your OTP'], 'Be careful and apply directly at a bank or post office'],
    ],
  },

  // ------------------------------------------------------------------ Level 4: Wealth Creation and Investment
  {
    id: 13, level: 4, min: 7,
    title: ['Introduction to Investing', 'निवेश का परिचय'],
    summary: ['What investing is, how risk and return go together, and why time is your best friend.', 'निवेश क्या है, जोखिम और रिटर्न साथ कैसे चलते हैं, और समय आपका सबसे अच्छा साथी क्यों है।'],
    points: [
      ['🌱', 'What is investing?', 'निवेश क्या है?', 'Investing means putting money into something that can grow over time, like a deposit, a fund or gold, instead of leaving it idle.', 'निवेश का मतलब है पैसे को ऐसी जगह लगाना जो समय के साथ बढ़ सके, जैसे जमा, फ़ंड या सोना, बजाय इसके कि वह यूँ ही पड़ा रहे।'],
      ['🔀', 'Saving vs. investing vs. trading', 'बचत बनाम निवेश बनाम ट्रेडिंग', 'Saving is for safety and near needs. Investing is for long-term growth. Trading is buying and selling quickly for short-term gains, and it is much riskier. Most people should start with saving and investing.', 'बचत सुरक्षा और पास की ज़रूरतों के लिए है। निवेश लंबे समय की बढ़त के लिए है। ट्रेडिंग जल्दी-जल्दी ख़रीदना-बेचना है और इसमें जोखिम बहुत ज़्यादा है। ज़्यादातर लोगों को बचत और निवेश से शुरू करना चाहिए।'],
      ['⚖️', 'Risk and return', 'जोखिम और रिटर्न', 'Higher possible returns come with higher risk of loss. If someone promises high returns with no risk, that is a warning sign.', 'ज़्यादा संभावित रिटर्न के साथ नुकसान का ज़्यादा जोखिम भी आता है। अगर कोई बिना जोखिम के ऊँचे रिटर्न का वादा करे, तो यह ख़तरे का संकेत है।'],
      ['📉', 'Inflation and purchasing power', 'महँगाई और क्रय शक्ति', 'Inflation is the rise in prices. Over the years, ₹100 buys less. If your money earns less than inflation, it loses value even when the number looks the same.', 'महँगाई यानी दामों का बढ़ना। सालों में ₹100 से कम सामान आता है। अगर आपका पैसा महँगाई से कम कमाए, तो संख्या वही दिखने पर भी उसकी कीमत घट जाती है।'],
      ['❄️', 'Understanding compounding', 'चक्रवृद्धि को समझना', 'Compounding means you earn returns on your earlier returns too. The longer you stay invested, the faster it grows, which is why starting early matters.', 'चक्रवृद्धि का मतलब है कि आपको पिछले रिटर्न पर भी रिटर्न मिलता है। जितना लंबा निवेश रखें, उतनी तेज़ी से बढ़ता है, इसीलिए जल्दी शुरू करना मायने रखता है।'],
      ['🕰️', 'Investment time horizons', 'निवेश की समय सीमा', 'Money you need within 1 to 3 years should not sit in risky investments. Money for goals 5 years or more away can take more risk, because there is time to recover from dips.', 'जिस पैसे की 1 से 3 साल में ज़रूरत है, उसे जोखिम वाले निवेश में न रखें। 5 साल या उससे दूर के लक्ष्यों का पैसा ज़्यादा जोखिम उठा सकता है, क्योंकि गिरावट से उबरने का समय होता है।'],
      ['🧭', 'Risk tolerance and financial goals', 'जोखिम सहने की क्षमता और लक्ष्य', 'Ask yourself how much of a fall you could stay calm about, and when you will need the money. Match your investments to your goals and your comfort, not to what others are doing.', 'ख़ुद से पूछें कि कितनी गिरावट पर आप शांत रह सकती हैं, और पैसा कब चाहिए। निवेश को अपने लक्ष्यों और अपनी सहजता से मिलाएँ, इससे नहीं कि दूसरे क्या कर रहे हैं।'],
    ],
    quiz: [
      ['Higher possible returns usually come with…', ['Higher risk', 'No risk', 'Lower risk'], 'Higher risk'],
      ['Inflation means…', ['Prices rise over time', 'Prices never change', 'Banks close'], 'Prices rise over time'],
      ['Why does starting to invest early help?', ['Compounding has more time to work', 'Early investors pay no tax', 'The returns are guaranteed'], 'Compounding has more time to work'],
    ],
  },
  {
    id: 14, level: 4, min: 7,
    title: ['Investment Options and Financial Markets', 'निवेश के विकल्प और वित्तीय बाज़ार'],
    summary: ['A simple tour of where people put their money, and what each option is good and bad at.', 'लोग अपना पैसा कहाँ लगाते हैं, इसकी एक आसान सैर, और हर विकल्प की ख़ूबी और कमी।'],
    points: [
      ['🏦', 'Fixed deposits and recurring deposits', 'फ़िक्स्ड और रेकरिंग डिपॉज़िट', 'Low risk with a fixed interest rate. Good for goals within a few years. The returns are modest and may barely beat inflation.', 'कम जोखिम और तय ब्याज दर। कुछ सालों के भीतर के लक्ष्यों के लिए अच्छे हैं। रिटर्न सीमित होता है और महँगाई से मुश्किल से आगे निकलता है।'],
      ['📊', 'Mutual funds', 'म्यूचुअल फ़ंड', 'Many people put money into one pool, and a professional fund manager invests it across many assets. You can start with a small amount.', 'कई लोग एक साझा पूल में पैसा डालते हैं, और एक पेशेवर फ़ंड मैनेजर उसे कई चीज़ों में लगाता है। आप छोटी रकम से शुरू कर सकती हैं।'],
      ['🏢', 'Equity shares and stock markets', 'इक्विटी शेयर और शेयर बाज़ार', 'A share is a small ownership part of a company. Prices go up and down, so shares can grow wealth over many years but can also lose value, especially over short periods.', 'शेयर किसी कंपनी का छोटा हिस्सा है। दाम घटते-बढ़ते रहते हैं, इसलिए शेयर कई सालों में संपत्ति बढ़ा सकते हैं पर, ख़ासकर कम समय में, घट भी सकते हैं।'],
      ['📜', 'Bonds and government securities', 'बॉन्ड और सरकारी प्रतिभूतियाँ', 'You lend money to a company or the government and receive interest. Government securities are among the safest. Company bonds carry more risk.', 'आप किसी कंपनी या सरकार को पैसा उधार देती हैं और ब्याज पाती हैं। सरकारी प्रतिभूतियाँ सबसे सुरक्षित में गिनी जाती हैं। कंपनी के बॉन्ड में जोखिम ज़्यादा होता है।'],
      ['🥇', 'Gold and other asset classes', 'सोना और अन्य परिसंपत्तियाँ', 'Gold can hold value over the long term, and prices still rise and fall. Digital gold and gold funds are alternatives to jewellery, which has making charges.', 'सोना लंबे समय में मूल्य बनाए रख सकता है, फिर भी उसके दाम घटते-बढ़ते हैं। डिजिटल गोल्ड और गोल्ड फ़ंड गहनों के विकल्प हैं, जिनमें बनवाई का शुल्क लगता है।'],
      ['🏠', 'Real estate as an investment', 'निवेश के रूप में रियल एस्टेट', 'Property can grow in value and earn rent, but it needs a lot of money, is hard to sell quickly and has costs like registration and repairs.', 'संपत्ति का मूल्य बढ़ सकता है और किराया भी आ सकता है, लेकिन इसमें बहुत पैसा लगता है, जल्दी बेचना मुश्किल होता है और रजिस्ट्री व मरम्मत जैसे ख़र्च होते हैं।'],
      ['💧', 'Understanding liquidity and investment risks', 'तरलता और निवेश के जोखिम समझना', 'Liquidity means how quickly you can turn an investment into cash without losing value. A savings account is very liquid. Property is not. Check this before you invest.', 'तरलता का मतलब है कि कोई निवेश कितनी जल्दी बिना नुकसान के नकद में बदला जा सकता है। बचत खाता बहुत तरल है। संपत्ति नहीं। निवेश से पहले यह देख लें।'],
    ],
    quiz: [
      ['Which option is usually the safest of these?', ['Government securities', 'A single company\'s shares', 'A tip from social media'], 'Government securities'],
      ['A mutual fund is…', ['A pool of many people\'s money, managed by a professional', 'A kind of loan app', 'A savings account at a post office'], 'A pool of many people\'s money, managed by a professional'],
      ['Liquidity means…', ['How fast you can turn an investment into cash', 'How high the return is', 'How old the company is'], 'How fast you can turn an investment into cash'],
    ],
  },
  {
    id: 15, level: 4, min: 7,
    title: ['Mutual Funds and Systematic Investing', 'म्यूचुअल फ़ंड और नियमित निवेश'],
    summary: ['How mutual funds work, what SIP means, and the words on a fund fact sheet.', 'म्यूचुअल फ़ंड कैसे काम करते हैं, SIP का मतलब क्या है, और फ़ंड की जानकारी के शब्द।'],
    points: [
      ['🧺', 'What are mutual funds?', 'म्यूचुअल फ़ंड क्या हैं?', 'A mutual fund collects money from many investors and invests it in shares, bonds or both. It is regulated by SEBI. Mutual fund investments are subject to market risks.', 'म्यूचुअल फ़ंड कई निवेशकों से पैसा जमा करके शेयरों, बॉन्डों या दोनों में लगाता है। इसे SEBI नियंत्रित करता है। म्यूचुअल फ़ंड निवेश बाज़ार के जोखिमों के अधीन हैं।'],
      ['🧩', 'Equity, debt and hybrid funds', 'इक्विटी, डेट और हाइब्रिड फ़ंड', 'Equity funds mainly hold shares: higher risk, higher possible growth. Debt funds mainly hold bonds: steadier. Hybrid funds mix the two.', 'इक्विटी फ़ंड मुख्य रूप से शेयर रखते हैं: ज़्यादा जोखिम, ज़्यादा संभावित बढ़त। डेट फ़ंड मुख्य रूप से बॉन्ड रखते हैं: ज़्यादा स्थिर। हाइब्रिड फ़ंड दोनों को मिलाते हैं।'],
      ['🔗', 'Direct vs. regular plans', 'डायरेक्ट बनाम रेगुलर प्लान', 'A direct plan is bought straight from the fund company and has a lower cost. A regular plan goes through a distributor who is paid a commission, so it costs more every year.', 'डायरेक्ट प्लान सीधे फ़ंड कंपनी से लिया जाता है और उसकी लागत कम होती है। रेगुलर प्लान वितरक के ज़रिए आता है जिसे कमीशन मिलता है, इसलिए हर साल उसकी लागत ज़्यादा होती है।'],
      ['🌾', 'Growth vs. income distribution options', 'ग्रोथ बनाम आय वितरण विकल्प', 'In the growth option, profits stay invested and keep compounding. In the IDCW option, some money is paid out to you from time to time, and the fund\'s value falls by that amount. A payout is not free extra money.', 'ग्रोथ विकल्प में मुनाफ़ा निवेश में ही रहता है और बढ़ता रहता है। IDCW विकल्प में समय-समय पर कुछ पैसा आपको दिया जाता है और फ़ंड का मूल्य उतना घट जाता है। भुगतान कोई मुफ़्त अतिरिक्त पैसा नहीं है।'],
      ['📅', 'SIPs and lump-sum investing', 'SIP और एकमुश्त निवेश', 'A SIP, or systematic investment plan, invests a fixed amount every month, which builds the habit and averages out market ups and downs. A lump sum invests everything at once.', 'SIP यानी सिस्टमैटिक इन्वेस्टमेंट प्लान हर महीने तय रकम निवेश करता है, जिससे आदत बनती है और बाज़ार के उतार-चढ़ाव का औसत निकल जाता है। एकमुश्त में सब कुछ एक बार में लगता है।'],
      ['🔢', 'Understanding NAV, expense ratios and returns', 'NAV, ख़र्च अनुपात और रिटर्न समझना', 'NAV is the price of one unit of the fund. The expense ratio is the yearly fee the fund charges. A low NAV does not mean a cheap fund. Look at the fee and the long-term record instead.', 'NAV फ़ंड की एक यूनिट का दाम है। ख़र्च अनुपात वह सालाना शुल्क है जो फ़ंड लेता है। कम NAV का मतलब सस्ता फ़ंड नहीं होता। इसके बजाय शुल्क और लंबे समय का रिकॉर्ड देखें।'],
      ['🧭', 'Choosing investments by goals and risk', 'लक्ष्य और जोखिम के हिसाब से निवेश चुनना', 'Pick a fund that fits your goal date and your comfort with ups and downs. Past returns do not guarantee future returns, so do not choose by last year\'s winner.', 'ऐसा फ़ंड चुनें जो आपके लक्ष्य की तारीख़ और उतार-चढ़ाव सहने की आपकी क्षमता से मेल खाए। पिछला रिटर्न भविष्य की गारंटी नहीं है, इसलिए पिछले साल के विजेता को देखकर न चुनें।'],
    ],
    quiz: [
      ['A SIP means…', ['Investing a fixed amount regularly', 'A one-time loan', 'A type of insurance'], 'Investing a fixed amount regularly'],
      ['Compared with a regular plan, a direct plan usually has…', ['A lower yearly cost', 'A higher yearly cost', 'A guaranteed return'], 'A lower yearly cost'],
      ['Do past returns guarantee future returns?', ['Yes, always', 'No, they do not', 'Only for equity funds'], 'No, they do not'],
    ],
  },
  {
    id: 16, level: 4, min: 7,
    title: ['Advanced Investment and Wealth Management', 'उन्नत निवेश और संपत्ति प्रबंधन'],
    summary: ['Spread risk, stay steady when markets fall, and spot the scams that promise too much.', 'जोखिम बाँटना, बाज़ार गिरने पर शांत रहना, और बहुत बड़े वादे करने वाली धोखाधड़ी पहचानना।'],
    points: [
      ['🥧', 'Asset allocation and diversification', 'एसेट एलोकेशन और विविधीकरण', 'Asset allocation is how you split money between shares, bonds, gold and cash. Diversification means not putting all your eggs in one basket, so one bad investment does not sink you.', 'एसेट एलोकेशन यह है कि आप पैसे को शेयर, बॉन्ड, सोने और नकद में कैसे बाँटती हैं। विविधीकरण का मतलब है सारे अंडे एक टोकरी में न रखना, ताकि एक ख़राब निवेश आपको डुबो न दे।'],
      ['🧱', 'Portfolio construction', 'पोर्टफ़ोलियो बनाना', 'Your portfolio is everything you have invested. Build it from your goals: safer money for near goals, growth money for far ones, and keep it simple so you understand every part.', 'आपका पोर्टफ़ोलियो वह सब है जिसमें आपने निवेश किया है। इसे अपने लक्ष्यों से बनाएँ: पास के लक्ष्यों के लिए सुरक्षित पैसा, दूर के लिए बढ़त वाला पैसा, और इसे सरल रखें ताकि हर हिस्सा समझ आए।'],
      ['⚖️', 'Rebalancing investments', 'निवेश का पुनर्संतुलन', 'Over time some investments grow faster and change your mix. Once a year, move money back to your planned split. This keeps your risk where you want it.', 'समय के साथ कुछ निवेश तेज़ी से बढ़कर आपका मिश्रण बदल देते हैं। साल में एक बार पैसे को वापस अपनी तय बाँट पर लाएँ। इससे आपका जोखिम वहीं रहता है जहाँ आप चाहती हैं।'],
      ['🌊', 'Understanding market volatility', 'बाज़ार की अस्थिरता को समझना', 'Markets rise and fall, sometimes sharply. Falls are normal, not a reason to panic and sell. Staying invested and keeping your SIPs going is how long-term investors usually get through them.', 'बाज़ार चढ़ते-गिरते हैं, कभी तेज़ी से। गिरावट सामान्य है, घबराकर बेचने की वजह नहीं। निवेश बनाए रखना और SIP चलाते रहना ही वह तरीका है जिससे लंबी अवधि के निवेशक आम तौर पर उनसे गुज़रते हैं।'],
      ['🏔️', 'Long-term wealth creation strategies', 'लंबी अवधि में संपत्ति बनाने की रणनीतियाँ', 'Start early, invest regularly, keep costs low, avoid debt on high interest, and be patient. Wealth is mostly built by habits and time, not by clever timing.', 'जल्दी शुरू करें, नियमित निवेश करें, लागत कम रखें, ऊँचे ब्याज के कर्ज़ से बचें और धैर्य रखें। संपत्ति ज़्यादातर आदतों और समय से बनती है, चालाक टाइमिंग से नहीं।'],
      ['📋', 'Evaluating investment performance', 'निवेश के प्रदर्शन का मूल्यांकन', 'Compare your returns with a fair benchmark and with your own goal, over several years, not weeks. Check the costs too. A good return that comes with huge risk is not a good deal.', 'अपने रिटर्न की तुलना किसी उचित बेंचमार्क और अपने लक्ष्य से करें, कई सालों में, हफ़्तों में नहीं। लागत भी देखें। बहुत बड़े जोखिम के साथ आया अच्छा रिटर्न अच्छा सौदा नहीं है।'],
      ['🚨', 'Investment scams and misleading return promises', 'निवेश धोखाधड़ी और भ्रामक रिटर्न के वादे', 'Warning signs: guaranteed high returns, "double your money", pressure to invest today, tips from strangers, and sellers who are not registered with SEBI. Report fraud at cybercrime.gov.in or on 1930.', 'ख़तरे के संकेत: ऊँचे रिटर्न की गारंटी, "पैसा दोगुना", आज ही निवेश करने का दबाव, अजनबियों की सलाह, और SEBI में पंजीकृत न होने वाले विक्रेता। धोखाधड़ी की शिकायत cybercrime.gov.in या 1930 पर करें।'],
    ],
    quiz: [
      ['Diversification means…', ['Spreading money across different investments', 'Putting everything in one stock', 'Never investing'], 'Spreading money across different investments'],
      ['When markets fall sharply, a long-term investor usually should…', ['Panic and sell everything', 'Stay calm and keep to the plan', 'Borrow money to invest more'], 'Stay calm and keep to the plan'],
      ['Which is a warning sign of an investment scam?', ['Guaranteed high returns', 'A SEBI-registered adviser', 'Clear written risks'], 'Guaranteed high returns'],
    ],
  },
];
