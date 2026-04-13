import {createContext, useContext, useState, type ReactNode} from 'react';

export type Lang = 'id' | 'en';

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'id',
  toggle: () => {},
});

export function LanguageProvider({children}: {children: ReactNode}) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('nvite-lang');
      if (saved === 'en' || saved === 'id') return saved;
    } catch {}
    return 'id';
  });

  const toggle = () => {
    setLang((prev) => {
      const next: Lang = prev === 'id' ? 'en' : 'id';
      try {
        localStorage.setItem('nvite-lang', next);
      } catch {}
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{lang, toggle}}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
