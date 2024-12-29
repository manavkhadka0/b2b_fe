import React from "react";
import Link from "next/link";
import WishOfferCard from "@/components/wish-offer-card";
import { getWishes, getOffers } from "@/app/utils/wishOffer";
import { Wish, Offer } from "@/types/wish";

// Main WishOffer Page Component
export default async function WishOfferPage() {
  const [wishes, offers]: [Wish[], Offer[]] = await Promise.all([
    getWishes(),
    getOffers(),
  ]);

  return (
    <div className="max-w-7xl space-y-4 mx-auto px-4 py-10">
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
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold hover:text-blue-500">
              <Link href="/wishOffer/wishes">Wishes</Link>
            </h2>
            <Link href="/wishOffer/wishes/create-wish">
              <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
                Create Wish
              </button>
            </Link>
          </div>

          {/* Wishes Cards */}
          <div className="space-y-4">
            {wishes.map((wish) => (
              <Link key={wish.id} href={`/wishOffer/wishes/${wish.id}`}>
                <WishOfferCard
                  title={wish.title}
                  description={
                    wish.product?.description || wish.service?.description || ""
                  }
                  tags={[wish.product?.name || wish.service?.name || ""]}
                  hCode={[wish.product?.hs_code || ""]}
                />
              </Link>
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
          <div className="space-y-4">
            {offers.map((offer) => (
              <Link
                key={offer.id}
                href={`/wishOffer/offer/${offer.id}`}
                passHref
              >
                <div className="cursor-pointer">
                  <WishOfferCard
                    title={offer.title}
                    description={
                      offer.product?.description ||
                      offer.service?.description ||
                      "No description available"
                    }
                    tags={[
                      offer.product?.name ||
                        offer.service?.name ||
                        "No tag available",
                    ]}
                    hCode={[offer.product?.hs_code || "No HS Code"]}
                  />
                </div>
              </Link>
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
}
