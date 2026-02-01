import React from 'react';
import { Job } from '@/types/types';
import { MapPin, Clock, Banknote, Building2, ChevronRight, Edit, CheckCircle2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  onEdit?: (job: Job) => void;
  onClick?: (job: Job) => void;
  showApplyButton?: boolean;
  showEditButton?: boolean;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  onEdit,
  onClick,
  showApplyButton = true,
  showEditButton = false,
  compact = false
}) => {
  const handleCardClick = () => {
    if (onClick) onClick(job);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) onApply(job);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(job);
  };

  if (compact) {
    return (
      <div
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick ? handleCardClick : undefined}
        onKeyDown={onClick ? (e) => e.key === "Enter" && handleCardClick() : undefined}
        className={`px-4 py-3 hover:bg-gray-50/50 transition-colors group ${onClick ? "cursor-pointer" : ""}`}
      >
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
          </div>
          <span className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-semibold uppercase shrink-0">
            {job.type}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" /> {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Banknote className="w-3 h-3 shrink-0" /> {job.salaryRange}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 shrink-0" /> {job.postedDate}
          </span>
        </div>
        {showEditButton && onEdit && (
          <div className="mt-2 pt-2 flex justify-end">
            <button
              onClick={handleEditClick}
              className="text-xs font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1"
            >
              <Edit className="w-3 h-3" /> Edit
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick ? handleCardClick : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && handleCardClick() : undefined}
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-blue-600/30 hover:shadow-md transition-all group ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {job.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-600 mt-1 font-medium">
          <Building2 className="w-4 h-4" />
          <span>{job.company}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Banknote className="w-3.5 h-3.5" /> {job.salaryRange}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> {job.postedDate}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-6 border-t border-slate-50 pt-4">
        <span className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide shrink-0">
          {job.type}
        </span>
        <div className="flex gap-2 flex-wrap min-w-0 flex-1 justify-center">
          {job.requirements.map(req => (
            <span 
              key={req} 
              className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 font-medium"
            >
              {req}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showEditButton && onEdit && (
            <button
              type="button"
              onClick={handleEditClick}
              className="text-xs font-bold text-slate-900 group-hover:translate-x-1 transition-transform flex items-center gap-1 hover:text-blue-600"
            >
              <Edit className="w-3 h-3" /> Edit
            </button>
          )}
          {showApplyButton && (
            <>
              {job.isApplied ? (
                <div className="text-xs font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Already Applied
                </div>
              ) : onApply ? (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="text-xs font-bold text-slate-900 group-hover:translate-x-1 transition-transform flex items-center gap-1 hover:text-blue-600"
                >
                  Apply <ChevronRight className="w-3 h-3" />
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
