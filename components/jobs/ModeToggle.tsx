import React from 'react';

interface ModeToggleProps {
  isHiringMode: boolean;
  onModeChange: (isHiring: boolean) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ 
  isHiringMode, 
  onModeChange 
}) => {
  return (
    <div className="flex items-center gap-4 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
      <button 
        onClick={() => onModeChange(false)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          !isHiringMode 
            ? 'bg-slate-900 text-white shadow' 
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        Find a Job
      </button>
      <button 
        onClick={() => onModeChange(true)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          isHiringMode 
            ? 'bg-slate-900 text-white shadow' 
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        I'm Hiring
      </button>
    </div>
  );
};
