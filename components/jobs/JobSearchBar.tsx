import React from 'react';
import { Search } from 'lucide-react';

interface JobSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export const JobSearchBar: React.FC<JobSearchBarProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-lg border border-slate-200 flex items-center gap-2 mb-6 shadow-sm">
      <Search className="w-5 h-5 text-slate-400 ml-2" />
      <input 
        type="text" 
        placeholder="Search job title or keyword..." 
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 h-10" 
      />
      <button 
        type="submit"
        className="bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-900 transition-colors"
      >
        Search
      </button>
    </form>
  );
};
