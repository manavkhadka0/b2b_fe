"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useWishes,
  useOffers,
  searchWishesOffers,
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
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { signIn } from "next-auth/react";

function WishOfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const isInitialMount = useRef(true);

  const [activeCategory, setActiveCategory] = useState<string | null>(
    categoryParam || null,
  );
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    wishes: allWishes,
    isLoading: wishLoading,
    error: wishError,
  } = useWishes(activeCategory);
  const {
    offers: allOffers,
    isLoading: offerLoading,
    error: offerError,
  } = useOffers(activeCategory);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    wishes: Wish[];
    offers: Offer[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("wishes");

  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/wishOffer" });
  };

  // Update URL when category changes (skip on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (activeCategory) {
      params.set("category", activeCategory);
    } else {
      params.delete("category");
    }
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [activeCategory, router, searchParams]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        // Fetch Product categories
        const productResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/?type=Product`,
        );
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setProductCategories(productData.results || []);
        }

        // Fetch Service categories
        const serviceResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/?type=Service`,
        );
        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json();
          setServiceCategories(serviceData.results || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  // When searching, use search results; otherwise use API-filtered results
  // Note: Search API doesn't include category filter, so we filter client-side if needed
  const filteredWishes = searchResults
    ? searchResults.wishes.filter(
        (wish) =>
          !activeCategory || wish.product?.category?.name === activeCategory,
      )
    : allWishes;

  const filteredOffers = searchResults
    ? searchResults.offers.filter(
        (offer) =>
          !activeCategory ||
          offer.product?.category?.name === activeCategory ||
          offer.service?.category?.name === activeCategory,
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
      <GoogleLoginButton onClick={handleGoogleLogin} />
      <ResponsiveContainer className="py-4 px-4 md:py-6 md:px-6 lg:py-8">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h1 className="text-lg font-semibold text-gray-900">Wish & Offer</h1>
          <CategorySheet
            productCategories={productCategories}
            serviceCategories={serviceCategories}
            activeCategory={activeCategory}
            isLoadingCategories={isLoadingCategories}
            onCategorySelect={setActiveCategory}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <CategorySidebar
            productCategories={productCategories}
            serviceCategories={serviceCategories}
            activeCategory={activeCategory}
            isLoadingCategories={isLoadingCategories}
            onCategorySelect={setActiveCategory}
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
