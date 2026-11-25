import React, { useState } from 'react';
import { saveTestResult } from '../../utils/testResults';
import { ShieldCheck, Target, Award, ArrowRight, RefreshCcw, CheckCircle2 } from 'lucide-react';

const TestKnowledge = () => {
  const [activeTest, setActiveTest] = useState(null); // 'health' or 'finance' or null
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const testBanks = {
    health: [
      { 
        q: "What is the normal menstrual cycle length approximately?", 
        options: [
          { text: "10 days", explanation: "❌ A normal cycle is longer. Most cycles are around 28 days, ranging from 21 to 35 days." },
          { text: "28 days", explanation: "✓ Correct! A typical menstrual cycle is about 28 days, but can range from 21 to 35 days. This includes menstruation, ovulation, and hormonal changes." },
          { text: "50 days", explanation: "❌ A cycle lasting 50 days would be irregular. Consult a doctor if your cycle is much longer than 35 days." },
          { text: "5 days", explanation: "❌ 5 days is too short for a full cycle. The menstruation period alone can last 3-7 days, but the entire cycle is much longer." }
        ], 
        answer: "28 days" 
      },
      { 
        q: "How often should you ideally change a sanitary pad?", 
        options: [
          { text: "Every 4-6 hours", explanation: "✓ Correct! Changing pads every 4-6 hours prevents bacterial growth, odor, and infections. More frequently if flow is heavy." },
          { text: "Every 24 hours", explanation: "❌ Changing only once daily is not hygienic and increases infection risk. Pads need to be changed more frequently." },
          { text: "Only when fully soaked", explanation: "❌ Waiting too long allows bacteria to multiply, causing infections. Change regularly, not just when overflowing." },
          { text: "Once a day", explanation: "❌ This is insufficient. You should change pads every 4-6 hours for proper hygiene and health." }
        ], 
        answer: "Every 4-6 hours" 
      },
      { 
        q: "Which organ produces the female egg?", 
        options: [
          { text: "Uterus", explanation: "❌ Uterus is where the fertilized egg grows into a baby, not where eggs are produced." },
          { text: "Kidney", explanation: "❌ Kidneys filter waste. They have no role in egg production." },
          { text: "Ovary", explanation: "✓ Correct! Ovaries are almond-shaped glands that release eggs during ovulation (monthly cycle)." },
          { text: "Stomach", explanation: "❌ The stomach digests food. Egg production happens in the ovaries, not the stomach." }
        ], 
        answer: "Ovary" 
      },
      { 
        q: "Are mood swings during periods biologically normal?", 
        options: [
          { text: "Yes, due to hormones", explanation: "✓ Correct! Hormonal fluctuations (estrogen & progesterone) during periods cause mood changes, anxiety, and irritability. This is PMS." },
          { text: "No, it is a sickness", explanation: "❌ Mood swings during periods are perfectly normal due to hormonal changes, not a sickness." },
          { text: "Only if you have an infection", explanation: "❌ Mood swings happen due to hormones, not infections. Infections cause different symptoms." },
          { text: "Yes, due to weather", explanation: "❌ While weather can affect mood, period mood swings are primarily due to hormonal changes." }
        ], 
        answer: "Yes, due to hormones" 
      },
      { 
        q: "Is taking a bath safe during menstruation?", 
        options: [
          { text: "No, it stops bleeding", explanation: "❌ This is a myth! Bathing doesn't stop menstruation. Warm water may actually help with cramps." },
          { text: "Yes, hygiene is critical", explanation: "✓ Correct! Bathing or showering during periods is important for hygiene. Warm water even helps ease cramps." },
          { text: "Only with cold water", explanation: "❌ Cold water during periods is uncomfortable. Warm water is actually better for relieving cramps." },
          { text: "Never", explanation: "❌ This is false. Regular hygiene during periods is essential to prevent infections." }
        ], 
        answer: "Yes, hygiene is critical" 
      }
    ],
    finance: [
      { 
        q: "What does UPI stand for?", 
        options: [
          { text: "Unknown Payment Index", explanation: "❌ This is not correct. UPI is regulated by the Reserve Bank of India." },
          { text: "Unified Payments Interface", explanation: "✓ Correct! UPI is a digital payment system in India that allows instant money transfer between bank accounts using just a mobile app." },
          { text: "User Personal ID", explanation: "❌ This isn't what UPI stands for. UPI is a payment system, not an identification system." },
          { text: "Universal Process Info", explanation: "❌ Incorrect. UPI is specifically for payments, developed by the National Payments Corporation of India." }
        ], 
        answer: "Unified Payments Interface" 
      },
      { 
        q: "Is it safe to share your bank OTP with a stranger?", 
        options: [
          { text: "Yes, for verification", explanation: "❌ NEVER share your OTP! Banks will never ask for it. Sharing OTP is how hackers steal money." },
          { text: "Never", explanation: "✓ Correct! Never share OTPs, passwords, or PIN with anyone. The bank will never ask for these. It's the fastest way to lose money to fraud." },
          { text: "Only if they claim to be from bank", explanation: "❌ Scammers often pretend to be from the bank. Never share OTP with anyone claiming to be from the bank." },
          { text: "Yes, on phone only", explanation: "❌ Never share OTP anywhere, whether on phone or in person. OTP is your security—keep it private." }
        ], 
        answer: "Never" 
      },
      { 
        q: "What is the primary benefit of a Fixed Deposit (FD)?", 
        options: [
          { text: "High risk", explanation: "❌ FDs are actually low-risk. They offer guaranteed returns with minimal risk." },
          { text: "Guaranteed returns & safety", explanation: "✓ Correct! FDs offer fixed interest rates and capital safety. Your money grows predictably." },
          { text: "Double the money in 1 month", explanation: "❌ This is unrealistic. FDs provide steady, safe returns, not overnight wealth." },
          { text: "Tax evasion", explanation: "❌ FDs are taxable income. Never use investments for tax evasion—it's illegal." }
        ], 
        answer: "Guaranteed returns & safety" 
      },
      { 
        q: "Why is saving money important?", 
        options: [
          { text: "Financial security", explanation: "✓ Correct! Savings provide emergency funds, reduce stress, and help you achieve goals like education, home, or retirement." },
          { text: "To hide it", explanation: "❌ Money should be in banks for safety and growth, not hidden anywhere." },
          { text: "Because banks demand it", explanation: "❌ You save for yourself, not because banks demand it. It's YOUR financial future." },
          { text: "To pay hackers", explanation: "❌ Savings are for your security and goals, never for paying anyone. Stay alert for scams." }
        ], 
        answer: "Financial security" 
      },
      { 
        q: "Can you get a loan without collateral under certain Gov schemes?", 
        options: [
          { text: "No, never", explanation: "❌ Actually, yes! Government schemes like PM MUDRA allow loans without traditional collateral." },
          { text: "Yes, like PM MUDRA Yojana", explanation: "✓ Correct! PM MUDRA Yojana offers loans up to ₹10 lakhs to small business owners without collateral. Perfect for startups!" },
          { text: "Only if you are rich", explanation: "❌ These schemes are specifically for poor and middle-class people to start businesses." },
          { text: "Only for buying cars", explanation: "❌ MUDRA loans are for small businesses, not car loans." }
        ], 
        answer: "Yes, like PM MUDRA Yojana" 
      }
    ]
  };

  const handleStartTest = (topic) => {
    setActiveTest(topic);
    setCurrentQuestion(0);
    setScore(0);
    setTestFinished(false);
    setSelectedOption(null);
  };

  const handleAnswer = (optionText) => {
    setSelectedOption(optionText);
    
    const correct = testBanks[activeTest][currentQuestion].answer === optionText;
    if (correct) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestion < testBanks[activeTest].length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        saveTestResult(activeTest, score + (correct ? 1 : 0), testBanks[activeTest].length);
        setTestFinished(true);
      }
    }, 2000);
  };

  const returnHome = () => {
    setActiveTest(null);
  };

  if (activeTest && !testFinished) {
    const questions = testBanks[activeTest];
    const q = questions[currentQuestion];
    const progressPerc = ((currentQuestion) / questions.length) * 100;

    return (
      <div className="fade-in" style={styles.testContainer}>
        <div style={styles.progressBarBg}>
          <div style={{...styles.progressBarFill, width: `${progressPerc}%`}}></div>
        </div>

        <div style={styles.testHeader}>
          <h2 className="h3">Question {currentQuestion + 1} of {questions.length}</h2>
          <span style={styles.scoreBadge}>Score: {score}</span>
        </div>

        <div style={styles.quizCard}>
          <h1 style={{fontSize: '1.4rem', marginBottom: '32px', lineHeight: 1.5, color: 'var(--text-dark)'}}>{q.q}</h1>

          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {q.options.map((opt, i) => {
              let bgColor = 'var(--surface)';
              let borderColor = 'var(--border-color)';
              
              if (selectedOption) {
                if (opt.text === q.answer) {
                  bgColor = '#f0fff4'; borderColor = 'var(--success)';
                } else if (opt.text === selectedOption) {
                  bgColor = '#fff5f5'; borderColor = 'var(--danger)';
                }
              }

              return (
                <div key={i}>
                  <button 
                    style={{...styles.optionBtn, backgroundColor: bgColor, borderColor: borderColor, width: '100%', justifyContent: 'space-between'}}
                    onClick={() => handleAnswer(opt.text)}
                    disabled={!!selectedOption}
                  >
                    <span>{opt.text}</span>
                    {selectedOption && opt.text === q.answer && <CheckCircle2 color="var(--success)" size={20}/>}
                  </button>
                  {selectedOption && (opt.text === selectedOption || opt.text === q.answer) && (
                    <div style={{...styles.explanationBox, borderColor: opt.text === q.answer ? 'var(--success)' : 'var(--danger)', backgroundColor: opt.text === q.answer ? '#f0fff4' : '#fff5f5'}}>
                      <p style={{margin: 0, fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: 1.5}}>{opt.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (testFinished) {
    const isPerfect = score === testBanks[activeTest].length;
    
    return (
      <div className="fade-in" style={styles.resultContainer}>
        <div style={styles.resultCard}>
          {isPerfect ? (
            <div style={styles.perfectBadge}>
              <Award size={64} color="#dd6b20" />
            </div>
          ) : (
            <div style={styles.goodBadge}>
              <Target size={64} color="var(--primary)" />
            </div>
          )}

          <h1 style={{fontSize: '2rem', marginBottom: '8px', color: 'var(--text-dark)'}}>
            {isPerfect ? 'Perfect Score!' : 'Test Completed!'}
          </h1>
          <p style={{fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '32px'}}>
            You answered {score} out of {testBanks[activeTest].length} correctly.
          </p>

          {isPerfect && (
            <div style={styles.achievementBox}>
              <h3 style={{color: '#dd6b20', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                 <ShieldCheck /> NariShakti Master Badge Unlocked!
              </h3>
              <p className="subtext">You have shown excellent knowledge in {activeTest === 'health' ? 'Health & Wellness' : 'Financial Literacy'}.</p>
            </div>
          )}

          <div style={styles.actions}>
            <button className="btn btn-primary" onClick={returnHome}>
              Take Another Test
            </button>
            {!isPerfect && (
              <button className="btn btn-outline" onClick={() => handleStartTest(activeTest)}>
                <RefreshCcw size={16} /> Retry Test
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <header style={{marginBottom: '40px'}}>
        <h1 className="h2" style={{color: 'var(--text-dark)'}}>Test Your Knowledge</h1>
        <p className="subtext">Select a category to challenge yourself and earn badges</p>
      </header>

      <div style={styles.selectionGrid}>
        <div style={styles.categoryCard} className="hover-card" onClick={() => handleStartTest('health')}>
          <div style={{...styles.iconCircle, backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)'}}>
            <ShieldCheck size={40} />
          </div>
          <h2 style={{fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-dark)'}}>Health & Wellness</h2>
          <p className="subtext" style={{marginBottom: '24px'}}>5 questions covering menstruation, anatomy, hygiene, and pregnancy.</p>
          <button className="btn btn-primary" style={{width: '100%', backgroundColor: 'var(--secondary)', border: 'none'}}>
            Start Health Test <ArrowRight size={18} />
          </button>
        </div>

        <div style={styles.categoryCard} className="hover-card" onClick={() => handleStartTest('finance')}>
          <div style={{...styles.iconCircle, backgroundColor: 'var(--primary-light)', color: 'var(--primary)'}}>
            <Target size={40} />
          </div>
          <h2 style={{fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-dark)'}}>Financial Literacy</h2>
          <p className="subtext" style={{marginBottom: '24px'}}>5 questions covering banking, savings, UPI, and fraud awareness.</p>
          <button className="btn btn-primary" style={{width: '100%', border: 'none'}}>
            Start Finance Test <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  selectionGrid: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
  },
  categoryCard: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: 'var(--surface)',
    padding: '40px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px'
  },
  
  // Active Test Styles
  testContainer: {
    maxWidth: 'none',
    margin: '0 auto',
    paddingTop: '20px'
  },
  progressBarBg: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--border-color)',
    borderRadius: 'var(--radius-full)',
    marginBottom: '24px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'var(--primary)',
    transition: 'width 0.3s ease'
  },
  testHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  scoreBadge: {
    padding: '6px 16px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-dark)',
    fontWeight: 'bold',
    borderRadius: 'var(--radius-full)'
  },
  quizCard: {
    backgroundColor: 'var(--surface)',
    padding: '40px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-color)'
  },
  optionBtn: {
    width: '100%',
    padding: '20px 24px',
    textAlign: 'left',
    borderRadius: 'var(--radius-md)',
    border: '2px solid',
    fontSize: '1.1rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    color: 'var(--text-dark)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  explanationBox: {
    marginTop: '12px',
    padding: '16px 20px',
    borderRadius: 'var(--radius-md)',
    borderLeft: '4px solid',
    backgroundColor: '#f0fff4',
    animation: 'slideDown 0.3s ease'
  },

  // Final Result
  resultContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh'
  },
  resultCard: {
    backgroundColor: 'var(--surface)',
    padding: '48px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid var(--border-color)'
  },
  perfectBadge: {
    width: '100px',
    height: '100px',
    backgroundColor: '#feebc8',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #dd6b20',
    marginBottom: '24px'
  },
  goodBadge: {
    width: '100px',
    height: '100px',
    backgroundColor: 'var(--primary-light)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px'
  },
  achievementBox: {
    backgroundColor: '#fffaf0',
    padding: '20px',
    borderRadius: 'var(--radius-md)',
    border: '1px dashed #dd6b20',
    width: '100%',
    marginBottom: '32px'
  },
  actions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    width: '100%'
  }
};

export default TestKnowledge;
