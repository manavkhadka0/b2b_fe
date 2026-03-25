"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  useCombinedWishesOffers,
  useWishOfferCategories,
  useSearchWishesOffers,
  postWishView,
  postOfferView,
  parseMarketplaceSlug,
} from "@/app/utils/wishOffer";
import {
  Wish,
  Offer,
  ItemWithSource,
  type ItemType,
  type CategoryType,
} from "@/types/wish";
import { Category } from "@/types/create-wish-type";
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
import { AuthDialog } from "@/components/auth/AuthDialog";
import { SidebarContent } from "./SidebarContent";
import { ItemCard } from "./ItemCard";
import { ItemDetailDialog } from "./ItemDetailDialog";
import { CreateFormModal } from "./CreateFormModal";
import { useInView } from "react-intersection-observer";
import { SkeletonCard } from "./SkeletonCard";
import { Event } from "@/types/events";
import { getEvents } from "@/services/events";
import useSWR from "swr";

export function WishOfferContent({
  initialCategoryId = null,
  initialSubcategoryId = null,
  initialCategoryName = null,
  initialSubcategoryName = null,
  initialType = "ALL",
  initialCategoryType = "ALL",
  initialEventSlug = null,
  initialProductCategories = [],
  initialServiceCategories = [],
  slug = [],
}: {
  initialCategoryId?: number | null;
  initialSubcategoryId?: number | null;
  initialCategoryName?: string | null;
  initialSubcategoryName?: string | null;
  initialType?: ItemType;
  initialCategoryType?: CategoryType;
  initialEventSlug?: string | null;
  initialProductCategories?: Category[];
  initialServiceCategories?: Category[];
  slug?: string[];
}) {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Add ref to track if this is initial mount
  const isInitialMount = useRef(true);
  const isUpdatingFromURL = useRef(false);

  const typeParam = searchParams.get("type");
  const [selectedType, setSelectedType] = useState<ItemType>(() => {
    if (initialType !== "ALL") return initialType;
    return typeParam === "WISH" || typeParam === "OFFER" ? typeParam : "ALL";
  });

  const [selectedCategoryType, setSelectedCategoryType] = useState<CategoryType>(initialCategoryType);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(initialCategoryId);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<number | null>(initialSubcategoryId);
  const [activeEventSlug, setActiveEventSlug] = useState<string | null>(initialEventSlug);

  const { productCategories, serviceCategories } = useWishOfferCategories();

  const slugify = useCallback((text: string) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-"), []);

  const updateURL = useCallback((catId: number | null, subId: number | null, type?: ItemType, catType?: CategoryType, eventSlug?: string | null) => {
    const currentType = type ?? selectedType;
    const currentCatType = catType ?? selectedCategoryType;
    const currentEventSlug = eventSlug !== undefined ? eventSlug : activeEventSlug;

    let newPath = "/marketplace";
    if (currentType === "WISH") {
      newPath = "/marketplace/wishes";
    } else if (currentType === "OFFER") {
      newPath = "/marketplace/offers";
      if (currentCatType === "Product") {
        newPath += "/products";
      } else if (currentCatType === "Service") {
        newPath += "/services";
      }
    }

    if (currentEventSlug && !catId) {
       // Handle /marketplace/event/[slug] or /marketplace/wishes/event/[slug]
       newPath += `/event/${currentEventSlug}`;
    }

    if (catId) {
      const allCats = [...productCategories, ...serviceCategories];
      const cat = allCats.find((c) => c.id === catId);
      if (cat) {
        newPath += `/${slugify(cat.name)}`;
        if (subId) {
          const sub = cat.subcategories?.find((s) => s.id === subId);
          if (sub) {
            newPath += `/${slugify(sub.name)}`;
          }
        }
      }
      
      // If we have an event AND a category, put the event at the end
      if (currentEventSlug) {
        newPath += `/event/${currentEventSlug}`;
      }
    }

    // Use replace instead of push and add scroll: false to prevent page jump
    if (window.location.pathname !== newPath) {
      router.replace(newPath, { scroll: false });
    }
  }, [selectedType, selectedCategoryType, activeEventSlug, productCategories, serviceCategories, slugify, router]);

  const handleSetActiveEventSlug = useCallback((slug: string | null) => {
    setActiveEventSlug(slug);
    updateURL(activeCategoryId, activeSubcategoryId, undefined, undefined, slug);
  }, [activeCategoryId, activeSubcategoryId, updateURL]);

  const handleSetSelectedType = useCallback(
    (type: ItemType) => {
      isUpdatingFromURL.current = true;
      setSelectedType(type);
      updateURL(activeCategoryId, activeSubcategoryId, type);
      setTimeout(() => { isUpdatingFromURL.current = false; }, 500);
    },
    [activeCategoryId, activeSubcategoryId, updateURL],
  );

  const handleSetSelectedCategoryType = useCallback(
    (catType: CategoryType) => {
      isUpdatingFromURL.current = true;
      setSelectedCategoryType(catType);
      setActiveCategoryId(null);
      setActiveSubcategoryId(null);
      updateURL(null, null, selectedType, catType);
      setTimeout(() => { isUpdatingFromURL.current = false; }, 500);
    },
    [selectedType, updateURL],
  );

  const handleSetActiveCategoryId = useCallback((id: number | null) => {
    isUpdatingFromURL.current = true;
    setActiveCategoryId(id);
    if (id === null) {
      setActiveSubcategoryId(null);
      updateURL(null, null);
    } else {
      updateURL(id, activeSubcategoryId);
    }
    setTimeout(() => { isUpdatingFromURL.current = false; }, 500);
  }, [activeSubcategoryId, updateURL]);

  const handleSetActiveSubcategoryId = useCallback((id: number | null) => {
    isUpdatingFromURL.current = true;
    setActiveSubcategoryId(id);
    updateURL(activeCategoryId, id);
    setTimeout(() => { isUpdatingFromURL.current = false; }, 500);
  }, [activeCategoryId, updateURL]);

  const handleSetCategoryAndSubcategory = useCallback(
    (catId: number | null, subId: number | null) => {
      isUpdatingFromURL.current = true;
      setActiveCategoryId(catId);
      setActiveSubcategoryId(subId);
      updateURL(catId, subId);
      setTimeout(() => { isUpdatingFromURL.current = false; }, 500);
    },
    [updateURL],
  );

  // Handle Slug-based category and subcategory matching
  useEffect(() => {
    const pc = productCategories.length > 0 ? productCategories : initialProductCategories;
    const sc = serviceCategories.length > 0 ? serviceCategories : initialServiceCategories;

    if (pc.length > 0 || sc.length > 0) {
      // Don't set isUpdatingFromURL if this is initial mount, 
      // as we want SWR to trigger with the correct initial states
      if (!isInitialMount.current) {
        isUpdatingFromURL.current = true;
      }

      const parsed = parseMarketplaceSlug(slug || []);

      // Batch state updates but check if they've actually changed to avoid cycles
      setSelectedType(prev => prev !== parsed.type ? parsed.type : prev);
      setSelectedCategoryType(prev => prev !== parsed.catType ? parsed.catType : prev);
      setActiveEventSlug(prev => prev !== parsed.eventSlug ? parsed.eventSlug : prev);

      if (parsed.categorySlug) {
        const allCats = [...pc, ...sc];
        const match = allCats.find((c) => slugify(c.name) === parsed.categorySlug);

        if (match) {
          setActiveCategoryId(prev => prev !== match.id ? match.id : prev);
          if (parsed.subcategorySlug) {
            const subMatch = match.subcategories?.find((sc) => slugify(sc.name) === parsed.subcategorySlug);
            setActiveSubcategoryId(prev => {
              const targetId = subMatch ? subMatch.id : null;
              return prev !== targetId ? targetId : prev;
            });
          } else {
            setActiveSubcategoryId(prev => prev !== null ? null : prev);
          }
        } else {
          setActiveCategoryId(prev => prev !== null ? null : prev);
          setActiveSubcategoryId(prev => prev !== null ? null : prev);
        }
      } else {
        setActiveCategoryId(prev => prev !== null ? null : prev);
        setActiveSubcategoryId(prev => prev !== null ? null : prev);
      }

      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        setTimeout(() => {
          isUpdatingFromURL.current = false;
        }, 100);
      }
    }
  }, [slug, productCategories, serviceCategories, slugify, initialProductCategories, initialServiceCategories]);

  // If initialCategoryName is provided, try to find the category ID once categories are loaded
  useEffect(() => {
    const pc = productCategories.length > 0 ? productCategories : initialProductCategories;
    const sc = serviceCategories.length > 0 ? serviceCategories : initialServiceCategories;

    if ((initialCategoryName || initialSubcategoryName) && !activeCategoryId && !isUpdatingFromURL.current && (pc.length > 0 || sc.length > 0)) {
      const allCats = [...pc, ...sc];
      if (initialCategoryName) {
        const match = allCats.find((c) => slugify(c.name) === initialCategoryName);
        if (match) {
          setActiveCategoryId(match.id);
          if (initialSubcategoryName) {
            const subMatch = match.subcategories?.find(s => slugify(s.name) === initialSubcategoryName);
            if (subMatch) setActiveSubcategoryId(subMatch.id);
          }
        }
      }
    }
  }, [initialCategoryName, initialSubcategoryName, productCategories, serviceCategories, activeCategoryId, slugify]);

  const [selectedItem, setSelectedItem] = useState<ItemWithSource | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [formType, setFormType] = useState<"wishes" | "offers">("wishes");
  const [relatedItemId, setRelatedItemId] = useState<number | null>(null);
  const [relatedItem, setRelatedItem] = useState<Wish | Offer | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<"login" | "register">(
    "login",
  );
  const [pendingCreate, setPendingCreate] = useState<
    | { kind: "offer"; item: Wish }
    | { kind: "wish"; item: Offer }
    | null
  >(null);

  // Fetch events
  const eventFetcher = async () => {
    const response = await getEvents("1");
    return response.results || [];
  };

  const { data: events, isLoading: isLoadingEvents } = useSWR<Event[]>(
    "wishOfferEvents",
    eventFetcher,
  );

  const modelTypeParam =
    selectedType === "WISH"
      ? ("wish" as const)
      : selectedType === "OFFER"
        ? ("offer" as const)
        : null;

  const {
    allResults: combinedResults,
    isLoading: combinedLoading,
    isLoadingMore: isCombinedLoadingMore,
    size: combinedSize,
    setSize: setCombinedSize,
    isReachingEnd: isCombinedReachingEnd,
  } = useCombinedWishesOffers(
    activeSubcategoryId ? null : activeCategoryId,
    activeSubcategoryId,
    activeEventSlug,
    modelTypeParam,
    activeCategoryId ? null : initialCategoryName,
  );

  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (
      inView &&
      !searchQuery.trim() &&
      !isCombinedReachingEnd &&
      !isCombinedLoadingMore
    ) {
      setCombinedSize(combinedSize + 1);
    }
  }, [
    inView,
    searchQuery,
    isCombinedReachingEnd,
    isCombinedLoadingMore,
    combinedSize,
    setCombinedSize,
  ]);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const { results: swrSearchResults, isLoading: swrIsSearching } =
    useSearchWishesOffers(debouncedSearch);

  const availableCategories = useMemo(() => {
    const pc = productCategories.length > 0 ? productCategories : initialProductCategories;
    const sc = serviceCategories.length > 0 ? serviceCategories : initialServiceCategories;
    
    if (selectedCategoryType === "Product") return pc;
    if (selectedCategoryType === "Service") return sc;
    return [...pc, ...sc];
  }, [selectedCategoryType, productCategories, serviceCategories, initialProductCategories, initialServiceCategories]);

  const allSubcategories = useMemo(() => {
    return availableCategories.flatMap((cat) => cat.subcategories || []);
  }, [availableCategories]);

  const prevCategoryIdRef = React.useRef<number | null>(null);
  useEffect(() => {
    // Skip if we're updating from URL
    if (isUpdatingFromURL.current) return;

    if (activeCategoryId === null) {
      setActiveSubcategoryId(null);
      prevCategoryIdRef.current = null;
      return;
    }

    if (
      prevCategoryIdRef.current !== null &&
      prevCategoryIdRef.current !== activeCategoryId &&
      activeSubcategoryId !== null
    ) {
      const parentCategory = availableCategories.find((cat) =>
        cat.subcategories?.some((sub) => sub.id === activeSubcategoryId),
      );
      if (!parentCategory || parentCategory.id !== activeCategoryId) {
        setActiveSubcategoryId(null);
      }
    }
    prevCategoryIdRef.current = activeCategoryId;
  }, [activeCategoryId, availableCategories, activeSubcategoryId]);

  const filteredItems = useMemo(() => {
    const searchResults = swrSearchResults;
    const isSearching = searchQuery.trim().length > 0;

    let items: ItemWithSource[] = [];

    if (isSearching) {
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
      items = (combinedResults || []).map((r) => ({
        ...r,
        _source:
          r.model_type === "wish" ? ("wish" as const) : ("offer" as const),
        model_type: r.model_type,
      }));
    }

    if (isSearching) {
      if (selectedType === "WISH") {
        items = items.filter((i) => i._source === "wish");
      } else if (selectedType === "OFFER") {
        items = items.filter((i) => i._source === "offer");
      }
    }

    if (
      isSearching &&
      (activeCategoryId || activeSubcategoryId || activeEventSlug)
    ) {
      items = items.filter((item) => {
        if (activeEventSlug) {
          const eventSlug =
            (item as any).event_slug || (item as any).event?.slug;
          if (eventSlug) {
            return eventSlug === activeEventSlug;
          }
          return false;
        }

        if (activeSubcategoryId) {
          const subId = (item as any).subcategory;
          if (typeof subId === "number") {
            return subId === activeSubcategoryId;
          }
          return false;
        }

        if (activeCategoryId) {
          const subId = (item as any).subcategory;
          if (typeof subId === "number") {
            return true;
          }

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
    activeEventSlug,
    combinedResults,
    swrSearchResults,
    searchQuery,
  ]);

  const clearSearch = () => setSearchQuery("");

  const clearAllFilters = () => {
    setSelectedType("ALL");
    setSelectedCategoryType("ALL");
    setActiveCategoryId(null);
    setActiveSubcategoryId(null);
    setActiveEventSlug(null);
    setSearchQuery("");
    router.replace("/marketplace", { scroll: false });
  };

  const activeCategory = useMemo(
    () =>
      activeCategoryId
        ? availableCategories.find((c) => c.id === activeCategoryId)
        : null,
    [activeCategoryId, availableCategories],
  );

  const activeSubcategory = useMemo(
    () =>
      activeSubcategoryId
        ? allSubcategories.find((sc) => sc.id === activeSubcategoryId)
        : null,
    [activeSubcategoryId, allSubcategories],
  );

  const activeEvent = useMemo(
    () =>
      activeEventSlug ? events?.find((e) => e.slug === activeEventSlug) : null,
    [activeEventSlug, events],
  );

  const hasActiveFilters =
    selectedType !== "ALL" ||
    selectedCategoryType !== "ALL" ||
    activeCategoryId !== null ||
    activeSubcategoryId !== null ||
    activeEventSlug !== null ||
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
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!user && !token && !authLoading) {
      setPendingCreate({ kind: "offer", item: wish });
      setAuthDialogMode("login");
      setAuthDialogOpen(true);
      return;
    }
    setRelatedItem(wish);
    setRelatedItemId(wish.id);
    setFormType("offers");
    setShowFormModal(true);
  };

  const handleCreateWish = (offer: Offer) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!user && !token && !authLoading) {
      setPendingCreate({ kind: "wish", item: offer });
      setAuthDialogMode("login");
      setAuthDialogOpen(true);
      return;
    }
    setRelatedItem(offer);
    setRelatedItemId(offer.id);
    setFormType("wishes");
    setShowFormModal(true);
  };

  useEffect(() => {
    if (!user || !pendingCreate) return;
    if (pendingCreate.kind === "offer") {
      const w = pendingCreate.item;
      setRelatedItem(w);
      setRelatedItemId(w.id);
      setFormType("offers");
    } else {
      const o = pendingCreate.item;
      setRelatedItem(o);
      setRelatedItemId(o.id);
      setFormType("wishes");
    }
    setShowFormModal(true);
    setSelectedItem(null);
    setPendingCreate(null);
  }, [user, pendingCreate]);

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
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 overflow-y-auto overflow-x-hidden py-4 px-4 transition-transform duration-200 ease-out lg:hidden [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
          setSelectedType={handleSetSelectedType}
          selectedCategoryType={selectedCategoryType}
          setSelectedCategoryType={handleSetSelectedCategoryType}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={handleSetActiveCategoryId}
          activeSubcategoryId={activeSubcategoryId}
          setActiveSubcategoryId={handleSetActiveSubcategoryId}
          setCategoryAndSubcategory={handleSetCategoryAndSubcategory}
          activeEventSlug={activeEventSlug}
          setActiveEventSlug={handleSetActiveEventSlug}
          availableCategories={availableCategories}
          events={events || []}
          isLoadingEvents={isLoadingEvents}
          onFilterClick={closeSidebar}
        />
      </aside>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0 self-start sticky top-24 border-r border-slate-200 pr-6 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
          <SidebarContent
            selectedType={selectedType}
            setSelectedType={handleSetSelectedType}
            selectedCategoryType={selectedCategoryType}
            setSelectedCategoryType={handleSetSelectedCategoryType}
            activeCategoryId={activeCategoryId}
            setActiveCategoryId={handleSetActiveCategoryId}
            activeSubcategoryId={activeSubcategoryId}
            setActiveSubcategoryId={handleSetActiveSubcategoryId}
            setCategoryAndSubcategory={handleSetCategoryAndSubcategory}
            activeEventSlug={activeEventSlug}
            setActiveEventSlug={handleSetActiveEventSlug}
            availableCategories={availableCategories}
            events={events || []}
            isLoadingEvents={isLoadingEvents}
            onFilterClick={undefined}
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
              {activeEvent && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium">
                  Event: {activeEvent.title}
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

          {combinedLoading ? (
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
              {filteredItems.map((item, idx) => {
                const isWish =
                  item.model_type === "wish" || item._source === "wish";
                return (
                  <ItemCard
                    key={`${item.model_type ?? item._source}-${item.id}`}
                    item={item}
                    index={idx}
                    onOpen={() => {
                      if (isWish) postWishView(item.id);
                      else postOfferView(item.id);
                      setSelectedItem(item);
                    }}
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

              {isCombinedLoadingMore &&
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={`skeleton-${i}`} />
                ))}

              {!searchQuery.trim() && (
                <div
                  ref={ref}
                  className="col-span-1 sm:col-span-2 lg:col-span-3 h-10 flex justify-center items-center"
                />
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
            (selectedItem.model_type ?? selectedItem._source) === "wish"
              ? () => handleCreateOffer(selectedItem as Wish)
              : undefined
          }
          onCreateWish={
            (selectedItem.model_type ?? selectedItem._source) === "offer"
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

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={(open) => {
          setAuthDialogOpen(open);
          if (!open && pendingCreate) {
            window.setTimeout(() => {
              const token = localStorage.getItem("accessToken");
              if (!token) setPendingCreate(null);
            }, 0);
          }
        }}
        initialMode={authDialogMode}
        returnTo={pathname || undefined}
      />
    </div>
  );
}