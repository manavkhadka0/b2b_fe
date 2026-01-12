"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { changeLanguage, currentLanguage } = useI18n();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Update HTML lang attribute on mount
    if (typeof document !== "undefined") {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  if (!mounted) {
    return null;
  }

  const languages = [
    { code: "en", label: t("common.english"), native: "English" },
    { code: "ne", label: t("common.nepali"), native: "नेपाली" },
  ];

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 h-9 px-3"
          aria-label={t("common.language")}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${
              currentLanguage === lang.code ? "bg-accent font-semibold" : ""
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>{lang.native}</span>
              {currentLanguage === lang.code && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
