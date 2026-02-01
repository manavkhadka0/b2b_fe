"use client";

import { ResponsiveContainer } from "../common/responsive-container";
import { useTranslation } from "react-i18next";
import { Heart, Package, Briefcase, Users, Target, Rocket } from "lucide-react";

const features = [
  { key: "businessWishes", icon: Heart, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
  { key: "businessOffers", icon: Package, bgColor: "bg-violet-50", iconColor: "text-violet-600" },
  { key: "jobMatching", icon: Briefcase, bgColor: "bg-emerald-50", iconColor: "text-emerald-600" },
  { key: "inclusiveGrowth", icon: Users, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
  { key: "smartMatching", icon: Target, bgColor: "bg-violet-50", iconColor: "text-violet-600" },
  { key: "localToGlobal", icon: Rocket, bgColor: "bg-amber-50", iconColor: "text-amber-600" },
];

export default function PlatformFeatures() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <ResponsiveContainer>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t("features.title")}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="p-6 bg-white rounded-xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300 group"
              >
                <div
                  className={`w-10 h-10 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t(`features.${feature.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
