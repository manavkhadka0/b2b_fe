import React from "react";
import { FaAngleDoubleRight } from "react-icons/fa";

interface WishOfferCardProps {
  title: string;
  description: string;
  tags?: string[];
}

const WishOfferCard = ({
  title,
  description,
  tags = [],
}: WishOfferCardProps) => {
  return (
    <div className="p-7 border rounded-lg hover:shadow-md transition group">
      {/* Flexbox for Title and Icon */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{title}</h3>
        <FaAngleDoubleRight className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Tags Section */}
      <div className="flex space-x-3 mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-blue-500 text-sm px-2 py-1 border border-blue-500 rounded-lg"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Paragraph Text */}
      <p className="text-gray-500 text-sm mt-2">{description}</p>
    </div>
  );
};

export default WishOfferCard;
