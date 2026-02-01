"use client";

import React, { useState, Suspense, useMemo } from "react";
import {
  useWishes,
  useOffers,
  useWishOfferCategories,
  useSearchWishesOffers,
} from "@/app/utils/wishOffer";
import { Wish, Offer } from "@/types/wish";
import { Category } from "@/types/create-wish-type";
import {
  Loader2,
  MapPin,
  Briefcase,
  Zap,
  X,
  ChevronRight,
  Search,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import Image from "next/image";
import { CreateWishOfferFormSimplified } from "@/components/sections/create-wish/create-wish-form-simplified";

type ItemType = "WISH" | "OFFER" | "ALL";
type CategoryType = "Product" | "Service" | "ALL";

// Type for items with source tracking (based on API call)
type ItemWithSource = (Wish | Offer) & { _source: "wish" | "offer" };

function WishOfferContent() {
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

  const debouncedSearch = useDebounce(searchQuery, 500);
  const { results: swrSearchResults, isLoading: swrIsSearching } =
    useSearchWishesOffers(debouncedSearch);

  // Get categories based on selected category type
  const availableCategories = useMemo(() => {
    if (selectedCategoryType === "Product") return productCategories;
    if (selectedCategoryType === "Service") return serviceCategories;
    return [...productCategories, ...serviceCategories];
  }, [selectedCategoryType, productCategories, serviceCategories]);

  // Filter items based on type and category, with source tracking
  const filteredItems = useMemo(() => {
    const searchResults = swrSearchResults;
    const wishes = searchResults ? searchResults.wishes : allWishes;
    const offers = searchResults ? searchResults.offers : allOffers;

    let items: ItemWithSource[] = [];

    // Filter by type and tag items with their source
    if (selectedType === "ALL") {
      // Tag wishes from wishes array
      const taggedWishes: ItemWithSource[] = wishes.map((wish) => ({
        ...wish,
        _source: "wish" as const,
      }));
      // Tag offers from offers array
      const taggedOffers: ItemWithSource[] = offers.map((offer) => ({
        ...offer,
        _source: "offer" as const,
      }));
      items = [...taggedWishes, ...taggedOffers];
    } else if (selectedType === "WISH") {
      items = wishes.map((wish) => ({
        ...wish,
        _source: "wish" as const,
      }));
    } else if (selectedType === "OFFER") {
      items = offers.map((offer) => ({
        ...offer,
        _source: "offer" as const,
      }));
    }

    // Filter by category
    if (activeCategoryId) {
      items = items.filter((item) => {
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
  }, [selectedType, activeCategoryId, allWishes, allOffers, swrSearchResults]);

  const handleCategorySelect = (categoryId: number | null) => {
    setActiveCategoryId(categoryId);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header + Search - sticky on desktop */}
      <div className="sticky top-16 z-30 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 pb-6 mb-6 bg-white border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div>
          <span className="text-blue-800 font-bold text-xs uppercase tracking-wider mb-2 block">
            Marketplace
          </span>
          <h1 className="text-3xl font-bold text-slate-900">B2B Connect</h1>
          <p className="text-slate-500 mt-2 max-w-lg text-sm">
            Discover business wishes and offers. Connect with suppliers, buyers,
            and partners across Nepal.
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-auto md:min-w-[280px] md:max-w-md">
          <div className="rounded-md border border-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 bg-white">
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
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 overflow-y-auto py-4 px-4 transition-transform duration-200 ease-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
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

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop sidebar - flush, sticky */}
        <aside className="hidden lg:block w-64 flex-shrink-0 self-start sticky top-[15rem] border-r border-slate-200 pr-6 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
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

        {/* Main content - Listings */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900">Listings</h2>
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
          {wishLoading || offerLoading ? (
            <div className="flex justify-center items-center min-h-[400px] bg-white rounded-xl border border-slate-200 shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm">
              <p className="text-slate-500">
                No items found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
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

      {/* Create Form Modal */}
      {showFormModal && relatedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full my-8 relative max-h-[90vh] overflow-y-auto shadow-lg border border-slate-200">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <CreateWishOfferFormSimplified
                is_wish_or_offer={formType}
                onClose={handleCloseForm}
                initialValues={{
                  wish_id:
                    formType === "offers" && relatedItemId
                      ? relatedItemId.toString()
                      : undefined,
                  offer_id:
                    formType === "wishes" && relatedItemId
                      ? relatedItemId.toString()
                      : undefined,
                  type: relatedItem.product ? "Product" : "Service",
                  product: relatedItem.product?.id?.toString() || "",
                  service: relatedItem.service?.id?.toString() || "",
                  title: relatedItem.title || "",
                  description: relatedItem.description || "",
                  category: (() => {
                    if (relatedItem.product?.category?.id) {
                      return relatedItem.product.category.id.toString();
                    }
                    const service = relatedItem.service;
                    if (
                      service &&
                      typeof service === "object" &&
                      "category" in service &&
                      service.category?.id
                    ) {
                      return service.category.id.toString();
                    }
                    return "";
                  })(),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FilterOption: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  showChevron?: boolean;
}> = ({ label, isActive, onClick, icon, showChevron }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
      isActive
        ? "bg-slate-100 text-slate-900"
        : "text-slate-600 hover:bg-slate-50"
    }`}
  >
    {icon}
    <span className="flex-1 text-left">{label}</span>
    {showChevron && (
      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
    )}
  </button>
);

const SidebarContent: React.FC<{
  selectedType: ItemType;
  setSelectedType: (t: ItemType) => void;
  selectedCategoryType: CategoryType;
  setSelectedCategoryType: (t: CategoryType) => void;
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
  availableCategories: Category[];
  onFilterClick?: () => void;
}> = ({
  selectedType,
  setSelectedType,
  selectedCategoryType,
  setSelectedCategoryType,
  activeCategoryId,
  setActiveCategoryId,
  availableCategories,
  onFilterClick,
}) => {
  const wrap = (fn: () => void) => () => {
    fn();
    onFilterClick?.();
  };
  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
          <LayoutGrid className="w-4 h-4 text-slate-500" />
          <span>Type</span>
        </div>
        <div className="space-y-0.5">
          <FilterOption
            label="All Items"
            isActive={selectedType === "ALL"}
            onClick={wrap(() => setSelectedType("ALL"))}
          />
          <FilterOption
            label="Wishes (क्रेता)"
            isActive={selectedType === "WISH"}
            onClick={wrap(() => setSelectedType("WISH"))}
            icon={<Briefcase className="w-4 h-4 text-slate-500" />}
          />
          <FilterOption
            label="Offers (बिक्रेता)"
            isActive={selectedType === "OFFER"}
            onClick={wrap(() => setSelectedType("OFFER"))}
            icon={<Zap className="w-4 h-4 text-slate-500" />}
          />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
          <LayoutGrid className="w-4 h-4 text-slate-500" />
          <span>Category Type</span>
        </div>
        <div className="space-y-0.5">
          <FilterOption
            label="All Categories"
            isActive={selectedCategoryType === "ALL"}
            onClick={wrap(() => {
              setSelectedCategoryType("ALL");
              setActiveCategoryId(null);
            })}
          />
          <FilterOption
            label="Products"
            isActive={selectedCategoryType === "Product"}
            onClick={wrap(() => {
              setSelectedCategoryType("Product");
              setActiveCategoryId(null);
            })}
          />
          <FilterOption
            label="Services"
            isActive={selectedCategoryType === "Service"}
            onClick={wrap(() => {
              setSelectedCategoryType("Service");
              setActiveCategoryId(null);
            })}
          />
        </div>
      </div>
      {availableCategories.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
            <LayoutGrid className="w-4 h-4 text-slate-500" />
            <span>Industries</span>
          </div>
          <div className="space-y-0.5">
            <FilterOption
              label="All Industries"
              isActive={activeCategoryId === null}
              onClick={wrap(() => setActiveCategoryId(null))}
            />
            {availableCategories.map((cat) => (
              <FilterOption
                key={cat.id}
                label={cat.name}
                isActive={activeCategoryId === cat.id}
                onClick={wrap(() =>
                  setActiveCategoryId(
                    activeCategoryId === cat.id ? null : cat.id
                  )
                )}
                showChevron
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const ItemCard: React.FC<{
  item: Wish | Offer | ItemWithSource;
  isWish: boolean;
  onOpen: () => void;
  onCreateOffer?: () => void;
  onCreateWish?: () => void;
}> = ({ item, isWish, onOpen, onCreateOffer, onCreateWish }) => {
  const imageUrl = item.image || (isWish ? item.product?.image : null) || null;
  const postedBy = item.company_name || item.full_name || "Unknown";
  const location = item.province || item.municipality || item.country || "N/A";
  const created = new Date(item.created_at);
  const timeAgo =
    Date.now() - created.getTime() < 60000
      ? "just now"
      : Date.now() - created.getTime() < 120000
      ? "1 min ago"
      : `${Math.max(
          1,
          Math.floor((Date.now() - created.getTime()) / 60000)
        )} mins ago`;

  return (
    <div
      className="flex flex-row gap-3 sm:gap-4 py-4 sm:py-5 first:pt-0 group cursor-pointer -mx-2 px-2 rounded-lg hover:bg-slate-50 transition-colors"
      onClick={onOpen}
    >
      {/* Image block */}
      <div className="w-24 sm:w-40 md:w-48 flex-shrink-0">
        <div className="aspect-square bg-slate-50 relative overflow-hidden rounded">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-400 text-xs">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Content block - full width, larger readable text */}
      <div className="flex-1 min-w-0 flex flex-col text-left w-full">
        <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        {(item.description ?? "").trim() && (
          <p className="text-sm text-slate-600 mb-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-slate-100 text-slate-600 text-sm px-2.5 py-1 rounded font-medium">
            {isWish ? "Wish" : "Offer"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 mb-2">
          <span className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-4 h-4 flex-shrink-0 text-slate-500" />
            <span className="truncate">{location}</span>
          </span>
          <span className="text-slate-500">{timeAgo}</span>
        </div>
        <div className="text-sm text-slate-600 mb-3">{postedBy}</div>
        <div className="mt-auto flex items-center justify-end sm:justify-between pt-3 border-t border-slate-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isWish && onCreateOffer) onCreateOffer();
              else if (!isWish && onCreateWish) onCreateWish();
            }}
            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5 ml-auto"
          >
            {isWish ? "Create Offer" : "Request"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

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
