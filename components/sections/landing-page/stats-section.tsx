"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer } from "../common/responsive-container";
import {
  Heart,
  Gift,
  Calendar,
  Briefcase,
  Users,
  Compass,
  Building2,
  FileCheck,
} from "lucide-react";

interface StatsData {
  wishes_count?: number;
  offers_count?: number;
  upcoming_events_count?: number;
  past_events_count?: number;
  jobs_count?: number;
  skilled_workforce_roster_count?: number;
  work_interest_count?: number;
  companies_placing_jobs_count?: number;
  mdmu_registration_count?: number;
}

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad formula: progress * (2 - progress)
      const easedProgress = progress * (2 - progress);
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return <>{count.toLocaleString()}</>;
}

const STAT_CONFIG = [
  {
    key: "wishes_count",
    label: "Wishes",
    icon: Heart,
    color: "text-rose-600 bg-rose-50 border-rose-100",
    getValue: (s: StatsData) => s.wishes_count ?? 0,
  },
  {
    key: "offers_count",
    label: "Offers",
    icon: Gift,
    color: "text-amber-600 bg-amber-50 border-amber-100",
    getValue: (s: StatsData) => s.offers_count ?? 0,
  },
  {
    key: "events_count",
    label: "B2B Events",
    icon: Calendar,
    color: "text-blue-600 bg-blue-50 border-blue-100",
    getValue: (s: StatsData) =>
      (s.upcoming_events_count ?? 0) + (s.past_events_count ?? 0),
    subText: (s: StatsData) =>
      `${s.upcoming_events_count ?? 0} Upcoming • ${s.past_events_count ?? 0} Past`,
  },
  {
    key: "jobs_count",
    label: "Active Jobs",
    icon: Briefcase,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    getValue: (s: StatsData) => s.jobs_count ?? 0,
  },
  {
    key: "skilled_workforce_roster_count",
    label: "Skilled Workforce Roster",
    icon: Users,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    getValue: (s: StatsData) => s.skilled_workforce_roster_count ?? 0,
  },
  {
    key: "work_interest_count",
    label: "Work Interests",
    icon: Compass,
    color: "text-teal-600 bg-teal-50 border-teal-100",
    getValue: (s: StatsData) => s.work_interest_count ?? 0,
  },
  {
    key: "companies_placing_jobs_count",
    label: "Companies Placing Jobs",
    icon: Building2,
    color: "text-cyan-600 bg-cyan-50 border-cyan-100",
    getValue: (s: StatsData) => s.companies_placing_jobs_count ?? 0,
  },
  {
    key: "mdmu_registration_count",
    label: "MDMU Registrations",
    icon: FileCheck,
    color: "text-orange-600 bg-orange-50 border-orange-100",
    getValue: (s: StatsData) => s.mdmu_registration_count ?? 0,
  },
] as const;

export default function StatsSection() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("https://cim.baliyoventures.com/api/stats/");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <section className="py-10 md:py-14">
      <ResponsiveContainer>
        <div className="mb-8 text-center max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Platform Statistics
          </h2>
          <p className="text-slate-500 text-sm md:text-base">
            Real-time insights and growth metrics across our ecosystem
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-slate-100 bg-white animate-pulse flex flex-col justify-between h-24"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-md bg-slate-200" />
                  <div className="h-3.5 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-6 bg-slate-200 rounded w-1/3 mt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            Unable to load live statistics at the moment.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {STAT_CONFIG.map((item) => {
              const Icon = item.icon;
              const val = stats ? item.getValue(stats) : 0;
              const subText = stats && item.subText ? item.subText(stats) : null;

              return (
                <div
                  key={item.key}
                  className="p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-center space-x-2.5 mb-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 truncate">
                      {item.label}
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      <CountUp target={val} />
                    </div>
                    {subText && (
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {subText}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ResponsiveContainer>
    </section>
  );
}
