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

      <ResponsiveContainer className="relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr,420px] xl:grid-cols-[1fr,480px] gap-12 items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-600">
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t("hero.title")}{" "}
              <span className="text-blue-600">{t("hero.subtitle")}</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="/wishOffer">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                >
                  {t("hero.exploreWishOffer")}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/jobs">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  {t("hero.exploreJobs")}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              className="mt-12 flex flex-wrap gap-4 text-sm text-slate-500"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span>{t("hero.pillWish")}</span>
              <span className="text-slate-300">•</span>
              <span>{t("hero.pillOffer")}</span>
              <span className="text-slate-300">•</span>
              <span>{t("hero.pillJobs")}</span>
              <span className="text-slate-300">•</span>
              <span>{t("hero.pillEvents")}</span>
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
