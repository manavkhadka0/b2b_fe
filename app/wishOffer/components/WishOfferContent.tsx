"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useWishes,
  useOffers,
  useWishOfferCategories,
  useSearchWishesOffers,
} from "@/app/utils/wishOffer";
import {
  Wish,
  Offer,
  ItemWithSource,
  type ItemType,
  type CategoryType,
} from "@/types/wish";
import {
  Loader2,
  X,
  Search,
  SlidersHorizontal,
  FilterX,
  LayoutGrid,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarContent } from "./SidebarContent";
import { ItemCard } from "./ItemCard";
import { ItemDetailDialog } from "./ItemDetailDialog";
import { CreateFormModal } from "./CreateFormModal";
import { useInView } from "react-intersection-observer"; // Ensure this package is installed or use native
import { SkeletonCard } from "./SkeletonCard";
import { SubCategory } from "@/types/create-wish-type";
import useSWR from "swr";
import axios from "axios";

export function WishOfferContent() {
  const { user, isLoading: authLoading, requireAuth } = useAuth();
  const [selectedType, setSelectedType] = useState<ItemType>("ALL");
  const [selectedCategoryType, setSelectedCategoryType] =
    useState<CategoryType>("ALL");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<number | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<ItemWithSource | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [formType, setFormType] = useState<"wishes" | "offers">("wishes");
  const [relatedItemId, setRelatedItemId] = useState<number | null>(null);
  const [relatedItem, setRelatedItem] = useState<Wish | Offer | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoggedIn =
    !!user ||
    (typeof window !== "undefined" && !!localStorage.getItem("accessToken"));

  const { productCategories, serviceCategories } = useWishOfferCategories();

  // Fetch subcategories when a category is selected
  const subcategoryFetcher = (url: string) =>
    axios
      .get(url, {
        headers: { Accept: "application/json" },
      })
      .then((res) => res.data);

  const { data: subcategoryData, isLoading: isLoadingSubcategories } = useSWR(
    activeCategoryId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/sub-categories/?category=${activeCategoryId}`
      : null,
    subcategoryFetcher
  );

  const subcategories: SubCategory[] = subcategoryData?.results || [];

  // Reset subcategory when category changes
  useEffect(() => {
    setActiveSubcategoryId(null);
  }, [activeCategoryId]);

  // Infinite Scroll Hooks
  const {
    wishes: allWishes,
    isLoading: wishLoading,
    isLoadingMore: isWishLoadingMore,
    size: wishSize,
    setSize: setWishSize,
    isReachingEnd: isWishReachingEnd,
  } = useWishes(
    activeSubcategoryId ? null : activeCategoryId,
    activeSubcategoryId
  );

  const {
    offers: allOffers,
    isLoading: offerLoading,
    isLoadingMore: isOfferLoadingMore,
    size: offerSize,
    setSize: setOfferSize,
    isReachingEnd: isOfferReachingEnd,
  } = useOffers(
    activeSubcategoryId ? null : activeCategoryId,
    activeSubcategoryId
  );

  // Intersection Observer
  const { ref, inView } = useInView();

  // Load more when scrolled to bottom
  React.useEffect(() => {
    if (inView && !searchQuery.trim()) {
      if (selectedType === "ALL") {
        if (!isWishReachingEnd && !isWishLoadingMore) setWishSize(wishSize + 1);
        if (!isOfferReachingEnd && !isOfferLoadingMore)
          setOfferSize(offerSize + 1);
      } else if (selectedType === "WISH") {
        if (!isWishReachingEnd && !isWishLoadingMore) setWishSize(wishSize + 1);
      } else if (selectedType === "OFFER") {
        if (!isOfferReachingEnd && !isOfferLoadingMore)
          setOfferSize(offerSize + 1);
      }
    }
  }, [
    inView,
    searchQuery,
    selectedType,
    isWishReachingEnd,
    isOfferReachingEnd,
    isWishLoadingMore,
    isOfferLoadingMore,
    wishSize,
    offerSize,
    setWishSize,
    setOfferSize,
  ]);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const { results: swrSearchResults, isLoading: swrIsSearching } =
    useSearchWishesOffers(debouncedSearch);

  const availableCategories = useMemo(() => {
    if (selectedCategoryType === "Product") return productCategories;
    if (selectedCategoryType === "Service") return serviceCategories;
    return [...productCategories, ...serviceCategories];
  }, [selectedCategoryType, productCategories, serviceCategories]);

  const filteredItems = useMemo(() => {
    // 1. Determine Source & Initial List
    const searchResults = swrSearchResults;
    const isSearching = searchQuery.trim().length > 0;

    let items: ItemWithSource[] = [];

    if (isSearching) {
      // If Searching: Use search results.
      // NOTE: Search results are NOT pre-filtered by category from the API,
      // so we MUST filter them client-side if a category is selected.
      const wishes = searchResults?.wishes || [];
      const offers = searchResults?.offers || [];

      const taggedWishes: ItemWithSource[] = wishes.map((wish) => ({
        ...wish,
        _source: "wish" as const,
      }));
      const taggedOffers: ItemWithSource[] = offers.map((offer) => ({
        ...offer,
        _source: "offer" as const,
      }));
      items = [...taggedWishes, ...taggedOffers];
    } else {
      // If NOT Searching: Use `allWishes` and `allOffers`.
      // NOTE: These are already filtered by `activeCategoryId` via the API hooks.
      // So we generally TRUST the API here and do NOT need to re-filter by category
      // (which avoids issues where client-side filter expects different structure).
      items = [
        ...allWishes.map((w) => ({ ...w, _source: "wish" as const })),
        ...allOffers.map((o) => ({ ...o, _source: "offer" as const })),
      ];
    }

    // 2. Filter by Type (Wishes / Offers / All)
    if (selectedType === "WISH") {
      items = items.filter((i) => i._source === "wish");
    } else if (selectedType === "OFFER") {
      items = items.filter((i) => i._source === "offer");
    }

    // 3. Filter by Category/Subcategory (Only needed if Searching)
    // - If not searching, the API hooks already filtered by `activeCategoryId` or `activeSubcategoryId`.
    // - If searching, the search API ignores category/subcategory, so we filter here.
    if (isSearching && (activeCategoryId || activeSubcategoryId)) {
      items = items.filter((item) => {
        // If subcategory is selected, filter by subcategory ID
        if (activeSubcategoryId) {
          const subId = (item as any).subcategory;
          if (typeof subId === "number") {
            return subId === activeSubcategoryId;
          }
          return false;
        }

        // Otherwise filter by category ID
        if (activeCategoryId) {
          // Handle new API structure: `subcategory` ID (but we're filtering by category)
          const subId = (item as any).subcategory;
          if (typeof subId === "number") {
            // If item has subcategory, check if it belongs to the active category
            // We need to check if the subcategory's category matches
            // For now, we'll rely on the API structure
            return true; // Let API handle this
          }

          // Fallback for legacy nested structure
          if (
            "product" in item &&
            item.product?.category?.id === activeCategoryId
          ) {
            return true;
          }
          if (
            "service" in item &&
            item.service &&
            "category" in item.service &&
            item.service.category?.id === activeCategoryId
          ) {
            return true;
          }
          return false;
        }
        return true;
      });
    }

    return items;
  }, [
    selectedType,
    activeCategoryId,
    activeSubcategoryId,
    allWishes,
    allOffers,
    swrSearchResults,
    searchQuery,
  ]);

  const clearSearch = () => setSearchQuery("");

  const clearAllFilters = () => {
    setSelectedType("ALL");
    setSelectedCategoryType("ALL");
    setActiveCategoryId(null);
    setActiveSubcategoryId(null);
    setSearchQuery("");
  };

  const activeCategory = useMemo(
    () =>
      activeCategoryId
        ? availableCategories.find((c) => c.id === activeCategoryId)
        : null,
    [activeCategoryId, availableCategories]
  );

  const activeSubcategory = useMemo(
    () =>
      activeSubcategoryId
        ? subcategories.find((sc) => sc.id === activeSubcategoryId)
        : null,
    [activeSubcategoryId, subcategories]
  );

  const hasActiveFilters =
    selectedType !== "ALL" ||
    selectedCategoryType !== "ALL" ||
    activeCategoryId !== null ||
    activeSubcategoryId !== null ||
    searchQuery.trim() !== "";

  const typeLabel =
    selectedType === "ALL"
      ? null
      : selectedType === "WISH"
      ? "Wishes"
      : "Offers";
  const categoryTypeLabel =
    selectedCategoryType === "ALL"
      ? null
      : selectedCategoryType === "Product"
      ? "Products"
      : "Services";

  const handleCreateOffer = (wish: Wish) => {
    setRelatedItem(wish);
    setRelatedItemId(wish.id);
    setFormType("offers");
    setShowFormModal(true);
  };

  const handleCreateWish = (offer: Offer) => {
    setRelatedItem(offer);
    setRelatedItemId(offer.id);
    setFormType("wishes");
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setRelatedItem(null);
    setRelatedItemId(null);
    setSelectedItem(null);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 overflow-y-auto overflow-x-hidden py-4 px-4 transition-transform duration-200 ease-out lg:hidden [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ msOverflowStyle: "none" } as React.CSSProperties}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-slate-900 text-sm">Filters</span>
          <button
            type="button"
            onClick={closeSidebar}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCategoryType={selectedCategoryType}
          setSelectedCategoryType={setSelectedCategoryType}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
          activeSubcategoryId={activeSubcategoryId}
          setActiveSubcategoryId={setActiveSubcategoryId}
          availableCategories={availableCategories}
          subcategories={subcategories}
          isLoadingSubcategories={isLoadingSubcategories}
          onFilterClick={closeSidebar}
          showSubcategoriesInline={true}
        />
      </aside>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0 self-start sticky top-24 border-r border-slate-200 pr-6 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
          <SidebarContent
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCategoryType={selectedCategoryType}
            setSelectedCategoryType={setSelectedCategoryType}
            activeCategoryId={activeCategoryId}
            setActiveCategoryId={setActiveCategoryId}
            activeSubcategoryId={activeSubcategoryId}
            setActiveSubcategoryId={setActiveSubcategoryId}
            availableCategories={availableCategories}
            subcategories={subcategories}
            isLoadingSubcategories={isLoadingSubcategories}
            onFilterClick={undefined}
            showSubcategoriesInline={false}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="mb-6 sm:mb-8 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent mb-2 py-2">
                Connecting Buyers and Sellers
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
                Share your wish, discover offers, and seize the best
                opportunities with ease.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-md border border-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 bg-white min-w-[200px] max-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 h-7 min-w-0"
                />
                {swrIsSearching && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 shrink-0" />
                )}
                {searchQuery && !swrIsSearching && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors lg:hidden"
                aria-label="Open filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4 py-2 px-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mr-1">
                Active filters:
              </span>
              {typeLabel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                  Type: {typeLabel}
                </span>
              )}
              {categoryTypeLabel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                  Category: {categoryTypeLabel}
                </span>
              )}
              {activeCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                  Industry: {activeCategory.name}
                </span>
              )}
              {activeSubcategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-medium">
                  Subcategory: {activeSubcategory.name}
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                  Search: &quot;{searchQuery.trim()}&quot;
                </span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-800 text-xs font-medium transition-colors"
                aria-label="Clear all filters"
              >
                <FilterX className="w-3.5 h-3.5" />
                Clear all
              </button>
            </div>
          )}

          {wishLoading || offerLoading ? (
            <div className="flex justify-center items-center min-h-[400px] bg-white ">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm">
              <p className="text-slate-500">
                No items found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const isWish = item._source === "wish";
                return (
                  <ItemCard
                    key={`${item._source}-${item.id}`} // Ensure unique keys with source
                    item={item}
                    isWish={isWish}
                    onOpen={() => setSelectedItem(item)}
                    onCreateOffer={
                      isWish ? () => handleCreateOffer(item as Wish) : undefined
                    }
                    onCreateWish={
                      !isWish
                        ? () => handleCreateWish(item as Offer)
                        : undefined
                    }
                  />
                );
              })}

              {/* Skeleton Loaders for Infinite Scroll */}
              {(isWishLoadingMore || isOfferLoadingMore) &&
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={`skeleton-${i}`} />
                ))}

              {/* Intersection Observer Target */}
              {/* Only show if we have more data to load and are not currently loading/searching */}
              {!searchQuery.trim() && (
                <div
                  ref={ref}
                  className="col-span-1 sm:col-span-2 lg:col-span-3 h-10 flex justify-center items-center"
                >
                  {/* Optional: Add a spinner or message here if needed, but skeletons cover loading state */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {selectedItem && (
        <ItemDetailDialog
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onCreateOffer={
            selectedItem._source === "wish"
              ? () => handleCreateOffer(selectedItem as Wish)
              : undefined
          }
          onCreateWish={
            selectedItem._source === "offer"
              ? () => handleCreateWish(selectedItem as Offer)
              : undefined
          }
        />
      )}
      {showFormModal && relatedItem && (
        <CreateFormModal
          formType={formType}
          relatedItem={relatedItem}
          relatedItemId={relatedItemId}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
