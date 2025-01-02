import React from "react";

interface WishOfferCardProps {
  title: string;
  description: string;
  tags?: string[];
  hCode: string[];
  matchPercentage: number;
  location?: string;
  time?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const WishOfferCard = ({
  title,
  description,
  tags = [],
  hCode = [],
  matchPercentage,
  location = "Unknown Location",
  time = new Date().toISOString(),
  onClick,
}: WishOfferCardProps) => {
  return (
    <div
      className="p-7 border rounded-lg hover:shadow-md transition group relative cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
    >
      {/* Flexbox for Title and Match Indicator */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{title}</h3>
        <div className="relative w-24 h-12">
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
              strokeDashoffset={`${126.5 - (126.5 * matchPercentage) / 100}`}
            />
          </svg>

          {/* Percentage Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold mt-10">{matchPercentage}%</span>
            <span className="text-xs text-gray-500">Match</span>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex space-x-3 mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-blue-500 text-sm px-3 pt-1 pb-1 border border-blue-500 rounded-3xl"
          >
            {tag}
          </span>
        ))}
        {tags.includes("Product") && (
          <div className="text-gray-400 mt-1">
            {hCode.map((code, index) => (
              <span
                key={index}
                className="inline-block text-sm px-2 py-1 rounded"
              >
                {code}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-500 text-sm mt-2">{description}</p>

      <hr className="my-3 border-t border-gray-200" />

      {/* Location and Time */}
      <p className="text-gray-500 text-sm">
        <span className="text-gray-400">{`Location: ${location} | `}</span>
        <span className="text-gray-400">
          {`Time: ${new Date(time).toLocaleString()}`}
        </span>
      </p>
    </div>
  );
};

export default WishOfferCard;
