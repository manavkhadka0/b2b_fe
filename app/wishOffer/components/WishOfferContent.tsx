"use client";

import React, { useState, useMemo } from "react";
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
import { Loader2, X, Search, SlidersHorizontal, FilterX } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarContent } from "./SidebarContent";
import { ItemCard } from "./ItemCard";
import { ItemDetailDialog } from "./ItemDetailDialog";
import { CreateFormModal } from "./CreateFormModal";

export function WishOfferContent() {
  const { user, isLoading: authLoading, requireAuth } = useAuth();
  const [selectedType, setSelectedType] = useState<ItemType>("ALL");
  const [selectedCategoryType, setSelectedCategoryType] =
    useState<CategoryType>("ALL");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
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

  const { wishes: allWishes, isLoading: wishLoading } =
    useWishes(activeCategoryId);
  const { offers: allOffers, isLoading: offerLoading } =
    useOffers(activeCategoryId);

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

    // 3. Filter by Category (Only needed if Searching)
    // - If not searching, the API hooks already filtered by `activeCategoryId`.
    // - If searching, the search API ignores category, so we filter here.
    if (isSearching && activeCategoryId) {
      items = items.filter((item) => {
        // Handle new API structure: `subcategory` ID
        // Using `(item as any)` because types might not reflect this yet
        // and we want to be robust.
        const subId = (item as any).subcategory;
        if (typeof subId === "number") {
          return subId === activeCategoryId;
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
      });
    }

    return items;
  }, [
    selectedType,
    activeCategoryId,
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
    setSearchQuery("");
  };

  const activeCategory = useMemo(
    () =>
      activeCategoryId
        ? availableCategories.find((c) => c.id === activeCategoryId)
        : null,
    [activeCategoryId, availableCategories],
  );

  const hasActiveFilters =
    selectedType !== "ALL" ||
    selectedCategoryType !== "ALL" ||
    activeCategoryId !== null ||
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
          availableCategories={availableCategories}
          onFilterClick={closeSidebar}
        />
      </aside>
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent mb-2 py-2">
          क्रेता बिक्रेता भेट हुने ठाउँ
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
          Discover opportunities to connect, trade, and collaborate. Share your
          wish, discover offers, and seize the best opportunities with ease.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0 self-start sticky top-24 border-r border-slate-200 pr-6 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
          <SidebarContent
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCategoryType={selectedCategoryType}
            setSelectedCategoryType={setSelectedCategoryType}
            activeCategoryId={activeCategoryId}
            setActiveCategoryId={setActiveCategoryId}
            availableCategories={availableCategories}
            onFilterClick={undefined}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="text-lg font-bold text-slate-900">
              Explore Wishes and Offers
            </h2>
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
                    key={item.id}
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
