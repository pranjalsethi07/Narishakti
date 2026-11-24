import { useState, useEffect, useCallback, useMemo } from 'react';
import { translations } from './translations';
import { LanguageContext } from './languageContextValue';

const getInitialLang = () => {
  try {
    const saved = localStorage.getItem('appLang');
    return saved in translations ? saved : 'en';
  } catch {
    return 'en';
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    try {
      localStorage.setItem('appLang', lang);
    } catch {
      // storage unavailable; ignore
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLanguage, t }),
    [lang, toggleLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
