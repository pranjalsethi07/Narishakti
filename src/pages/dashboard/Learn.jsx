import React, { useState } from 'react';
import { PlayCircle, CheckCircle, Circle, ArrowRight, ArrowLeft, Coins, Trophy, ExternalLink } from 'lucide-react';
import { getRecommendedCategory, getStoredLearnProgress } from '../../utils/learningProgress';

const modulesData = {
  health: [
    {
      id: 1,
      title: "Basic Female Anatomy",
      explanation: "Female body mein uterus, ovaries aur fallopian tubes hote hain jo reproduction aur periods ke liye important hote hain.",
      video: "https://www.youtube.com/watch?v=RFDatCchpus",
      duration: "5 min",
      quiz: [
        { question: "Uterus ka kya kaam hai?", options: ["Digestion", "Pregnancy support", "Breathing"], answer: "Pregnancy support" },
        { question: "Ovaries kya karti hain?", options: ["Egg release", "Blood pump", "Breathing"], answer: "Egg release" },
        { question: "Fallopian tube ka role kya hai?", options: ["Egg transport", "Food digestion"], answer: "Egg transport" },
        { question: "Female reproductive system ka main kaam kya hai?", options: ["Movement", "Reproduction"], answer: "Reproduction" },
        { question: "Egg kaha banta hai?", options: ["Heart", "Ovary"], answer: "Ovary" }
      ]
    },
    {
      id: 2,
      title: "Menstruation Basics",
      explanation: "Periods ek natural process hai jisme uterus ki lining har mahine shed hoti hai.",
      video: "https://www.youtube.com/watch?v=ayzN5f3qN8g",
      duration: "6 min",
      quiz: [
        { question: "Periods kitne din chal sakte hain?", options: ["3-7 days", "1 day"], answer: "3-7 days" },
        { question: "Periods kya hai?", options: ["Disease", "Natural process"], answer: "Natural process" },
        { question: "Cycle kitne din ka hota hai?", options: ["28 days approx", "10 days"], answer: "28 days approx" },
        { question: "Periods kis age me start hote hain?", options: ["10-15 years", "30 years"], answer: "10-15 years" },
        { question: "Periods dangerous hote hain?", options: ["Yes", "No"], answer: "No" }
      ]
    },
    {
      id: 3,
      title: "Menstrual Hygiene",
      explanation: "Hygiene maintain karna infection se bachata hai.",
      video: "https://www.youtube.com/watch?v=R6lq9nYdF4Y",
      duration: "7 min",
      quiz: [
        { question: "Pad kab change karna chahiye?", options: ["4-6 hours", "12 hours"], answer: "4-6 hours" },
        { question: "Dirty pad se kya ho sakta hai?", options: ["Infection", "Nothing"], answer: "Infection" },
        { question: "Cloth use safe hai?", options: ["Yes if clean", "Always unsafe"], answer: "Yes if clean" },
        { question: "Hygiene kyun important hai?", options: ["Health safety", "Fashion"], answer: "Health safety" },
        { question: "Reusable pad ka use?", options: ["Possible", "Not possible"], answer: "Possible" }
      ]
    },
    {
      id: 4,
      title: "Hormones & Mood",
      explanation: "Hormones body ke chemical messengers hote hain jo mood aur periods ko affect karte hain.",
      video: "https://www.youtube.com/watch?v=3c7qzG5PZ1Y",
      duration: "6 min",
      quiz: [
        { question: "Hormones kya hote hain?", options: ["Chemicals", "Organs"], answer: "Chemicals" },
        { question: "Mood swings kis wajah se hote hain?", options: ["Hormones", "Weather"], answer: "Hormones" },
        { question: "Periods ke time mood change normal hai?", options: ["Yes", "No"], answer: "Yes" },
        { question: "Hormones body ko control karte hain?", options: ["Yes", "No"], answer: "Yes" },
        { question: "Hormones kaha bante hain?", options: ["Glands", "Bones"], answer: "Glands" }
      ]
    },
    {
      id: 5,
      title: "Pregnancy Basics",
      explanation: "Pregnancy tab hoti hai jab fertilized egg uterus me develop karta hai.",
      video: "https://www.youtube.com/watch?v=3r5Yp7W7s3M",
      duration: "8 min",
      quiz: [
        { question: "Pregnancy kaise hoti hai?", options: ["Egg fertilization", "Exercise"], answer: "Egg fertilization" },
        { question: "Pregnancy kitne months hoti hai?", options: ["9 months", "3 months"], answer: "9 months" },
        { question: "Healthy diet zaruri hai?", options: ["Yes", "No"], answer: "Yes" },
        { question: "Doctor visit important hai?", options: ["Yes", "No"], answer: "Yes" },
        { question: "Smoking safe hai pregnancy me?", options: ["No", "Yes"], answer: "No" }
      ]
    },
    {
      id: 6,
      title: "Health Myths",
      explanation: "Bahut si beliefs galat hoti hain jo health ko affect karti hain.",
      video: "https://www.youtube.com/watch?v=3r5Yp7W7s3M",
      duration: "5 min",
      quiz: [
        { question: "Periods me exercise safe hai?", options: ["Yes", "No"], answer: "Yes" },
        { question: "Cold food harmful hai periods me?", options: ["No", "Yes"], answer: "No" },
        { question: "Myths hamesha sahi hote hain?", options: ["No", "Yes"], answer: "No" },
        { question: "Scientific info important hai?", options: ["Yes", "No"], answer: "Yes" },
        { question: "Periods disease hai?", options: ["No", "Yes"], answer: "No" }
      ]
    }
  ],
  finance: [
    {
      id: 1,
      title: "Bank Account Basics",
      explanation: "Bank account ek safe jagah hai paisa rakhne ke liye.",
      video: "https://www.youtube.com/watch?v=2v9yW8Pz9WQ",
      duration: "5 min",
      quiz: [
        { question: "Bank account ka use?", options: ["Store money", "Cooking"], answer: "Store money" },
        { question: "Account safe hota hai?", options: ["Yes", "No"], answer: "Yes" },
        { question: "Bank kaha hota hai?", options: ["Financial institution", "School"], answer: "Financial institution" },
        { question: "Account ka owner kaun?", options: ["User", "Bank"], answer: "User" },
        { question: "Account ka fayda?", options: ["Security", "Loss"], answer: "Security" }
      ]
    },
    {
      id: 2,
      title: "UPI & Digital Payments",
      explanation: "UPI se instant paise transfer kiye ja sakte hain.",
      video: "https://www.youtube.com/watch?v=0f9Gzj5uFqk",
      duration: "6 min",
      quiz: [
        { question: "UPI ka full form?", options: ["Unified Payments Interface", "User Payment Info"], answer: "Unified Payments Interface" },
        { question: "UPI ka use?", options: ["Money transfer", "Calling"], answer: "Money transfer" },
        { question: "PIN share safe hai?", options: ["No", "Yes"], answer: "No" },
        { question: "UPI fast hai?", options: ["Yes", "No"], answer: "Yes" },
        { question: "UPI app example?", options: ["GPay", "Instagram"], answer: "GPay" }
      ]
    },
    {
      id: 3,
      title: "Saving Money",
      explanation: "Saving future ke liye important hai.",
      video: "https://www.youtube.com/watch?v=Kz7e9tZ9Y2Y",
      duration: "7 min",
      quiz: [
        { question: "Saving kyun zaruri hai?", options: ["Future security", "Fun"], answer: "Future security" },
        { question: "Har month save karna chahiye?", options: ["Yes", "No"], answer: "Yes" },
        { question: "Saving kaha rakhe?", options: ["Bank", "Road"], answer: "Bank" },
        { question: "Emergency fund kya hai?", options: ["Savings", "Loan"], answer: "Savings" },
        { question: "Saving habit kab start kare?", options: ["Early", "Late"], answer: "Early" }
      ]
    },
    {
      id: 4,
      title: "Fixed Deposit (FD)",
      explanation: "FD ek safe investment hai jisme interest milta hai.",
      video: "https://www.youtube.com/watch?v=Vnq2sJp4f7g",
      duration: "5 min",
      quiz: [
        { question: "FD safe hai?", options: ["Yes", "No"], answer: "Yes" },
        { question: "FD me paisa lock hota hai?", options: ["Yes", "No"], answer: "Yes" },
        { question: "Interest milta hai?", options: ["Yes", "No"], answer: "Yes" },
        { question: "FD risky hai?", options: ["No", "Yes"], answer: "No" },
        { question: "FD bank me hota hai?", options: ["Yes", "No"], answer: "Yes" }
      ]
    },
    {
      id: 5,
      title: "Fraud Awareness",
      explanation: "Scams se bachne ke liye awareness zaruri hai.",
      video: "https://www.youtube.com/watch?v=6Y3lX3F3RkE",
      duration: "6 min",
      quiz: [
        { question: "OTP share karna safe hai?", options: ["No", "Yes"], answer: "No" },
        { question: "Unknown link click karna?", options: ["No", "Yes"], answer: "No" },
        { question: "Bank kabhi PIN mangta hai?", options: ["No", "Yes"], answer: "No" },
        { question: "Fraud call ka kya kare?", options: ["Ignore/report", "Share info"], answer: "Ignore/report" },
        { question: "Security important hai?", options: ["Yes", "No"], answer: "Yes" }
      ]
    }
  ]
};

