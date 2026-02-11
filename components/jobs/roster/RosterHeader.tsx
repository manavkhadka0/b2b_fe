"use client";

import React from "react";

export function RosterHeader() {
  return (
    <div className="mb-6 sm:mb-8 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent py-2">
          Skilled Workforce Roster (Human Resource Roster)
        </h1>
      </div>
      <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
        View and manage your skilled workforce. Track availability, skills, and
        assignments in one place.
      </p>
    </div>
  );
}

