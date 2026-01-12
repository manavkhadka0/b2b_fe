import { useTranslation } from "react-i18next";

/**
 * Custom hook for translations
 * Provides a convenient wrapper around react-i18next's useTranslation
 * 
 * @example
 * const { t } = useTranslation();
 * <h1>{t("common.home")}</h1>
 */
export function useAppTranslation() {
  return useTranslation();
}
