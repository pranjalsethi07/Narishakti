import { useRef, useState, useEffect } from 'react';
import { appUrl } from '../utils/appMode';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Copy, Check, KeyRound } from 'lucide-react';
import { useLanguage } from '../context/languageContextValue';
import { accountsEnabled, useAuth, signUpWithPin, signInWithPin, signOutDevice } from '../lib/auth';
import { validateUsername, validatePin, normaliseUsername, onlyDigits } from '../lib/authRules';
import { createRecoveryCode, restoreWithCode, deleteMyData, hasLocalProgress, clearLocalProgress } from '../lib/sync';
import { GUEST_LOCKED } from '../lib/guestAccess';
import { confirmSignOut } from '../lib/signOutWarning';

const TEXT = {
  en: {
    start: "Let's get started",
    signin: 'Sign in', signup: 'Create account', guest: 'Guest',
    username: 'Username', usernameHint: 'Make up a handle, like lotus_asha. Not your phone number or real name.',
    name: 'Your name', nameHint: 'Stays on this device only.',
    age: 'Your age', selectAge: 'Select age',
    pin: '6-digit PIN', pinConfirm: 'Type the PIN again', showPin: 'Show PIN', hidePin: 'Hide PIN',
    language: 'Preferred language',
    createBtn: 'Create my account', signinBtn: 'Sign in', guestBtn: 'Continue as guest', recoverBtn: 'Recover my progress',
    forgot: 'Forgot your PIN?', backToSignin: 'Back to sign in',
    privacy: 'We never ask for your phone number or email.',
    guestNote: 'As a guest you can try Ask AI, Learn, Games, Tests and Schemes. Your progress stays on this device only.',
    guestLocked: (names) => `Needs an account: ${names}.`,
    recoverTitle: 'Recover with your recovery code',
    recoverHint: 'Forgot your PIN? Choose a new username and PIN, and enter the recovery code you saved. Your progress moves to the new account.',
    recoveryCode: 'Recovery code',
    welcomeBack: (n) => `Welcome back, ${n}`, goDashboard: 'Go to my dashboard', signOut: 'Sign out',
    codeTitle: 'Save your recovery code',
    codeText: 'If you ever forget your PIN, this code is the only way to get your progress back. It is shown only once and nobody can look it up for you. Write it down or take a screenshot.',
    codeFailed: "We couldn't make a recovery code just now. You can make one later on your Profile page.",
    copy: 'Copy', copied: 'Copied', savedIt: 'I have saved my code', continue: 'Continue',
    carryUp: 'This device has progress saved in guest mode. Add it to your new account?',
    carryIn: "This device has progress saved in guest mode. Add it to your account?\n\nChoose Cancel to use only your account's own progress.",
    loading: 'Loading...',
    or: 'or',
    noBackend: "Accounts aren't switched on in this version of the app yet. You can still continue as a guest below.",
    hideGuest: 'Hide',
    e: {
      empty: 'Choose a username.',
      format: 'Use 3 to 20 letters, numbers or underscores (_).',
      phone: "Please don't use a phone number. Make up a handle instead.",
      pinFormat: 'Your PIN must be exactly 6 digits.',
      pinWeak: 'That PIN is too easy to guess. Avoid 123456, 000000 or repeated digits.',
      mismatch: "The two PINs don't match.",
      needName: 'Please enter your name.',
      needAge: 'Please choose your age.',
      needCode: 'Please enter the full recovery code.',
      taken: 'That username is taken. Try another.',
      invalid: 'Username or PIN is not right.',
      rate_limited: 'Too many tries. Please wait a few minutes.',
      network: 'No internet connection. Please try again.',
      confirm_required: 'Sign-up is not ready: the project still asks for email confirmation. The app owner must turn that off.',
      codeNotFound: "That recovery code wasn't recognised. Check it and try again.",
      unknown: 'Something went wrong. Please try again.',
      noBackend: "Accounts aren't switched on in this version of the app yet.",
      weak: 'That PIN is too easy to guess. Please choose a different one.',
    },
  },
  hi: {
    start: 'चलिए शुरू करते हैं',
    signin: 'साइन इन', signup: 'अकाउंट बनाएं', guest: 'गेस्ट',
    username: 'यूज़रनेम', usernameHint: 'कोई बनाया हुआ नाम चुनें, जैसे lotus_asha। फ़ोन नंबर या असली नाम नहीं।',
    name: 'आपका नाम', nameHint: 'यह सिर्फ़ इसी डिवाइस पर रहता है।',
    age: 'आपकी उम्र', selectAge: 'उम्र चुनें',
    pin: '6 अंकों का पिन', pinConfirm: 'पिन दोबारा डालें', showPin: 'पिन दिखाएं', hidePin: 'पिन छिपाएं',
    language: 'पसंदीदा भाषा',
    createBtn: 'मेरा अकाउंट बनाएं', signinBtn: 'साइन इन करें', guestBtn: 'गेस्ट के रूप में जारी रखें', recoverBtn: 'मेरी प्रगति वापस लाएं',
    forgot: 'पिन भूल गईं?', backToSignin: 'साइन इन पर वापस',
    privacy: 'हम आपका फ़ोन नंबर या ईमेल कभी नहीं मांगते।',
    guestNote: 'गेस्ट के रूप में आप Ask AI, सीखना, गेम्स, टेस्ट और योजनाएं आज़मा सकती हैं। आपकी प्रगति सिर्फ़ इसी डिवाइस पर रहती है।',
    guestLocked: (names) => `अकाउंट चाहिए: ${names}।`,
    recoverTitle: 'रिकवरी कोड से वापस पाएं',
    recoverHint: 'पिन भूल गईं? नया यूज़रनेम और पिन चुनें और सेव किया हुआ रिकवरी कोड डालें। आपकी प्रगति नए अकाउंट में आ जाएगी।',
    recoveryCode: 'रिकवरी कोड',
    welcomeBack: (n) => `वापसी पर स्वागत है, ${n}`, goDashboard: 'मेरे डैशबोर्ड पर जाएं', signOut: 'साइन आउट',
    codeTitle: 'अपना रिकवरी कोड सेव करें',
    codeText: 'अगर आप कभी पिन भूल गईं, तो अपनी प्रगति वापस पाने का यही एकमात्र तरीका है। यह सिर्फ़ एक बार दिखता है और कोई इसे दोबारा नहीं निकाल सकता। इसे लिख लें या स्क्रीनशॉट ले लें।',
    codeFailed: 'अभी रिकवरी कोड नहीं बन पाया। आप इसे बाद में प्रोफ़ाइल पेज पर बना सकती हैं।',
    copy: 'कॉपी करें', copied: 'कॉपी हो गया', savedIt: 'मैंने अपना कोड सेव कर लिया', continue: 'आगे बढ़ें',
    carryUp: 'इस डिवाइस पर गेस्ट मोड की प्रगति सेव है। क्या इसे आपके नए अकाउंट में जोड़ें?',
    carryIn: 'इस डिवाइस पर गेस्ट मोड की प्रगति सेव है। क्या इसे आपके अकाउंट में जोड़ें?\n\nसिर्फ़ अकाउंट की अपनी प्रगति रखने के लिए Cancel चुनें।',
    loading: 'लोड हो रहा है...',
    or: 'या',
    noBackend: 'इस संस्करण में अकाउंट अभी चालू नहीं हैं। आप नीचे गेस्ट के रूप में जारी रख सकती हैं।',
    hideGuest: 'छिपाएं',
    e: {
      empty: 'एक यूज़रनेम चुनें।',
      format: '3 से 20 अक्षर, अंक या अंडरस्कोर (_) इस्तेमाल करें।',
      phone: 'कृपया फ़ोन नंबर न डालें। कोई बनाया हुआ नाम चुनें।',
      pinFormat: 'आपका पिन ठीक 6 अंकों का होना चाहिए।',
      pinWeak: 'यह पिन बहुत आसान है। 123456, 000000 या दोहराए अंकों से बचें।',
      mismatch: 'दोनों पिन मेल नहीं खाते।',
      needName: 'कृपया अपना नाम डालें।',
      needAge: 'कृपया अपनी उम्र चुनें।',
      needCode: 'कृपया पूरा रिकवरी कोड डालें।',
      taken: 'यह यूज़रनेम पहले से लिया जा चुका है। दूसरा आज़माएं।',
      invalid: 'यूज़रनेम या पिन सही नहीं है।',
      rate_limited: 'बहुत ज़्यादा कोशिशें हुईं। कुछ मिनट रुकें।',
      network: 'इंटरनेट नहीं है। कृपया फिर कोशिश करें।',
      confirm_required: 'साइन-अप तैयार नहीं है: प्रोजेक्ट अभी ईमेल पुष्टि मांगता है। ऐप के मालिक को इसे बंद करना होगा।',
      codeNotFound: 'यह रिकवरी कोड पहचाना नहीं गया। जांचकर फिर कोशिश करें।',
      unknown: 'कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।',
      noBackend: 'इस संस्करण में अकाउंट अभी चालू नहीं हैं।',
      weak: 'यह पिन बहुत आसान है। कृपया कोई दूसरा पिन चुनें।',
    },
  },
};

