"use client";

import React from "react";
import { LogoItem } from "../types";

interface LogoCarouselProps {
  logos: LogoItem[];
}

const LogoCarousel: React.FC<LogoCarouselProps> = ({ logos }) => {
  if (!logos || logos.length === 0) {
    return null;
  }

  // Calculate animation duration based on number of logos
  // More logos = slower animation to maintain consistent speed
  // Increased duration for smoother, more elegant animation
  const animationDuration = Math.max(10, logos.length * 6);

  return (
    <div className="w-full  overflow-hidden py-8">
      <div className="marquee-container overflow-hidden w-full relative max-w-7xl mx-auto select-none">
        {/* Left gradient fade */}
        <div className="absolute left-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-r from-white via-white to-transparent" />

        <div
          className="marquee-wrapper will-change-transform"
          style={{ animationDuration: `${animationDuration}s` }}
        >
          {/* First set of logos */}
          <div className="marquee-inner">
            {logos.map((logo, index) => (
              <div
                key={`${logo.id}-first-${index}`}
                className="logo-item inline-flex items-center justify-center min-w-[160px] md:min-w-[180px] h-28 px-4 md:px-6 transition-transform duration-300 hover:scale-110 opacity-80 hover:opacity-100 flex-shrink-0"
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain"
                  draggable={false}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless infinite loop - ensures no gap when looping */}
          <div className="marquee-inner">
            {logos.map((logo, index) => (
              <div
                key={`${logo.id}-second-${index}`}
                className="logo-item inline-flex items-center justify-center min-w-[160px] md:min-w-[180px] h-28 px-4 md:px-6 transition-transform duration-300 hover:scale-110 opacity-80 hover:opacity-100 flex-shrink-0"
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain"
                  draggable={false}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right gradient fade */}
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white via-white to-transparent" />
      </div>
    </div>
  );
};

export default LogoCarousel;
