"use client";

import { ResponsiveContainer } from "../common/responsive-container";
import { HeaderSubtitle } from "../common/header-subtitle";
import { useTranslation } from "react-i18next";

export default function ObjectivesSection() {
  const { t } = useTranslation();

  const objectives = [
    {
      title: t("objectives.enhanceNetworking.title"),
      description: t("objectives.enhanceNetworking.description"),
    },
    {
      title: t("objectives.promoteCollaboration.title"),
      description: t("objectives.promoteCollaboration.description"),
    },
    {
      title: t("objectives.supportLocal.title"),
      description: t("objectives.supportLocal.description"),
    },
    {
      title: t("objectives.showcaseInvestment.title"),
      description: t("objectives.showcaseInvestment.description"),
    },
    {
      title: t("objectives.inclusiveGrowth.title"),
      description: t("objectives.inclusiveGrowth.description"),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50/60 via-white to-purple-50/60">
      <ResponsiveContainer className="py-10 md:py-14">
        <HeaderSubtitle
          title={t("objectives.title")}
          subtitle={t("objectives.subtitle")}
        />

        <div className="mt-10 md:mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {objectives.map((item, index) => (
            <div
              key={index}
              className="h-full rounded-xl bg-white/90 border border-blue-50 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-7 flex flex-col"
            >
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </div>
  );
}
