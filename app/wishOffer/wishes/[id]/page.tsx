"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTransition, animated } from "@react-spring/web";
import axios from "axios";
import shuffle from "lodash.shuffle";

// Type Definitions
type Product = {
  id: number;
  name?: string;
  hs_code?: string;
  description?: string;
  image?: string | null;
};

type Offer = {
  id: number;
  title: string;
  company_name: string;
  address: string;
  country: string;
  province?: string | null;
  municipality?: string | null;
  ward?: string | null;
  product?: { name?: string; hs_code?: string } | null;
  match_percentage: number;
  type?: string;
  description?: string | null;
  image?: string | null;
  created_at?: string;
};

type WishDetail = {
  id: number;
  full_name: string;
  designation: string;
  mobile_no: string;
  alternate_no?: string | null;
  email: string;
  company_name: string;
  address: string;
  country: string;
  province?: string | null;
  municipality?: string | null;
  ward?: string | null;
  company_website?: string | null;
  title: string;
  description?: string | null;
  status: string;
  type?: string;
  wish_type?: string;
  match_percentage: number;
  image?: string | null;
  product?: Product | null;
  service?: {
    id?: number;
    name?: string;
    description?: string;
  } | null;
  created_at?: string;
  updated_at?: string;
  offers: Offer[];
};

