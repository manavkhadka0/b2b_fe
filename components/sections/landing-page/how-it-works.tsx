"use client";

import { ResponsiveContainer } from "../common/responsive-container";
import { useTranslation } from "react-i18next";
import { UserPlus, FileText, Zap, Handshake } from "lucide-react";
import Link from "next/link";

const steps = [
  { key: "step1", icon: UserPlus, number: "01" },
  { key: "step2", icon: FileText, number: "02" },
  { key: "step3", icon: Zap, number: "03" },
  { key: "step4", icon: Handshake, number: "04" },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <ResponsiveContainer>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-slate-600 text-lg">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="relative">
                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-1/2 h-px bg-slate-200" />
                )}

                <div className="relative text-center">
                  <div className="inline-flex flex-col items-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-sm relative z-10">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mt-4 mb-2">
                      {t(`howItWorks.${step.key}.title`)}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-[200px] mx-auto">
                      {t(`howItWorks.${step.key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/howtoapply"
            className="inline-flex items-center gap-2 px-6 py-3 text-blue-600 font-semibold rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 transition-colors"
          >
            {t("navigation.howToApply")}
          </Link>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
