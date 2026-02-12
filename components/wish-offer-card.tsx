import React from "react";
import Image from "next/image";

interface WishOfferCardProps {
  title: string;
  description?: string | null;
  hCode?: string;
  matchPercentage: number;
  province?: string | null;
  municipality?: string | null;
  ward?: string | null;
  image?: string | null;
  type?: string;
  time?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const WishOfferCard = ({
  title,
  description,
  hCode,
  matchPercentage,
  province,
  municipality,
  ward,
  image,
  type,
  time = new Date().toISOString(),
  onClick,
}: WishOfferCardProps) => {
  // Format address: province, municipality, ward
  const formatAddress = () => {
    const parts: string[] = [];
    if (province) parts.push(province);
    if (municipality) parts.push(municipality);
    if (ward) parts.push(`Ward ${ward}`);
    return parts.length > 0 ? parts.join(", ") : "Unknown Location";
  };

  return (
    <div
      className="p-2 sm:p-3 md:p-5 lg:p-7 border rounded-lg hover:shadow-md transition group relative cursor-pointer flex flex-col justify-between min-h-[160px] sm:min-h-[180px] md:min-h-[200px] lg:h-auto"
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
    >
      {/* Flexbox for Image and All Content */}
      <div className="flex gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 items-start">
        {/* Image Section - Left Side */}
        {image && (
          <div className="flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 lg:w-24 lg:h-28 rounded-lg"
            />
          </div>
        )}

        {/* Content Section - Right Side of Image */}
        <div className="flex-1 min-w-0">
          {/* Title and Match Indicator Row */}
          <div className="flex justify-between items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <h3 className="font-bold flex-1 text-xs sm:text-sm md:text-base lg:text-lg break-words pr-0.5 sm:pr-1 md:pr-2 lg:pr-4">
              {title}
            </h3>
            <div className="relative w-12 h-6 sm:w-16 sm:h-8 md:w-20 md:h-10 lg:w-24 lg:h-12 flex-shrink-0">
              {/* Semi-Circle SVG */}
              <svg className="w-full h-full" viewBox="0 0 100 50">
                {/* Background Arc */}
                <path
                  d="M 10,50 A 40,40 0 0 1 90,50"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="10"
                />
                {/* Foreground Arc */}
                <path
                  d="M 10,50 A 40,40 0 0 1 90,50"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeDasharray="126.5"
                  strokeDashoffset={`${
                    126.5 - (126.5 * matchPercentage) / 100
                  }`}
                />
              </svg>

              {/* Percentage Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[9px] sm:text-xs md:text-sm lg:text-xl font-bold mt-4 sm:mt-6 md:mt-8 lg:mt-10">
                  {matchPercentage}%
                </span>
                <span className="text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500">
                  Match
                </span>
              </div>
            </div>
          </div>
          {/* Type Badge */}
          {type && (
            <div className="mb-1 sm:mb-1.5 md:mb-2">
              <span className="inline-block text-[9px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-0.5 md:py-1 rounded bg-blue-100 text-blue-800 font-medium">
                {type}
              </span>
            </div>
          )}
          {/* HS Code Section */}
          {hCode && (
            <div className="mb-1 sm:mb-1.5 md:mb-2">
              <div className="text-gray-600 flex flex-wrap items-center gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs md:text-sm font-medium">
                  HS Code:{" "}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-1.5 md:px-2 py-0.5 rounded bg-gray-100 break-all">
                  {hCode}
                </span>
              </div>
            </div>
          )}
          {/* Description */}
          {description && (
            <p className="text-gray-500 text-sm mt-2 truncate">{description}</p>
          )}
        </div>
      </div>

      <hr className="my-1.5 sm:my-2 md:my-3 border-t border-gray-200" />

      {/* Location and Time */}
      <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs lg:text-sm break-words leading-tight sm:leading-normal">
        <span className="text-gray-400">{`Location: ${formatAddress()} | `}</span>
        <span className="text-gray-400">
          {`Time: ${new Date(time).toLocaleString()}`}
        </span>
      </p>
    </div>
  );
};

export default WishOfferCard;
