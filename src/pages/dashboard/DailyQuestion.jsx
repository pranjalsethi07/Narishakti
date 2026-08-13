import React, { useState } from 'react';
import { Volume2, Trophy, Flame, CheckCircle2, XCircle } from 'lucide-react';

const DailyQuestion = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const questionData = {
    category: "Financial Literacy",
    question: "Sabse surakshit jagah apne paise bachane ke liye kaunsi hai?",
    questionEn: "What is the safest place to save your money?",
    options: [
      { id: 'a', text: 'Ghar mein (At home)' },
      { id: 'b', text: 'Bank khate mein (In a bank account)', isCorrect: true },
      { id: 'c', text: 'Dosto ke paas (With friends)' },
      { id: 'd', text: 'Sone mein (In gold only)' }
    ]
  };

  const handleSelect = (option) => {
    if (selectedAnswer) return; // prevent multiple clicks
    setSelectedAnswer(option.id);
    setIsCorrect(option.isCorrect);
  };

  return (
    <div className="fade-in" style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 className="h2" style={{color: 'var(--text-dark)'}}>Aaj Ka Sawaal</h1>
          <p className="subtext">Daily Quiz to test your knowledge</p>
        </div>
        <div style={styles.streakBox}>
          <Flame color="#dd6b20" size={24} />
          <span style={styles.streakText}>5 Day Streak!</span>
        </div>
      </header>

      <div style={styles.quizCard} className="hover-card">
        <div style={styles.categoryBadge}>{questionData.category}</div>
        
        <div style={styles.questionSection}>
          <button style={styles.playBtn} className="mic-pulse">
            <Volume2 size={24} color="#fff" />
          </button>
          <div>
            <h2 className="h2" style={{fontSize: '1.5rem', marginBottom: '8px'}}>{questionData.question}</h2>
            <p className="subtext">{questionData.questionEn}</p>
          </div>
        </div>

        <div style={styles.optionsGrid}>
          {questionData.options.map(opt => {
            let bgColor = 'var(--surface)';
            let borderColor = 'var(--border-color)';
            
            if (selectedAnswer === opt.id) {
              if (opt.isCorrect) {
                bgColor = '#f0fff4';
                borderColor = 'var(--success)';
              } else {
                bgColor = '#fff5f5';
                borderColor = 'var(--danger)';
              }
            } else if (selectedAnswer && opt.isCorrect) {
              // highlight correct if they got it wrong
              bgColor = '#f0fff4';
              borderColor = 'var(--success)';
            }

            return (
              <button 
                key={opt.id}
                style={{
                  ...styles.optionBtn, 
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                  cursor: selectedAnswer ? 'default' : 'pointer'
                }}
                onClick={() => handleSelect(opt)}
                disabled={!!selectedAnswer}
              >
                <div style={styles.optionContent}>
                  <span style={styles.optionLetter}>{opt.id.toUpperCase()}</span>
                  <span style={styles.optionText}>{opt.text}</span>
                </div>
                {selectedAnswer && opt.isCorrect && <CheckCircle2 color="var(--success)" />}
                {selectedAnswer === opt.id && !opt.isCorrect && <XCircle color="var(--danger)" />}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div style={{...styles.feedbackBox, backgroundColor: isCorrect ? '#f0fff4' : '#fff5f5'}}>
            <h3 style={{color: isCorrect ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px'}}>
              {isCorrect ? <Trophy /> : null}
              {isCorrect ? 'Bilkul Sahi! (Correct!)' : 'Galat Jawab (Incorrect)'}
            </h3>
            <p style={{marginTop: '8px'}}>
              Bank account deposits are regulated and insured, making them the safest place for savings while earning interest.
            </p>
            <button className="btn btn-primary" style={{marginTop: '16px'}}>
              Claim 10 Coins
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  streakBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#feebc8',
    borderRadius: 'var(--radius-full)',
    border: '2px solid #fbd38d',
  },
  streakText: {
    fontWeight: '700',
    color: '#dd6b20',
    fontSize: '1.1rem'
  },
  quizCard: {
    backgroundColor: 'var(--surface)',
    padding: '32px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-color)',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-dark)',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '24px'
  },
  questionSection: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
    marginBottom: '32px'
  },
  playBtn: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  optionsGrid: {
    display: 'grid',
    gap: '16px',
  },
  optionBtn: {
    width: '100%',
    padding: '20px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  optionContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  optionLetter: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: 'var(--text-muted)'
  },
  optionText: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: 'var(--text-dark)'
  },
  feedbackBox: {
    marginTop: '32px',
    padding: '24px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    animation: 'fadeIn 0.5s ease'
  }
};

export default DailyQuestion;
