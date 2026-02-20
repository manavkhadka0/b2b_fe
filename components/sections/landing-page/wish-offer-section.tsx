"use client"; // Enable client-side rendering for SWR

import React from "react";
import WishOfferCard from "@/components/wish-offer-card";
import { useWishes, useOffers } from "@/app/utils/wishOffer";
import { useRouter } from "next/navigation";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function WishOfferSection() {
  const { wishes: allWishes, isLoading: wishLoading } = useWishes();
  const { offers: allOffers, isLoading: offerLoading } = useOffers();
  const router = useRouter();

  // Determine which data to display and limit to 10 items
  const wishes = allWishes.slice(0, 15);
  const offers = allOffers.slice(0, 15);

  if (wishLoading || offerLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <ResponsiveContainer className="py-2 px-2 sm:py-4 sm:px-4 md:py-6 md:px-6 lg:py-10">
      {/* Heading */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-base sm:text-4xl lg:text-5xl  font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent break-words px-1 sm:p-2 text-center">
          क्रेता बिक्रेता भेट हुने ठाउँ
        </h1>
      </div>

      {/* Display Content */}
      <>
        {/* Desktop: Image Grid Section at Top */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-6 lg:mb-8 xl:mb-10">
          <button
            type="button"
            onClick={() => router.push("/wishOffer?type=WISH")}
            className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none rounded-lg"
            aria-label="View wishes"
          >
            <Image
              src="/wishes1.svg"
              alt="Wisher"
              width={136}
              height={108}
              className="w-auto h-28 md:h-32 lg:h-[200px]"
            />
          </button>
          <button
            type="button"
            onClick={() => router.push("/wishOffer?type=OFFER")}
            className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none rounded-lg"
            aria-label="View offers"
          >
            <Image
              src="/offers1.svg"
              alt="Offers"
              width={454}
              height={316}
              className="w-auto h-28 md:h-32 lg:h-[200px]"
            />
          </button>
        </div>

        {/* Mobile Layout: Stacked with Images on Top of Each Section */}
        <div className="md:hidden space-y-4 sm:space-y-6">
          {/* Wishes Section */}
          {wishes.length > 0 && (
            <div className="bg-white rounded-lg">
              {/* Wishes SVG at Top */}
              <button
                type="button"
                onClick={() => router.push("/wishOffer?type=WISH")}
                className="flex justify-center mb-3 sm:mb-4 w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                aria-label="View wishes"
              >
                <Image
                  src="/wishes1.svg"
                  alt="Wisher"
                  width={136}
                  height={108}
                  className="w-auto h-16 sm:h-20 max-w-[35%] sm:max-w-[40%]"
                />
              </button>
              <div className="grid grid-cols-1 gap-y-3 sm:gap-y-4 md:gap-y-6 px-1 sm:px-0">
                {wishes.map((wish) => (
                  <WishOfferCard
                    key={wish.id}
                    title={wish.title}
                    description={wish.description || null}
                    hCode={wish.product?.hs_code || undefined}
                    matchPercentage={wish.match_percentage}
                    province={wish.province}
                    municipality={wish.municipality}
                    ward={wish.ward}
                    image={wish.image || undefined}
                    type={wish.type}
                    time={wish.created_at}
                    onClick={() => router.push(`/wishOffer/wishes/${wish.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Offers Section */}
          {offers.length > 0 && (
            <div className="bg-white rounded-lg">
              {/* Offers SVG at Top */}
              <button
                type="button"
                onClick={() => router.push("/wishOffer?type=OFFER")}
                className="flex justify-center mb-3 sm:mb-4 w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                aria-label="View offers"
              >
                <Image
                  src="/offers1.svg"
                  alt="Offers"
                  width={454}
                  height={316}
                  className="w-auto h-16 sm:h-20 max-w-[35%] sm:max-w-[40%]"
                />
              </button>
              <div className="grid grid-cols-1 gap-y-3 sm:gap-y-4 md:gap-y-6 px-1 sm:px-0">
                {offers.map((offer) => (
                  <WishOfferCard
                    key={offer.id}
                    title={offer.title}
                    description={offer.description || null}
                    hCode={offer.product?.hs_code || undefined}
                    matchPercentage={offer.match_percentage || 0}
                    province={offer.province}
                    municipality={offer.municipality}
                    ward={offer.ward}
                    image={offer.image || undefined}
                    type={offer.type}
                    time={offer.created_at}
                    onClick={() => router.push(`/wishOffer/offer/${offer.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout: Side by Side */}
        <div className="hidden md:grid grid-cols-2 gap-3 md:gap-4 lg:gap-6">
          {/* Wishes Section */}
          <div className="bg-white rounded-lg">
            {wishes.length > 0 ? (
              <div className="grid grid-cols-1 gap-y-3 md:gap-y-4 lg:gap-y-6">
                {wishes.map((wish) => (
                  <WishOfferCard
                    key={wish.id}
                    title={wish.title}
                    description={wish.description || null}
                    hCode={wish.product?.hs_code || undefined}
                    matchPercentage={wish.match_percentage}
                    province={wish.province}
                    municipality={wish.municipality}
                    ward={wish.ward}
                    image={wish.image || undefined}
                    type={wish.type}
                    time={wish.created_at}
                    onClick={() => router.push(`/wishOffer/wishes/${wish.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 sm:py-12 text-center">
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">
                  No wishes found
                </p>
              </div>
            )}
          </div>

          {/* Offers Section */}
          <div className="bg-white rounded-lg">
            {offers.length > 0 ? (
              <div className="grid grid-cols-1 gap-y-3 md:gap-y-4 lg:gap-y-6">
                {offers.map((offer) => (
                  <WishOfferCard
                    key={offer.id}
                    title={offer.title}
                    description={offer.description || null}
                    hCode={offer.product?.hs_code || undefined}
                    matchPercentage={offer.match_percentage || 0}
                    province={offer.province}
                    municipality={offer.municipality}
                    ward={offer.ward}
                    image={offer.image || undefined}
                    type={offer.type}
                    time={offer.created_at}
                    onClick={() => router.push(`/wishOffer/offer/${offer.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 sm:py-12 text-center">
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">
                  No offers found
                </p>
              </div>
            )}
          </div>
        </div>
      </>

      {/* View More Button */}
      <div className="mt-6 sm:mt-8 md:mt-10 flex justify-center">
        <Button
          onClick={() => router.push("/wishOffer")}
          variant="outline"
          className="gap-2"
        >
          View More <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </ResponsiveContainer>
  );
}
