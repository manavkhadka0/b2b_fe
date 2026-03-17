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

  const wrap = (fn: () => void) => () => {
    fn();
    onFilterClick?.();
  };

  const handleCategoryClick = (categoryId: number | null) => {
    if (categoryId === null) {
      setActiveCategoryId(null);
      setActiveSubcategoryId(null);
      setOpenDropdownId(null);
      return;
    }

    const category = availableCategories.find((c) => c.id === categoryId);
    const categorySubcategories = category?.subcategories || [];

    // If category is already active, toggle it off
    if (activeCategoryId === categoryId) {
      setActiveCategoryId(null);
      setActiveSubcategoryId(null);
      setOpenDropdownId(null);
    } else {
      // Set new active category
      setActiveCategoryId(categoryId);
      setActiveSubcategoryId(null);
    }
  };

  const handleSubcategoryClick = (
    categoryId: number,
    subcategoryId: number | null
  ) => {
    // If clicking the same subcategory, clear both category and subcategory
    if (subcategoryId === activeSubcategoryId) {
      setActiveCategoryId(null);
      setActiveSubcategoryId(null);
    } else {
      // Always set both category and subcategory when subcategory is selected
      // The category should always be shown as active when its subcategory is selected
      setActiveSubcategoryId(subcategoryId);
      setActiveCategoryId(categoryId);
    }
    setOpenDropdownId(null); // Close dropdown after selection
  };

  const handleCategoryHover = (categoryId: number) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    const category = availableCategories.find((c) => c.id === categoryId);
    const categorySubcategories = category?.subcategories || [];

    if (categorySubcategories.length > 0) {
      // Open dropdown on hover (don't change active category)
      setOpenDropdownId(categoryId);
    }
  };

  const handleCategoryLeave = () => {
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
              onClick={wrap(() => {
                setSelectedCategoryType("ALL");
                handleCategoryClick(null);
              })}
            />
            <FilterOption
              label="Products"
              isActive={selectedCategoryType === "Product"}
              onClick={wrap(() => {
                setSelectedCategoryType("Product");
                handleCategoryClick(null);
              })}
            />
            <FilterOption
              label="Services"
              isActive={selectedCategoryType === "Service"}
              onClick={wrap(() => {
                setSelectedCategoryType("Service");
                handleCategoryClick(null);
              })}
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
                    isActive={activeCategoryId === null}
                    onClick={wrap(() => handleCategoryClick(null))}
                  />
                  {availableCategories.map((cat) => {
                    const categorySubcategories = cat.subcategories || [];
                    const hasSubcategories = categorySubcategories.length > 0;
                    // Category is active if:
                    // 1. It's selected AND no subcategory is selected, OR
                    // 2. It's selected AND a subcategory from this category is selected
                    const isCategoryActive =
                      activeCategoryId === cat.id &&
                      (activeSubcategoryId === null ||
                        categorySubcategories.some(
                          (sub) => sub.id === activeSubcategoryId
                        ));
                    const isDropdownOpen = openDropdownId === cat.id;

                    return (
                      <DropdownMenu
                        key={cat.id}
                        open={isDropdownOpen}
                        onOpenChange={(open) => {
                          // Only handle programmatic changes, hover handles the rest
                          if (!open) {
                            setOpenDropdownId(null);
                          }
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={() => {
                              if (!hasSubcategories) {
                                // For categories without subcategories, toggle active state
                                wrap(() => handleCategoryClick(cat.id))();
                              } else {
                                // For categories with subcategories, just toggle active state
                                // Hover will handle opening/closing the dropdown
                                if (isCategoryActive) {
                                  wrap(() => {
                                    setActiveCategoryId(null);
                                    setActiveSubcategoryId(null);
                                    setOpenDropdownId(null);
                                  })();
                                } else {
                                  wrap(() => {
                                    // When clicking category directly, set category and clear subcategory
                                    setActiveCategoryId(cat.id);
                                    setActiveSubcategoryId(null);
                                  })();
                                }
                              }
                            }}
                            onMouseEnter={() => {
                              handleCategoryHover(cat.id);
                            }}
                            onMouseLeave={handleCategoryLeave}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                              isCategoryActive
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
                              categorySubcategories.map((subcat) => (
                                <DropdownMenuItem
                                  key={subcat.id}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Always set both category and subcategory when subcategory is selected
                                    // The category should always be shown as active when its subcategory is selected
                                    if (subcat.id === activeSubcategoryId) {
                                      // Toggle off if same subcategory clicked - clear both
                                      wrap(() => {
                                        setActiveCategoryId(null);
                                        setActiveSubcategoryId(null);
                                      })();
                                    } else {
                                      // Set both category and subcategory - use wrap to ensure filter is triggered
                                      // Set subcategory first, then category to ensure subcategory filter is applied
                                      wrap(() => {
                                        // Use functional updates to ensure we're working with latest state
                                        setActiveSubcategoryId(subcat.id);
                                        setActiveCategoryId(cat.id);
                                      })();
                                    }
                                    setOpenDropdownId(null);
                                  }}
                                  className={`cursor-pointer ${
                                    activeSubcategoryId === subcat.id
                                      ? "bg-slate-100"
                                      : ""
                                  }`}
                                >
                                  {subcat.name}
                                </DropdownMenuItem>
                              ))
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
