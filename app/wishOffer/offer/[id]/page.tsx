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
  product?: Product | null;
  service?: string | null;
  wishes: Wish[];
};

export default function OfferDetailPage() {
  const { id } = useParams();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchOffer = async () => {
        try {
          const response = await axios.get<OfferDetail>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/${id}`
          );
          setOffer(response.data);
        } catch (error) {
          console.error("Failed to fetch offer details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOffer();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">
          No details found for this offer.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold">{offer.title}</h1>
        <p className="mt-4">
          Match Percentage:{" "}
          <span className="font-semibold">{offer.match_percentage}%</span>
        </p>
        <div className="mt-4 text-lg">
          <p>
            <strong>Company:</strong> {offer.company_name}
          </p>
          <p>
            <strong>Address:</strong> {offer.address}, {offer.country}
          </p>
        </div>
      </div>

      {/* Product Section */}
      {offer.product && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          <div className="mt-4">
            <p>
              <strong>Name:</strong> {offer.product.name}
            </p>
            <p>
              <strong>HS Code:</strong> {offer.product.hs_code}
            </p>
            <p>
              <strong>Description:</strong> {offer.product.description}
            </p>
            <p>
              <strong>Category:</strong>{" "}
              {offer.product.category?.name || "No category information"}
            </p>
          </div>
        </div>
      )}

      {/* Related Wishes */}
      {offer.wishes.length > 0 && (
        <div className="mt-8 bg-gray-50 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800">Related Wishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {offer.wishes.map((wish) => (
              <div
                key={wish.id}
                className="p-4 border rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold">{wish.title}</h3>
                <p className="mt-2">
                  <strong>Company:</strong> {wish.company_name}
                </p>
                <p>
                  <strong>Address:</strong> {wish.address}, {wish.country}
                </p>
                <p>
                  <strong>Product:</strong>{" "}
                  {wish.product?.name || "No product information"}
                </p>
                <p className="text-blue-600 font-bold">
                  Match Percentage: {wish.match_percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
