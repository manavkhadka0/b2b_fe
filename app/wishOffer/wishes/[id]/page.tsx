"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: number;
  name: string;
  hs_code: string;
  description: string;
  image: string | null;
  category?: {
    id: number;
    name: string;
    description: string;
    image: string | null;
  };
};

type Offer = {
  id: number;
  full_name: string;
  designation: string;
  mobile_no: string;
  email: string;
  company_name: string;
  address: string;
  country: string;
  title: string;
  product: Product;
  status: string;
  offer_type: string;
  match_percentage: number;
};

type WishDetail = {
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
  wish_type: string;
  match_percentage: number;
  created_at: string;
  updated_at: string;
  product?: Product | null;
  service?: string | null;
  offers: Offer[];
};

export default function WishDetailPage() {
  const { id } = useParams(); // Extract ID from URL
  const [wish, setWish] = useState<WishDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Fetch the wish details by ID
      const fetchWish = async () => {
        try {
          const response = await axios.get<WishDetail>(
            `https://ratishshakya.pythonanywhere.com/api/wish_and_offers/wishes/${id}`
          );
          setWish(response.data);
        } catch (error) {
          console.error("Failed to fetch wish details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWish();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">
          No details found for this wish.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-800 text-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold">{wish.title}</h1>
        <p className="mt-4">
          Match Percentage:{" "}
          <span className="font-semibold">{wish.match_percentage}%</span>
        </p>
        <div className="mt-4 text-lg">
          <p>
            <strong>Company:</strong> {wish.company_name}
          </p>
          <p>
            <strong>Address:</strong> {wish.address}, {wish.country}
          </p>
        </div>
      </div>

      {/* Product Section */}
      {wish.product && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          <div className="mt-4">
            <p>
              <strong>Name:</strong> {wish.product.name}
            </p>
            <p>
              <strong>HS Code:</strong> {wish.product.hs_code}
            </p>
            <p>
              <strong>Description:</strong> {wish.product.description}
            </p>
            <p>
              <strong>Category:</strong>{" "}
              {wish.product.category?.name || "No category information"}
            </p>
          </div>
        </div>
      )}

      {/* Offers Section */}
      {wish.offers.length > 0 && (
        <div className="mt-8 bg-gray-50 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800">Related Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {wish.offers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 border rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold">{offer.title}</h3>
                <p className="mt-2">
                  <strong>Company:</strong> {offer.company_name}
                </p>
                <p>
                  <strong>Address:</strong> {offer.address}, {offer.country}
                </p>
                <p>
                  <strong>Product:</strong>{" "}
                  {offer.product?.name || "No product information available"}
                </p>
                <p className="text-blue-600 font-bold">
                  Match Percentage: {offer.match_percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
