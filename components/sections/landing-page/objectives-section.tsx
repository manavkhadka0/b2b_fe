"use client";

import { ResponsiveContainer } from "../common/responsive-container";
import { useTranslation } from "react-i18next";
import { Network, Handshake, Building2, TrendingUp, Users } from "lucide-react";

const iconMap = {
  network: Network,
  handshake: Handshake,
  building: Building2,
  trending: TrendingUp,
  users: Users,
};

const objectiveKeys = [
  { key: "enhanceNetworking", icon: "network" as keyof typeof iconMap },
  { key: "promoteCollaboration", icon: "handshake" as keyof typeof iconMap },
  { key: "supportLocal", icon: "building" as keyof typeof iconMap },
];

export default function ObjectivesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-white">
      <ResponsiveContainer>
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-left">
            {t("objectives.title")}
          </h2>
          <p className="text-slate-600 text-lg text-left max-w-2xl">
            {t("objectives.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {objectiveKeys.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={item.key}
                className="p-6 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {t(`objectives.${item.key}.title`)}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t(`objectives.${item.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
