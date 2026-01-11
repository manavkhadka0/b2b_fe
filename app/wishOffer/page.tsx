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
    <ResponsiveContainer className="py-4 sm:py-6 md:py-10">
      {/* Heading */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent break-words p-2">
          Explore Wishes (क्रेता) and Offers (विक्रेता) to Connect and
          Collaborate
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 break-words">
          Share your wish, discover offers, and seize the best opportunities
          with ease.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search for products or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-11 pr-10 sm:pr-12 h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-1 sm:right-2 h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </div>
          {isSearching && (
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        {searchQuery && searchResults && !isSearching && (
          <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
            Found {searchResults.wishes.length} wish(es) and{" "}
            {searchResults.offers.length} offer(s)
          </p>
        )}
      </div>

      {/* Display Content - Same layout for both search and regular view */}
      {wishes.length === 0 && offers.length === 0 && searchResults ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm sm:text-base">
            No results found for &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Image Grid Section at Top */}
          <div className="hidden md:flex justify-between items-center gap-4 mb-8 lg:mb-10">
            <Image
              src="/wishes1.svg"
              alt="Wisher"
              width={136}
              height={108}
              className="w-auto h-32 lg:h-[200px]"
            />
            <Image
              src="/offers1.svg"
              alt="Offers"
              width={454}
              height={316}
              className="w-auto h-32 lg:h-[200px]"
            />
          </div>

          {/* Mobile Layout: Stacked with Images on Top of Each Section */}
          <div className="md:hidden space-y-6">
            {/* Wishes Section */}
            {wishes.length > 0 && (
              <div className="bg-white rounded-lg">
                {/* Wishes SVG at Top */}
                <div className="flex justify-center mb-4">
                  <Image
                    src="/wishes1.svg"
                    alt="Wisher"
                    width={136}
                    height={108}
                    className="w-auto h-20 max-w-[40%]"
                  />
                </div>
                <div className="grid grid-cols-1 gap-y-4 sm:gap-y-6">
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
                <div className="flex justify-center mb-4">
                  <Image
                    src="/offers1.svg"
                    alt="Offers"
                    width={454}
                    height={316}
                    className="w-auto h-20 max-w-[40%]"
                  />
                </div>
                <div className="grid grid-cols-1 gap-y-4 sm:gap-y-6">
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
          <div className="hidden md:grid grid-cols-2 gap-4 sm:gap-6">
            {/* Wishes Section */}
            {wishes.length > 0 && (
              <div className="bg-white rounded-lg">
                <div className="grid grid-cols-1 gap-y-4 sm:gap-y-6">
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
                <div className="grid grid-cols-1 gap-y-4 sm:gap-y-6">
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
        </>
      )}

      {/* High Matching Wishes */}
      {matchedWishes.length > 0 && (
        <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 mt-6 sm:mt-8 md:mt-10 shadow-sm">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex flex-wrap items-center gap-2">
            <span className="bg-green-500 w-2 h-6 sm:h-8 rounded mr-2 sm:mr-3"></span>
            <span className="break-words">High Matching Wishes</span>
            <span className="text-xs sm:text-sm font-normal text-gray-500">
              (Above 80% Match)
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
