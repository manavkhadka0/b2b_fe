"use client";

import { ResponsiveContainer } from "../common/responsive-container";
import { HeaderSubtitle } from "../common/header-subtitle";
import { useTranslation } from "react-i18next";

export default function AboutUs() {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("about.enterpriseSolutions.title"),
      description: t("about.enterpriseSolutions.description"),
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: t("about.streamlinedProcess.title"),
      description: t("about.streamlinedProcess.description"),
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: t("about.partnershipDevelopment.title"),
      description: t("about.partnershipDevelopment.description"),
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50">
      <ResponsiveContainer className="py-10">
        <HeaderSubtitle
          title={t("about.title")}
          subtitle={t("about.subtitle")}
        />

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </div>
  );
}
