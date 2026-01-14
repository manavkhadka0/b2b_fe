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
  category?: {
    id: number;
    name: string;
    description: string;
    image?: string | null;
  };
};

type Wish = {
  id: number;
  full_name: string;
  designation: string;
  mobile_no: string;
  email: string;
  company_name: string;
  address: string;
  country: string;
  province?: string | null;
  municipality?: string | null;
  ward?: string | null;
  title: string;
  description?: string | null;
  type?: string;
  product?: Product | null;
  service?: {
    id?: number;
    name?: string;
    description?: string;
  } | null;
  match_percentage: number;
  image?: string | null;
  created_at?: string;
};

type OfferDetail = {
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
  offer_type?: string;
  match_percentage: number;
  created_at: string;
  updated_at: string;
  image: string | null;
  product?: Product | null;
  service?: {
    id?: number;
    name?: string;
    description?: string;
  } | null;
  wishes: Wish[];
};

export default function OfferDetailPage() {
  const { id } = useParams();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishes, setWishes] = useState<Wish[]>([]);

  // Fetch offer data
  useEffect(() => {
    if (id) {
      const fetchOffer = async () => {
        try {
          const response = await axios.get<OfferDetail>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/${id}`
          );
          setOffer(response.data);
          setWishes(response.data.wishes || []);
        } catch (error) {
          console.error("Failed to fetch offer details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOffer();
    }
  }, [id]);

  // Manage and shuffle wishes
  const [rows, setRows] = useState<Wish[]>([]);

  useEffect(() => {
    setRows(wishes); // Initialize rows with wishes
  }, [wishes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRows((prevRows) => shuffle(prevRows));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animation hook for wishes
  const transitions = useTransition(rows, {
    keys: (wish) => wish.id,
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
  if (!offer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">
          No details found for this offer.
        </div>
      </div>
    );
  }

  // Format address: province, municipality, ward
  const formatAddress = () => {
    const parts: string[] = [];
    if (offer.province) parts.push(offer.province);
    if (offer.municipality) parts.push(offer.municipality);
    if (offer.ward) parts.push(`Ward ${offer.ward}`);
    return parts.length > 0
      ? parts.join(", ")
      : offer.address || "Unknown Location";
  };

  // Main UI
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      {/* Main Details Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-6 md:p-8 mb-4 sm:mb-8">
        {/* Header Section with Image and Title */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start mb-4 sm:mb-6">
          {/* Image Section */}
          {offer.image && (
            <div className="w-full sm:w-auto sm:flex-shrink-0 rounded-lg overflow-hidden mx-auto sm:mx-0">
              <img
                src={
                  offer.image.startsWith("http")
                    ? offer.image
                    : `${process.env.NEXT_PUBLIC_API_URL}/${offer.image}`
                }
                alt={offer.title}
                className="w-full sm:w-48 md:w-56 h-auto sm:h-56 md:h-64 object-cover rounded-lg max-w-xs sm:max-w-none mx-auto sm:mx-0"
                style={{ aspectRatio: "auto" }}
              />
            </div>
          )}

          {/* Title and Match Indicator */}
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-3 sm:mb-4 gap-3 sm:gap-4">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex-1 sm:pr-4 break-words">
                {offer.title}
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
                      126.5 - (126.5 * offer.match_percentage) / 100
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base sm:text-lg md:text-xl font-bold mt-8 sm:mt-10">
                    {offer.match_percentage}%
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    Match
                  </span>
                </div>
              </div>
            </div>

            {/* Type Badge */}
            {(offer.type || offer.offer_type) && (
              <div className="mb-2 sm:mb-3">
                <span className="inline-block text-xs sm:text-sm px-2 sm:px-3 py-1 rounded bg-blue-100 text-blue-800 font-medium">
                  {offer.type || offer.offer_type}
                </span>
              </div>
            )}

            {/* HS Code */}
            {offer.product?.hs_code && (
              <div className="mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  HS Code:{" "}
                </span>
                <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded bg-gray-100 text-gray-800 break-all">
                  {offer.product.hs_code}
                </span>
              </div>
            )}

            {/* Description */}
            {offer.description && (
              <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-3 leading-relaxed break-words">
                {offer.description}
              </p>
            )}

            {/* Location and Time */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 break-words">
                <span className="font-medium">Location: </span>
                {formatAddress()}
              </p>
              {offer.created_at && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  <span className="font-medium">Created: </span>
                  {new Date(offer.created_at).toLocaleString()}
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
                {offer.company_name}
              </p>
              <p className="break-words">
                <span className="font-medium">Address:</span> {offer.address},{" "}
                {offer.country}
              </p>
              {offer.company_website && (
                <p className="break-words">
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={offer.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {offer.company_website}
                  </a>
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
              Personal Information
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-gray-700 text-sm sm:text-base">
              {offer.full_name && (
                <p className="break-words">
                  <span className="font-medium">Full Name:</span>{" "}
                  {offer.full_name}
                </p>
              )}
              {offer.designation && (
                <p className="break-words">
                  <span className="font-medium">Designation:</span>{" "}
                  {offer.designation}
                </p>
              )}
              {offer.mobile_no && (
                <p className="break-words">
                  <span className="font-medium">Mobile:</span>{" "}
                  <a
                    href={`tel:${offer.mobile_no}`}
                    className="text-blue-600 hover:underline"
                  >
                    {offer.mobile_no}
                  </a>
                </p>
              )}
              {offer.alternate_no && (
                <p className="break-words">
                  <span className="font-medium">Alternate Mobile:</span>{" "}
                  <a
                    href={`tel:${offer.alternate_no}`}
                    className="text-blue-600 hover:underline"
                  >
                    {offer.alternate_no}
                  </a>
                </p>
              )}
              {offer.email && (
                <p className="break-words">
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    href={`mailto:${offer.email}`}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {offer.email}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Wishes Section */}
      {wishes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            Related Wishes ({wishes.length})
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
