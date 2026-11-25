// Financial Literacy, Level 5 (sections 17 to 20).
// General education, not financial advice or tax advice. Tax rules, slabs and limits change every year:
// always check incometax.gov.in or ask a chartered accountant before you decide.

export const FINANCE_C = [
  // ------------------------------------------------------------------ Level 5: Financial Independence and Advanced Planning
  {
    id: 17, level: 5, min: 7,
    title: ['Tax Literacy and Tax Planning', 'कर की समझ और कर योजना'],
    summary: ['Income tax in plain words: what is taxed, the papers you will see, and how to plan legally.', 'आयकर आसान शब्दों में: क्या टैक्स लगता है, कौन से काग़ज़ दिखेंगे, और क़ानूनी तरीके से योजना कैसे बनाएँ।'],
    points: [
      ['🏛️', 'Understanding income tax in India', 'भारत में आयकर को समझना', 'Income tax is a tax on what you earn, collected by the government to pay for public services. You pay it only if your income is above a set limit, and the limit is different in each regime.', 'आयकर आपकी कमाई पर लगने वाला टैक्स है, जिसे सरकार जन-सेवाओं के लिए लेती है। आप तभी देती हैं जब आपकी आय एक तय सीमा से ऊपर हो, और यह सीमा हर व्यवस्था में अलग होती है।'],
      ['➖', 'Taxable income and deductions', 'कर योग्य आय और कटौतियाँ', 'Taxable income is your total income minus the exemptions and deductions the law allows, for example for some savings, insurance and home loan interest. You pay tax only on the taxable part.', 'कर योग्य आय आपकी कुल आय में से क़ानून द्वारा मान्य छूट और कटौतियाँ घटाकर बचती है, जैसे कुछ बचत, बीमा और होम लोन के ब्याज पर। टैक्स सिर्फ़ इसी हिस्से पर लगता है।'],
      ['🔀', 'The old and new tax regimes', 'पुरानी और नई कर व्यवस्था', 'The new regime has lower rates but allows fewer deductions. The old regime has higher rates but more deductions. Work out both each year, and choose the one that leaves you paying less.', 'नई व्यवस्था में दरें कम हैं पर कटौतियाँ कम मिलती हैं। पुरानी व्यवस्था में दरें ज़्यादा हैं पर कटौतियाँ ज़्यादा हैं। हर साल दोनों का हिसाब लगाएँ और वह चुनें जिसमें कम टैक्स देना पड़े।'],
      ['✂️', 'TDS and Form 16', 'TDS और फ़ॉर्म 16', 'TDS means tax deducted at source: your employer or bank cuts some tax before paying you. Form 16 is the certificate from your employer showing your salary and the TDS deducted.', 'TDS यानी स्रोत पर कटा टैक्स: आपका नियोक्ता या बैंक आपको भुगतान से पहले कुछ टैक्स काट लेता है। फ़ॉर्म 16 नियोक्ता का प्रमाणपत्र है जिसमें आपका वेतन और कटा हुआ TDS लिखा होता है।'],
      ['🔎', 'AIS and Form 26AS', 'AIS और फ़ॉर्म 26AS', 'AIS and Form 26AS are statements on the income tax website that list the income and tax linked to your PAN. Check them before you file, and make sure they match your own records.', 'AIS और फ़ॉर्म 26AS आयकर वेबसाइट पर मौजूद वे विवरण हैं जिनमें आपके PAN से जुड़ी आय और टैक्स दिखते हैं। रिटर्न भरने से पहले उन्हें देखें और अपने रिकॉर्ड से मिलाएँ।'],
      ['📤', 'Introduction to income tax returns', 'आयकर रिटर्न का परिचय', 'An income tax return (ITR) is the form in which you report your income to the government. For most salaried people the usual date is 31 July. Filing also lets you claim a refund if too much tax was cut.', 'आयकर रिटर्न (ITR) वह फ़ॉर्म है जिसमें आप सरकार को अपनी आय बताती हैं। ज़्यादातर वेतनभोगियों के लिए आम तारीख़ 31 जुलाई है। रिटर्न भरने से, अगर ज़्यादा टैक्स कटा हो, तो रिफ़ंड भी मिल सकता है।'],
      ['🧭', 'Tax-efficient financial planning', 'कर-कुशल वित्तीय योजना', 'Planning means using the savings, insurance and schemes the law offers, and keeping the proofs. It does not mean hiding income. When your situation is complex, ask a chartered accountant.', 'योजना का मतलब है क़ानून द्वारा दी गई बचत, बीमा और योजनाओं का लाभ लेना और उनके सबूत रखना। इसका मतलब आय छिपाना नहीं है। स्थिति जटिल हो तो चार्टर्ड अकाउंटेंट से पूछें।'],
    ],
    quiz: [
      ['TDS stands for…', ['Tax Deducted at Source', 'Total Deposit Scheme', 'Tax Due Statement'], 'Tax Deducted at Source'],
      ['Form 16 is given to you by…', ['Your employer', 'Your neighbour', 'A loan app'], 'Your employer'],
      ['Which is a legal way to lower your tax?', ['Hiding some income', 'Using deductions the law allows', 'Not filing a return'], 'Using deductions the law allows'],
    ],
  },
  {
    id: 18, level: 5, min: 7,
    title: ['Retirement and Long-Term Financial Security', 'रिटायरमेंट और लंबी अवधि की आर्थिक सुरक्षा'],
    summary: ['Plan today for the years when you may no longer earn, including if your career has breaks.', 'उन सालों की योजना आज बनाएँ जब शायद आप कमा नहीं रही होंगी, ख़ासकर अगर करियर में ब्रेक रहे हों।'],
    points: [
      ['🌅', 'Understanding retirement planning', 'रिटायरमेंट की योजना को समझना', 'Retirement planning is building enough money now to pay for your life when you stop working. The earlier you start, the less you need to save each month.', 'रिटायरमेंट की योजना का मतलब है आज इतना पैसा जोड़ना कि काम रुकने के बाद आपकी ज़िंदगी चल सके। जितना जल्दी शुरू करें, हर महीने उतना कम बचाना पड़ता है।'],
      ['🧮', 'Estimating retirement expenses', 'रिटायरमेंट के ख़र्च का अंदाज़ा', 'Think about your monthly costs later in life: food, rent if any, medicines and travel. Health costs usually rise with age, so allow for them.', 'सोचें कि आगे की उम्र में आपके मासिक ख़र्च क्या होंगे: खाना, अगर किराया है तो वह, दवाइयाँ और सफ़र। उम्र के साथ स्वास्थ्य ख़र्च आम तौर पर बढ़ते हैं, इसलिए उन्हें गिनें।'],
      ['📉', 'Inflation and retirement savings', 'महँगाई और रिटायरमेंट बचत', 'If prices rise a little each year, the money you need at 60 is much more than today. Your savings should grow faster than inflation, not just sit still.', 'अगर हर साल दाम थोड़े बढ़ते हैं, तो 60 साल की उम्र में आपको आज से कहीं ज़्यादा पैसा चाहिए होगा। आपकी बचत महँगाई से तेज़ बढ़नी चाहिए, यूँ ही पड़ी नहीं रहनी चाहिए।'],
      ['🏦', 'EPF, PPF, NPS and other retirement options', 'EPF, PPF, NPS और अन्य रिटायरमेंट विकल्प', 'EPF is a provident fund for salaried workers. PPF and NPS are open to many people. You can also use mutual funds and annuities. Compare the rules, risks and how easily you can withdraw.', 'EPF वेतनभोगी कर्मचारियों का भविष्य निधि फंड है। PPF और NPS बहुत से लोगों के लिए खुले हैं। म्यूचुअल फ़ंड और एन्युटी भी इस्तेमाल हो सकते हैं। नियम, जोखिम और निकासी की आसानी की तुलना करें।'],
      ['💵', 'Understanding pension income', 'पेंशन आय को समझना', 'A pension is a regular income after retirement. It can come from an employer, a government scheme like APY or NPS, or an annuity you buy. Check whether it rises with inflation.', 'पेंशन रिटायरमेंट के बाद नियमित आय है। यह नियोक्ता से, APY या NPS जैसी सरकारी योजना से, या ख़रीदी गई एन्युटी से आ सकती है। देखें कि क्या वह महँगाई के साथ बढ़ती है।'],
      ['🕊️', 'Planning for financial independence', 'आर्थिक आज़ादी की योजना', 'Financial independence is having enough savings and income that work is a choice, not a need. A simple start is to save a fixed share of every income and to cut debt.', 'आर्थिक आज़ादी का मतलब है इतनी बचत और आय होना कि काम करना ज़रूरत नहीं, चुनाव हो। आसान शुरुआत है: हर आय का एक तय हिस्सा बचाना और कर्ज़ घटाना।'],
      ['🌸', 'Retirement planning for women with career breaks', 'करियर ब्रेक वाली महिलाओं के लिए रिटायरमेंट योजना', 'Breaks for caring or children mean fewer years of saving. You can catch up by saving more in working years, keeping an account in your own name, and not relying only on a partner\'s pension.', 'देखभाल या बच्चों के लिए ब्रेक का मतलब है बचत के कम साल। आप काम के सालों में ज़्यादा बचाकर, अपने नाम पर खाता रखकर और सिर्फ़ जीवनसाथी की पेंशन पर निर्भर न रहकर इसकी भरपाई कर सकती हैं।'],
    ],
    quiz: [
      ['The earlier you start saving for retirement…', ['The less you need to save each month', 'The more tax you pay', 'The more you must borrow'], 'The less you need to save each month'],
      ['Inflation matters for retirement because…', ['Prices rise, so you will need more money later', 'It lowers your pension for sure', 'It cancels your savings'], 'Prices rise, so you will need more money later'],
      ['Which is a retirement savings option?', ['A lottery ticket', 'NPS', 'An unregistered loan app'], 'NPS'],
    ],
  },
  {
    id: 19, level: 5, min: 7,
    title: ['Entrepreneurship and Financial Independence', 'उद्यमिता और आर्थिक आज़ादी'],
    summary: ['Start and run a small business with clear numbers, and find the schemes made for women.', 'साफ़ हिसाब के साथ छोटा व्यवसाय शुरू करना और चलाना, और महिलाओं के लिए बनी योजनाएँ ढूँढना।'],
    points: [
      ['🚀', 'Financial planning for starting a business', 'व्यवसाय शुरू करने की वित्तीय योजना', 'Work out what you need before you start: setup costs, stock, and living costs for the first months. Start small, test your idea, and keep your own money separate from the business.', 'शुरू करने से पहले हिसाब लगाएँ: शुरुआती ख़र्च, माल, और पहले कुछ महीनों का घर का ख़र्च। छोटी शुरुआत करें, अपना विचार परखें, और अपना पैसा व्यवसाय के पैसे से अलग रखें।'],
      ['🧾', 'Understanding business income and expenses', 'व्यवसाय की आय और ख़र्च समझना', 'Income is what customers pay you. Expenses are what you spend to run the business, such as materials, rent, transport and helpers. Write both down every day.', 'आय वह है जो ग्राहक आपको देते हैं। ख़र्च वह है जो व्यवसाय चलाने में लगता है, जैसे सामग्री, किराया, ढुलाई और सहायक। दोनों रोज़ लिखें।'],
      ['🗒️', 'Creating a business budget', 'व्यवसाय का बजट बनाना', 'Plan each month: the sales you expect, the costs you must pay and what is left. A budget helps you see problems early and decide when to buy stock.', 'हर महीने की योजना बनाएँ: कितनी बिक्री की उम्मीद है, कौन से ख़र्च देने हैं और क्या बचेगा। बजट से समस्याएँ जल्दी दिखती हैं और माल कब ख़रीदना है, यह तय करना आसान होता है।'],
      ['🏷️', 'Pricing products and services', 'उत्पादों और सेवाओं की क़ीमत तय करना', 'Add up the cost of making one item, including your own time, and add a fair profit on top. A price that does not cover your costs keeps you busy and poor.', 'एक चीज़ बनाने की लागत जोड़ें, अपने समय सहित, और उस पर उचित मुनाफ़ा जोड़ें। जो क़ीमत आपकी लागत न निकाले, वह आपको व्यस्त रखती है पर ग़रीब।'],
      ['📊', 'Understanding profit, loss and cash flow', 'मुनाफ़ा, घाटा और कैश फ़्लो समझना', 'Profit is income minus expenses. A loss is the reverse. Cash flow is the timing of money in and out. A business can show a profit yet run out of cash if customers pay late.', 'मुनाफ़ा आय में से ख़र्च घटाने पर बचता है। घाटा इसका उल्टा है। कैश फ़्लो पैसे के आने-जाने का समय है। मुनाफ़ा दिखने पर भी ग्राहक देर से चुकाएँ तो व्यवसाय में नकदी ख़त्म हो सकती है।'],
      ['🏦', 'Accessing business loans and financial support', 'व्यवसाय के लिए लोन और वित्तीय सहायता पाना', 'Banks and registered lenders give business loans. Keep your records, ID, address proof and a simple plan ready. Borrow only what the business can repay from its earnings.', 'बैंक और पंजीकृत संस्थाएँ व्यवसाय लोन देती हैं। अपने रिकॉर्ड, पहचान, पते का प्रमाण और एक सरल योजना तैयार रखें। उतना ही उधार लें जितना व्यवसाय अपनी कमाई से चुका सके।'],
      ['👩‍💼', 'Women entrepreneurship schemes and funding', 'महिला उद्यमिता योजनाएँ और फंडिंग', 'Look at PM Mudra Yojana, which gives collateral-free small business loans, Stand-Up India for women starting new enterprises, and self-help group credit through rural livelihood missions. Check eligibility and apply directly at a bank.', 'पीएम मुद्रा योजना देखें, जो बिना गारंटी के छोटे व्यवसाय लोन देती है, नया उद्यम शुरू करने वाली महिलाओं के लिए स्टैंड-अप इंडिया, और ग्रामीण आजीविका मिशनों के ज़रिए स्वयं सहायता समूह का ऋण। पात्रता जाँचें और सीधे बैंक में आवेदन करें।'],
    ],
    quiz: [
      ['Profit is…', ['Income minus expenses', 'Expenses plus loans', 'Only the money in the bank'], 'Income minus expenses'],
      ['A business can show a profit and still run short of cash if…', ['Customers pay late', 'It keeps its own money separate', 'It writes down expenses'], 'Customers pay late'],
      ['PM Mudra Yojana is for…', ['Small business loans without collateral', 'Buying a car', 'Paying income tax'], 'Small business loans without collateral'],
    ],
  },
  {
    id: 20, level: 5, min: 7,
    title: ['Digital Financial Safety and Financial Empowerment', 'डिजिटल वित्तीय सुरक्षा और आर्थिक सशक्तिकरण'],
    summary: ['Stay safe from fraud when you bank and pay online, and put everything together into your own plan.', 'ऑनलाइन बैंकिंग और भुगतान में धोखाधड़ी से बचें, और सब कुछ जोड़कर अपनी योजना बनाएँ।'],
    points: [
      ['🔐', 'Online banking and digital payment safety', 'ऑनलाइन बैंकिंग और डिजिटल भुगतान की सुरक्षा', "Use only your bank's official app and website. Keep your phone locked and updated, and do not use public Wi-Fi for banking. Check the name shown before you confirm any payment.", 'सिर्फ़ अपने बैंक का आधिकारिक ऐप और वेबसाइट इस्तेमाल करें। फ़ोन लॉक और अपडेट रखें, और बैंकिंग के लिए सार्वजनिक Wi-Fi न चुनें। कोई भी भुगतान पक्का करने से पहले दिखने वाला नाम जाँचें।'],
      ['🎣', 'UPI frauds and phishing', 'UPI धोखाधड़ी और फ़िशिंग', 'You never need your UPI PIN to receive money. If someone asks you to enter it to "get" money, it is fraud. Phishing messages pretend to be your bank or a prize to make you click a link.', 'पैसे पाने के लिए आपको UPI PIN कभी नहीं डालना होता। अगर कोई कहे कि पैसा "पाने" के लिए PIN डालें, तो यह धोखाधड़ी है। फ़िशिंग संदेश बैंक या इनाम बनकर आपसे लिंक पर क्लिक करवाते हैं।'],
      ['🔑', 'OTP, PIN and password security', 'OTP, PIN और पासवर्ड की सुरक्षा', 'Never share your OTP, PIN, CVV or password with anyone, even someone who says they are from the bank. Use a different password for each account and do not use your birth date.', 'अपना OTP, PIN, CVV या पासवर्ड किसी को न बताएँ, चाहे वह ख़ुद को बैंक वाला ही क्यों न कहे। हर खाते के लिए अलग पासवर्ड रखें और अपनी जन्म तारीख़ न रखें।'],
      ['🕵️', 'Recognising investment and financial scams', 'निवेश और वित्तीय धोखाधड़ी पहचानना', 'Scams usually promise big, quick or guaranteed gains, rush you, and ask for money first. Real banks and registered firms give you time and clear paperwork.', 'धोखाधड़ी में आम तौर पर बड़े, जल्दी या गारंटी वाले मुनाफ़े का वादा होता है, जल्दबाज़ी कराई जाती है और पहले पैसा माँगा जाता है। असली बैंक और पंजीकृत कंपनियाँ आपको समय और साफ़ काग़ज़ देती हैं।'],
      ['📞', 'Reporting financial fraud in India', 'भारत में वित्तीय धोखाधड़ी की शिकायत', 'Act at once: call your bank to block the card or account, call 1930, and report at cybercrime.gov.in. Report an unauthorised transaction to your bank quickly, because rules protect you better when you report within 3 working days.', 'तुरंत कदम उठाएँ: बैंक को कॉल करके कार्ड या खाता बंद करवाएँ, 1930 पर कॉल करें, और cybercrime.gov.in पर शिकायत करें। बिना अनुमति के लेन-देन की सूचना बैंक को जल्दी दें, क्योंकि 3 कार्य-दिवस के भीतर बताने पर नियम आपको बेहतर सुरक्षा देते हैं।'],
      ['📝', 'Creating a personal financial independence plan', 'अपनी आर्थिक आज़ादी की योजना बनाना', 'Bring it together on one page: your income, a budget, an emergency fund, insurance, loans to clear, savings and investment goals, and one thing you will do this month.', 'सब कुछ एक पन्ने पर जोड़ें: आपकी आय, बजट, इमरजेंसी फंड, बीमा, चुकाने वाले लोन, बचत और निवेश लक्ष्य, और एक काम जो आप इसी महीने करेंगी।'],
      ['💪', 'Building long-term financial confidence and autonomy', 'लंबे समय के लिए आर्थिक आत्मविश्वास और स्वायत्तता', 'Confidence grows with practice. Keep learning, ask questions, take part in family money decisions and keep an account in your own name. Your money skills protect you and inspire other women.', 'आत्मविश्वास अभ्यास से बढ़ता है। सीखती रहें, सवाल पूछें, परिवार के पैसों के फ़ैसलों में हिस्सा लें और अपने नाम पर खाता रखें। आपकी पैसों की समझ आपकी रक्षा करती है और दूसरी महिलाओं को प्रेरित करती है।'],
    ],
    quiz: [
      ['To receive money by UPI, you need to enter…', ['Your UPI PIN', 'Nothing: no PIN is needed', 'Your card CVV'], 'Nothing: no PIN is needed'],
      ['If someone calls claiming to be from your bank and asks for your OTP, you should…', ['Share it quickly', 'Hang up and never share it', 'Send it by SMS'], 'Hang up and never share it'],
      ['After a fraud, the national cyber helpline number is…', ['1930', '1010', '5555'], '1930'],
    ],
  },
];
