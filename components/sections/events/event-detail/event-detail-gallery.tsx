"use client";

import { Event } from "@/types/events";
import { HeaderSubtitle } from "../../common/header-subtitle";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const EventDetailGallery = ({ event }: { event: Event }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Combine thumbnail and images array
  const allImages =
    event?.images && event.images.length > 0
      ? event.images
      : event?.thumbnail
      ? [{ id: 0, image: event.thumbnail }]
      : [];

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
              onClick={() => setSelectedImage(httpsImageUrl)}
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
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-7xl w-full p-0 bg-transparent border-0 [&>button]:hidden">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Event photo"
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
