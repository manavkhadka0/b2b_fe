"use client";

import { cn } from "@/lib/utils";
import { Heart, Package, Briefcase, FileCheck, FileText } from "lucide-react";

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const wishesAndOffersTabs = [
  { id: "wishes", label: "My Wishes", icon: Heart, color: "text-blue-600" },
  { id: "offers", label: "My Offers", icon: Package, color: "text-green-600" },
];

const jobbrizTabs = [
  { id: "my-jobs", label: "My Jobs", icon: Briefcase, color: "text-purple-600" },
  { id: "applied-jobs", label: "Applied Jobs", icon: FileCheck, color: "text-orange-600" },
  { id: "cv", label: "CV", icon: FileText, color: "text-teal-600" },
];

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  return (
    <div className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-gray-200 bg-white p-4 md:p-6">
      <nav className="flex md:flex-col gap-2 md:space-y-0 overflow-x-auto md:overflow-x-visible">
        {/* Wishes & Offers */}
        <div className="flex-shrink-0 md:mb-4">
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Wishes & Offers
          </p>
          <div className="flex md:flex-col gap-1 md:gap-0">
            {wishesAndOffersTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap flex-shrink-0 w-full",
                    isActive
                      ? "bg-gray-100 text-gray-900 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? tab.color : "text-gray-400")} />
                  <span className="text-sm md:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Jobbriz */}
        <div className="flex-shrink-0">
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Jobbriz
          </p>
          <div className="flex md:flex-col gap-1 md:gap-0">
            {jobbrizTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap flex-shrink-0 w-full",
                    isActive
                      ? "bg-gray-100 text-gray-900 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? tab.color : "text-gray-400")} />
                  <span className="text-sm md:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