const AGES = ['10-14', '15-22', '23-35', '35+'];
const MODES = ['signin', 'signup', 'guest'];

// The first thing on the landing page: sign in, create an account, or carry on as a guest.
const AuthCard = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { lang, setLang } = useLanguage();
  const ui = TEXT[lang];
  const auth = useAuth();

  // signin | signup | guest | recover | code. With no backend the account tabs can't work, so start on Guest.
  const [mode, setMode] = useState(accountsEnabled ? (MODES.includes(params.get('mode')) ? params.get('mode') : 'signup') : 'guest');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [codeFailed, setCodeFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeSaved, setCodeSaved] = useState(false);
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setPin('');
    setPin2('');
  };

  const showError = (key) => setError(ui.e[key] || ui.e.unknown);

  const usernameError = () => {
    const code = validateUsername(username);
    return code ? ui.e[code] : '';
  };
  const pinError = () => {
    const code = validatePin(pin);
    if (code) return ui.e[code === 'weak' ? 'pinWeak' : 'pinFormat'];
    return '';
  };

  // Guest progress left on this device: ask before it moves into an account.
  const askAboutGuestProgress = (message) => {
    if (hasLocalProgress() && !window.confirm(message)) clearLocalProgress();
  };

  // ----- who is on this device -----
  const rememberPerson = (handle, details = {}) => {
    const previous = localStorage.getItem('lastAccountUsername');
    if (previous !== handle) {
      // A different person last used this device: start her name and age fresh.
      localStorage.removeItem('userName');
      localStorage.removeItem('userAge');
    }
    localStorage.setItem('lastAccountUsername', handle);
    if (details.name) localStorage.setItem('userName', details.name);
    else if (!localStorage.getItem('userName')) localStorage.setItem('userName', handle);
    if (details.age) localStorage.setItem('userAge', details.age);
  };

  // ----- the four actions -----
  const handleGuest = (e) => {
    e.preventDefault();
    if (!name.trim()) return showError('needName');
    if (!age) return showError('needAge');
    localStorage.setItem('userName', name.trim());
    localStorage.setItem('userAge', age);
    navigate('/dashboard');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!accountsEnabled) return showError('noBackend');
    const handle = normaliseUsername(username);
    if (!handle) return showError('empty');
    if (!/^\d{6}$/.test(pin)) return showError('pinFormat');
    setBusy(true);
    setError('');
    const result = await signInWithPin(handle, pin);
    setBusy(false);
    if (!result.ok) return showError(result.reason);
    askAboutGuestProgress(ui.carryIn);
    rememberPerson(handle);
    navigate('/dashboard');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!accountsEnabled) return showError('noBackend');
    const uErr = usernameError();
    if (uErr) return setError(uErr);
    if (!name.trim()) return showError('needName');
    if (!age) return showError('needAge');
    const pErr = pinError();
    if (pErr) return setError(pErr);
    if (pin !== pin2) return showError('mismatch');

    setBusy(true);
    setError('');
    const handle = normaliseUsername(username);
    const result = await signUpWithPin(handle, pin);
    if (!result.ok) {
      setBusy(false);
      return showError(result.reason);
    }
    askAboutGuestProgress(ui.carryUp);
    rememberPerson(handle, { name: name.trim(), age });

    // Show the recovery code straight away: it is the only way back if she forgets her PIN.
    try {
      setNewCode(await createRecoveryCode());
    } catch {
      setCodeFailed(true);
    }
    setBusy(false);
    setMode('code');
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    if (!accountsEnabled) return showError('noBackend');
    const uErr = usernameError();
    if (uErr) return setError(uErr);
    const pErr = pinError();
    if (pErr) return setError(pErr);
    if (pin !== pin2) return showError('mismatch');
    if (recoveryInput.replace(/[^A-Za-z0-9]/g, '').length < 20) return showError('needCode');

    setBusy(true);
    setError('');
    const handle = normaliseUsername(username);
    const created = await signUpWithPin(handle, pin);
    if (!created.ok) {
      setBusy(false);
      return showError(created.reason);
    }
    try {
      const found = await restoreWithCode(recoveryInput);
      if (!found) {
        await deleteMyData(); // undo the empty account we just made, so the username is free again
        setBusy(false);
        return showError('codeNotFound');
      }
    } catch {
      setBusy(false);
      return showError('unknown');
    }
    rememberPerson(handle);
    // A full load, so her restored language and progress are picked up everywhere.
    window.location.assign(appUrl('/dashboard'));
    return undefined;
  };

  const handleSignOut = async () => {
    if (!confirmSignOut(lang)) return;
    await signOutDevice();
    localStorage.clear(); // the next person on this device starts clean
    window.location.reload();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(newCode);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: she can still read the code on screen
    }
  };

  // ----- small pieces -----
  const languageField = (prefix = 'auth') => (
    <Field label={ui.language} id={`${prefix}-language`}>
      <select id={`${prefix}-language`} value={lang} onChange={(e) => setLang(e.target.value)} style={styles.input}>
        <option value="en">English</option>
        <option value="hi">हिंदी (Hindi)</option>
      </select>
    </Field>
  );

  const pinField = (id, label, value, setValue, autoComplete) => (
    <Field label={label} id={id}>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={showPin ? 'text' : 'password'}
          inputMode="numeric"
          autoComplete={autoComplete}
          maxLength={6}
          value={value}
          onChange={(e) => setValue(onlyDigits(e.target.value))}
          style={{ ...styles.input, letterSpacing: showPin ? '0.3em' : '0.2em', paddingRight: '48px' }}
          placeholder="••••••"
        />
        <button
          type="button"
          style={styles.eye}
          onClick={() => setShowPin((s) => !s)}
          aria-label={showPin ? ui.hidePin : ui.showPin}
          title={showPin ? ui.hidePin : ui.showPin}
        >
          {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </Field>
  );

  const usernameField = (hint = true) => (
    <Field label={ui.username} id="auth-username" hint={hint ? ui.usernameHint : ''}>
      <input
        id="auth-username"
        type="text"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={20}
        value={username}
        onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
        style={styles.input}
        placeholder="lotus_asha"
      />
    </Field>
  );

  const ageField = (prefix = 'auth') => (
    <Field label={ui.age} id={`${prefix}-age`}>
      <select id={`${prefix}-age`} value={age} onChange={(e) => setAge(e.target.value)} style={styles.input}>
        <option value="" disabled>{ui.selectAge}</option>
        {AGES.map((a) => <option key={a} value={a}>{a === '35+' ? '35+' : a.replace('-', ' - ')}</option>)}
      </select>
    </Field>
  );

  const nameField = (prefix = 'auth') => (
    <Field label={ui.name} id={`${prefix}-name`} hint={ui.nameHint}>
      <input id={`${prefix}-name`} type="text" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} placeholder="Ex: Priya" />
    </Field>
  );

  const errorLine = error && <p style={styles.error} role="alert">{error}</p>;
  const privacyLine = (
    <div style={styles.privacy}>
      <ShieldCheck size={16} color="var(--success)" />
      <span>{ui.privacy}</span>
    </div>
  );

  // ----- screens -----
  let body = null;

  if (accountsEnabled && auth.status === 'loading') {
    body = <p className="subtext">{ui.loading}</p>;
  } else if (mode === 'code') {
    body = (
      <>
        <h2 className="h2" style={styles.title}><KeyRound size={22} /> {ui.codeTitle}</h2>
        {codeFailed ? (
          <p style={{ marginBottom: '16px' }}>{ui.codeFailed}</p>
        ) : (
          <>
            <p style={{ marginBottom: '12px', fontSize: '0.95rem' }}>{ui.codeText}</p>
            <div style={styles.codeBox}>
              <div style={styles.code}>{newCode}</div>
              <button type="button" className="btn btn-secondary" style={styles.smallBtn} onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? ui.copied : ui.copy}
              </button>
            </div>
            <label style={styles.check}>
              <input type="checkbox" checked={codeSaved} onChange={(e) => setCodeSaved(e.target.checked)} />
              <span>{ui.savedIt}</span>
            </label>
          </>
        )}
        <button type="button" className="btn btn-primary" style={styles.submit} disabled={!codeFailed && !codeSaved} onClick={() => navigate('/dashboard')}>
          {ui.continue}
        </button>
      </>
    );
  } else if (accountsEnabled && auth.status === 'signedIn') {
    body = (
      <>
        <h2 className="h2" style={styles.title}>{ui.welcomeBack(auth.username)}</h2>
        <button type="button" className="btn btn-primary" style={styles.submit} onClick={() => navigate('/dashboard')}>{ui.goDashboard}</button>
        <button type="button" className="btn btn-secondary" style={{ ...styles.submit, marginTop: '10px' }} onClick={handleSignOut}>{ui.signOut}</button>
      </>
    );
  } else if (mode === 'signin') {
    body = (
      <form onSubmit={handleSignIn} noValidate>
        <div style={styles.grid}>
          {usernameField(false)}
          {pinField('auth-pin', ui.pin, pin, setPin, 'current-password')}
        </div>
        <div style={styles.grid}>{languageField()}</div>
        {errorLine}
        <button type="submit" className="btn btn-primary" style={styles.submit} disabled={busy || !accountsEnabled}>{busy ? '...' : ui.signinBtn}</button>
        <button type="button" style={styles.link} onClick={() => switchMode('recover')}>{ui.forgot}</button>
        {privacyLine}
      </form>
    );
  } else if (mode === 'signup') {
    body = (
      <form onSubmit={handleSignUp} noValidate>
        <div style={styles.grid}>
          {usernameField()}
          {nameField()}
        </div>
        <div style={styles.grid}>
          {ageField()}
          {languageField()}
        </div>
        <div style={styles.grid}>
          {pinField('auth-pin', ui.pin, pin, setPin, 'new-password')}
          {pinField('auth-pin2', ui.pinConfirm, pin2, setPin2, 'new-password')}
        </div>
        {errorLine}
        <button type="submit" className="btn btn-primary" style={styles.submit} disabled={busy || !accountsEnabled}>{busy ? '...' : ui.createBtn}</button>
        {privacyLine}
      </form>
    );
  } else if (mode === 'recover') {
    body = (
      <form onSubmit={handleRecover} noValidate>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{ui.recoverTitle}</h3>
        <p className="subtext" style={{ fontSize: '0.9rem', marginBottom: '14px' }}>{ui.recoverHint}</p>
        <div style={styles.grid}>
          {usernameField()}
          <Field label={ui.recoveryCode} id="auth-recovery">
            <input
              id="auth-recovery"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={recoveryInput}
              onChange={(e) => setRecoveryInput(e.target.value.toUpperCase())}
              style={{ ...styles.input, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}
              placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
            />
          </Field>
        </div>
        <div style={styles.grid}>
          {pinField('auth-pin', ui.pin, pin, setPin, 'new-password')}
          {pinField('auth-pin2', ui.pinConfirm, pin2, setPin2, 'new-password')}
        </div>
        {errorLine}
        <button type="submit" className="btn btn-primary" style={styles.submit} disabled={busy || !accountsEnabled}>{busy ? '...' : ui.recoverBtn}</button>
        <button type="button" style={styles.link} onClick={() => switchMode('signin')}>{ui.backToSignin}</button>
      </form>
    );
  } else if (mode === 'guest') {
    body = (
      <form onSubmit={handleGuest} noValidate>
        <div style={styles.grid}>
          {nameField()}
          {ageField()}
        </div>
        <div style={styles.grid}>{languageField()}</div>
        <p className="subtext" style={{ fontSize: '0.88rem', marginBottom: '6px' }}>{ui.guestNote}</p>
        {accountsEnabled && (
          <p className="subtext" style={{ fontSize: '0.88rem', marginBottom: '6px' }}>
            {ui.guestLocked(GUEST_LOCKED.map((entry) => entry.label[lang]).join(', '))}
          </p>
        )}
        {errorLine}
        <button type="submit" className="btn btn-primary" style={styles.submit}>{ui.guestBtn}</button>
        {privacyLine}
      </form>
    );
  }

  const signedIn = accountsEnabled && auth.status === 'signedIn';
  const checking = accountsEnabled && auth.status === 'loading';
  // The three options are always shown. Without a backend the two account tabs are visible but switched off.
  const showTabs = mode !== 'code' && !signedIn && !checking;
  const activeTab = mode === 'recover' ? 'signin' : mode;

  return (
    <div style={styles.card} className="hover-card pop-in">
      {mode !== 'code' && !signedIn && (
        <h2 className="h2" style={{ marginBottom: '16px', fontSize: '1.5rem' }}>{ui.start}</h2>
      )}
      {showTabs && (
        <div role="tablist" style={styles.tabs}>
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={activeTab === m}
              onClick={() => switchMode(m)}
              style={{ ...styles.tab, ...(activeTab === m ? styles.tabOn : {}) }}
            >
              {ui[m]}
            </button>
          ))}
        </div>
      )}
      {!accountsEnabled && !signedIn && mode !== 'guest' && <p style={styles.notice} role="status">{ui.noBackend}</p>}
      {body}
    </div>
  );
};

