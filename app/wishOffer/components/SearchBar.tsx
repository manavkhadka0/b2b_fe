"use client";

import React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export function SearchBar({
  searchQuery,
  isSearching,
  onSearchChange,
  onClear,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xs mb-4 md:mb-0">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      <Input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 pr-8 h-9 bg-gray-50/80 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-50 focus:border-blue-300 transition-all rounded-lg text-sm"
      />
      {isSearching && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-gray-400" />
      )}
      {searchQuery && !isSearching && (
        <button
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 hover:bg-gray-200 p-1 rounded text-gray-400 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
