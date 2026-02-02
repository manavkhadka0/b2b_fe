"use client";

import React from "react";
import { LogoItem } from "../types";

interface LogoMarqueeProps {
  logos: LogoItem[];
}

const LogoMarquee: React.FC<LogoMarqueeProps> = ({ logos }) => {
  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-12">
      {/* First Row - Scrolling Right to Left */}
      <div className="relative mb-8">
        <div className="flex animate-marquee-left">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`row1-${logo.id}-${index}`}
              className="flex-shrink-0 w-64 h-64 mx-4 bg-white rounded-lg flex items-center justify-center p-6"
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Scrolling Left to Right */}
      <div className="relative">
        <div className="flex animate-marquee-right">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`row2-${logo.id}-${index}`}
              className="flex-shrink-0 w-64 h-64 mx-4 bg-white rounded-lg flex items-center justify-center p-6"
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee-left {
          animation: marquee-left 60s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right 60s linear infinite;
        }

        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default LogoMarquee;
