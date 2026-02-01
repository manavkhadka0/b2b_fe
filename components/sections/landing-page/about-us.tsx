"use client";

import { ResponsiveContainer } from "../common/responsive-container";
import { useTranslation } from "react-i18next";
import { Briefcase, Zap, Shield } from "lucide-react";

export default function AboutUs() {
  const { t } = useTranslation();

  const features = [
    {
      key: "enterpriseSolutions",
      icon: Briefcase,
    },
    {
      key: "streamlinedProcess",
      icon: Zap,
    },
    {
      key: "partnershipDevelopment",
      icon: Shield,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <ResponsiveContainer>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t("about.title")}
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              {t("about.subtitle")}
            </p>
            <div className="space-y-6">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {t(`about.${item.key}.title`)}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {t(`about.${item.key}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/80 shadow-sm mb-4">
                  <Briefcase className="w-10 h-10 text-blue-600" />
                </div>
                <p className="text-slate-600 font-medium">
                  {t("about.visualText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
