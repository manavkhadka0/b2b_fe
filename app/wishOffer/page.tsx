"use client";

import React, { useState, Suspense } from "react";
import {
  useWishes,
  useOffers,
  useWishOfferCategories,
  useSearchWishesOffers,
} from "@/app/utils/wishOffer";
import { Wish, Offer } from "@/types/wish";
import { Category } from "@/types/create-wish-type";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CategorySidebar } from "./components/CategorySidebar";
import { CategorySheet } from "./components/CategorySheet";
import { SearchBar } from "./components/SearchBar";
import { WishList } from "./components/WishList";
import { OfferList } from "./components/OfferList";

function WishOfferContent() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const {
    productCategories,
    serviceCategories,
    isLoading: isLoadingCategories,
  } = useWishOfferCategories();

  const {
    wishes: allWishes,
    isLoading: wishLoading,
    error: wishError,
  } = useWishes(activeCategoryId);
  const {
    offers: allOffers,
    isLoading: offerLoading,
    error: offerError,
  } = useOffers(activeCategoryId);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("wishes");

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Search wishes & offers (SWR handles deduping repeated calls)
  const { results: swrSearchResults, isLoading: swrIsSearching } =
    useSearchWishesOffers(debouncedSearch);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const searchResults = swrSearchResults;
  const isSearching = swrIsSearching;

  const handleCategorySelect = (categoryId: number | null) => {
    setActiveCategoryId(categoryId);
  };

  // When searching, use search results; otherwise use API-filtered results
  // Note: Search API doesn't include category filter, so we filter client-side if needed
  const filteredWishes = searchResults
    ? searchResults.wishes.filter(
        (wish) =>
          !activeCategoryId || wish.product?.category?.id === activeCategoryId,
      )
    : allWishes;

  const filteredOffers = searchResults
    ? searchResults.offers.filter(
        (offer) =>
          !activeCategoryId ||
          offer.product?.category?.id === activeCategoryId ||
          offer.service?.category?.id === activeCategoryId,
      )
    : allOffers;

  if (wishLoading || offerLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ResponsiveContainer className="py-4 px-4 md:py-6 md:px-6 lg:py-8">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h1 className="text-lg font-semibold text-gray-900">Wish & Offer</h1>
          <CategorySheet
            productCategories={productCategories}
            serviceCategories={serviceCategories}
            activeCategoryId={activeCategoryId}
            isLoadingCategories={isLoadingCategories}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <CategorySidebar
            productCategories={productCategories}
            serviceCategories={serviceCategories}
            activeCategoryId={activeCategoryId}
            isLoadingCategories={isLoadingCategories}
            onCategorySelect={handleCategorySelect}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="overflow-hidden">
              <Tabs
                defaultValue="wishes"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <div className="px-4 md:px-6 pt-4 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                  <TabsList className="bg-transparent h-auto p-0 gap-6 justify-start">
                    <TabsTrigger
                      value="wishes"
                      className="px-0 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold text-gray-500 data-[state=active]:text-blue-600 transition-all text-sm md:text-base"
                    >
                      Wishes
                    </TabsTrigger>
                    <TabsTrigger
                      value="offers"
                      className="px-0 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold text-gray-500 data-[state=active]:text-blue-600 transition-all text-sm md:text-base"
                    >
                      Offers
                    </TabsTrigger>
                  </TabsList>

                  <SearchBar
                    searchQuery={searchQuery}
                    isSearching={isSearching}
                    onSearchChange={setSearchQuery}
                    onClear={clearSearch}
                  />
                </div>

                <TabsContent
                  value="wishes"
                  className="m-0 focus-visible:ring-0"
                >
                  <WishList wishes={filteredWishes} />
                </TabsContent>

                <TabsContent
                  value="offers"
                  className="m-0 focus-visible:ring-0"
                >
                  <OfferList offers={filteredOffers} />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </ResponsiveContainer>
    </div>
  );
}

export default function WishOfferPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <WishOfferContent />
    </Suspense>
  );
}
