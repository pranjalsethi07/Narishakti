import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Landmark, Volume2, Info, Search, HeartPulse, GraduationCap, CheckCircle } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'userProfile';
const PROFILE_DRAFT_STORAGE_KEY = 'userProfileDraft';

const incomeRank = {
  'below-1-lakh': 1,
  '1-3-lakh': 2,
  '3-6-lakh': 3,
  '6-plus-lakh': 4,
};

const getIncomeLevel = (profile) => incomeRank[profile?.familyIncomeBracket] || 99;

const isProfileReady = (profile) => {
  if (!profile) return false;

  const basicRequired =
    String(profile.fullName || '').trim() &&
    profile.ageGroup &&
    profile.maritalStatus &&
    String(profile.education || '').trim() &&
    profile.familyIncomeBracket &&
    /^\d{10}$/.test(String(profile.phoneNumber || '').trim()) &&
    String(profile.state || '').trim() &&
    String(profile.district || '').trim() &&
    String(profile.occupation || '').trim() &&
    profile.isUsingGovScheme;

  if (!basicRequired) return false;
  if (profile.isUsingGovScheme === 'yes' && !String(profile.existingSchemes || '').trim()) return false;
  return true;
};

const getEligibilityResult = (scheme, profile, lang) => {
  const unmet = [];
  const kids = Number(profile?.numberOfKids) || 0;
  const incomeLevel = getIncomeLevel(profile);

  switch (scheme.id) {
    case 1: {
      if (profile?.maritalStatus !== 'married') {
        unmet.push(lang === 'hi' ? 'वैवाहिक स्थिति विवाहित होनी चाहिए।' : 'Marital status should be married.');
      }
      if (kids > 1) {
        unmet.push(lang === 'hi' ? 'यह योजना सामान्यतः पहले बच्चे के लिए है।' : 'This scheme is generally for first child support.');
      }
      if (incomeLevel > 2) {
        unmet.push(lang === 'hi' ? 'परिवार आय सीमा अधिक है।' : 'Family income is above preferred limit.');
      }
      break;
    }
    case 2: {
      if (kids < 1) {
        unmet.push(lang === 'hi' ? 'बालिका होने पर यह योजना लागू होती है।' : 'A girl child is required for this scheme.');
      }
      if (incomeLevel > 3) {
        unmet.push(lang === 'hi' ? 'यह आय श्रेणी में प्राथमिकता कम हो सकती है।' : 'Income bracket may not be prioritized.');
      }
      break;
    }
    case 3: {
      if (profile?.maritalStatus !== 'married') {
        unmet.push(lang === 'hi' ? 'यह योजना विवाहित गर्भवती महिलाओं पर केंद्रित है।' : 'This scheme targets married pregnant women.');
      }
      if (incomeLevel > 2) {
        unmet.push(lang === 'hi' ? 'BPL या निम्न आय को प्राथमिकता दी जाती है।' : 'BPL/low-income households are prioritized.');
      }
      break;
    }
    case 4: {
      if (!profile?.occupation?.trim()) {
        unmet.push(lang === 'hi' ? 'व्यवसाय/रोजगार जानकारी जरूरी है।' : 'Occupation details are required.');
      }
      break;
    }
    case 5: {
      if (kids < 1) {
        unmet.push(lang === 'hi' ? 'बालिका होने पर योजना का लाभ मिलता है।' : 'The scheme benefits families with a girl child.');
      }
      break;
    }
    case 6: {
      if (!/^\d{10}$/.test((profile?.phoneNumber || '').trim())) {
        unmet.push(lang === 'hi' ? 'वैध 10 अंकों का फोन नंबर चाहिए।' : 'A valid 10-digit phone number is required.');
      }
      if (!profile?.state?.trim()) {
        unmet.push(lang === 'hi' ? 'राज्य की जानकारी जरूरी है।' : 'State information is required.');
      }
      break;
    }
    default:
      break;
  }

  const eligible = unmet.length === 0;
  if (eligible) {
    return {
      eligible: true,
      msg:
        lang === 'hi'
          ? `खुशखबरी! आपकी प्रोफ़ाइल के आधार पर आप ${scheme.title} के लिए पात्र हैं।`
          : `Good news! Based on your profile, you are eligible for ${scheme.title}.`,
    };
  }

  return {
    eligible: false,
    msg:
      lang === 'hi'
        ? `${scheme.title} के लिए कुछ शर्तें पूरी नहीं हुईं: ${unmet.join(' ')}`
        : `You currently do not meet all conditions for ${scheme.title}: ${unmet.join(' ')}`,
  };
};