const Learn = () => {
  const initialProgress = getStoredLearnProgress();
  const [activeCategory, setActiveCategory] = useState(() => getRecommendedCategory(initialProgress));
  const [selectedAge, setSelectedAge] = useState(localStorage.getItem('userAge') || '15-22');
  const [activeModule, setActiveModule] = useState(null);
  
  // Progress tracking
  const [progress, setProgress] = useState(initialProgress);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleStartModule = (mod) => {
    setActiveModule(mod);
    setCurrentQuizIndex(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsAnimatingOut(false);
  };

  const markModuleCompleted = (modId, category) => {
    const newProgress = { ...progress };
    if (!newProgress[category].includes(modId)) {
      newProgress[category] = [...newProgress[category], modId];
      localStorage.setItem('learnProgress', JSON.stringify(newProgress));
      setProgress(newProgress);
    }
  };

  const handleQuizAnswer = (option, correctAnswer) => {
    setSelectedOption(option);
    const isCorrect = option === correctAnswer;
    
    setTimeout(() => {
      if (isCorrect) {
        setIsAnimatingOut(true);
        setTimeout(() => {
          if (currentQuizIndex < activeModule.quiz.length - 1) {
            setCurrentQuizIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnimatingOut(false);
          } else {
            setQuizFinished(true);
            setEarnedCoins(50); // Give 50 coins on module finish
            markModuleCompleted(activeModule.id, activeCategory);
          }
        }, 500); // Wait for fade out
      } else {
        // Just let them try again after briefly showing wrong
        setSelectedOption(null);
      }
    }, 1000);
  };

  const closeModule = () => {
    setActiveModule(null);
  };

  const getStatusIcon = (topicId) => {
    const isCompleted = progress[activeCategory].includes(topicId);
    if (isCompleted) return <CheckCircle color="var(--success)" size={24} />;
    
    // Check if it's the very first incomplete one
    const incompleteIdx = modulesData[activeCategory].findIndex(m => !progress[activeCategory].includes(m.id));
    const currentIndex = modulesData[activeCategory].findIndex(m => m.id === topicId);
    
    if (currentIndex === incompleteIdx) {
      return <Circle color="var(--primary)" size={24} fill="var(--primary-light)" />;
    }
    return <Circle color="var(--border-color)" size={24} />;
  };

  if (activeModule) {
    if (quizFinished) {
      return (
        <div className="fade-in" style={styles.quizFinishedContainer}>
          <div style={styles.successCard}>
            <Trophy size={64} color="#f6e05e" style={{marginBottom: '24px'}} />
            <h1 style={{color: 'var(--text-dark)', marginBottom: '16px'}}>Congratulations!</h1>
            <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '24px'}}>
              You have successfully completed <strong>{activeModule.title}</strong>
            </p>
            <div style={styles.coinBadge}>
              <Coins color="#dd6b20" />
              <span style={{fontWeight: 'bold', fontSize: '1.2rem'}}>+{earnedCoins} Coins Claimed!</span>
            </div>
            
            <button className="btn btn-primary" onClick={closeModule} style={{marginTop: '32px', padding: '12px 32px'}}>
              Back to Roadmap
            </button>
          </div>
        </div>
      );
    }

    const currentQ = activeModule.quiz[currentQuizIndex];

    return (
      <div className="fade-in" style={styles.moduleContainer}>
        <button onClick={closeModule} style={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Roadmap
        </button>

        <div style={styles.moduleHeader}>
          <h1 className="h2">{activeModule.title}</h1>
          <p style={{fontSize: '1.1rem', marginTop: '12px', lineHeight: 1.6}}>{activeModule.explanation}</p>
        </div>

        <div style={styles.videoSection}>
          <a href={activeModule.video} target="_blank" rel="noreferrer" style={styles.videoCard}>
            <div style={styles.playIconBox}><PlayCircle size={48} color="#fff" /></div>
            <div style={{flex: 1}}>
              <h3 style={{marginBottom: '4px'}}>Watch Video Lesson</h3>
              <p className="subtext">Opens in YouTube</p>
            </div>
            <ExternalLink size={20} color="var(--text-muted)"/>
          </a>
        </div>

        <div style={{...styles.quizSection, opacity: isAnimatingOut ? 0 : 1, transition: 'opacity 0.4s ease'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
            <h2 className="h3">Knowledge Check</h2>
            <span style={{color: 'var(--primary)', fontWeight: '600'}}>
              Question {currentQuizIndex + 1} of {activeModule.quiz.length}
            </span>
          </div>

          <div style={styles.quizCard}>
            <h3 style={{fontSize: '1.3rem', marginBottom: '24px', lineHeight: 1.5}}>{currentQ.question}</h3>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {currentQ.options.map((opt, i) => {
                let bgColor = 'var(--surface)';
                let borderColor = 'var(--border-color)';
                if (selectedOption === opt) {
                  if (opt === currentQ.answer) {
                    bgColor = '#f0fff4'; borderColor = 'var(--success)';
                  } else {
                    bgColor = '#fff5f5'; borderColor = 'var(--danger)';
                  }
                }
                return (
                  <button 
                    key={i} 
                    style={{...styles.optionBtn, backgroundColor: bgColor, borderColor: borderColor}}
                    onClick={() => handleQuizAnswer(opt, currentQ.answer)}
                    disabled={!!selectedOption}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <h1 className="h2" style={{color: 'var(--text-dark)'}}>Step-by-Step Learning</h1>
        <div style={styles.ageSelector}>
          <span className="subtext">Your Age Group: </span>
          <select 
            value={selectedAge} 
            onChange={(e) => setSelectedAge(e.target.value)}
            style={styles.select}
          >
            <option value="10-14">10 - 14</option>
            <option value="15-22">15 - 22 (Young adult)</option>
            <option value="23-35">23 - 35 (Adult)</option>
            <option value="35+">35+ (Mature)</option>
          </select>
        </div>
      </div>

      <div style={styles.tabs}>
        <button 
          style={{...styles.tab, borderBottom: activeCategory === 'health' ? '3px solid var(--primary)' : '3px solid transparent', color: activeCategory === 'health' ? 'var(--primary-dark)' : 'var(--text-muted)'}}
          onClick={() => setActiveCategory('health')}
        >
          Health & Wellness
        </button>
        <button 
          style={{...styles.tab, borderBottom: activeCategory === 'finance' ? '3px solid var(--primary)' : '3px solid transparent', color: activeCategory === 'finance' ? 'var(--primary-dark)' : 'var(--text-muted)'}}
          onClick={() => setActiveCategory('finance')}
        >
          Financial Literacy
        </button>
      </div>

      <div style={styles.roadmap}>
        <h2 className="h3" style={{marginBottom: '24px'}}>Your personalized roadmap</h2>
        
        {modulesData[activeCategory].map((topic, index) => {
          const isCompleted = progress[activeCategory].includes(topic.id);
          const incompleteIdx = modulesData[activeCategory].findIndex(m => !progress[activeCategory].includes(m.id));
          const isCurrent = index === incompleteIdx;
          const isLocked = index > incompleteIdx && incompleteIdx !== -1;

          return (
            <div key={topic.id} style={styles.roadmapItem} className={isLocked ? '' : 'hover-card'}>
              <div style={styles.statusCol}>
                {getStatusIcon(topic.id)}
                {index < modulesData[activeCategory].length - 1 && <div style={{...styles.line, backgroundColor: isCompleted ? 'var(--primary-light)' : 'var(--border-color)'}}></div>}
              </div>
              <div style={{...styles.cardContent, opacity: isLocked ? 0.6 : 1, borderLeft: isCurrent ? '4px solid var(--primary)' : '1px solid var(--border-color)'}}>
                <div>
                  <h4 style={{fontSize: '1.1rem', marginBottom: '4px'}}>{topic.title}</h4>
                  <p className="subtext">Audio/Video lesson • {topic.duration}</p>
                </div>
                <div style={styles.actions}>
                  {isCompleted ? (
                    <button className="btn" style={{padding: '8px 16px', fontSize: '0.9rem', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 'var(--radius-full)'}} onClick={() => handleStartModule(topic)}>
                      Review
                    </button>
                  ) : (
                    <button 
                      className={isCurrent ? "btn btn-primary" : "btn btn-secondary"} 
                      style={{padding: '8px 16px', fontSize: '0.9rem'}} 
                      disabled={isLocked}
                      onClick={() => handleStartModule(topic)}
                    >
                      {isCurrent ? <><PlayCircle size={16} /> Start</> : 'Locked'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  ageSelector: { display: 'flex', alignItems: 'center', gap: '8px' },
  select: { padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface)', outline: 'none' },
  tabs: { display: 'flex', gap: '32px', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' },
  tab: { padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', backgroundColor: 'transparent', transition: 'all 0.2s' },
  roadmap: { maxWidth: '800px' },
  roadmapItem: { display: 'flex', gap: '24px', minHeight: '100px', transition: 'transform 0.2s ease' },
  statusCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px' },
  line: { width: '2px', flex: 1, margin: '8px 0', transition: 'background-color 0.3s' },
  cardContent: { flex: 1, backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  actions: { display: 'flex', gap: '12px' },
  
  // Active Module styles
  moduleContainer: { maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '24px', fontSize: '1rem' },
  moduleHeader: { backgroundColor: 'var(--primary-light)', padding: '32px', borderRadius: 'var(--radius-lg)', marginBottom: '32px', borderLeft: '6px solid var(--primary)' },
  videoSection: { marginBottom: '40px' },
  videoCard: { display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 24px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textDecoration: 'none', color: 'inherit', boxShadow: 'var(--shadow-sm)' },
  playIconBox: { width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(255,0,0,0.3)' },
  quizSection: { backgroundColor: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' },
  quizCard: { marginTop: '16px' },
  optionBtn: { width: '100%', padding: '16px 24px', textAlign: 'left', borderRadius: 'var(--radius-md)', border: '2px solid', fontSize: '1.1rem', fontWeight: '500', transition: 'all 0.2s', color: 'var(--text-dark)' },

  // Finished state
  quizFinishedContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  successCard: { backgroundColor: 'var(--surface)', padding: '48px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', textAlign: 'center', maxWidth: '500px', width: '100%', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  coinBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#feebc8', padding: '12px 24px', borderRadius: 'var(--radius-full)', border: '2px solid #fbd38d', color: '#dd6b20' }
};

export default Learn;
