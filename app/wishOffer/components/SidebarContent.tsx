"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Briefcase,
  Zap,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { FilterOption } from "./FilterOption";
import { Category, SubCategory } from "@/types/create-wish-type";
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

export type SidebarContentProps = {
  selectedType: ItemType;
  setSelectedType: (t: ItemType) => void;
  selectedCategoryType: CategoryType;
  setSelectedCategoryType: (t: CategoryType) => void;
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
  activeSubcategoryId: number | null;
  setActiveSubcategoryId: (id: number | null) => void;
  availableCategories: Category[];
  subcategories: SubCategory[];
  isLoadingSubcategories: boolean;
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
  availableCategories,
  subcategories,
  isLoadingSubcategories,
  onFilterClick,
  showSubcategoriesInline = true,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

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
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
              <LayoutGrid className="w-4 h-4 text-slate-500" />
              <span>Industries</span>
            </div>
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
                      if (open) {
                        // When opening, set the category as active first
                        if (!isCategoryActive) {
                          handleCategoryClick(cat.id);
                        } else {
                          setOpenDropdownId(cat.id);
                        }
                      } else {
                        setOpenDropdownId(null);
                      }
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={() => {
                          if (!hasSubcategories) {
                            wrap(() => handleCategoryClick(cat.id))();
                          } else {
                            // For categories with subcategories, the dropdown handles the click
                            if (!isCategoryActive) {
                              handleCategoryClick(cat.id);
                            }
                          }
                        }}
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
                                activeSubcategoryId === null && isCategoryActive
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
          </div>
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
