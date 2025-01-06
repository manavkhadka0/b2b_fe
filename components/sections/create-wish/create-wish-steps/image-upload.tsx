"use client";

import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/types/create-wish-type";
import Image from "next/image";

interface ImageUploadProps {
  images: ImageUpload[];
  setImages: (images: ImageUpload[]) => void;
}

export function ImageUploadSection({ images, setImages }: ImageUploadProps) {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageUpload[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newImages.push({ url, file });
    });

    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].url);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Images
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
