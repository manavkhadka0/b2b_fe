import React from "react";
import Link from "next/link";
import WishOfferCard from "@/components/wish-offer-card";
import { WISH_DATA } from "@/constants/wish";

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
            <h2 className="text-xl font-bold hover:text-blue-500">
              <Link href={"/wishOffer/wishes"} className="hover:text-blue-500">
                Wishes
              </Link>
            </h2>

            <Link href={"/wishOffer/wishes/create-wish"}>
              <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
                Create Wish
              </button>
            </Link>
          </div>
          {/* Wishes Cards */}
          <div className="space-y-4">
            {WISH_DATA.map((wish, index) => (
              <WishOfferCard
                key={index}
                title={wish.title}
                description={wish.description}
                tags={[wish.product_or_service]}
                hCode={[wish.hCode]}
              />
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
            <h2 className="text-xl font-bold">
              <Link href={"/wishOffer/offer"} className="hover:text-blue-500">
                Offers
              </Link>
            </h2>
            <Link href={"/wishOffer/offer/create-offer"}>
              <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
                Create Offer
              </button>
            </Link>
          </div>
          {/* Offers Cards */}
          <div className="space-y-4">
            {WISH_DATA.map((offer, index) => (
              <WishOfferCard
                key={index}
                title={offer.title}
                description={offer.description}
                tags={[offer.product_or_service]}
                hCode={[offer.hCode]}
              />
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
