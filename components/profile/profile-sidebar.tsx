"use client";

import { cn } from "@/lib/utils";
import {
  Heart,
  Package,
  Briefcase,
  FileCheck,
  FileText,
  Building2,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const wishesAndOffersTabs = [
  { id: "wishes", label: "My Wishes", icon: Heart, color: "text-blue-600" },
  { id: "offers", label: "My Offers", icon: Package, color: "text-green-600" },
];

const jobbrizTabs = [
  {
    id: "my-jobs",
    label: "My Jobs",
    icon: Briefcase,
    color: "text-purple-600",
  },
  {
    id: "applied-jobs",
    label: "Applied Jobs",
    icon: FileCheck,
    color: "text-orange-600",
  },
  { id: "cv", label: "CV", icon: FileText, color: "text-teal-600" },
  { id: "roster", label: "My Roster", icon: Users, color: "text-indigo-600" },
  {
    id: "institute",
    label: "Institute",
    icon: Building2,
    color: "text-indigo-600",
  },
];

const allTabs = [...wishesAndOffersTabs, ...jobbrizTabs];

function getTabLabel(tabId: string): string {
  return allTabs.find((t) => t.id === tabId)?.label ?? tabId;
}

export function ProfileSidebar({
  activeTab,
  onTabChange,
}: ProfileSidebarProps) {
  return (
    <div className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-gray-200 bg-white p-4 md:p-6">
      {/* Mobile: dropdown select */}
      <div className="md:hidden w-full">
        <Select value={activeTab} onValueChange={onTabChange}>
          <SelectTrigger className="w-full h-11 border-gray-200 bg-white">
            <SelectValue placeholder="Select section">
              <span className="flex items-center gap-2">
                {getTabLabel(activeTab)}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="wishes">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-blue-600" />
                My Wishes
              </span>
            </SelectItem>
            <SelectItem value="offers">
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-green-600" />
                My Offers
              </span>
            </SelectItem>
            <SelectItem value="my-jobs">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" />
                My Jobs
              </span>
            </SelectItem>
            <SelectItem value="applied-jobs">
              <span className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-orange-600" />
                Applied Jobs
              </span>
            </SelectItem>
            <SelectItem value="cv">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                CV
              </span>
            </SelectItem>
            <SelectItem value="roster">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Roster
              </span>
            </SelectItem>
            <SelectItem value="institute">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Institute
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: full sidebar nav */}
      <nav className="hidden md:flex md:flex-col gap-2 md:space-y-0">
        {/* Wishes & Offers */}
        <div className="md:mb-4">
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Wishes & Offers
          </p>
          <div className="flex flex-col gap-1">
            {wishesAndOffersTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors w-full",
                    isActive
                      ? "bg-gray-100 text-gray-900 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? tab.color : "text-gray-400",
                    )}
                  />
                  <span className="text-sm md:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Jobbriz */}
        <div>
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Jobbriz
          </p>
          <div className="flex flex-col gap-1">
            {jobbrizTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors w-full",
                    isActive
                      ? "bg-gray-100 text-gray-900 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? tab.color : "text-gray-400",
                    )}
                  />
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
