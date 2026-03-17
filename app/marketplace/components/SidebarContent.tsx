"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutGrid,
  Briefcase,
  Zap,
  Loader2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { FilterOption } from "./FilterOption";
import { Category } from "@/types/create-wish-type";
import { Event } from "@/types/events";
import type { ItemType, CategoryType } from "@/types/wish";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export type SidebarContentProps = {
  selectedType: ItemType;
  setSelectedType: (t: ItemType) => void;
  selectedCategoryType: CategoryType;
  setSelectedCategoryType: (t: CategoryType) => void;
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
  activeSubcategoryId: number | null;
  setActiveSubcategoryId: (id: number | null) => void;
  setCategoryAndSubcategory: (catId: number | null, subId: number | null) => void;
  activeEventSlug: string | null;
  setActiveEventSlug: (slug: string | null) => void;
  availableCategories: Category[];
  events: Event[];
  isLoadingEvents: boolean;
  onFilterClick?: () => void;
};

export const SidebarContent: React.FC<SidebarContentProps> = ({
  selectedType,
  setSelectedType,
  selectedCategoryType,
  setSelectedCategoryType,
  activeCategoryId,
  setActiveCategoryId,
  activeSubcategoryId,
  setActiveSubcategoryId,
  setCategoryAndSubcategory,
  activeEventSlug,
  setActiveEventSlug,
  availableCategories,
  events,
  isLoadingEvents,
  onFilterClick,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(true);
  const [isEventsOpen, setIsEventsOpen] = useState(true);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isClickingRef = useRef(false);

  const wrap = (fn: () => void) => () => {
    isClickingRef.current = true;
    fn();
    onFilterClick?.();
    // Reset after a short delay
    setTimeout(() => {
      isClickingRef.current = false;
    }, 200);
  };

  const handleCategoryClick = (categoryId: number | null) => {
    if (categoryId === null) {
      setCategoryAndSubcategory(null, null);
      setOpenDropdownId(null);
      return;
    }

    const category = availableCategories.find((c) => c.id === categoryId);
    const categorySubcategories = category?.subcategories || [];

    // If category is already active and has no subcategories, toggle it off
    if (activeCategoryId === categoryId && categorySubcategories.length === 0) {
      setCategoryAndSubcategory(null, null);
    } else if (activeCategoryId === categoryId && activeSubcategoryId === null) {
      // Category is active with no subcategory - if it has subcategories, keep it active
      // but close any open dropdown
      setOpenDropdownId(null);
    } else {
      // Set new active category
      setCategoryAndSubcategory(categoryId, null);
    }
    setOpenDropdownId(null);
  };

  const handleSubcategoryClick = (
    categoryId: number,
    subcategoryId: number | null
  ) => {
    // If clicking the same subcategory, clear both category and subcategory
    if (subcategoryId === activeSubcategoryId) {
      setCategoryAndSubcategory(null, null);
    } else {
      // Always set both category and subcategory when subcategory is selected
      setCategoryAndSubcategory(categoryId, subcategoryId);
    }
    setOpenDropdownId(null); // Close dropdown after selection
  };

  const handleCategoryHover = (categoryId: number) => {
    // Don't open on hover if we're in the middle of a click
    if (isClickingRef.current) return;

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    const category = availableCategories.find((c) => c.id === categoryId);
    const categorySubcategories = category?.subcategories || [];

    if (categorySubcategories.length > 0) {
      // Open dropdown on hover
      setOpenDropdownId(categoryId);
    }
  };

  const handleCategoryLeave = () => {
    // Don't close if we're in the middle of a click
    if (isClickingRef.current) return;

    // Delay closing to allow moving to dropdown content
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
      hoverTimeoutRef.current = null;
    }, 200);
  };

  const handleDropdownEnter = () => {
    // Clear timeout when entering dropdown
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleDropdownLeave = () => {
    // Don't close if we're in the middle of a click
    if (isClickingRef.current) return;

    // Close dropdown when leaving
    setOpenDropdownId(null);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Main filters */}
      <div className="space-y-6">
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
              onClick={wrap(() => setSelectedCategoryType("ALL"))}
            />
            <FilterOption
              label="Products"
              isActive={selectedCategoryType === "Product"}
              onClick={wrap(() => setSelectedCategoryType("Product"))}
            />
            <FilterOption
              label="Services"
              isActive={selectedCategoryType === "Service"}
              onClick={wrap(() => setSelectedCategoryType("Service"))}
            />
          </div>
        </div>
        {availableCategories.length > 0 && (
          <Collapsible
            open={isIndustriesOpen}
            onOpenChange={setIsIndustriesOpen}
          >
            <div>
              <CollapsibleTrigger className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm w-full hover:opacity-80 transition-opacity">
                <LayoutGrid className="w-4 h-4 text-slate-500" />
                <span className="flex-1 text-left">Industries</span>
                {isIndustriesOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-0.5">
                  <FilterOption
                    label="All Industries"
                    isActive={activeCategoryId === null && activeSubcategoryId === null}
                    onClick={wrap(() => handleCategoryClick(null))}
                  />
                  {availableCategories.map((cat) => {
                    const categorySubcategories = cat.subcategories || [];
                    const hasSubcategories = categorySubcategories.length > 0;

                    // Category is active if:
                    // 1. It's the active category AND no subcategory is selected, OR
                    // 2. A subcategory from this category is selected
                    const isCategoryActive =
                      activeCategoryId === cat.id &&
                      (activeSubcategoryId === null ||
                        categorySubcategories.some(sub => sub.id === activeSubcategoryId));

                    const isDropdownOpen = openDropdownId === cat.id;

                    return (
                      <DropdownMenu
                        key={cat.id}
                        open={isDropdownOpen}
                        onOpenChange={(open) => {
                          if (!open && !isClickingRef.current) {
                            setOpenDropdownId(null);
                          }
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              wrap(() => handleCategoryClick(cat.id))();
                            }}
                            onMouseEnter={() => handleCategoryHover(cat.id)}
                            onMouseLeave={handleCategoryLeave}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isCategoryActive
                              ? "bg-slate-100 text-slate-900"
                              : "text-slate-600 hover:bg-slate-50"
                              }`}
                          >
                            <span className="flex-1 text-left">{cat.name}</span>
                            {hasSubcategories && (
                              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </button>
                        </DropdownMenuTrigger>
                        {hasSubcategories && (
                          <DropdownMenuContent
                            align="start"
                            side="right"
                            className="w-56"
                            onCloseAutoFocus={(e) => e.preventDefault()}
                            onMouseEnter={handleDropdownEnter}
                            onMouseLeave={handleDropdownLeave}
                          >
                            {categorySubcategories.length === 0 ? (
                              <div className="px-2 py-1.5 text-sm text-slate-500">
                                No subcategories
                              </div>
                            ) : (
                              <>


                                {categorySubcategories.map((subcat) => (
                                  <DropdownMenuItem
                                    key={subcat.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      wrap(() => handleSubcategoryClick(cat.id, subcat.id))();
                                    }}
                                    className={`cursor-pointer ${activeSubcategoryId === subcat.id
                                      ? "bg-slate-100"
                                      : ""
                                      }`}
                                  >
                                    {subcat.name}
                                  </DropdownMenuItem>
                                ))}
                              </>
                            )}
                          </DropdownMenuContent>
                        )}
                      </DropdownMenu>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}
        {events.length > 0 && (
          <Collapsible open={isEventsOpen} onOpenChange={setIsEventsOpen}>
            <div>
              <CollapsibleTrigger className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm w-full hover:opacity-80 transition-opacity">
                <LayoutGrid className="w-4 h-4 text-slate-500" />
                <span className="flex-1 text-left">Events</span>
                {isEventsOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-0.5">
                  <FilterOption
                    label="All Events"
                    isActive={activeEventSlug === null}
                    onClick={wrap(() => setActiveEventSlug(null))}
                  />
                  {isLoadingEvents ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    events.map((event) => (
                      <FilterOption
                        key={event.id}
                        label={event.title}
                        isActive={activeEventSlug === event.slug}
                        onClick={wrap(() =>
                          setActiveEventSlug(
                            activeEventSlug === event.slug ? null : event.slug
                          )
                        )}
                      />
                    ))
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}
      </div>
    </div>
  );
};