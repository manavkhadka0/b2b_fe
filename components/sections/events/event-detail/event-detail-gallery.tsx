"use client";

import { Event } from "@/types/events";
import { HeaderSubtitle } from "../../common/header-subtitle";
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const EventDetailGallery = ({ event }: { event: Event }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Combine thumbnail and images array
  const allImages =
    event?.images && event.images.length > 0
      ? event.images
      : event?.thumbnail
      ? [{ id: 0, image: event.thumbnail }]
      : [];

  // Get current image URL
  const currentImageUrl =
    selectedImageIndex !== null
      ? allImages[selectedImageIndex]?.image.replace(/^http:\/\//i, "https://")
      : null;

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
    });
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
    });
  }, [allImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, allImages.length, goToPrevious, goToNext]);

  if (allImages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <HeaderSubtitle
        title="Event Photos and Videos"
        subtitle="Check out photos and videos from the event"
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allImages.map((imageItem, index) => {
          const imageUrl = imageItem.image;
          const httpsImageUrl = imageUrl.replace(/^http:\/\//i, "https://");

          return (
            <div
              key={imageItem.id || index}
              className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100 aspect-square"
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={httpsImageUrl}
                alt={`Event photo ${index + 1}`}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          );
        })}
      </div>

      {/* Image Modal */}
      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={() => setSelectedImageIndex(null)}
      >
        <DialogContent className="max-w-7xl w-full p-0 bg-transparent border-0 [&>button]:hidden">
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Button */}
            {allImages.length > 1 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 hover:bg-black/70"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Button */}
            {allImages.length > 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 hover:bg-black/70"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && selectedImageIndex !== null && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 rounded-full px-4 py-2 text-sm z-10">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}

            {/* Current Image */}
            {currentImageUrl && (
              <img
                src={currentImageUrl}
                alt={`Event photo ${
                  selectedImageIndex !== null ? selectedImageIndex + 1 : ""
                }`}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetailGallery;
