import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../context/languageContextValue';
import {
  Award,
  Bell,
  CheckCircle2,
  FileCheck2,
  LogOut,
  Save,
  Shield,
} from 'lucide-react';
import {
  getDayStreakCount,
  getQuestionsAskedCount,
  getTopicsCompletedCount,
  recordDailyActivity,
} from '../../utils/userProgress';

const PROFILE_STORAGE_KEY = 'userProfile';
const PROFILE_DRAFT_STORAGE_KEY = 'userProfileDraft';

const buildInitialProfile = () => {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  const draft = localStorage.getItem(PROFILE_DRAFT_STORAGE_KEY);
  const source = saved || draft;

  if (source) {
    try {
      const parsed = JSON.parse(source);
      return {
        fullName: parsed.fullName || localStorage.getItem('userName') || '',
        ageGroup: parsed.ageGroup || localStorage.getItem('userAge') || '',
        maritalStatus: parsed.maritalStatus || '',
        numberOfKids: parsed.numberOfKids ?? 0,
        education: parsed.education || '',
        familyIncomeBracket: parsed.familyIncomeBracket || '',
        phoneNumber: parsed.phoneNumber || '',
        state: parsed.state || '',
        district: parsed.district || '',
        occupation: parsed.occupation || '',
        isUsingGovScheme: parsed.isUsingGovScheme || 'no',
        existingSchemes: parsed.existingSchemes || '',
        healthFocus: parsed.healthFocus || '',
        financialGoal: parsed.financialGoal || '',
      };
    } catch {
      // If stored profile is corrupted, fall back to defaults.
    }
  }

  return {
    fullName: localStorage.getItem('userName') || '',
    ageGroup: localStorage.getItem('userAge') || '',
    maritalStatus: '',
    numberOfKids: 0,
    education: '',
    familyIncomeBracket: '',
    phoneNumber: '',
    state: '',
    district: '',
    occupation: '',
    isUsingGovScheme: 'no',
    existingSchemes: '',
    healthFocus: '',
    financialGoal: '',
  };
};

const isProfileReady = (profile) => {
  const basicRequired =
    profile.fullName.trim() &&
    profile.ageGroup &&
    profile.maritalStatus &&
    profile.education.trim() &&
    profile.familyIncomeBracket &&
    /^\d{10}$/.test(profile.phoneNumber.trim()) &&
    profile.state.trim() &&
    profile.district.trim() &&
    profile.occupation.trim() &&
    profile.isUsingGovScheme;

  if (!basicRequired) return false;
  if (profile.isUsingGovScheme === 'yes' && !profile.existingSchemes.trim()) return false;
  return true;
};

