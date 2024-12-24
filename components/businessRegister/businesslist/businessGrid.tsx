import React from "react";

// Define the props type
type BusinessCardProps = {
  info: {
    id: number;
    name: string;
    description: string;
    category: number;
  };
};

// Define the functional component with props
const BusinessCard: React.FC<BusinessCardProps> = ({ info }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition border">
      {/* Card Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m6 4h1m-6 0h6m0 0v4m0-4v-4a4 4 0 10-8 0v4a4 4 0 11-8 0V6a4 4 0 118 0v6m4-6a4 4 0 118 0v6"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{info.name}</h2>
          <p className="text-gray-500 text-sm">Category: {info.category}</p>
        </div>
      </div>

      {/* Description */}
      <div
        className="text-gray-600 text-sm mt-4"
        dangerouslySetInnerHTML={{ __html: info.description }}
      />

      {/* Read More */}
      <a href="#" className="text-blue-500 mt-4 inline-block font-medium">
        Read More →
      </a>
    </div>
  );
};

export default BusinessCard;
