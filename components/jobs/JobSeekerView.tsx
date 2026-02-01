import React, { useState, useEffect } from 'react';
import { Job } from '@/types/types';
import { JobCard } from './JobCard';
import { JobSearchBar } from './JobSearchBar';
import { useDebounce } from '@/hooks/use-debounce';

interface JobSeekerViewProps {
  jobs: Job[];
  onApply?: (job: Job) => void;
  onSearch?: (searchQuery: string) => void;
  isLoading?: boolean;
}

export const JobSeekerView: React.FC<JobSeekerViewProps> = ({ 
  jobs, 
  onApply, 
  onSearch,
  isLoading = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearch]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearch = () => {
    // Search is automatically triggered via debounced effect
    // This is kept for the form submit button
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <JobSearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
        />

        {isLoading ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <p className="text-slate-500">Searching jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <p className="text-slate-500">
              {searchQuery.trim() 
                ? 'No jobs found matching your search.' 
                : 'No jobs available at the moment.'}
            </p>
          </div>
        ) : (
          jobs.map(job => (
            <JobCard key={job.id} job={job} onApply={onApply} showApplyButton={true} />
          ))
        )}
      </div>
    </div>
  );
};
