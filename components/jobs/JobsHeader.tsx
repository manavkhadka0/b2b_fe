import React from "react";
import { ModeToggle } from "./ModeToggle";

interface JobsHeaderProps {
  isHiringMode: boolean;
  onModeChange: (isHiring: boolean) => void;
}

export const JobsHeader: React.FC<JobsHeaderProps> = ({
  isHiringMode,
  onModeChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
      <div>
        <h1 className="text-base sm:text-4xl lg:text-5xl  font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent break-words py-4">
          {isHiringMode
            ? "Employer Dashboard"
            : "Connecting job seekers with employers"}
        </h1>
        <p className="text-slate-500 mt-2 text-sm max-w-md">
          {isHiringMode
            ? "Manage your job postings and find the best talent for your team."
            : "Connect with top employers and find your next role in the B2B ecosystem."}
        </p>
      </div>

      <ModeToggle isHiringMode={isHiringMode} onModeChange={onModeChange} />
    </div>
  );
};
