"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LogoItem } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LogoCarouselProps {
  logos: LogoItem[];
  autoSlideInterval?: number; // in milliseconds
  logosPerSlide?: number;
}

const LogoCarousel: React.FC<LogoCarouselProps> = ({
  logos,
  autoSlideInterval = 5000,
  logosPerSlide = 8,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Calculate total slides
  const totalSlides = Math.ceil(logos.length / logosPerSlide);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, autoSlideInterval, totalSlides]);

  // Get logos for current slide
  const getCurrentLogos = () => {
    const start = currentIndex * logosPerSlide;
    const end = start + logosPerSlide;
    return logos.slice(start, end);
  };

  const currentLogos = getCurrentLogos();

  return (
    <div
      className="relative w-full max-w-7xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white shadow-2xl border border-slate-200">
        {/* Logos Grid */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 min-h-[400px]">
            {currentLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${currentIndex}-${index}`}
                className="group relative aspect-square bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 flex items-center justify-center p-4 border border-slate-100 animate-fadeIn"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center p-4">
                  <h3 className="text-white text-sm md:text-base font-bold text-center uppercase tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {logo.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Slide Indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-12 h-3 bg-blue-600"
                  : "w-3 h-3 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="text-center mt-4 text-slate-600 font-medium">
        <span className="text-blue-600 font-bold">{currentIndex + 1}</span> /{" "}
        {totalSlides}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LogoCarousel;
