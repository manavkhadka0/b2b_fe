"use client";

import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/types/create-wish-type";

interface ImageUploadProps {
  image: ImageUpload | null;
  setImage: (image: ImageUpload | null) => void;
}

export function ImageUploadSection({ image, setImage }: ImageUploadProps) {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // Only take the first file
    const url = URL.createObjectURL(file);
    setImage({ url, file });
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image.url);
      setImage(null);
    }
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
          Upload Image
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {image && (
        <div className="relative group w-full max-w-[200px]">
          <img
            src={image.url}
            alt="Upload preview"
            className="w-full h-32 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
