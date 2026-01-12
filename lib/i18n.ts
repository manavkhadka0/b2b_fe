import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "@/locales/en.json";
import neTranslations from "@/locales/ne.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  ne: {
    translation: neTranslations,
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: ["en", "ne"],
      defaultNS: "translation",
      ns: ["translation"],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator", "htmlTag"],
        caches: ["localStorage"],
        lookupLocalStorage: "i18nextLng",
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
