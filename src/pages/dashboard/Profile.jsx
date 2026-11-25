import React, { useEffect, useMemo, useRef, useState } from 'react';
import { appUrl } from '../../utils/appMode';
import { useLanguage } from '../../context/languageContextValue';
import {
  Award,
  Bell,
  BookOpen,
  Camera,
  CheckCircle2,
  Flame,
  HelpCircle,
  LogOut,
  Pencil,
  Save,
  Shield,
  Trash2,
} from 'lucide-react';
import {
  getDayStreakCount,
  getQuestionsAskedCount,
  getTopicsCompletedCount,
  recordDailyActivity,
} from '../../utils/userProgress';
import { useUserPhoto, setUserPhoto, clearUserPhoto } from '../../utils/userPhoto';
import { getLevelInfo } from '../../utils/levels';
import AccountBackup from '../../components/AccountBackup';
import { signOutDevice } from '../../lib/auth';
import { confirmSignOut } from '../../lib/signOutWarning';

const PROFILE_STORAGE_KEY = 'userProfile';
const PROFILE_DRAFT_STORAGE_KEY = 'userProfileDraft';

// Crop to a centred square and shrink, so the saved photo stays small (about 20-40 KB).
const resizeImage = (file, size = 256) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const side = Math.min(img.width, img.height);
      canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image'));
    };
    img.src = url;
  });

// Display labels for the saved-profile summary: [English, Hindi]
const MARITAL_LABELS = {
  single: ['Single', 'अविवाहित'],
  married: ['Married', 'विवाहित'],
  widowed: ['Widowed', 'विधवा'],
  divorced: ['Divorced', 'तलाकशुदा'],
};
const INCOME_LABELS = {
  'below-1-lakh': ['Below 1 lakh', '1 लाख से कम'],
  '1-3-lakh': ['1-3 lakh', '1-3 लाख'],
  '3-6-lakh': ['3-6 lakh', '3-6 लाख'],
  '6-plus-lakh': ['6+ lakh', '6+ लाख'],
};

