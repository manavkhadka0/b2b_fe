"use client";

import { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

interface I18nContextType {
  t: (key: string, options?: any) => string;
  i18n: any;
  changeLanguage: (lng: string) => Promise<void>;
  currentLanguage: string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Update HTML lang attribute on mount and language change
    if (typeof document !== "undefined") {
      const savedLang = localStorage.getItem("i18nextLng") || "en";
      document.documentElement.lang = savedLang;
    }
  }, []);

  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = i18n.language || "en";
    }
  }, [i18n.language, mounted]);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    // Update HTML lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = lng;
    }
  };

  return (
    <I18nContext.Provider
      value={{
        t,
        i18n,
        changeLanguage,
        currentLanguage: i18n.language || "en",
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
