"use client"; // Enable client-side rendering for SWR

import React, { useState, useEffect } from "react";
import Link from "next/link";
import WishOfferCard from "@/components/wish-offer-card";
import {
  useWishes,
  useOffers,
  searchWishesOffers,
} from "@/app/utils/wishOffer";
import { Wish, Offer } from "@/types/wish";
import { useRouter } from "next/navigation";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";

export default function WishOfferPage() {
  const {
    wishes: allWishes,
    isLoading: wishLoading,
    error: wishError,
  } = useWishes();
  const {
    offers: allOffers,
    isLoading: offerLoading,
    error: offerError,
  } = useOffers();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    wishes: Wish[];
    offers: Offer[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedSearch.trim()) {
      setIsSearching(true);
      searchWishesOffers(debouncedSearch)
        .then((results) => {
          setSearchResults(results);
          setIsSearching(false);
        })
        .catch((error) => {
          console.error("Search error:", error);
          setIsSearching(false);
        });
    } else {
      setSearchResults(null);
    }
  }, [debouncedSearch]);

  // Determine which data to display
  const wishes = searchResults ? searchResults.wishes : allWishes;
  const offers = searchResults ? searchResults.offers : allOffers;

  // Filter high-matching wishes (>= 80%)
  const matchedWishes: Wish[] = wishes.filter(
    (wish) => wish.match_percentage >= 80
  );

  // Filter high-matching offers (>= 80%)
  const matchedOffers: Offer[] = offers.filter(
    (offer) => offer.match_percentage && offer.match_percentage >= 80
  );

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

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
        <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent break-words px-1 sm:p-2">
          Explore Wishes (क्रेता) and Offers (विक्रेता) to Connect and
          Collaborate
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2 break-words px-1 sm:px-0">
          Share your wish, discover offers, and seize the best opportunities
          with ease.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-4 sm:mb-6 md:mb-8 px-1 sm:px-0">
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-2 sm:left-3 md:left-4 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-400 pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Search for products or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 sm:pl-9 md:pl-11 pr-8 sm:pr-10 md:pr-12 h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-1 sm:right-1.5 md:right-2 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 hover:bg-gray-100 rounded-full"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
              </Button>
            )}
          </div>
          {isSearching && (
            <div className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        {searchQuery && searchResults && !isSearching && (
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-1.5 sm:mt-2 text-center">
            Found {searchResults.wishes.length} wish(es) and{" "}
            {searchResults.offers.length} offer(s)
          </p>
        )}
      </div>

      {/* Display Content - Same layout for both search and regular view */}
      {wishes.length === 0 && offers.length === 0 && searchResults ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-xs sm:text-sm md:text-base px-2">
            No results found for &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Image Grid Section at Top */}
          <div className="hidden md:flex justify-between items-center gap-4 mb-6 lg:mb-8 xl:mb-10">
            <Image
              src="/wishes1.svg"
              alt="Wisher"
              width={136}
              height={108}
              className="w-auto h-28 md:h-32 lg:h-[200px]"
            />
            <Image
              src="/offers1.svg"
              alt="Offers"
              width={454}
              height={316}
              className="w-auto h-28 md:h-32 lg:h-[200px]"
            />
          </div>

          {/* Mobile Layout: Stacked with Images on Top of Each Section */}
          <div className="md:hidden space-y-4 sm:space-y-6">
            {/* Wishes Section */}
            {wishes.length > 0 && (
              <div className="bg-white rounded-lg">
                {/* Wishes SVG at Top */}
                <div className="flex justify-center mb-3 sm:mb-4">
                  <Image
                    src="/wishes1.svg"
                    alt="Wisher"
                    width={136}
                    height={108}
                    className="w-auto h-16 sm:h-20 max-w-[35%] sm:max-w-[40%]"
                  />
                </div>
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
                      onClick={() =>
                        router.push(`/wishOffer/wishes/${wish.id}`)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Offers Section */}
            {offers.length > 0 && (
              <div className="bg-white rounded-lg">
                {/* Offers SVG at Top */}
                <div className="flex justify-center mb-3 sm:mb-4">
                  <Image
                    src="/offers1.svg"
                    alt="Offers"
                    width={454}
                    height={316}
                    className="w-auto h-16 sm:h-20 max-w-[35%] sm:max-w-[40%]"
                  />
                </div>
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
                      onClick={() =>
                        router.push(`/wishOffer/offer/${offer.id}`)
                      }
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
                      onClick={() =>
                        router.push(`/wishOffer/wishes/${wish.id}`)
                      }
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
                      onClick={() =>
                        router.push(`/wishOffer/offer/${offer.id}`)
                      }
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
      )}

      {/* High Matching Wishes */}
      {matchedWishes.length > 0 && (
        <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg sm:rounded-xl border border-green-200 mt-4 sm:mt-6 md:mt-8 lg:mt-10 shadow-sm">
          <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 flex flex-wrap items-center gap-1.5 sm:gap-2 px-1 sm:px-0">
            <span className="bg-green-500 w-1.5 sm:w-2 h-4 sm:h-6 md:h-8 rounded mr-1.5 sm:mr-2 md:mr-3"></span>
            <span className="break-words">High Matching Wishes</span>
            <span className="text-[10px] sm:text-xs md:text-sm font-normal text-gray-500">
              (Above 80% Match)
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {matchedWishes.map((wish) => (
              <div
                key={wish.id}
                className={`p-3 sm:p-4 md:p-5 border rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-lg ${
                  wish.match_percentage >= 95 ? "animate-bounce-gentle" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg flex-1 break-words pr-1">
                    {wish.title}
                  </h3>
                  {/* Circular Progress Indicator */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
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
                    <div className="absolute top-1 sm:top-1.5 left-1 sm:left-1.5 right-1 sm:right-1.5 bottom-1 sm:bottom-1.5 bg-white rounded-full flex items-center justify-center">
                      <span
                        className={`text-xs sm:text-sm font-bold ${
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
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 break-words">
                  {wish.product?.name ||
                    wish.service?.name ||
                    "No category available"}
                </p>
                <Link
                  href={`/wishOffer/wishes/${wish.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
                >
                  View Details
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 ml-1"
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