const RING_SIZE = 168;
const RING_STROKE = 9;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

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
  // A saved, complete profile opens as a read-only summary; the form opens on Edit.
  const [editing, setEditing] = useState(() => !isProfileReady(profile));
  const [hasSaved, setHasSaved] = useState(() => Boolean(localStorage.getItem(PROFILE_STORAGE_KEY)));
  const photo = useUserPhoto();
  const [levelInfo] = useState(() => getLevelInfo());
  const [photoError, setPhotoError] = useState('');
  const fileRef = useRef(null);
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

  // Share of required fields filled in; drives the ring around the photo.
  const completion = useMemo(() => {
    const checks = [
      profile.fullName.trim(),
      profile.ageGroup,
      profile.maritalStatus,
      profile.education.trim(),
      profile.familyIncomeBracket,
      /^\d{10}$/.test(profile.phoneNumber.trim()),
      profile.state.trim(),
      profile.district.trim(),
      profile.occupation.trim(),
    ];
    if (profile.isUsingGovScheme === 'yes') checks.push(profile.existingSchemes.trim());
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

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
    setHasSaved(true);
    setEditing(false);
  };

  const startEditing = () => {
    setFormMessage('');
    setFormError('');
    setEditing(true);
  };

  // Throw away unsaved changes and go back to the saved profile.
  const cancelEditing = () => {
    setProfile(buildInitialProfile());
    setFormError('');
    setFormMessage('');
    setEditing(false);
  };

  const pick = (pair, fallback = '') => (pair ? pair[lang === 'hi' ? 1 : 0] : fallback);
  const summaryItems = [
    [lang === 'hi' ? 'पूरा नाम' : 'Full Name', profile.fullName],
    [lang === 'hi' ? 'आयु वर्ग' : 'Age Group', profile.ageGroup],
    [lang === 'hi' ? 'वैवाहिक स्थिति' : 'Marital Status', pick(MARITAL_LABELS[profile.maritalStatus])],
    [lang === 'hi' ? 'बच्चों की संख्या' : 'Number of Kids', String(profile.numberOfKids ?? 0)],
    [lang === 'hi' ? 'शिक्षा' : 'Education', profile.education],
    [lang === 'hi' ? 'परिवार की वार्षिक आय' : 'Family Annual Income', pick(INCOME_LABELS[profile.familyIncomeBracket])],
    [lang === 'hi' ? 'फोन नंबर' : 'Phone Number', profile.phoneNumber],
    [lang === 'hi' ? 'राज्य' : 'State', profile.state],
    [lang === 'hi' ? 'जिला' : 'District', profile.district],
    [lang === 'hi' ? 'व्यवसाय' : 'Occupation', profile.occupation],
    [
      lang === 'hi' ? 'सरकारी योजना' : 'Government Scheme',
      profile.isUsingGovScheme === 'yes'
        ? (profile.existingSchemes || (lang === 'hi' ? 'हां' : 'Yes'))
        : (lang === 'hi' ? 'उपयोग नहीं कर रही' : 'Not using any'),
    ],
  ];
  const goalItems = [
    [lang === 'hi' ? 'स्वास्थ्य से जुड़ा मुख्य लक्ष्य' : 'Primary Health Goal', profile.healthFocus],
    [lang === 'hi' ? 'वित्तीय लक्ष्य' : 'Financial Goal', profile.financialGoal],
  ];

  const handlePhotoPick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError(lang === 'hi' ? 'कृपया एक फ़ोटो चुनें।' : 'Please choose an image file.');
      return;
    }
    try {
      const dataUrl = await resizeImage(file);
      setUserPhoto(dataUrl);
      setPhotoError('');
    } catch {
      setPhotoError(lang === 'hi' ? 'फ़ोटो सेव नहीं हो पाई। कोई दूसरी फ़ोटो आज़माएं।' : 'Could not save that photo. Try another one.');
    }
  };

  const removePhoto = () => {
    clearUserPhoto();
    setPhotoError('');
  };

  const handleLogout = async () => {
    if (!confirmSignOut(lang)) return;
    await signOutDevice();
    localStorage.clear();
    window.location.href = appUrl('/');
  };

  return (
    <div className="fade-in" style={styles.container}>
      <header style={{ marginBottom: '28px' }}>
        <h1 className="h2" style={{ color: 'var(--text-dark)' }}>{t('myProfile')}</h1>
        <p className="subtext">{t('trackProgress')}</p>
      </header>

      <div style={styles.layout}>
        {/* ---------- left: photo, completion, stats, settings ---------- */}
        <aside style={styles.left}>
          <div style={styles.profileCard}>
            <div style={styles.ringWrap}>
              <svg width={RING_SIZE} height={RING_SIZE} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} aria-hidden="true">
                <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill="none" stroke="var(--primary-light)" strokeWidth={RING_STROKE} />
                <circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={RING_STROKE}
                  strokeLinecap="round"
                  strokeDasharray={RING_LENGTH}
                  strokeDashoffset={RING_LENGTH * (1 - completion / 100)}
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <div style={styles.photoCircle}>
                {photo ? (
                  <img src={photo} alt={userName} style={styles.photoImg} />
                ) : (
                  <span style={{ fontSize: '3rem', color: '#fff', fontWeight: '600' }}>{userName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button
                type="button"
                style={styles.cameraBtn}
                onClick={() => fileRef.current?.click()}
                aria-label={lang === 'hi' ? 'फ़ोटो बदलें' : 'Change photo'}
                title={lang === 'hi' ? 'फ़ोटो बदलें' : 'Change photo'}
              >
                <Camera size={18} color="#fff" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoPick} style={{ display: 'none' }} />
              <div style={styles.levelPill}>
                <Award size={14} color="#fff" />
                {lang === 'hi' ? `स्तर ${levelInfo.level} · ${levelInfo.name.hi}` : `Lvl ${levelInfo.level} · ${levelInfo.name.en}`}
              </div>
            </div>

            {photoError && <p style={{ ...styles.errorText, textAlign: 'center', marginTop: '8px' }}>{photoError}</p>}
            {photo && (
              <button type="button" onClick={removePhoto} style={styles.removePhoto}>
                <Trash2 size={14} /> {lang === 'hi' ? 'फ़ोटो हटाएं' : 'Remove photo'}
              </button>
            )}

            <h2 style={styles.welcome}>{t('namaste')}, {userName} 👋</h2>
            <p className="subtext">{lang === 'hi' ? 'आयु वर्ग:' : 'Age Group:'} {userAge}</p>

            <div style={styles.completionRow}>
              <span style={styles.completionNumber}>{completion}%</span>
              <span className="subtext" style={{ lineHeight: 1.3 }}>
                {lang === 'hi' ? 'प्रोफ़ाइल पूरी' : 'Profile complete'}
              </span>
            </div>
            <div style={styles.barTrack} aria-hidden="true">
              <div style={{ ...styles.barFill, width: `${completion}%` }} />
            </div>

            <div style={styles.miniStats}>
              <div style={styles.miniStat}>
                <span style={{ ...styles.miniIcon, backgroundColor: '#ebf8ff' }}><HelpCircle size={18} color="#3182ce" /></span>
                <strong style={styles.miniNumber}>{progressStats.questionsAsked}</strong>
                <span style={styles.miniLabel}>{t('questionsAsked')}</span>
              </div>
              <div style={styles.miniStat}>
                <span style={{ ...styles.miniIcon, backgroundColor: '#e6fffa' }}><BookOpen size={18} color="#2c7a7b" /></span>
                <strong style={styles.miniNumber}>{progressStats.topicsCompleted}</strong>
                <span style={styles.miniLabel}>{t('topicsCompleted')}</span>
              </div>
              <div style={styles.miniStat}>
                <span style={{ ...styles.miniIcon, backgroundColor: '#fffaf0' }}><Flame size={18} color="#dd6b20" /></span>
                <strong style={styles.miniNumber}>{progressStats.dayStreak}</strong>
                <span style={styles.miniLabel}>{t('dayStreak')}</span>
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
                    <h4 style={{ fontWeight: '500' }}>{t('privacyMode')}</h4>
                    <p className="subtext" style={{ fontSize: '0.8rem' }}>{lang === 'hi' ? '24 घंटे के बाद स्वचालित रूप से चैट हटाएं' : 'Automatically delete chats after 24 hrs'}</p>
                  </div>
                </div>
                <label style={styles.toggle}>
                  <input type="checkbox" checked={privacyMode} onChange={(e) => setPrivacyMode(e.target.checked)} style={{ display: 'none' }} />
                  <div style={{ ...styles.toggleThumb, backgroundColor: privacyMode ? 'var(--success)' : 'var(--text-light)', justifyContent: privacyMode ? 'flex-end' : 'flex-start' }}>
                    <div style={styles.toggleCircle}></div>
                  </div>
                </label>
              </div>

              <div style={{ ...styles.settingItem, borderBottom: 'none', paddingBottom: 0 }}>
                <div style={styles.settingText}>
                  <Bell size={20} color="var(--primary)" />
                  <h4 style={{ fontWeight: '500' }}>{lang === 'hi' ? 'दैनिक शिक्षण अनुस्मारक' : 'Daily Learning Reminders'}</h4>
                </div>
                <label style={styles.toggle}>
                  <input type="checkbox" defaultChecked style={{ display: 'none' }} />
                  <div style={{ ...styles.toggleThumb, backgroundColor: 'var(--success)', justifyContent: 'flex-end' }}>
                    <div style={styles.toggleCircle}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <AccountBackup />

          <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleLogout}>
            <LogOut size={18} /> {t('logout')}
          </button>
        </aside>

        {/* ---------- right: the profile form, open by default ---------- */}
        <div style={styles.right}>
          {!editing && (
            <section style={styles.formCard} aria-label={lang === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your profile'}>
              <div style={styles.formHeader}>
                <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>
                  {lang === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your Profile'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {profileComplete && (
                    <span style={styles.completeChip}>
                      <CheckCircle2 size={16} />
                      {lang === 'hi' ? 'प्रोफ़ाइल पूर्ण' : 'Profile Complete'}
                    </span>
                  )}
                  <button type="button" className="btn btn-primary" style={{ padding: '10px 18px' }} onClick={startEditing}>
                    <Pencil size={16} /> {lang === 'hi' ? 'एडिट करें' : 'Edit Profile'}
                  </button>
                </div>
              </div>

              {formMessage && <p style={{ ...styles.successText, marginTop: '4px', marginBottom: '8px' }} role="status">{formMessage}</p>}

              <dl style={styles.summaryGrid}>
                {summaryItems.map(([label, value]) => (
                  <div key={label} style={styles.summaryItem}>
                    <dt style={styles.summaryLabel}>{label}</dt>
                    <dd style={styles.summaryValue}>{value || '—'}</dd>
                  </div>
                ))}
                {goalItems.map(([label, value]) => (
                  <div key={label} style={{ ...styles.summaryItem, gridColumn: '1 / -1' }}>
                    <dt style={styles.summaryLabel}>{label}</dt>
                    <dd style={styles.summaryValue}>{value || '—'}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {editing && (
          <form style={styles.formCard} onSubmit={saveProfile}>
            <div style={styles.formHeader}>
              <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>
                {profileComplete
                  ? (lang === 'hi' ? 'प्रोफ़ाइल एडिट करें' : 'Edit Profile')
                  : (lang === 'hi' ? 'प्रोफ़ाइल बनाएं' : 'Build Your Profile')}
              </h3>
              {profileComplete && (
                <span style={styles.completeChip}>
                  <CheckCircle2 size={16} />
                  {lang === 'hi' ? 'प्रोफ़ाइल पूर्ण' : 'Profile Complete'}
                </span>
              )}
            </div>
            <p className="subtext" style={{ marginBottom: '18px' }}>
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
                  <option value="10-14">10-14</option>
                  <option value="15-22">15-22</option>
                  <option value="23-35">23-35</option>
                  <option value="35+">35+</option>
                  {/* keep an older saved value (like 36-45) selectable */}
                  {profile.ageGroup && !['10-14', '15-22', '23-35', '35+'].includes(profile.ageGroup) && (
                    <option value={profile.ageGroup}>{profile.ageGroup}</option>
                  )}
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
              {hasSaved && (
                <button type="button" className="btn btn-secondary" onClick={cancelEditing}>
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              )}
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: 'none', margin: '0 auto' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' },
  left: { flex: '1 1 320px', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '24px' },
  right: { flex: '3 1 480px', minWidth: 0 },
  profileCard: { backgroundColor: 'var(--surface)', padding: '32px 24px 24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  ringWrap: { position: 'relative', width: `${RING_SIZE}px`, height: `${RING_SIZE}px`, marginBottom: '22px' },
  photoCircle: { position: 'absolute', inset: `${RING_STROKE + 6}px`, borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  photoImg: { width: '100%', height: '100%', objectFit: 'cover' },
  cameraBtn: { position: 'absolute', right: '6px', top: '6px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', border: '3px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  levelPill: { position: 'absolute', left: '50%', bottom: '-14px', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: 'var(--radius-full)', backgroundColor: '#dd6b20', color: '#fff', fontSize: '0.85rem', fontWeight: '600', border: '3px solid var(--surface)', whiteSpace: 'nowrap' },
  removePhoto: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', cursor: 'pointer' },
  welcome: { fontSize: '1.5rem', marginTop: '14px', marginBottom: '2px' },
  completionRow: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', alignSelf: 'stretch' },
  completionNumber: { fontSize: '2.4rem', fontWeight: '600', color: 'var(--primary-dark)', lineHeight: 1 },
  barTrack: { alignSelf: 'stretch', height: '8px', borderRadius: '999px', backgroundColor: 'var(--primary-light)', overflow: 'hidden', marginTop: '10px' },
  barFill: { height: '100%', borderRadius: '999px', backgroundColor: 'var(--primary)', transition: 'width 0.6s ease' },
  miniStats: { alignSelf: 'stretch', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '22px', padding: '14px 8px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' },
  miniStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  miniIcon: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  miniNumber: { fontSize: '1.4rem', color: 'var(--text-dark)', lineHeight: 1.1 },
  miniLabel: { fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.2 },
  formCard: {
    backgroundColor: 'var(--surface)',
    padding: '28px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
  },
  formHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' },
  completeChip: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: '600', fontSize: '0.9rem', backgroundColor: '#f0fff4', padding: '6px 14px', borderRadius: '50px', border: '1px solid #c6f6d5' },
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
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px 24px', marginTop: '16px' },
  summaryItem: { display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' },
  summaryLabel: { fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' },
  summaryValue: { fontSize: '1.05rem', color: 'var(--text-dark)', margin: 0, wordBreak: 'break-word' },
  formActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
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
  sectionCard: { backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' },
  sectionTitle: { fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-dark)' },
  settingsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  settingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' },
  settingText: { display: 'flex', alignItems: 'center', gap: '12px' },
  toggle: { cursor: 'pointer' },
  toggleThumb: { width: '40px', height: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '2px', transition: 'background-color 0.2s' },
  toggleCircle: { width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }
};

export default Profile;
