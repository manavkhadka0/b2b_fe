import React from "react";
import Link from "next/link";
import { FaAngleDoubleRight } from "react-icons/fa";

const Page = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 ">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
          Connect with Like-Minded Individuals to fulfill your Wish and Offers
        </h1>
        <p className="text-gray-600 mt-2">
          Submit your wish, explore matching offers, and claim the best ones
          with personalized, easy-to-navigate steps
        </p>
      </div>

      {/* Wishes and Offers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wishes Section */}
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Wishes</h2>
            <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
              Create Wish
            </button>
          </div>
          {/* Wishes Cards */}
          <div className="space-y-4">
            {[
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

                {/* Tags Section */}
                <div className="flex space-x-3 mt-2">
                  <span className="text-blue-500 text-sm px-2 py-1 border border-blue-500 rounded-lg">
                    Product
                  </span>
                </div>

                {/* Paragraph Text */}
                <p className="text-gray-500 text-sm mt-2">
                  Looking for tips on Digital Marketing Strategies and Advices
                </p>
              </div>
            ))}
          </div>
          <div className="text-right mt-4">
            <Link
              href="/wishOffer/wishes"
              className="font-semibold hover:underline flex items-center justify-end gap-1"
            >
              See More <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Offers Section */}
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Offers</h2>
            <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
              Create Offer
            </button>
          </div>
          {/* Offers Cards */}
          <div className="space-y-4">
            {[
              "Web Development",
              "Business Planning",
              "Networking",
              "Marketing Advice",
              "Tech Mentor",
            ].map((offer, index) => (
              <div
                key={index}
                className="p-7 border rounded-lg hover:shadow-md transition group"
              >
                {/* Flexbox for Title and Icon */}
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{offer}</h3>
                  <FaAngleDoubleRight className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Tags Section */}
                <div className="flex space-x-3 mt-2">
                  <span className="text-blue-500 text-sm px-2 py-1 border border-blue-500 rounded-lg">
                    Services
                  </span>
                </div>

                {/* Paragraph Text */}
                <p className="text-gray-500 text-sm mt-2">
                  Looking for tips on Digital Marketing Strategies and Advices
                </p>
              </div>
            ))}
          </div>
          <div className="text-right mt-4">
            <Link
              href="/wishOffer/offer"
              className="font-semibold hover:underline flex items-center justify-end gap-1"
            >
              See More <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