const Profile = () => {
  const { t, lang } = useLanguage();
  const [profile, setProfile] = useState(buildInitialProfile);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [formError, setFormError] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [showProfileBuilder, setShowProfileBuilder] = useState(false);
  const [progressStats, setProgressStats] = useState({
    questionsAsked: getQuestionsAskedCount(),
    topicsCompleted: getTopicsCompletedCount(),
    dayStreak: getDayStreakCount(),
  });

  useEffect(() => {
    const refreshProgress = () => {
      const streak = recordDailyActivity();
      setProgressStats({
        questionsAsked: getQuestionsAskedCount(),
        topicsCompleted: getTopicsCompletedCount(),
        dayStreak: streak,
      });
    };

    refreshProgress();
    window.addEventListener('focus', refreshProgress);
    window.addEventListener('storage', refreshProgress);

    return () => {
      window.removeEventListener('focus', refreshProgress);
      window.removeEventListener('storage', refreshProgress);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(PROFILE_DRAFT_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const profileComplete = useMemo(() => isProfileReady(profile), [profile]);
  const userName = profile.fullName || localStorage.getItem('userName') || 'Didi';
  const userAge = profile.ageGroup || localStorage.getItem('userAge') || 'Unknown';

  const onChange = (field, value) => {
    setFormError('');
    setFormMessage('');
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const validateProfile = () => {
    if (!profile.fullName.trim()) return lang === 'hi' ? 'कृपया नाम भरें।' : 'Please enter your name.';
    if (!profile.ageGroup) return lang === 'hi' ? 'कृपया आयु वर्ग चुनें।' : 'Please select age group.';
    if (!profile.maritalStatus) return lang === 'hi' ? 'कृपया वैवाहिक स्थिति चुनें।' : 'Please select marital status.';
    if (!profile.education.trim()) return lang === 'hi' ? 'कृपया शिक्षा की जानकारी भरें।' : 'Please enter education.';
    if (!profile.familyIncomeBracket) {
      return lang === 'hi' ? 'कृपया परिवार की आय श्रेणी चुनें।' : 'Please select family income bracket.';
    }
    if (!/^\d{10}$/.test(profile.phoneNumber.trim())) {
      return lang === 'hi' ? 'फोन नंबर 10 अंकों का होना चाहिए।' : 'Phone number must be 10 digits.';
    }
    if (!profile.state.trim()) return lang === 'hi' ? 'कृपया राज्य भरें।' : 'Please enter state.';
    if (!profile.district.trim()) return lang === 'hi' ? 'कृपया जिला भरें।' : 'Please enter district.';
    if (!profile.occupation.trim()) return lang === 'hi' ? 'कृपया व्यवसाय भरें।' : 'Please enter occupation.';
    if (profile.isUsingGovScheme === 'yes' && !profile.existingSchemes.trim()) {
      return lang === 'hi'
        ? 'कृपया उपयोग की जा रही सरकारी योजनाओं का नाम भरें।'
        : 'Please mention the government schemes you are using.';
    }

    return '';
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const error = validateProfile();
    if (error) {
      setFormError(error);
      return;
    }

    const normalized = {
      ...profile,
      fullName: profile.fullName.trim(),
      education: profile.education.trim(),
      phoneNumber: profile.phoneNumber.trim(),
      state: profile.state.trim(),
      district: profile.district.trim(),
      occupation: profile.occupation.trim(),
      existingSchemes: profile.existingSchemes.trim(),
      healthFocus: profile.healthFocus.trim(),
      financialGoal: profile.financialGoal.trim(),
      numberOfKids: Number(profile.numberOfKids) || 0,
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized));
    localStorage.setItem(PROFILE_DRAFT_STORAGE_KEY, JSON.stringify(normalized));
    localStorage.setItem('userName', normalized.fullName);
    localStorage.setItem('userAge', normalized.ageGroup);
    localStorage.setItem('profileComplete', 'true');
    setProfile(normalized);
    setFormError('');
    setFormMessage(lang === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक सेव हो गई।' : 'Profile saved successfully.');

    if (isProfileReady(normalized)) {
      setShowProfileBuilder(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="fade-in" style={styles.container}>
      <header style={{marginBottom: '32px'}}>
        <h1 className="h2" style={{color: 'var(--text-dark)'}}>{t('myProfile')}</h1>
        <p className="subtext">{t('trackProgress')}</p>
      </header>

      <div style={styles.profileCard}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
            <div style={styles.avatarLarge}>
              <span style={{fontSize: '2rem', color: '#fff'}}>{userName.charAt(0)}</span>
            </div>
            <div>
              <h2 style={{fontSize: '1.5rem', marginBottom: '4px'}}>{userName}</h2>
              <p className="subtext">{lang === 'hi' ? 'आयु वर्ग:' : 'Age Group:'} {userAge}</p>
              <div style={styles.levelBadge}>
                <Award size={16} color="#dd6b20" />
                <span style={{fontWeight: '600', color: '#dd6b20'}}>{lang === 'hi' ? 'स्तर: शिक्षार्थी' : 'Level: Learning'}</span>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {profileComplete && (
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: '600', backgroundColor: '#f0fff4', padding: '8px 16px', borderRadius: '50px', border: '1px solid #c6f6d5'}}>
                <CheckCircle2 size={18} />
                {lang === 'hi' ? 'प्रोफ़ाइल पूर्ण' : 'Profile Complete✓'}
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary"
              style={{padding: '10px 16px'}}
              onClick={() => setShowProfileBuilder((prev) => !prev)}
            >
              <FileCheck2 size={18} />
              {showProfileBuilder
                ? (lang === 'hi' ? 'फॉर्म छुपाएं' : 'Hide Profile Form')
                : profileComplete
                  ? (lang === 'hi' ? 'प्रोफ़ाइल एडिट करें' : 'Edit Profile')
                  : (lang === 'hi' ? 'प्रोफ़ाइल बनाएं' : 'Build Profile')}
            </button>
          </div>
        </div>
      </div>

      {showProfileBuilder && (
      <form style={styles.formCard} onSubmit={saveProfile}>
        <h3 style={styles.sectionTitle}>{lang === 'hi' ? 'प्रोफ़ाइल विवरण भरें' : 'Complete Your Profile Details'}</h3>
        <p className="subtext" style={{marginBottom: '18px'}}>
          {lang === 'hi'
            ? 'सरकारी योजनाओं और पर्सनल सुझावों के लिए यह जानकारी उपयोग होगी।'
            : 'This information helps with accurate scheme eligibility and personalized support.'}
        </p>

        <div style={styles.formGrid}>
          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'पूरा नाम' : 'Full Name'} *</span>
            <input style={styles.input} value={profile.fullName} onChange={(e) => onChange('fullName', e.target.value)} />
          </label>

          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'आयु वर्ग' : 'Age Group'} *</span>
            <select style={styles.input} value={profile.ageGroup} onChange={(e) => onChange('ageGroup', e.target.value)}>
              <option value="">{lang === 'hi' ? 'चुनें' : 'Select'}</option>
              <option value="15-22">15-22</option>
              <option value="23-35">23-35</option>
              <option value="36-45">36-45</option>
              <option value="46+">46+</option>
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'वैवाहिक स्थिति' : 'Marital Status'} *</span>
            <select style={styles.input} value={profile.maritalStatus} onChange={(e) => onChange('maritalStatus', e.target.value)}>
              <option value="">{lang === 'hi' ? 'चुनें' : 'Select'}</option>
              <option value="single">{lang === 'hi' ? 'अविवाहित' : 'Single'}</option>
              <option value="married">{lang === 'hi' ? 'विवाहित' : 'Married'}</option>
              <option value="widowed">{lang === 'hi' ? 'विधवा' : 'Widowed'}</option>
              <option value="divorced">{lang === 'hi' ? 'तलाकशुदा' : 'Divorced'}</option>
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'बच्चों की संख्या' : 'Number of Kids'}</span>
            <input
              style={styles.input}
              type="number"
              min="0"
              value={profile.numberOfKids}
              onChange={(e) => onChange('numberOfKids', e.target.value)}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'शिक्षा' : 'Education'} *</span>
            <input
              style={styles.input}
              placeholder={lang === 'hi' ? 'जैसे: 12वीं / ग्रेजुएट' : 'e.g. 12th pass / Graduate'}
              value={profile.education}
              onChange={(e) => onChange('education', e.target.value)}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'परिवार की वार्षिक आय' : 'Family Annual Income'} *</span>
            <select
              style={styles.input}
              value={profile.familyIncomeBracket}
              onChange={(e) => onChange('familyIncomeBracket', e.target.value)}
            >
              <option value="">{lang === 'hi' ? 'चुनें' : 'Select'}</option>
              <option value="below-1-lakh">{lang === 'hi' ? '1 लाख से कम' : 'Below 1 lakh'}</option>
              <option value="1-3-lakh">1-3 lakh</option>
              <option value="3-6-lakh">3-6 lakh</option>
              <option value="6-plus-lakh">6+ lakh</option>
            </select>
          </label>

          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'फोन नंबर' : 'Phone Number'} *</span>
            <input
              style={styles.input}
              placeholder="10 digit number"
              value={profile.phoneNumber}
              onChange={(e) => onChange('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'राज्य' : 'State'} *</span>
            <input style={styles.input} value={profile.state} onChange={(e) => onChange('state', e.target.value)} />
          </label>

          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'जिला' : 'District'} *</span>
            <input style={styles.input} value={profile.district} onChange={(e) => onChange('district', e.target.value)} />
          </label>

          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'व्यवसाय' : 'Occupation'} *</span>
            <input
              style={styles.input}
              placeholder={lang === 'hi' ? 'जैसे: गृहिणी / किसान / नौकरी' : 'e.g. Homemaker / Farmer / Job'}
              value={profile.occupation}
              onChange={(e) => onChange('occupation', e.target.value)}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.labelText}>{lang === 'hi' ? 'क्या आप कोई सरकारी योजना उपयोग कर रही हैं?' : 'Using Any Government Scheme?'} *</span>
            <select
              style={styles.input}
              value={profile.isUsingGovScheme}
              onChange={(e) => onChange('isUsingGovScheme', e.target.value)}
            >
              <option value="yes">{lang === 'hi' ? 'हां' : 'Yes'}</option>
              <option value="no">{lang === 'hi' ? 'नहीं' : 'No'}</option>
            </select>
          </label>

          <label style={{ ...styles.field, gridColumn: '1 / -1' }}>
            <span style={styles.labelText}>{lang === 'hi' ? 'स्वास्थ्य से जुड़ा मुख्य लक्ष्य' : 'Primary Health Goal'}</span>
            <input
              style={styles.input}
              placeholder={lang === 'hi' ? 'जैसे: एनीमिया कंट्रोल, पीरियड हेल्थ' : 'e.g. Anemia control, period health'}
              value={profile.healthFocus}
              onChange={(e) => onChange('healthFocus', e.target.value)}
            />
          </label>

          <label style={{ ...styles.field, gridColumn: '1 / -1' }}>
            <span style={styles.labelText}>{lang === 'hi' ? 'वित्तीय लक्ष्य' : 'Financial Goal'}</span>
            <input
              style={styles.input}
              placeholder={lang === 'hi' ? 'जैसे: बचत, छोटा बिजनेस' : 'e.g. Savings, start a small business'}
              value={profile.financialGoal}
              onChange={(e) => onChange('financialGoal', e.target.value)}
            />
          </label>

          {profile.isUsingGovScheme === 'yes' && (
            <label style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <span style={styles.labelText}>{lang === 'hi' ? 'कौन-कौन सी योजनाएं?' : 'Which Schemes Are You Using?'} *</span>
              <textarea
                style={styles.textarea}
                placeholder={lang === 'hi' ? 'जैसे: उज्ज्वला, जन धन, PMMVY' : 'e.g. Ujjwala, Jan Dhan, PMMVY'}
                value={profile.existingSchemes}
                onChange={(e) => onChange('existingSchemes', e.target.value)}
              />
            </label>
          )}
        </div>

        {formError && <p style={styles.errorText}>{formError}</p>}
        {formMessage && <p style={styles.successText}>{formMessage}</p>}

        <div style={styles.formActions}>
          <button type="submit" className="btn btn-primary">
            <Save size={18} /> {lang === 'hi' ? 'प्रोफ़ाइल सेव करें' : 'Save Profile'}
          </button>
        </div>
      </form>
      )}

      <div style={styles.grid}>
        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>{lang === 'hi' ? 'आपकी प्रगति' : 'Your Progress'}</h3>
          
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <h4 style={{fontSize: '2rem', color: 'var(--primary)', marginBottom: '4px'}}>{progressStats.questionsAsked}</h4>
              <p className="subtext">{t('questionsAsked')}</p>
            </div>
            <div style={styles.statBox}>
              <h4 style={{fontSize: '2rem', color: 'var(--accent)', marginBottom: '4px'}}>{progressStats.topicsCompleted}</h4>
              <p className="subtext">{t('topicsCompleted')}</p>
            </div>
            <div style={styles.statBox}>
              <h4 style={{fontSize: '2rem', color: 'var(--secondary)', marginBottom: '4px'}}>{progressStats.dayStreak}</h4>
              <p className="subtext">{t('dayStreak')}</p>
            </div>
          </div>
        </div>

        <div style={styles.sectionCard}>
          <h3 style={styles.sectionTitle}>{t('settings')}</h3>
          
          <div style={styles.settingsList}>
            <div style={styles.settingItem}>
              <div style={styles.settingText}>
                <Shield size={20} color="var(--primary)" />
                <div>
                  <h4 style={{fontWeight: '500'}}>{t('privacyMode')}</h4>
                  <p className="subtext" style={{fontSize: '0.8rem'}}>{lang === 'hi' ? '24 घंटे के बाद स्वचालित रूप से चैट हटाएं' : 'Automatically delete chats after 24 hrs'}</p>
                </div>
              </div>
              <label style={styles.toggle}>
                <input type="checkbox" checked={privacyMode} onChange={(e) => setPrivacyMode(e.target.checked)} style={{display:'none'}}/>
                <div style={{...styles.toggleThumb, backgroundColor: privacyMode ? 'var(--success)' : 'var(--text-light)', justifyContent: privacyMode ? 'flex-end' : 'flex-start'}}>
                  <div style={styles.toggleCircle}></div>
                </div>
              </label>
            </div>
            
            <div style={styles.settingItem}>
              <div style={styles.settingText}>
                <Bell size={20} color="var(--primary)" />
                <h4 style={{fontWeight: '500'}}>{lang === 'hi' ? 'दैनिक शिक्षण अनुस्मारक' : 'Daily Learning Reminders'}</h4>
              </div>
              <label style={styles.toggle}>
                <input type="checkbox" defaultChecked style={{display:'none'}}/>
                <div style={{...styles.toggleThumb, backgroundColor: 'var(--success)', justifyContent: 'flex-end'}}>
                  <div style={styles.toggleCircle}></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <button className="btn btn-outline" style={{marginTop: '32px', color: 'var(--danger)', borderColor: 'var(--danger)'}} onClick={handleLogout}>
        <LogOut size={18} /> {t('logout')}
      </button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto' },
  profileCard: { backgroundColor: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '32px', border: '1px solid var(--border-color)' },
  formCard: {
    backgroundColor: 'var(--surface)',
    padding: '24px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
    marginBottom: '24px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '14px 16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  labelText: {
    fontSize: '0.88rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  input: {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: '#fff',
  },
  textarea: {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    minHeight: '84px',
    resize: 'vertical',
    outline: 'none',
    backgroundColor: '#fff',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '14px',
  },
  errorText: {
    color: 'var(--danger)',
    marginTop: '12px',
    fontWeight: '500',
  },
  successText: {
    color: 'var(--success)',
    marginTop: '12px',
    fontWeight: '600',
  },
  avatarLarge: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  levelBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: '#feebc8', borderRadius: 'var(--radius-full)', marginTop: '12px', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' },
  sectionCard: { backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' },
  sectionTitle: { fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-dark)' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  statBox: { backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' },
  settingsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  settingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' },
  settingText: { display: 'flex', alignItems: 'center', gap: '12px' },
  toggle: { cursor: 'pointer' },
  toggleThumb: { width: '40px', height: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '2px', transition: 'background-color 0.2s' },
  toggleCircle: { width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }
};

export default Profile;
