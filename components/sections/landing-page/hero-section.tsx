"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ResponsiveContainer } from "../common/responsive-container";
import { useTranslation } from "react-i18next";
import { ChevronRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-50">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Soft gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-indigo-100/30 blur-3xl" />

      <ResponsiveContainer className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr,420px] xl:grid-cols-[1fr,480px] gap-8 sm:gap-12 items-center">
          <div className="max-w-2xl min-w-0">
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white border border-slate-200/80 shadow-sm mb-4 sm:mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              className="text-2xl font-bold text-slate-900 tracking-tight leading-[1.15] mb-4 sm:text-4xl sm:mb-6 md:text-5xl lg:text-6xl"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t("hero.title")}{" "}
              <span className="text-blue-600">{t("hero.subtitle")}</span>
            </motion.h1>

            <motion.p
              className="text-sm text-slate-600 leading-relaxed mb-6 max-w-2xl sm:text-base md:text-lg lg:text-xl sm:mb-8 md:mb-10"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 md:gap-3"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href="/wishOffer"
                className="col-span-2 sm:col-span-1 order-first min-w-0"
              >
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 w-full min-h-[44px] px-2.5 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 bg-white text-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors leading-tight text-center overflow-hidden min-w-0"
                >
                  <span className="truncate min-w-0">
                    {t("hero.exploreWishOffer")}
                  </span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                </button>
              </Link>
              <Link href="/events" className="min-w-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 w-full min-h-[44px] px-2.5 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 bg-white text-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors leading-tight text-center overflow-hidden min-w-0"
                >
                  <span className="truncate min-w-0">
                    {t("hero.exploreEvents")}
                  </span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                </button>
              </Link>
              <Link href="/jobs" className="min-w-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 w-full min-h-[44px] px-2.5 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 bg-white text-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors leading-tight text-center overflow-hidden min-w-0"
                >
                  <span className="truncate min-w-0">
                    {t("hero.exploreJobs")}
                  </span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                </button>
              </Link>
              <Link href="/display-zone" className="min-w-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 w-full min-h-[44px] px-2.5 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 bg-white text-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors leading-tight text-center overflow-hidden min-w-0"
                >
                  <span className="truncate min-w-0">
                    {t("hero.exploreDisplayZone")}
                  </span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                </button>
              </Link>
              <Link href="/co-working-space" className="min-w-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 w-full min-h-[44px] px-2.5 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 bg-white text-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors leading-tight text-center overflow-hidden min-w-0"
                >
                  <span className="truncate min-w-0">
                    {t("hero.exploreCoWorkingSpace")}
                  </span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                </button>
              </Link>

              <Link href="/mdmu" className="col-span-2 sm:col-span-1 min-w-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 w-full min-h-[44px] px-2.5 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 bg-white text-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors leading-tight text-center overflow-hidden min-w-0"
                >
                  <span className="truncate min-w-0">
                    {t("hero.exploreMdmu")}
                  </span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                </button>
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              className="mt-6 sm:mt-10 md:mt-12 flex flex-wrap gap-x-2 gap-y-1.5 sm:gap-x-4 sm:gap-y-2 text-xs sm:text-sm text-slate-500"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span>{t("hero.pillWish")}</span>
              <span className="text-slate-300">•</span>
              <span>{t("hero.pillOffer")}</span>
              <span className="text-slate-300">•</span>
              <span>{t("hero.pillEvents")}</span>
              <span className="text-slate-300">•</span>
              <span>{t("hero.pillJobs")}</span>
              <span className="text-slate-300">•</span>
              <span>{t("hero.pillDisplayZone")}</span>
              <span className="text-slate-300">•</span>
              <span>{t("hero.pillCoWorkingSpace")}</span>
              <span className="text-slate-300">•</span>
              <span>{t("hero.pillMdmu")}</span>
            </motion.div>
          </div>

          {/* Hero visual - desktop */}
          <motion.div
            className="hidden lg:block order-2"
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img src="/b2b.png" alt="Birat Bazaar" className="w-full h-auto" />
          </motion.div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
