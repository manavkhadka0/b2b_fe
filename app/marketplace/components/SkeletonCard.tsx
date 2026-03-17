import React from "react";

export const SkeletonCard = () => {
  return (
    <div className="flex flex-col rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden h-full">
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/3] bg-slate-200 animate-pulse relative">
        <div className="absolute top-2 left-2 w-12 h-5 bg-slate-300 rounded" />
      </div>

      <div className="flex flex-col gap-3 p-3 flex-1">
        {/* Title Skeleton */}
        <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />

        {/* Description Skeleton */}
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse" />
        </div>

        {/* Location & Time Skeleton */}
        <div className="flex items-center gap-3 mt-1">
          <div className="h-3 bg-slate-200 rounded w-20 animate-pulse" />
          <div className="h-3 bg-slate-200 rounded w-16 animate-pulse" />
        </div>

        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
          {/* Avatar & Name Skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-3 bg-slate-200 rounded w-24 animate-pulse" />
          </div>

          {/* Button Skeleton */}
          <div className="h-3 bg-slate-200 rounded w-16 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