export default function WishDetailPage() {
  const { id } = useParams();
  const [wish, setWish] = useState<WishDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);

  // Fetch wish data
  useEffect(() => {
    if (id) {
      const fetchWish = async () => {
        try {
          const response = await axios.get<WishDetail>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/${id}`
          );
          setWish(response.data);
          setOffers(response.data.offers || []);
        } catch (error) {
          console.error("Failed to fetch wish details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWish();
    }
  }, [id]);

  // Manage and shuffle offers
  const [rows, setRows] = useState<Offer[]>([]);

  useEffect(() => {
    setRows(offers); // Initialize rows with offers
  }, [offers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRows((prevRows) => shuffle(prevRows));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animation hook for offers
  const transitions = useTransition(rows, {
    keys: (offer) => offer.id,
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { tension: 200, friction: 20 },
  });

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // No Data Found State
  if (!wish) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">
          No details found for this wish.
        </div>
      </div>
    );
  }

  // Format address: province, municipality, ward
  const formatAddress = () => {
    const parts: string[] = [];
    if (wish.province) parts.push(wish.province);
    if (wish.municipality) parts.push(wish.municipality);
    if (wish.ward) parts.push(`Ward ${wish.ward}`);
    return parts.length > 0
      ? parts.join(", ")
      : wish.address || "Unknown Location";
  };

  // Main UI
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      {/* Main Details Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-6 md:p-8 mb-4 sm:mb-8">
        {/* Header Section with Image and Title */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start mb-4 sm:mb-6">
          {/* Image Section */}
          {wish.image && (
            <div className="w-full sm:w-auto sm:flex-shrink-0 rounded-lg overflow-hidden mx-auto sm:mx-0">
              <img
                src={
                  wish.image.startsWith("http")
                    ? wish.image
                    : `${process.env.NEXT_PUBLIC_API_URL}/${wish.image}`
                }
                alt={wish.title}
                className="w-full sm:w-48 md:w-56 h-auto sm:h-56 md:h-64 object-cover rounded-lg max-w-xs sm:max-w-none mx-auto sm:mx-0"
                style={{ aspectRatio: "auto" }}
              />
            </div>
          )}

          {/* Title and Match Indicator */}
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-3 sm:mb-4 gap-3 sm:gap-4">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex-1 sm:pr-4 break-words">
                {wish.title}
              </h1>
              <div className="relative w-20 h-10 sm:w-24 sm:h-12 flex-shrink-0 self-center sm:self-start">
                {/* Semi-Circle SVG */}
                <svg className="w-full h-full" viewBox="0 0 100 50">
                  <path
                    d="M 10,50 A 40,40 0 0 1 90,50"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="10"
                  />
                  <path
                    d="M 10,50 A 40,40 0 0 1 90,50"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="10"
                    strokeDasharray="126.5"
                    strokeDashoffset={`${
                      126.5 - (126.5 * wish.match_percentage) / 100
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base sm:text-lg md:text-xl font-bold mt-8 sm:mt-10">
                    {wish.match_percentage}%
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    Match
                  </span>
                </div>
              </div>
            </div>

            {/* Type Badge */}
            {(wish.type || wish.wish_type) && (
              <div className="mb-2 sm:mb-3">
                <span className="inline-block text-xs sm:text-sm px-2 sm:px-3 py-1 rounded bg-blue-100 text-blue-800 font-medium">
                  {wish.type || wish.wish_type}
                </span>
              </div>
            )}

            {/* HS Code */}
            {wish.product?.hs_code && (
              <div className="mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  HS Code:{" "}
                </span>
                <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded bg-gray-100 text-gray-800 break-all">
                  {wish.product.hs_code}
                </span>
              </div>
            )}

            {/* Description */}
            {wish.description && (
              <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-3 leading-relaxed break-words">
                {wish.description}
              </p>
            )}

            {/* Location and Time */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 break-words">
                <span className="font-medium">Location: </span>
                {formatAddress()}
              </p>
              {wish.created_at && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  <span className="font-medium">Created: </span>
                  {new Date(wish.created_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Company and Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-200">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
              Company Information
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-gray-700 text-sm sm:text-base">
              <p className="break-words">
                <span className="font-medium">Company Name:</span>{" "}
                {wish.company_name}
              </p>
              <p className="break-words">
                <span className="font-medium">Address:</span> {wish.address},{" "}
                {wish.country}
              </p>
              {wish.company_website && (
                <p className="break-words">
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={wish.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {wish.company_website}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product/Service Information */}
        {(wish.product || wish.service) && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
              {wish.type === "Product" ? "Product" : "Service"} Information
            </h3>
            {wish.product && (
              <div className="space-y-1.5 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                {wish.product.name && (
                  <p className="break-words">
                    <span className="font-medium">Product Name:</span>{" "}
                    {wish.product.name}
                  </p>
                )}
                {wish.product.description && (
                  <p className="break-words">
                    <span className="font-medium">Description:</span>{" "}
                    {wish.product.description}
                  </p>
                )}
              </div>
            )}
            {wish.service && (
              <div className="space-y-1.5 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                {wish.service.name && (
                  <p className="break-words">
                    <span className="font-medium">Service Name:</span>{" "}
                    {wish.service.name}
                  </p>
                )}
                {wish.service.description && (
                  <p className="break-words">
                    <span className="font-medium">Description:</span>{" "}
                    {wish.service.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Offers Section */}
      {offers.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            Related Offers ({offers.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {transitions((style, item) => (
              <animated.div
                key={item.id}
                style={style}
                className="p-3 sm:p-4 md:p-5 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                  {item.image && (
                    <div className="w-full sm:w-auto sm:flex-shrink-0 rounded-lg overflow-hidden mx-auto sm:mx-0">
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${process.env.NEXT_PUBLIC_API_URL}/${item.image}`
                        }
                        alt={item.title}
                        className="w-full sm:w-20 md:w-24 h-auto sm:h-24 md:h-28 object-cover rounded-lg max-w-[120px] sm:max-w-none mx-auto sm:mx-0"
                        style={{ aspectRatio: "auto" }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1.5 sm:mb-2 break-words">
                      {item.title}
                    </h3>
                    {item.type && (
                      <span className="inline-block text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded bg-blue-100 text-blue-800 font-medium mb-1.5 sm:mb-2">
                        {item.type}
                      </span>
                    )}
                    {item.product?.hs_code && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 break-words">
                        <span className="font-medium">HS Code: </span>
                        {item.product.hs_code}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 break-words">
                      <span className="font-medium">Company:</span>{" "}
                      {item.company_name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                      <span className="font-medium">Location:</span>{" "}
                      {item.province && item.municipality && item.ward
                        ? `${item.province}, ${item.municipality}, Ward ${item.ward}`
                        : `${item.address}, ${item.country}`}
                    </p>
                    <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                      <span className="text-blue-600 font-bold text-xs sm:text-sm">
                        {item.match_percentage}% Match
                      </span>
                      {item.created_at && (
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </animated.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
