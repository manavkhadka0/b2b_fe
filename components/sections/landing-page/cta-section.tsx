"use client";

import Link from "next/link";
import Image from "next/image";
import { ResponsiveContainer } from "../common/responsive-container";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[280px] py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/dhankuta.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-slate-900/60" />
      </div>

      <ResponsiveContainer className="relative z-10 h-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 min-h-[200px]">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {t("ctaSection.title")}
            </h2>
            <p className="text-slate-200 text-base md:text-lg mt-1">
              {t("ctaSection.subtitle")}
            </p>
          </div>
          <Link
            href="/wishOffer/wishes/create-wish"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shrink-0 whitespace-nowrap"
          >
            {t("ctaSection.button")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
