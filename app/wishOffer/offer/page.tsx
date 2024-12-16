import React from "react";
import Link from "next/link";
import { FaAngleDoubleRight } from "react-icons/fa";

const page = () => {
  return (
    <div>
      <div className="flex justify-between items-center  p-4 max-w-7xl mx-auto px-4 ">
        <h2 className="text-xl font-bold">Offers</h2>
        <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
          Create Offer
        </button>
      </div>
      <div className="p-4 bg-white rounded-lg border max-w-7xl mx-auto px-4 py-10 ">
        {/* Wishes Cards */}
        <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
          {[
            "Marketing Advice",
            "Tech Mentor",
            "Funding Opportunities",
            "Marketing Advice",
            "Tech Mentor",
            "Marketing Advice",
            "Tech Mentor",
            "Funding Opportunities",
            "Marketing Advice",
            "Tech Mentor",
          ].map((wish, index) => (
            <div
              key={index}
              className="p-7 border rounded-lg hover:shadow-md transition group"
            >
              {/* Flexbox for Title and Icon */}
              <div className="flex justify-between items-center">
                <h3 className="font-bold">{wish}</h3>
                <FaAngleDoubleRight className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Paragraph Text */}
              <p className="text-gray-500 text-sm">
                Looking for tips on Digital Marketing Strategies and Advices
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
