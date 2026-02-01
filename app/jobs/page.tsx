"use client";

import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { useTranslation } from "react-i18next";

export default function JobsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-[60vh] py-16">
      <ResponsiveContainer>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {t("hero.exploreJobs")}
          </h1>
          <p className="text-slate-600">
            Jobs section coming soon. Connect with employers and job seekers.
          </p>
        </div>
      </ResponsiveContainer>
    </main>
  );
}
