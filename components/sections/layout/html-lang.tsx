"use client";

import { useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";

export function HtmlLang() {
  const { currentLanguage } = useI18n();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  return null;
}
