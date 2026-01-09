"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTransition, animated } from "@react-spring/web";
import axios from "axios";
import shuffle from "lodash.shuffle";

// Type Definitions
type Product = {
  id: number;
  name: string;
  hs_code?: string;
  description: string;
  image: string | null;
  category?: {
    id: number;
    name: string;
    description: string;
    image: string | null;
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
  title: string;
  product: Product | null;
  service: string | null;
  match_percentage: number;
};

type OfferDetail = {
  id: number;
  full_name: string;
  designation: string;
  mobile_no: string;
  email: string;
  company_name: string;
  address: string;
  country: string;
  title: string;
  status: string;
  offer_type: string;
  match_percentage: number;
  created_at: string;
  updated_at: string;
  image: string | null;
  product?: Product | null;
  service?: string | null;
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

  // Main UI
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto border border-gray-200">
        {offer.image && (
          <div className="w-full h-64 overflow-hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/${offer.image}`}
              alt={offer.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 text-blue-800 p-6 text-center">
          <h1 className="text-3xl font-bold">{offer.title}</h1>
          <p className="mt-2 text-lg">
            Match Percentage:{" "}
            <span className="font-semibold">{offer.match_percentage}%</span>
          </p>
          <p className="mt-2 text-lg">
            Related Wishes:{" "}
            <span className="font-semibold">{wishes.length}</span>
          </p>
        </div>

        {/* Details Section */}
        {/* <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div className="space-y-4">
            <p>
              <strong>🏢 Company:</strong> {offer.company_name}
            </p>
            <p>
              <strong>📍 Address:</strong> {offer.address}, {offer.country}
            </p>
            <p>
              <strong>📧 Email:</strong> {offer.email}
            </p>
          </div>
          <div className="space-y-4">
            <p>
              <strong>👤 Person Name:</strong> {offer.full_name}
            </p>
            <p>
              <strong>🧑‍💼 Designation:</strong> {offer.designation}
            </p>
            <p>
              <strong>📊 Status:</strong> {offer.status}
            </p>
          </div>
        </div> */}
      </div>

      {/* Related Wishes Section */}
      {wishes.length > 0 && (
        <div className="mt-8 bg-gray-50 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Related Wishes
          </h2>
          <div className="relative overflow-hidden mt-6">
            {transitions((style, item) => (
              <animated.div
                key={item.id}
                style={style}
                className="p-4 border rounded-lg shadow-md hover:shadow-lg transition bg-white mb-4"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p>
                  <strong>Company:</strong> {item.company_name}
                </p>
                <p>
                  <strong>Address:</strong> {item.address}, {item.country}
                </p>
                <p>
                  <strong>Product:</strong>{" "}
                  {item.product?.name || "No product information available"}
                </p>
                <p className="text-blue-600 font-bold">
                  Match Percentage: {item.match_percentage}%
                </p>
              </animated.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
