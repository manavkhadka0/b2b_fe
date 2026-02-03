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
import { Category, SubCategory } from "@/types/create-wish-type";
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
  subcategories: SubCategory[];
  isLoadingSubcategories: boolean;
  events: Event[];
  isLoadingEvents: boolean;
  onFilterClick?: () => void;
  showSubcategoriesInline?: boolean;
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
  subcategories,
  isLoadingSubcategories,
  events,
  isLoadingEvents,
  onFilterClick,
  showSubcategoriesInline = true,
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

    const categorySubcategories = subcategories.filter(
      (sc) => sc.category === categoryId
    );

    // If category is already active, toggle it off
    if (activeCategoryId === categoryId) {
      setActiveCategoryId(null);
      setActiveSubcategoryId(null);
      setOpenDropdownId(null);
    } else {
      // Set new active category
      setActiveCategoryId(categoryId);
      setActiveSubcategoryId(null);

      // If category has subcategories, open the dropdown
      if (categorySubcategories.length > 0) {
        setOpenDropdownId(categoryId);
      }
    }
  };

  const handleSubcategoryClick = (subcategoryId: number | null) => {
    setActiveSubcategoryId(
      subcategoryId === activeSubcategoryId ? null : subcategoryId
    );
    setOpenDropdownId(null); // Close dropdown after selection
    onFilterClick?.();
  };

  const handleCategoryHover = (categoryId: number) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    const categorySubcategories = subcategories.filter(
      (sc) => sc.category === categoryId
    );

    if (categorySubcategories.length > 0) {
      // Set category as active if not already active
      if (activeCategoryId !== categoryId) {
        setActiveCategoryId(categoryId);
        setActiveSubcategoryId(null);
      }
      // Open dropdown
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
                    const categorySubcategories = subcategories.filter(
                      (sc) => sc.category === cat.id
                    );
                    const hasSubcategories = categorySubcategories.length > 0;
                    const isCategoryActive = activeCategoryId === cat.id;
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
                                    setActiveCategoryId(cat.id);
                                    setActiveSubcategoryId(null);
                                  })();
                                }
                              }
                            }}
                            onMouseEnter={() => {
                              if (hasSubcategories) {
                                handleCategoryHover(cat.id);
                              }
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
                            {isLoadingSubcategories ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                              </div>
                            ) : categorySubcategories.length === 0 ? (
                              <div className="px-2 py-1.5 text-sm text-slate-500">
                                No subcategories
                              </div>
                            ) : (
                              <>
                                <DropdownMenuItem
                                  onClick={wrap(() => {
                                    setActiveSubcategoryId(null);
                                    setOpenDropdownId(null);
                                  })}
                                  className={`cursor-pointer ${
                                    activeSubcategoryId === null &&
                                    isCategoryActive
                                      ? "bg-slate-100"
                                      : ""
                                  }`}
                                >
                                  All Subcategories
                                </DropdownMenuItem>
                                {categorySubcategories.map((subcat) => (
                                  <DropdownMenuItem
                                    key={subcat.id}
                                    onClick={wrap(() => {
                                      handleSubcategoryClick(subcat.id);
                                    })}
                                    className={`cursor-pointer ${
                                      activeSubcategoryId === subcat.id
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

      {/* Subcategories inline (for mobile) */}
      {activeCategoryId && showSubcategoriesInline && (
        <div className="border-t border-slate-200 pt-6 mt-6">
          <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
            <LayoutGrid className="w-4 h-4 text-slate-500" />
            <span>Subcategories</span>
          </div>
          {isLoadingSubcategories ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : subcategories.length === 0 ? (
            <div className="text-sm text-slate-500 py-4">
              No subcategories available
            </div>
          ) : (
            <div className="space-y-0.5">
              <FilterOption
                label="All Subcategories"
                isActive={activeSubcategoryId === null}
                onClick={wrap(() => setActiveSubcategoryId(null))}
              />
              {subcategories.map((subcat) => (
                <FilterOption
                  key={subcat.id}
                  label={subcat.name}
                  isActive={activeSubcategoryId === subcat.id}
                  onClick={wrap(() => handleSubcategoryClick(subcat.id))}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
