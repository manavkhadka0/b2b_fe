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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Main Details Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
        {/* Header Section with Image and Title */}
        <div className="flex gap-6 items-start mb-6">
          {/* Image Section */}
          {offer.image && (
            <div className="flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={
                  offer.image.startsWith("http")
                    ? offer.image
                    : `${process.env.NEXT_PUBLIC_API_URL}/${offer.image}`
                }
                alt={offer.title}
                className="w-48 h-56 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Title and Match Indicator */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800 flex-1 pr-4">
                {offer.title}
              </h1>
              <div className="relative w-24 h-12 flex-shrink-0">
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
                  <span className="text-xl font-bold mt-10">
                    {offer.match_percentage}%
                  </span>
                  <span className="text-xs text-gray-500">Match</span>
                </div>
              </div>
            </div>

            {/* Type Badge */}
            {(offer.type || offer.offer_type) && (
              <div className="mb-3">
                <span className="inline-block text-sm px-3 py-1 rounded bg-blue-100 text-blue-800 font-medium">
                  {offer.type || offer.offer_type}
                </span>
              </div>
            )}

            {/* HS Code */}
            {offer.product?.hs_code && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700">
                  HS Code:{" "}
                </span>
                <span className="text-sm px-3 py-1 rounded bg-gray-100 text-gray-800">
                  {offer.product.hs_code}
                </span>
              </div>
            )}

            {/* Description */}
            {offer.description && (
              <p className="text-gray-600 text-base mt-3 leading-relaxed">
                {offer.description}
              </p>
            )}

            {/* Location and Time */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Location: </span>
                {formatAddress()}
              </p>
              {offer.created_at && (
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Created: </span>
                  {new Date(offer.created_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Company and Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Company Information
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Company Name:</span>{" "}
                {offer.company_name}
              </p>
              <p>
                <span className="font-medium">Address:</span> {offer.address},{" "}
                {offer.country}
              </p>
              {offer.company_website && (
                <p>
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={offer.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {offer.company_website}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Wishes Section */}
      {wishes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Related Wishes ({wishes.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transitions((style, item) => (
              <animated.div
                key={item.id}
                style={style}
                className="p-5 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex gap-4 items-start">
                  {item.image && (
                    <div className="flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${process.env.NEXT_PUBLIC_API_URL}/${item.image}`
                        }
                        alt={item.title}
                        className="w-20 h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    {item.type && (
                      <span className="inline-block text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 font-medium mb-2">
                        {item.type}
                      </span>
                    )}
                    {item.product?.hs_code && (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">HS Code: </span>
                        {item.product.hs_code}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Company:</span>{" "}
                      {item.company_name}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Location:</span>{" "}
                      {item.province && item.municipality && item.ward
                        ? `${item.province}, ${item.municipality}, Ward ${item.ward}`
                        : `${item.address}, ${item.country}`}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="text-blue-600 font-bold text-sm">
                        {item.match_percentage}% Match
                      </span>
                      {item.created_at && (
                        <span className="text-xs text-gray-500">
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
