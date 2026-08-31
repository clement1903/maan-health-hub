import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

const STORAGE_KEY = "maan.lang";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** t("texte français", "english text") */
  t: (fr: string, en: string) => string;
};

const I18nContext = createContext<Ctx>({
  lang: "fr",
  setLang: () => {},
  t: (fr) => fr,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  // Le rendu serveur part toujours du français pour éviter tout décalage d'hydratation.
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "fr") {
      setLangState(stored);
      return;
    }
    if (navigator.language && !navigator.language.toLowerCase().startsWith("fr")) {
      setLangState("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const t = useCallback((fr: string, en: string) => (lang === "en" ? en : fr), [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
