"use client"; // Enable client-side rendering for SWR

import React from "react";
import Link from "next/link";
import WishOfferCard from "@/components/wish-offer-card";
import { useWishes, useOffers } from "@/app/utils/wishOffer";
import { Wish, Offer } from "@/types/wish";
import { useRouter } from "next/navigation";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";

export default function WishOfferPage() {
  const { wishes, isLoading: wishLoading, error: wishError } = useWishes();
  const { offers, isLoading: offerLoading, error: offerError } = useOffers();
  const router = useRouter();

  // Filter high-matching wishes (>= 80%)
  const matchedWishes: Wish[] = wishes.filter(
    (wish) => wish.match_percentage >= 80
  );

  // Filter high-matching offers (>= 80%)
  const matchedOffers: Offer[] = offers.filter(
    (offer) => offer.match_percentage && offer.match_percentage >= 80
  );

  if (wishLoading || offerLoading) return <div>Loading...</div>;
  if (wishError || offerError) {
    console.error(wishError || offerError);
    return <div>Failed to load data. Please try again later.</div>;
  }

  return (
    <ResponsiveContainer className="py-10">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
          Explore Wishes and Offers to Connect and Collaborate
        </h1>
        <p className="text-gray-600 mt-2">
          Share your wish, discover offers, and seize the best opportunities
          with ease.
        </p>
      </div>

      {/* Wishes and Offers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wishes Section */}
        <div className=" bg-white rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold hover:text-blue-500">Wishes</h2>
            <Link href="/wishOffer/wishes/create-wish">
              <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
                Create Wish
              </button>
            </Link>
          </div>

          {/* Wishes Cards */}
          <div className="grid grid-cols-1 gap-y-6">
            {wishes.map((wish) => (
              <Link
                key={wish.id}
                href={`/wishOffer/wishes/${wish.id}`}
                scroll={false}
              >
                <WishOfferCard
                  title={wish.title}
                  description={""}
                  tags={[
                    wish.product?.name ||
                      wish.service?.name ||
                      "No tag available",
                  ]}
                  hCode={[wish.product?.hs_code || ""]}
                  matchPercentage={wish.match_percentage}
                  onClick={() => router.push(`/wishOffer/wishes/${wish.id}`)}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Offers Section */}
        <div className=" bg-white rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold hover:text-blue-500">Offers</h2>
            <Link href="/wishOffer/offer/create-offer">
              <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
                Create Offer
              </button>
            </Link>
          </div>

          {/* Offers Cards */}
          <div className="grid grid-cols-1 gap-y-6">
            {offers.map((offer) => (
              <Link key={offer.id} href={`/wishOffer/offer/${offer.id}`}>
                <WishOfferCard
                  title={offer.title}
                  description={""}
                  tags={[
                    offer.product?.name ||
                      offer.service?.name ||
                      "No tag available",
                  ]}
                  hCode={[offer.product?.hs_code || "No HS Code"]}
                  matchPercentage={offer.match_percentage || 0}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* High Matching Wishes */}
      {matchedWishes.length > 0 && (
        <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 mt-10 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-green-500 w-2 h-8 rounded mr-3"></span>
            High Matching Wishes
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Above 80% Match)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedWishes.map((wish) => (
              <div
                key={wish.id}
                className={`p-5 border rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-lg ${
                  wish.match_percentage >= 95 ? "animate-bounce-gentle" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">{wish.title}</h3>
                  {/* Circular Progress Indicator */}
                  <div className="relative w-16 h-16">
                    <div className="w-full h-full rounded-full bg-gray-100"></div>
                    <div
                      className="absolute top-0 left-0 w-full h-full"
                      style={{
                        background: `conic-gradient(
                    ${wish.match_percentage >= 95 ? "#22c55e" : "#3b82f6"} ${
                          wish.match_percentage
                        }%, 
                    transparent ${wish.match_percentage}%
                  )`,
                        borderRadius: "50%",
                        transition: "all 1s ease-in-out",
                        animation: "progress 1s ease-in-out",
                      }}
                    ></div>
                    <div className="absolute top-1.5 left-1.5 right-1.5 bottom-1.5 bg-white rounded-full flex items-center justify-center">
                      <span
                        className={`text-sm font-bold ${
                          wish.match_percentage >= 95
                            ? "text-green-500"
                            : "text-blue-500"
                        }`}
                      >
                        {wish.match_percentage}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {wish.product?.name ||
                    wish.service?.name ||
                    "No category available"}
                </p>
                <Link
                  href={`/wishOffer/wishes/${wish.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Details
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </ResponsiveContainer>
  );
}
