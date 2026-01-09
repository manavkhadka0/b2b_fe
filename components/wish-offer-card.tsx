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
      className="p-7 border rounded-lg hover:shadow-md transition group relative cursor-pointer flex flex-col justify-between h-52"
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
    >
      {/* Flexbox for Image and All Content */}
      <div className="flex gap-4 items-start">
        {/* Image Section - Left Side */}
        {image && (
          <div className="flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-24 h-28 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content Section - Right Side of Image */}
        <div className="flex-1 min-w-0">
          {/* Title and Match Indicator Row */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold flex-1 pr-4">{title}</h3>
            <div className="relative w-24 h-12 flex-shrink-0">
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
                <span className="text-xl font-bold mt-10">
                  {matchPercentage}%
                </span>
                <span className="text-xs text-gray-500">Match</span>
              </div>
            </div>
          </div>

          {/* Type Badge */}
          {type && (
            <div className="mb-2">
              <span className="inline-block text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 font-medium">
                {type}
              </span>
            </div>
          )}

          {/* HS Code Section */}
          {hCode && (
            <div className="mb-2">
              <div className="text-gray-600">
                <span className="text-sm font-medium">HS Code: </span>
                <span className="text-sm px-2 py-1 rounded bg-gray-100">
                  {hCode}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-gray-500 text-sm mt-2">{description}</p>
          )}
        </div>
      </div>

      <hr className="my-3 border-t border-gray-200" />

      {/* Location and Time */}
      <p className="text-gray-500 text-sm">
        <span className="text-gray-400">{`Location: ${formatAddress()} | `}</span>
        <span className="text-gray-400">
          {`Time: ${new Date(time).toLocaleString()}`}
        </span>
      </p>
    </div>
  );
};

export default WishOfferCard;