const Schemes = () => {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [checkingId, setCheckingId] = useState(null);
  const [checkResult, setCheckResult] = useState(null);

  const schemesData = [
    {
      id: 1,
      title: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
      category: 'health',
      description: lang === 'hi' ? 'मातृत्व लाभ कार्यक्रम जो गर्भवती महिलाओं को 5,000 रुपये का नकद प्रोत्साहन प्रदान करता है।' : 'Maternity benefit program providing cash incentive of ₹5,000 to pregnant women and lactating mothers for the first living child.',
      tags: ['Pregnant Women', 'Health & Nutrition', 'Cash Benefit'],
      icon: HeartPulse,
      color: 'var(--secondary)',
      link: 'https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana'
    },
    {
      id: 2,
      title: 'Sukanya Samriddhi Yojana',
      category: 'finance',
      description: lang === 'hi' ? 'बालिकाओं के माता-पिता के लिए सरकार समर्थित बचत योजना, उच्च ब्याज दरों की पेशकश।' : 'Government-backed savings scheme targeted at the parents of girl children, offering high interest rates to build a fund for her future.',
      tags: ['Girl Child (0-10 yrs)', 'High Interest', 'Tax Saving'],
      icon: Landmark,
      color: 'var(--primary)',
      link: 'https://nsiindia.gov.in/InternalPage.aspx?Id_Pk=89'
    },
    {
      id: 3,
      title: 'Janani Suraksha Yojana (JSY)',
      category: 'health',
      description: lang === 'hi' ? 'संस्थागत प्रसव को बढ़ावा देकर मातृ मृत्यु दर को कम करने के लिए एक सुरक्षित मातृत्व हस्तक्षेप।' : 'A safe motherhood intervention under the National Health Mission aiming to reduce maternal and neonatal mortality by promoting institutional delivery.',
      tags: ['Pregnant Women', 'BPL Families', 'Cash Assistance'],
      icon: HeartPulse,
      color: 'var(--secondary)',
      link: 'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309'
    },
    {
      id: 4,
      title: 'Pradhan Mantri Mudra Yojana (PMMY)',
      category: 'finance',
      description: lang === 'hi' ? 'बिना गारंटी के 10 लाख तक का व्यवसाय ऋण प्रदान करता है।' : 'Provides loans up to 10 lakh to non-corporate, non-farm small/micro enterprises without collateral.',
      tags: ['Women Entrepreneurs', 'Business Loan', 'No Collateral'],
      icon: Landmark,
      color: 'var(--primary)',
      link: 'https://www.mudra.org.in/'
    },
    {
      id: 5,
      title: 'Beti Bachao Beti Padhao',
      category: 'education',
      description: lang === 'hi' ? 'भारत में लड़कियों के लिए कल्याणकारी सेवाओं में सुधार के उद्देश्य से योजना।' : 'Aimed at generating awareness and improving the efficiency of welfare services intended for girls in India.',
      tags: ['Girl Child', 'Education', 'Social Welfare'],
      icon: GraduationCap,
      color: '#dd6b20',
      link: 'https://wcd.nic.in/bbbp-schemes'
    },
    {
      id: 6,
      title: 'Mahila Samman Savings Certificate',
      category: 'finance',
      description: lang === 'hi' ? 'महिलाओं और लड़कियों के लिए 7.5% निश्चित ब्याज दर वाली एक नई बचत योजना।' : 'A one-time new small savings scheme for women and girls offering 7.5% fixed interest rate for a 2-year tenure.',
      tags: ['Women & Girls', 'Fixed Interest', 'Savings'],
      icon: Landmark,
      color: 'var(--primary)',
      link: 'https://www.indiapost.gov.in/Financial/pages/content/post-office-saving-schemes.aspx'
    }
  ];

  const filteredSchemes = activeCategory === 'all' 
    ? schemesData 
    : schemesData.filter(s => s.category === activeCategory);

  const simulateEligibilityCheck = (scheme) => {
    const savedProfileRaw =
      localStorage.getItem(PROFILE_STORAGE_KEY) || localStorage.getItem(PROFILE_DRAFT_STORAGE_KEY);

    setCheckingId(scheme.id);
    setCheckResult(null);

    if (!savedProfileRaw) {
      setTimeout(() => {
        setCheckResult({
          id: scheme.id,
          eligible: false,
          msg: t('profileIncomplete')
        });
        setCheckingId(null);
      }, 500);
      return;
    }

    let savedProfile;
    try {
      savedProfile = JSON.parse(savedProfileRaw);
    } catch {
      setTimeout(() => {
        setCheckResult({
          id: scheme.id,
          eligible: false,
          msg: t('profileIncomplete')
        });
        setCheckingId(null);
      }, 500);
      return;
    }

    const hasCompletedProfile = isProfileReady(savedProfile);
    if (!hasCompletedProfile) {
      setTimeout(() => {
        setCheckResult({
          id: scheme.id,
          eligible: false,
          msg: t('profileIncomplete')
        });
        setCheckingId(null);
      }, 500);
      return;
    }

    // Simulated server check delay with deterministic profile rules.
    setTimeout(() => {
      const result = getEligibilityResult(scheme, savedProfile, lang);

      setCheckResult({
        id: scheme.id,
        eligible: result.eligible,
        msg: result.msg
      });
      setCheckingId(null);
    }, 1500);
  };

  return (
    <div className="fade-in">
      <header style={styles.header}>
        <div>
          <h1 className="h2" style={{color: 'var(--text-dark)'}}>{t('schemes')}</h1>
          <p className="subtext">{t('schemesSubtitle')}</p>
        </div>
        <div style={styles.searchBox}>
          <Search size={20} color="var(--text-muted)" />
          <input type="text" placeholder={t("searchPlaceholder").substring(0,25)+"..."} style={styles.searchInput} />
        </div>
      </header>

      <div style={styles.tabs}>
        <button 
          style={{...styles.tab, borderBottom: activeCategory === 'all' ? '3px solid var(--primary)' : '3px solid transparent', color: activeCategory === 'all' ? 'var(--primary-dark)' : 'var(--text-muted)'}}
          onClick={() => setActiveCategory('all')}
        >
          {t('allSchemes')}
        </button>
        <button 
          style={{...styles.tab, borderBottom: activeCategory === 'health' ? '3px solid var(--primary)' : '3px solid transparent', color: activeCategory === 'health' ? 'var(--primary-dark)' : 'var(--text-muted)'}}
          onClick={() => setActiveCategory('health')}
        >
          {t('healthMotherhood')}
        </button>
        <button 
          style={{...styles.tab, borderBottom: activeCategory === 'finance' ? '3px solid var(--primary)' : '3px solid transparent', color: activeCategory === 'finance' ? 'var(--primary-dark)' : 'var(--text-muted)'}}
          onClick={() => setActiveCategory('finance')}
        >
          {t('financeIndep')}
        </button>
        <button 
          style={{...styles.tab, borderBottom: activeCategory === 'education' ? '3px solid var(--primary)' : '3px solid transparent', color: activeCategory === 'education' ? 'var(--primary-dark)' : 'var(--text-muted)'}}
          onClick={() => setActiveCategory('education')}
        >
          {t('education')}
        </button>
      </div>

      <div style={styles.grid}>
        {filteredSchemes.map(scheme => (
          <div key={scheme.id} style={styles.card} className="hover-card">
            <div style={styles.cardHeader}>
              <div style={{...styles.iconCircle, backgroundColor: `${scheme.color}20`, color: scheme.color}}>
                <scheme.icon size={24} />
              </div>
              <button className="btn btn-secondary" style={styles.listenBtn}>
                <Volume2 size={16} /> {lang === 'hi' ? 'सुनें' : 'Listen'}
              </button>
            </div>
            
            <h3 style={styles.cardTitle}>{scheme.title}</h3>
            
            <div style={styles.tagsContainer}>
              {scheme.tags.map(tag => (
                <span key={tag} style={styles.tag}>{tag}</span>
              ))}
            </div>
            
            <p style={styles.description}>{scheme.description}</p>
            
            {/* Eligibility Check Area */}
            {checkResult && checkResult.id === scheme.id ? (
              <div style={{...styles.resultBox, backgroundColor: checkResult.eligible ? '#f0fff4' : '#fff5f5', borderColor: checkResult.eligible ? '#c6f6d5' : '#fed7d7'}}>
                <div style={{display: 'flex', gap: '8px', alignItems: 'flex-start'}}>
                  {checkResult.eligible ? <CheckCircle color="var(--success)" size={20} /> : <Info color="var(--danger)" size={20} />}
                  <p style={{fontSize: '0.9rem', color: checkResult.eligible ? 'var(--success)' : 'var(--danger)', lineHeight: 1.4}}>
                    {checkResult.msg}
                  </p>
                </div>
              </div>
            ) : null}

            <div style={styles.actionsBox}>
              <div style={{display: 'flex', gap: '12px', width: '100%'}}>
                <button 
                  className="btn btn-primary" 
                  style={{flex: 1, padding: '10px', fontSize: '0.9rem'}}
                  onClick={() => simulateEligibilityCheck(scheme)}
                  disabled={checkingId === scheme.id}
                >
                  {checkingId === scheme.id ? (lang === 'hi' ? 'जांच हो रही है...' : 'Checking...') : t('checkEligibility')}
                </button>
                <button className="btn btn-outline" style={{padding: '10px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-full)'}}>
                  <Info size={18} /> {t('askAI')}
                </button>
              </div>

              <a 
                href={scheme.link} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary" 
                style={{width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--primary-dark)', fontSize: '0.9rem', padding: '10px', marginTop: '12px', border: '1px solid var(--border-color)'}}
              >
                {t('viewGovt')}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', width: '300px' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', fontFamily: 'inherit' },
  tabs: { display: 'flex', gap: '32px', borderBottom: '1px solid var(--border-color)', marginBottom: '32px', overflowX: 'auto' },
  tab: { padding: '12px 0', fontSize: '1rem', fontWeight: '600', backgroundColor: 'transparent', transition: 'all 0.2s', whiteSpace: 'nowrap' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
  card: { backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  iconCircle: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  listenBtn: { padding: '6px 12px', fontSize: '0.85rem' },
  cardTitle: { fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '12px', lineHeight: 1.3 },
  tagsContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' },
  tag: { fontSize: '0.8rem', fontWeight: '500', padding: '4px 10px', backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' },
  description: { fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '24px', flex: 1 },
  resultBox: { padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid', marginBottom: '24px', animation: 'fadeIn 0.3s ease' },
  actionsBox: { marginTop: 'auto', display: 'flex', flexDirection: 'column' }
};

export default Schemes;
