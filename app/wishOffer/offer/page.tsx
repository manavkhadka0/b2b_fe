import React from "react";
import Link from "next/link";
import WishOfferCard from "@/components/wish-offer-card";
import { getOffers } from "@/app/utils/wishOffer";
import { Offer } from "@/types/wish";

// Main Offer Page Component
export default async function OfferPage() {
  const offers: Offer[] = await getOffers();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
          Explore Offers Tailored Just for You
        </h1>
        <p className="text-gray-600 mt-2">
          Discover matching offers and seize the best opportunities
          effortlessly.
        </p>
      </div>

      {/* Offers Section */}
      <div className="p-4 bg-white rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold hover:text-blue-500">
            <Link href="/wishOffer/offer">Offers</Link>
          </h2>
          <Link href="/wishOffer/offer/create-offer">
            <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
              Create Offer
            </button>
          </Link>
        </div>

        {/* Offers Cards */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {offers.map((offer) => (
            <WishOfferCard
              key={offer.id}
              title={offer.title}
              description={
                offer.product?.description || offer.service?.description || ""
              }
              tags={[offer.product?.name || offer.service?.name || ""]}
              hCode={[offer.product?.hs_code || ""]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
