import React from "react";
import { LogoItem } from "../types";

interface LogoGridProps {
  logos: LogoItem[];
}

const LogoGrid: React.FC<LogoGridProps> = ({ logos }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 max-w-7xl mx-auto mb-20">
      {logos.map((logo) => (
        <div
          key={logo.id}
          className="group relative aspect-square bg-white flex items-center justify-center overflow-hidden cursor-pointer rounded-lg border border-slate-50"
        >
          {/* Logo Image */}
          <div className="w-full h-full p-2 flex items-center justify-center">
            <img
              src={logo.url}
              alt={logo.name}
              className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>

          {/* Refined Hover Overlay - Subtle blur to keep image visible */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <h3 className="text-white text-sm md:text-base font-bold text-center tracking-widest uppercase px-6 drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {logo.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LogoGrid;
