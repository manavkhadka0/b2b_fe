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
  Filter,
  MapPin,
  Briefcase,
  Zap,
  X,
  ChevronRight,
  Search,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import Image from "next/image";
import { CreateWishOfferFormSimplified } from "@/components/sections/create-wish/create-wish-form-simplified";

type ItemType = "WISH" | "OFFER" | "ALL";
type CategoryType = "Product" | "Service" | "ALL";

// Type for items with source tracking (based on API call)
type ItemWithSource = (Wish | Offer) & { _source: "wish" | "offer" };

// Helper function to determine if an item is a Wish based on API source
function isItemWish(item: Wish | Offer | ItemWithSource): boolean {
  // First check if item has _source property (from API call tracking)
  if ("_source" in item && item._source) {
    return item._source === "wish";
  }
  
  // Fallback: Check the type field if available
  if (item.type) {
    const typeLower = item.type.toLowerCase();
    if (typeLower === "wish") return true;
    if (typeLower === "offer") return false;
  }
  
  // Fallback: Check if item has required Wish fields
  // Wish requires full_name, designation, mobile_no, email, company_name, address, country
  // Offer has these as optional
  if (
    item.full_name &&
    typeof item.full_name === "string" &&
    item.full_name.trim() !== "" &&
    item.designation &&
    typeof item.designation === "string" &&
    item.designation.trim() !== "" &&
    item.mobile_no &&
    typeof item.mobile_no === "string" &&
    item.mobile_no.trim() !== "" &&
    item.email &&
    typeof item.email === "string" &&
    item.email.trim() !== "" &&
    item.company_name &&
    typeof item.company_name === "string" &&
    item.company_name.trim() !== "" &&
    item.address &&
    typeof item.address === "string" &&
    item.address.trim() !== "" &&
    item.country &&
    typeof item.country === "string" &&
    item.country.trim() !== ""
  ) {
    return true;
  }
  
  // Default to Offer if we can't determine
  return false;
}

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
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
      </div>

      {/* Search Bar - Top */}
      <div className="mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all"
            />
            {swrIsSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
            )}
            {searchQuery && !swrIsSearching && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-slate-200 p-1 rounded text-slate-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-60 flex-shrink-0 space-y-6">
          {/* Filter Group: Type */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-xs uppercase tracking-wide">
              <Filter className="w-3 h-3" />
              <span>Type</span>
            </div>
            <div className="space-y-1">
              <FilterOption
                label="All Items"
                isActive={selectedType === "ALL"}
                onClick={() => setSelectedType("ALL")}
              />
              <FilterOption
                label="Wishes (क्रेता)"
                isActive={selectedType === "WISH"}
                onClick={() => setSelectedType("WISH")}
                icon={<Briefcase className="w-3 h-3 text-blue-500" />}
              />
              <FilterOption
                label="Offers (बिक्रेता)"
                isActive={selectedType === "OFFER"}
                onClick={() => setSelectedType("OFFER")}
                icon={<Zap className="w-3 h-3 text-emerald-500" />}
              />
            </div>
          </div>

          {/* Filter Group: Category Type */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wide mb-4">
              Category Type
            </h3>
            <div className="space-y-1">
              <FilterOption
                label="All Categories"
                isActive={selectedCategoryType === "ALL"}
                onClick={() => {
                  setSelectedCategoryType("ALL");
                  setActiveCategoryId(null);
                }}
              />
              <FilterOption
                label="Products"
                isActive={selectedCategoryType === "Product"}
                onClick={() => {
                  setSelectedCategoryType("Product");
                  setActiveCategoryId(null);
                }}
              />
              <FilterOption
                label="Services"
                isActive={selectedCategoryType === "Service"}
                onClick={() => {
                  setSelectedCategoryType("Service");
                  setActiveCategoryId(null);
                }}
              />
            </div>
          </div>

          {/* Filter Group: Categories */}
          {availableCategories.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wide mb-4">
                Industries
              </h3>
              <div className="space-y-1">
                <FilterOption
                  label="All Industries"
                  isActive={activeCategoryId === null}
                  onClick={() => setActiveCategoryId(null)}
                />
                {availableCategories.map((cat) => (
                  <FilterOption
                    key={cat.id}
                    label={cat.name}
                    isActive={activeCategoryId === cat.id}
                    onClick={() =>
                      setActiveCategoryId(
                        activeCategoryId === cat.id ? null : cat.id
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Grid */}
        <div className="flex-1">
          {wishLoading || offerLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-800" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl p-16 text-center border border-slate-200 border-dashed">
              <p className="text-slate-500">
                No items found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                // Use the _source property to determine if it's a wish or offer (from API call)
                const isWish = item._source === "wish";
                
                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isWish={isWish}
                    onOpen={() => setSelectedItem(item)}
                    onCreateOffer={isWish ? () => handleCreateOffer(item as Wish) : undefined}
                    onCreateWish={!isWish ? () => handleCreateWish(item as Offer) : undefined}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          isWish={selectedItem._source === "wish"}
          onClose={() => setSelectedItem(null)}
          onCreateOffer={
            selectedItem._source === "wish"
              ? () => handleCreateOffer(selectedItem as Wish)
              : undefined
          }
          onCreateWish={
            selectedItem._source === "wish"
              ? undefined
              : () => handleCreateWish(selectedItem as Offer)
          }
        />
      )}

      {/* Create Form Modal */}
      {showFormModal && relatedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <CreateWishOfferFormSimplified
                is_wish_or_offer={formType}
                onClose={handleCloseForm}
                initialValues={{
                  wish_id: formType === "offers" && relatedItemId ? relatedItemId.toString() : undefined,
                  offer_id: formType === "wishes" && relatedItemId ? relatedItemId.toString() : undefined,
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
                    if (service && typeof service === 'object' && 'category' in service && service.category?.id) {
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
}> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
      isActive ? "bg-blue-800 text-white" : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    {icon}
    {label}
  </button>
);

const ItemCard: React.FC<{
  item: Wish | Offer | ItemWithSource;
  isWish: boolean;
  onOpen: () => void;
  onCreateOffer?: () => void;
  onCreateWish?: () => void;
}> = ({ item, isWish, onOpen, onCreateOffer, onCreateWish }) => {
  const imageUrl = item.image || (isWish ? item.product?.image : null) || null;

  // Get category name - handle both Wish and Offer types
  let categoryName = "Uncategorized";
  if (isWish && item.product?.category?.name) {
    categoryName = item.product.category.name;
  } else if ("service" in item && item.service) {
    // For Offer, service can have category
    if ("category" in item.service && item.service.category?.name) {
      categoryName = item.service.category.name;
    }
  }
  const postedBy = item.company_name || item.full_name || "Unknown";
  const location = item.province || item.municipality || item.country || "N/A";
  const date = new Date(item.created_at).toLocaleDateString();

  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
      onClick={onOpen}
    >
      <div className="h-32 bg-slate-100 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-xs">No Image</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase text-white ${
              isWish ? "bg-blue-500" : "bg-emerald-500"
            }`}
          >
            {isWish ? "Wish" : "Offer"}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
            {categoryName}
          </span>
          <span className="text-[10px] text-slate-400">{date}</span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-blue-800 transition-colors">
          {item.title}
        </h3>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
            <Briefcase className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{postedBy}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isWish && onCreateOffer) {
                onCreateOffer();
              } else if (!isWish && onCreateWish) {
                onCreateWish();
              }
            }}
            className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 transition-colors ${
              isWish
                ? "text-emerald-600 group-hover:text-emerald-700"
                : "text-blue-800 group-hover:text-blue-900"
            }`}
          >
            {isWish ? "Create Offer" : "Request"}{" "}
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ItemDetailModal: React.FC<{
  item: Wish | Offer | ItemWithSource;
  isWish: boolean;
  onClose: () => void;
  onCreateOffer?: () => void;
  onCreateWish?: () => void;
}> = ({ item, isWish, onClose, onCreateOffer, onCreateWish }) => {
  const imageUrl = item.image || (isWish ? item.product?.image : null) || null;

  // Get category name - handle both Wish and Offer types
  let categoryName = "Uncategorized";
  if (isWish && item.product?.category?.name) {
    categoryName = item.product.category.name;
  } else if ("service" in item && item.service) {
    // For Offer, service can have category
    if ("category" in item.service && item.service.category?.name) {
      categoryName = item.service.category.name;
    }
  }
  const postedBy = item.company_name || item.full_name || "Unknown";
  const location = item.province || item.municipality || item.country || "N/A";
  const tags = categoryName ? [categoryName] : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 sm:h-64">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <span className="text-slate-400">No Image</span>
            </div>
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 text-white">
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase mb-2 ${
                isWish ? "bg-blue-500" : "bg-emerald-500"
              }`}
            >
              {isWish ? "Buying Wish" : "Selling Offer"}
            </span>
            <h2 className="text-2xl font-bold leading-tight">{item.title}</h2>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 border-b border-slate-100 pb-6">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Briefcase className="w-4 h-4" /> {postedBy}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {location}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
              Description
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {item.description || "No description provided."}
            </p>
          </div>

          {tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {isWish && onCreateOffer ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateOffer();
                }}
                className="flex-1 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
              >
                Create Offer
              </button>
            ) : !isWish && onCreateWish ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateWish();
                }}
                className="flex-1 py-3 px-4 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-medium transition-colors"
              >
                Request
              </button>
            ) : (
              <Link
                href={
                  isWish
                    ? `/wishOffer/wishes/${item.id}`
                    : `/wishOffer/offer/${item.id}`
                }
                className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-colors text-center ${
                  isWish
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                {isWish ? "Create Offer" : "Contact Seller"}
              </Link>
            )}
            <button
              className="px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
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
