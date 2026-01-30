import React from 'react';
import { ModeToggle } from './ModeToggle';

interface JobsHeaderProps {
  isHiringMode: boolean;
  onModeChange: (isHiring: boolean) => void;
}

export const JobsHeader: React.FC<JobsHeaderProps> = ({ 
  isHiringMode, 
  onModeChange 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
      <div>
        <span className="text-nepal-red font-bold text-xs uppercase tracking-wider mb-2 block">
          Talent Ecosystem
        </span>
        <h1 className="text-3xl font-bold text-slate-900">
          {isHiringMode ? 'Employer Dashboard' : 'Career Opportunities'}
        </h1>
        <p className="text-slate-500 mt-2 text-sm max-w-md">
          {isHiringMode 
            ? 'Manage your job postings and find the best talent for your team.' 
            : 'Connect with top employers and find your next role in the B2B ecosystem.'
          }
        </p>
      </div>
      
      <ModeToggle isHiringMode={isHiringMode} onModeChange={onModeChange} />
    </div>
  );
};
