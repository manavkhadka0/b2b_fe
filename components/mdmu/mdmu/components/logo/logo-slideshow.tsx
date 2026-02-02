"use client";

import React, { useState, useEffect } from "react";
import { LogoItem } from "../types";

interface LogoSlideshowProps {
  logos: LogoItem[];
  slideInterval?: number;
}

const LogoSlideshow: React.FC<LogoSlideshowProps> = ({
  logos,
  slideInterval = 5000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Group logos into slides of 8
  const groupLogosIntoSlides = () => {
    const slides: LogoItem[][] = [];
    const logosPerSlide = 8;

    for (let i = 0; i < logos.length; i += logosPerSlide) {
      let slideLogos = logos.slice(i, i + logosPerSlide);

      // If last slide has less than 8, duplicate some logos to fill
      if (slideLogos.length < logosPerSlide && slideLogos.length > 0) {
        while (slideLogos.length < logosPerSlide) {
          const duplicateIndex = slideLogos.length % logos.length;
          slideLogos.push(logos[duplicateIndex]);
        }
      }

      slides.push(slideLogos);
    }

    return slides;
  };

  const slides = groupLogosIntoSlides();
  const totalSlides = slides.length;

  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        setIsAnimating(false);
      }, 300);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [totalSlides, slideInterval]);

  if (slides.length === 0) return null;

  const currentLogos = slides[currentSlide];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-4 gap-6">
        {currentLogos.map((logo, index) => (
          <div
            key={`${logo.id}-${currentSlide}-${index}`}
            className="aspect-square bg-white rounded-lg flex items-center justify-center p-6 animate-bounce-in"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
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

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LogoSlideshow;
