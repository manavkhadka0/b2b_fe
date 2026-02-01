import React from 'react';
import { Job } from '@/types/types';
import { MapPin, Clock, Banknote, Building2, ChevronRight, Edit, CheckCircle2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  onEdit?: (job: Job) => void;
  showApplyButton?: boolean;
  showEditButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  onEdit,
  showApplyButton = true,
  showEditButton = false 
}) => {
  const handleApplyClick = () => {
    if (onApply) {
      onApply(job);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(job);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-blue-600/30 hover:shadow-md transition-all group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 mt-1 font-medium">
            <Building2 className="w-4 h-4" />
            <span>{job.company}</span>
          </div>
        </div>
        <span className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide">
          {job.type}
        </span>
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

      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex gap-2">
          {job.requirements.map(req => (
            <span 
              key={req} 
              className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 font-medium"
            >
              {req}
            </span>
          ))}
        </div>
        {showEditButton && onEdit && (
          <button
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
  );
};