const Field = ({ label, id, hint, children }) => (
  <div style={{ marginBottom: '14px', minWidth: 0 }}>
    <label htmlFor={id} style={styles.label}>{label}</label>
    {children}
    {hint && <span style={styles.hint}>{hint}</span>}
  </div>
);

const styles = {
  card: { width: '100%', backgroundColor: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(255,143,171,0.3)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', columnGap: '16px' },
  title: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontSize: '1.5rem' },
  tabs: { display: 'flex', gap: '6px', padding: '4px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', marginBottom: '20px' },
  tab: { flex: 1, padding: '8px 6px', borderRadius: 'var(--radius-full)', fontFamily: 'inherit', fontWeight: '600', fontSize: '0.92rem', color: 'var(--text-muted)' },
  tabOn: { backgroundColor: 'var(--primary)', color: '#fff' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '500', color: 'var(--text-dark)', fontSize: '0.95rem' },
  input: { width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', fontSize: '1rem', fontFamily: 'inherit', outline: 'none', backgroundColor: 'var(--bg-color)' },
  hint: { display: 'block', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' },
  eye: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', padding: '4px' },
  error: { color: 'var(--danger)', fontWeight: '500', fontSize: '0.92rem', margin: '4px 0 10px' },
  submit: { width: '100%', marginTop: '8px', fontSize: '1.05rem', padding: '13px' },
  link: { display: 'block', margin: '12px auto 0', color: 'var(--primary-dark)', fontWeight: '600', fontFamily: 'inherit', fontSize: '0.92rem' },
  privacy: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-muted)' },
  codeBox: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', padding: '14px', backgroundColor: '#fffbeb', border: '1px solid #f6e05e', borderRadius: 'var(--radius-md)', marginBottom: '12px' },
  code: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: '1.15rem', fontWeight: '700', letterSpacing: '0.06em', wordBreak: 'break-all', color: 'var(--text-dark)' },
  smallBtn: { padding: '8px 14px', fontSize: '0.9rem' },
  check: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' },
  notice: { padding: '10px 14px', marginBottom: '16px', backgroundColor: '#fffbeb', border: '1px solid #f6e05e', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-dark)' },
  guestSection: { marginTop: '20px' },
  orRow: { position: 'relative', borderTop: '1px solid var(--border-color)', margin: '6px 0 24px' },
  orText: { position: 'absolute', top: '-0.75em', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--surface)', padding: '0 14px', fontSize: '0.85rem', color: 'var(--text-light)' },
};

export default AuthCard;
