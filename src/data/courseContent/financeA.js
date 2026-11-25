// Financial Literacy, Levels 1 and 2 (sections 1 to 8).
// General education, not financial advice. Rules and rates change: always check current details
// with your bank, the RBI or the official scheme website.

export const FINANCE_A = [
  // ------------------------------------------------------------------ Level 1: Understanding Money
  {
    id: 1, level: 1, min: 6,
    title: ['Understanding Money and Financial Literacy', 'पैसे और वित्तीय साक्षरता को समझना'],
    summary: ['What money is, why financial skills matter, and the words you will meet again and again.', 'पैसा क्या है, वित्तीय समझ क्यों ज़रूरी है, और वे शब्द जो आपको बार-बार मिलेंगे।'],
    points: [
      ['💰', 'What is money and how does it work?', 'पैसा क्या है और कैसे काम करता है?', 'Money is what we agree to exchange for goods and services. You earn it by working, spend it on what you need, and can keep some aside for later.', 'पैसा वह चीज़ है जिसे हम सामान और सेवाओं के बदले लेने-देने पर सहमत हैं। आप काम करके कमाती हैं, ज़रूरत की चीज़ों पर खर्च करती हैं, और कुछ आगे के लिए बचा सकती हैं।'],
      ['👩', 'Why financial literacy matters for women', 'महिलाओं के लिए वित्तीय समझ क्यों ज़रूरी है', 'When you understand money, you can make your own decisions, spot cheating and plan for yourself and your family. Women often have career breaks and live longer, so planning matters even more.', 'जब आप पैसे को समझती हैं, तो अपने फ़ैसले ख़ुद ले सकती हैं, धोखे को पहचान सकती हैं और अपने व परिवार के लिए योजना बना सकती हैं। महिलाओं के करियर में अक्सर ब्रेक आते हैं और वे ज़्यादा जीती हैं, इसलिए योजना और भी ज़रूरी है।'],
      ['⚖️', 'Needs vs. wants', 'ज़रूरत बनाम चाहत', 'Needs are things you must have, like food, rent and medicine. Wants are nice to have, like a new phone. Pay for needs first.', 'ज़रूरतें वे हैं जो होनी ही चाहिए, जैसे खाना, किराया और दवा। चाहतें अच्छी लगने वाली चीज़ें हैं, जैसे नया फ़ोन। पहले ज़रूरतें पूरी करें।'],
      ['📒', 'Income, expenses, assets and liabilities', 'आय, खर्च, संपत्ति और देनदारी', 'Income is money coming in. Expenses are money going out. Assets are things you own that have value. Liabilities are what you owe, such as a loan.', 'आय वह पैसा है जो आता है। खर्च वह है जो जाता है। संपत्ति वे चीज़ें हैं जो आपकी हैं और जिनकी कीमत है। देनदारी वह है जो आपको चुकाना है, जैसे लोन।'],
      ['🕊️', 'Financial independence and why it matters', 'आर्थिक आज़ादी और यह क्यों मायने रखती है', 'It means you can meet your needs and make choices without depending on someone else for money. It gives you safety and a stronger voice at home.', 'इसका मतलब है कि आप पैसे के लिए किसी और पर निर्भर हुए बिना अपनी ज़रूरतें पूरी कर सकती हैं और फ़ैसले ले सकती हैं। इससे सुरक्षा मिलती है और घर में आपकी आवाज़ मज़बूत होती है।'],
      ['🚧', 'Common financial challenges faced by women', 'महिलाओं की आम आर्थिक चुनौतियाँ', 'Low or unpaid earning, career breaks, being left out of family money decisions, and less access to accounts and loans. Learning the basics helps you push past these.', 'कम या बिना भुगतान की कमाई, करियर में ब्रेक, परिवार के पैसों के फ़ैसलों से बाहर रखा जाना, और खाते व लोन तक कम पहुँच। बुनियादी बातें सीखने से आप इन बाधाओं को पार कर सकती हैं।'],
    ],
    quiz: [
      ['Which of these is a need?', ['A designer handbag', 'Medicine', 'A new video game'], 'Medicine'],
      ['A loan you must repay is an example of a…', ['Asset', 'Income', 'Liability'], 'Liability'],
      ['Money that comes in each month is called…', ['Income', 'An expense', 'A liability'], 'Income'],
    ],
  },
  {
    id: 2, level: 1, min: 6,
    title: ['Understanding Income and Earning', 'आय और कमाई को समझना'],
    summary: ['Where money comes from, how pay is worked out, and how to read a payslip.', 'पैसा कहाँ से आता है, वेतन कैसे तय होता है, और पेस्लिप कैसे पढ़ें।'],
    points: [
      ['💼', 'Different sources of income', 'आय के अलग-अलग स्रोत', 'Income can come from a job, your own business, farming, rent, interest, a pension, or help from family or government schemes.', 'आय नौकरी, अपने व्यवसाय, खेती, किराए, ब्याज, पेंशन, या परिवार व सरकारी योजनाओं की मदद से आ सकती है।'],
      ['🔁', 'Active income vs. passive income', 'सक्रिय आय बनाम निष्क्रिय आय', 'Active income needs your time and work, like a salary. Passive income keeps coming with little daily effort, like rent or interest.', 'सक्रिय आय के लिए आपका समय और काम चाहिए, जैसे वेतन। निष्क्रिय आय रोज़ की कम मेहनत से आती रहती है, जैसे किराया या ब्याज।'],
      ['🧾', 'Salary, wages, business and freelance income', 'वेतन, मज़दूरी, व्यवसाय और फ़्रीलांस आय', 'A salary is fixed pay each month. Wages are often paid daily or weekly. Business and freelance income changes with the work you get and may not be regular.', 'वेतन हर महीने तय रकम होती है। मज़दूरी अक्सर रोज़ या हफ़्ते में मिलती है। व्यवसाय और फ़्रीलांस की आय काम के हिसाब से बदलती है और नियमित नहीं भी हो सकती।'],
      ['➖', 'Gross salary vs. net salary', 'ग्रॉस सैलरी बनाम नेट सैलरी', 'Gross salary is the total before deductions. Net salary, or take-home pay, is what reaches your bank account after deductions such as PF and tax.', 'ग्रॉस सैलरी कटौतियों से पहले की कुल रकम है। नेट सैलरी, यानी हाथ में आने वाली रकम, PF और टैक्स जैसी कटौतियों के बाद आपके खाते में पहुँचती है।'],
      ['📄', 'Understanding payslips', 'पेस्लिप को समझना', 'A payslip lists your earnings, deductions and net pay for the month. Keep your payslips: banks ask for them when you apply for a loan.', 'पेस्लिप में महीने की आपकी कमाई, कटौतियाँ और नेट वेतन लिखा होता है। पेस्लिप सँभालकर रखें: लोन के लिए बैंक इन्हें माँगते हैं।'],
      ['🌱', 'Financial independence through earning', 'कमाई से आर्थिक आज़ादी', 'Earning your own income gives you a say in money decisions. Even a small, steady income builds confidence and savings.', 'अपनी कमाई होने से पैसों के फ़ैसलों में आपकी बात का वज़न बढ़ता है। छोटी, लेकिन नियमित आय भी आत्मविश्वास और बचत बनाती है।'],
    ],
    quiz: [
      ['Your take-home pay after deductions is called…', ['Gross salary', 'Net salary', 'A bonus'], 'Net salary'],
      ['Rent from a house you own is usually…', ['Passive income', 'Active income', 'A liability'], 'Passive income'],
      ['A payslip shows…', ['Only your bank balance', 'Your earnings and deductions', 'Your credit score'], 'Your earnings and deductions'],
    ],
  },
  {
    id: 3, level: 1, min: 6,
    title: ['Budgeting and Expense Management', 'बजट और खर्च का प्रबंधन'],
    summary: ['Make a simple plan for your money so you are never caught short at the end of the month.', 'अपने पैसों की एक आसान योजना बनाएँ ताकि महीने के अंत में तंगी न हो।'],
    points: [
      ['🗒️', 'What is a budget and why is it important?', 'बजट क्या है और क्यों ज़रूरी है?', 'A budget is a plan for your money. It shows what comes in, what goes out and how much you can save, so month-end is not a surprise.', 'बजट आपके पैसों की योजना है। इसमें दिखता है कि कितना आता है, कितना जाता है और कितना बच सकता है, ताकि महीने के अंत में परेशानी न हो।'],
      ['🔍', 'Tracking daily, monthly and annual expenses', 'रोज़, मासिक और सालाना खर्च का हिसाब', 'Write down what you spend, in a notebook or on your phone. Small daily spends add up, and some bills come only once a year.', 'जो खर्च करें उसे कॉपी या फ़ोन में लिख लें। रोज़ के छोटे खर्च जुड़कर बड़े हो जाते हैं, और कुछ बिल साल में एक ही बार आते हैं।'],
      ['📌', 'Fixed vs. variable expenses', 'तय बनाम बदलने वाले खर्च', 'Fixed expenses stay the same, like rent or school fees. Variable ones change, like groceries or travel. Variable costs are the easier ones to cut.', 'तय खर्च वही रहते हैं, जैसे किराया या स्कूल फ़ीस। बदलने वाले खर्च घटते-बढ़ते हैं, जैसे राशन या सफ़र। इन्हें कम करना आसान होता है।'],
      ['🧮', 'Creating a personal monthly budget', 'अपना मासिक बजट बनाना', 'List your income, then fixed costs, then variable costs, and set savings aside first. At the end of the month, check and adjust.', 'पहले अपनी आय लिखें, फिर तय खर्च, फिर बदलने वाले खर्च, और बचत सबसे पहले अलग रखें। महीने के अंत में जाँचें और ज़रूरत हो तो बदलें।'],
      ['🥧', 'The 50/30/20 budgeting rule', '50/30/20 बजट नियम', 'A simple guide: about 50% of income for needs, 30% for wants and 20% for savings. It is a starting point, so change it to suit your life.', 'एक आसान अंदाज़ा: आय का लगभग 50% ज़रूरतों पर, 30% चाहतों पर और 20% बचत पर। यह शुरुआत है, इसे अपनी ज़िंदगी के हिसाब से बदलें।'],
      ['🌦️', 'Managing expenses with irregular income', 'अनियमित आय में खर्च सँभालना', 'If your income changes, plan around your lowest usual month, save more in good months and keep a small buffer for lean ones.', 'अगर आय घटती-बढ़ती है, तो अपने सबसे कम वाले आम महीने के हिसाब से योजना बनाएँ, अच्छे महीनों में ज़्यादा बचाएँ और तंगी के महीनों के लिए थोड़ा बफ़र रखें।'],
    ],
    quiz: [
      ['In the 50/30/20 rule, the 20% is for…', ['Wants', 'Rent', 'Savings'], 'Savings'],
      ['Rent is usually a…', ['Fixed expense', 'Variable expense', 'Asset'], 'Fixed expense'],
      ['With an irregular income, plan your budget around…', ['Your best month', 'Your lowest usual month', "Someone else's salary"], 'Your lowest usual month'],
    ],
  },
  {
    id: 4, level: 1, min: 7,
    title: ['Banking and Financial Accounts', 'बैंकिंग और वित्तीय खाते'],
    summary: ['Open and use a bank account, read a statement, and send money safely.', 'बैंक खाता खोलना और इस्तेमाल करना, स्टेटमेंट पढ़ना, और सुरक्षित तरीके से पैसे भेजना।'],
    points: [
      ['🏦', 'Savings and current accounts', 'बचत खाता और चालू खाता', 'A savings account keeps your money safe and earns interest. A current account is for businesses with many daily transactions and usually pays no interest.', 'बचत खाता आपके पैसे सुरक्षित रखता है और ब्याज देता है। चालू खाता उन व्यवसायों के लिए है जिनमें रोज़ बहुत लेन-देन होते हैं, और इस पर आम तौर पर ब्याज नहीं मिलता।'],
      ['📝', 'How to open a bank account', 'बैंक खाता कैसे खोलें', "Visit a branch, or use the bank's app, with your ID and address proof. A Jan Dhan account can be opened with zero balance.", 'अपनी पहचान और पते के प्रमाण के साथ शाखा में जाएँ या बैंक का ऐप इस्तेमाल करें। जन धन खाता ज़ीरो बैलेंस पर खोला जा सकता है।'],
      ['🪪', 'KYC and required documents', 'KYC और ज़रूरी दस्तावेज़', 'KYC means Know Your Customer. Banks ask for proof of identity and address, such as Aadhaar, voter ID or passport, and a photo.', 'KYC का मतलब है अपने ग्राहक को जानिए। बैंक पहचान और पते का प्रमाण माँगते हैं, जैसे आधार, वोटर आईडी या पासपोर्ट, और एक फ़ोटो।'],
      ['💳', 'Debit cards, ATM cards and cash withdrawals', 'डेबिट कार्ड, ATM कार्ड और नकद निकासी', 'A debit card takes money straight from your account. Keep your PIN secret, cover the keypad, and never hand your card to anyone.', 'डेबिट कार्ड सीधे आपके खाते से पैसे लेता है। अपना PIN गुप्त रखें, कीपैड ढककर डालें, और कार्ड किसी को न दें।'],
      ['📑', 'Understanding bank statements', 'बैंक स्टेटमेंट को समझना', 'A statement lists every credit (money in) and debit (money out). Check it each month to spot any payment you did not make.', 'स्टेटमेंट में हर क्रेडिट (आया पैसा) और डेबिट (गया पैसा) लिखा होता है। हर महीने इसे देखें ताकि कोई ऐसा भुगतान पकड़ सकें जो आपने नहीं किया।'],
      ['📲', 'UPI, NEFT, RTGS and IMPS', 'UPI, NEFT, RTGS और IMPS', 'UPI and IMPS send money instantly. NEFT is for regular transfers. RTGS is for large amounts. You need your PIN only to send money, never to receive it.', 'UPI और IMPS से पैसा तुरंत जाता है। NEFT सामान्य ट्रांसफ़र के लिए है। RTGS बड़ी रकम के लिए है। PIN सिर्फ़ पैसा भेजने के लिए चाहिए, पैसा पाने के लिए कभी नहीं।'],
      ['⚖️', 'Interest rates and minimum balances', 'ब्याज दरें और न्यूनतम बैलेंस', 'Savings accounts pay a small interest. Some accounts need a minimum balance and charge a fee if you fall below it, so check before you open one.', 'बचत खाते पर थोड़ा ब्याज मिलता है। कुछ खातों में न्यूनतम बैलेंस रखना पड़ता है और उससे कम होने पर शुल्क कटता है, इसलिए खाता खोलने से पहले पूछ लें।'],
    ],
    quiz: [
      ['You need your UPI PIN to…', ['Receive money', 'Send money', 'See your name'], 'Send money'],
      ['KYC stands for…', ['Know Your Customer', 'Keep Your Cash', 'Key Your Code'], 'Know Your Customer'],
      ['Reading your bank statement helps you…', ['Spot payments you did not make', 'Raise your interest rate', 'Get a free loan'], 'Spot payments you did not make'],
    ],
  },

  // ------------------------------------------------------------------ Level 2: Financial Security and Control
  {
    id: 5, level: 2, min: 6,
    title: ['Saving Money and Building Financial Discipline', 'बचत और आर्थिक अनुशासन'],
    summary: ['Make saving a habit, set goals, and keep going even on a small or uneven income.', 'बचत को आदत बनाएँ, लक्ष्य तय करें, और कम या अनियमित आय में भी जारी रखें।'],
    points: [
      ['🐷', 'Saving vs. investing', 'बचत बनाम निवेश', 'Saving keeps money safe and easy to reach for near-term needs. Investing puts money to work over a longer time, with some risk of loss.', 'बचत से पैसा सुरक्षित रहता है और पास की ज़रूरतों के लिए आसानी से मिल जाता है। निवेश में पैसा लंबे समय के लिए लगता है, और नुकसान का कुछ जोखिम रहता है।'],
      ['🎯', 'Short-term and long-term savings goals', 'छोटी और लंबी अवधि के बचत लक्ष्य', 'A short-term goal could be school fees next term. A long-term goal could be a home or retirement. Give each goal an amount and a date.', 'छोटी अवधि का लक्ष्य अगले सत्र की स्कूल फ़ीस हो सकता है। लंबी अवधि का लक्ष्य घर या रिटायरमेंट हो सकता है। हर लक्ष्य की रकम और तारीख़ तय करें।'],
      ['🔄', 'Building a consistent saving habit', 'बचत की नियमित आदत बनाना', 'Save a fixed amount every month, even if small. Pay yourself first: move money to savings as soon as you are paid.', 'हर महीने एक तय रकम बचाएँ, भले ही छोटी हो। पहले ख़ुद को दें: कमाई मिलते ही बचत वाले खाते में डाल दें।'],
      ['⚙️', 'Automating savings', 'बचत को ऑटोमैटिक बनाना', 'Ask your bank for an auto-debit or standing instruction to your savings or recurring deposit. When saving is automatic, you do not have to remember it or resist spending.', 'बैंक से अपने बचत खाते या रेकरिंग डिपॉज़िट में ऑटो-डेबिट लगवाएँ। जब बचत अपने-आप होती है, तो न याद रखना पड़ता है न ख़र्च से बचना।'],
      ['🏦', 'Recurring deposits and fixed deposits', 'रेकरिंग डिपॉज़िट और फ़िक्स्ड डिपॉज़िट', 'An RD lets you deposit a fixed amount every month. An FD locks one lump sum for a set time. Both pay a fixed interest rate and are low risk.', 'RD में आप हर महीने तय रकम जमा करती हैं। FD में एक बड़ी रकम तय समय के लिए जमा होती है। दोनों पर तय ब्याज मिलता है और जोखिम कम होता है।'],
      ['🌾', 'Saving with a low or irregular income', 'कम या अनियमित आय में बचत', 'Start with whatever you can, even ₹20 or ₹50 a week. Save more in good months. A self-help group, where women save together, can help too.', 'जितना हो सके उससे शुरू करें, हफ़्ते में ₹20 या ₹50 भी। अच्छे महीनों में ज़्यादा बचाएँ। स्वयं सहायता समूह, जहाँ महिलाएँ मिलकर बचत करती हैं, भी मदद करता है।'],
    ],
    quiz: [
      ['"Pay yourself first" means…', ['Spend first, save what is left', 'Move money to savings as soon as you are paid', 'Pay all bills late'], 'Move money to savings as soon as you are paid'],
      ['A recurring deposit (RD) is…', ['A loan from the bank', 'One lump sum locked for years', 'A fixed amount deposited every month'], 'A fixed amount deposited every month'],
      ['Compared with saving, investing usually carries…', ['Some risk of loss', 'A guaranteed profit', 'No risk at all'], 'Some risk of loss'],
    ],
  },
  {
    id: 6, level: 2, min: 6,
    title: ['Emergency Funds and Financial Preparedness', 'इमरजेंसी फंड और आर्थिक तैयारी'],
    summary: ['Keep money aside for the unexpected so one bad month does not become a crisis.', 'अनपेक्षित के लिए पैसा अलग रखें ताकि एक बुरा महीना संकट न बन जाए।'],
    points: [
      ['🆘', 'What is an emergency fund?', 'इमरजेंसी फंड क्या है?', 'Money kept aside only for sudden needs, such as illness, a repair or losing a job. It is not for shopping or festivals.', 'यह वह पैसा है जो सिर्फ़ अचानक की ज़रूरतों के लिए रखा जाता है, जैसे बीमारी, मरम्मत या नौकरी जाना। यह ख़रीदारी या त्योहारों के लिए नहीं है।'],
      ['🧮', 'Calculating your emergency fund', 'अपना इमरजेंसी फंड तय करना', 'A common goal is 3 to 6 months of essential expenses. Add up rent, food, bills, school fees and EMIs for one month, then multiply.', 'आम लक्ष्य 3 से 6 महीने के ज़रूरी खर्च का होता है। एक महीने का किराया, खाना, बिल, स्कूल फ़ीस और EMI जोड़ें, फिर उसे गुणा करें।'],
      ['🪜', 'Building it gradually', 'इसे धीरे-धीरे बनाना', 'You do not need it all at once. Start with one week of expenses, then one month, and keep adding. Every rupee helps.', 'सब कुछ एक साथ नहीं चाहिए। एक हफ़्ते के खर्च से शुरू करें, फिर एक महीने के, और जोड़ती रहें। हर रुपया काम आता है।'],
      ['🔐', 'Where to keep emergency savings', 'इमरजेंसी बचत कहाँ रखें', 'Keep it where you can reach it quickly and safely, like a savings account or a short fixed deposit. Not in risky investments, and not tied up for years.', 'इसे ऐसी जगह रखें जहाँ से जल्दी और सुरक्षित मिल सके, जैसे बचत खाता या छोटी अवधि की FD। जोखिम वाले निवेश में नहीं, और सालों के लिए बंद भी नहीं।'],
      ['⛑️', 'Preparing for job loss, illness or emergencies', 'नौकरी जाने, बीमारी या आपात स्थिति की तैयारी', 'Know in advance what you would do: which costs you could cut, who you could ask for help, and which health insurance or schemes you can use.', 'पहले से सोच रखें कि क्या करेंगी: कौन से खर्च घटा सकती हैं, किससे मदद माँग सकती हैं, और कौन सा स्वास्थ्य बीमा या योजना इस्तेमाल कर सकती हैं।'],
      ['🗺️', 'Creating a personal financial safety plan', 'अपनी आर्थिक सुरक्षा योजना बनाना', 'Write down your emergency fund goal, your insurance, important phone numbers and where your documents are kept. Share the plan with someone you trust.', 'अपना इमरजेंसी फंड लक्ष्य, बीमा, ज़रूरी फ़ोन नंबर और दस्तावेज़ों की जगह लिख लें। यह योजना किसी भरोसेमंद व्यक्ति को बताएँ।'],
    ],
    quiz: [
      ['An emergency fund is for…', ['Festival shopping', 'Sudden needs like illness', 'Buying gold'], 'Sudden needs like illness'],
      ['A common emergency fund goal is…', ['3 to 6 months of essential expenses', 'One day of expenses', 'Ten years of expenses'], '3 to 6 months of essential expenses'],
      ['Emergency savings are best kept…', ['In risky investments', 'Locked away for 10 years', 'Somewhere safe you can reach quickly'], 'Somewhere safe you can reach quickly'],
    ],
  },
  {
    id: 7, level: 2, min: 7,
    title: ['Understanding Loans and Borrowing', 'लोन और उधार को समझना'],
    summary: ['How loans work, what they really cost, and how to avoid loan traps.', 'लोन कैसे काम करते हैं, उनकी असली कीमत क्या है, और लोन के जाल से कैसे बचें।'],
    points: [
      ['🤝', 'What is a loan?', 'लोन क्या है?', 'A loan is money you borrow and agree to repay, with interest, usually in instalments by a set date.', 'लोन वह पैसा है जो आप उधार लेती हैं और ब्याज सहित, आम तौर पर किस्तों में, तय तारीख़ तक चुकाने का वादा करती हैं।'],
      ['🔒', 'Secured vs. unsecured loans', 'सिक्योर्ड बनाम अनसिक्योर्ड लोन', 'A secured loan is backed by something you own, like gold or a house. An unsecured loan is not, so the interest is usually higher.', 'सिक्योर्ड लोन के पीछे आपकी कोई चीज़ गिरवी होती है, जैसे सोना या घर। अनसिक्योर्ड लोन में ऐसा नहीं होता, इसलिए ब्याज आम तौर पर ज़्यादा होता है।'],
      ['🏠', 'Personal, education, home and gold loans', 'पर्सनल, एजुकेशन, होम और गोल्ड लोन', 'Each loan has its own purpose and terms. Education and home loans usually cost less. Personal loans cost more. Gold loans use your jewellery as security.', 'हर लोन का अपना मक़सद और शर्तें होती हैं। एजुकेशन और होम लोन आम तौर पर सस्ते होते हैं। पर्सनल लोन महँगा होता है। गोल्ड लोन में आपके गहने गिरवी रहते हैं।'],
      ['🧾', 'Principal, interest and EMIs', 'मूलधन, ब्याज और EMI', 'The principal is the amount you borrow. Interest is the cost of borrowing. An EMI is the fixed monthly payment that covers both.', 'मूलधन वह रकम है जो आप उधार लेती हैं। ब्याज उधार की कीमत है। EMI वह तय मासिक किस्त है जिसमें दोनों शामिल होते हैं।'],
      ['📈', 'Simple vs. compound interest', 'साधारण बनाम चक्रवृद्धि ब्याज', 'Simple interest is charged only on the original amount. Compound interest is charged on the amount plus earlier interest, so it grows faster.', 'साधारण ब्याज सिर्फ़ मूल रकम पर लगता है। चक्रवृद्धि ब्याज रकम और पिछले ब्याज, दोनों पर लगता है, इसलिए यह तेज़ी से बढ़ता है।'],
      ['✅', 'Loan eligibility and repayment', 'लोन की पात्रता और चुकाना', 'Lenders look at your income, current loans and credit history. Borrow only what your monthly income can comfortably repay, because missed EMIs add charges and hurt your credit score.', 'देने वाले आपकी आय, मौजूदा लोन और क्रेडिट हिस्ट्री देखते हैं। उतना ही उधार लें जितना आपकी मासिक आय आराम से चुका सके, क्योंकि EMI चूकने पर शुल्क लगता है और क्रेडिट स्कोर गिरता है।'],
      ['🚫', 'Predatory lending and loan traps', 'शोषण करने वाला उधार और लोन के जाल', 'Beware of instant loan apps, very high interest, hidden fees and lenders who threaten or shame you. Borrow from banks, registered lenders or your self-help group.', 'तुरंत लोन देने वाले ऐप, बहुत ऊँचे ब्याज, छिपे शुल्क और धमकाने या शर्मिंदा करने वाले देनदारों से सावधान रहें। बैंक, पंजीकृत संस्थाओं या अपने स्वयं सहायता समूह से ही उधार लें।'],
    ],
    quiz: [
      ['An EMI is…', ['A fixed monthly payment on a loan', 'A kind of bank account', 'A government scheme'], 'A fixed monthly payment on a loan'],
      ['Which usually has higher interest?', ['A home loan', 'An unsecured personal loan', 'An education loan'], 'An unsecured personal loan'],
      ['A good sign you should walk away from a lender is…', ['They explain all charges clearly', 'They are registered and have an office', 'They threaten or shame you'], 'They threaten or shame you'],
    ],
  },
  {
    id: 8, level: 2, min: 7,
    title: ['Credit Scores and Credit Management', 'क्रेडिट स्कोर और क्रेडिट का प्रबंधन'],
    summary: ['What a credit score is, how credit cards work, and how to build a healthy record.', 'क्रेडिट स्कोर क्या है, क्रेडिट कार्ड कैसे काम करते हैं, और अच्छा रिकॉर्ड कैसे बनाएँ।'],
    points: [
      ['📊', 'What is a credit score?', 'क्रेडिट स्कोर क्या है?', 'A three-digit number, usually 300 to 900, showing how reliably you repay. A higher score helps you get loans at lower interest.', 'तीन अंकों की संख्या, आम तौर पर 300 से 900 के बीच, जो बताती है कि आप कितनी भरोसेमंदी से चुकाती हैं। ऊँचे स्कोर पर कम ब्याज पर लोन मिलना आसान होता है।'],
      ['🧠', 'How credit scores are calculated', 'क्रेडिट स्कोर कैसे बनता है', 'Mainly by whether you pay on time, how much of your credit limit you use, how long you have had credit, and how often you apply for new loans.', 'मुख्य रूप से इससे कि आप समय पर चुकाती हैं या नहीं, अपनी क्रेडिट सीमा का कितना इस्तेमाल करती हैं, कितने समय से क्रेडिट है, और कितनी बार नए लोन माँगती हैं।'],
      ['📃', 'Understanding credit reports', 'क्रेडिट रिपोर्ट को समझना', 'A credit report lists your loans, cards and payments. You can get a free report from each credit bureau once a year. Check it for mistakes.', 'क्रेडिट रिपोर्ट में आपके लोन, कार्ड और भुगतान लिखे होते हैं। हर क्रेडिट ब्यूरो से साल में एक बार मुफ़्त रिपोर्ट मिल सकती है। उसमें गलतियाँ जाँचें।'],
      ['💳', 'Credit cards and how they work', 'क्रेडिट कार्ड और वे कैसे काम करते हैं', "A credit card lets you spend the bank's money now and pay later. It is a loan, not extra income.", 'क्रेडिट कार्ड से आप बैंक का पैसा अभी ख़र्च करती हैं और बाद में चुकाती हैं। यह लोन है, अतिरिक्त आय नहीं।'],
      ['🗓️', 'Billing cycles and interest', 'बिलिंग साइकिल और ब्याज', 'Pay the full bill by the due date and you pay no interest. Pay only the minimum and interest is charged on the rest, at a high rate.', 'पूरा बिल देय तारीख़ तक भर दें तो कोई ब्याज नहीं लगता। सिर्फ़ न्यूनतम राशि भरें तो बाकी पर ऊँचा ब्याज लगता है।'],
      ['📉', 'Credit utilisation and timely repayment', 'क्रेडिट उपयोग और समय पर भुगतान', 'Try to use less than about 30% of your credit limit and always pay on time. Late payments lower your score.', 'अपनी क्रेडिट सीमा का लगभग 30% से कम इस्तेमाल करने की कोशिश करें और हमेशा समय पर चुकाएँ। देर से भुगतान स्कोर घटाता है।'],
      ['🌱', 'Building a healthy credit history', 'अच्छी क्रेडिट हिस्ट्री बनाना', 'Repay on time, keep old accounts in good standing, borrow only what you need, and check your report once a year.', 'समय पर चुकाएँ, पुराने खाते ठीक रखें, उतना ही उधार लें जितनी ज़रूरत हो, और साल में एक बार अपनी रिपोर्ट देखें।'],
    ],
    quiz: [
      ['If you pay your whole credit card bill by the due date…', ['You pay no interest', 'You pay double interest', 'Your score drops'], 'You pay no interest'],
      ['A credit score usually ranges from…', ['0 to 10', '300 to 900', '1000 to 5000'], '300 to 900'],
      ['What helps your credit score most?', ['Paying on time', 'Missing a few EMIs', 'Maxing out your card'], 'Paying on time'],
    ],
  },
];
