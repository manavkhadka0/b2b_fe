"use client";

import React from "react";
import { LayoutGrid, Briefcase, Zap } from "lucide-react";
import { FilterOption } from "./FilterOption";
import { Category } from "@/types/create-wish-type";
import type { ItemType, CategoryType } from "@/types/wish";

export type SidebarContentProps = {
  selectedType: ItemType;
  setSelectedType: (t: ItemType) => void;
  selectedCategoryType: CategoryType;
  setSelectedCategoryType: (t: CategoryType) => void;
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
  availableCategories: Category[];
  onFilterClick?: () => void;
};

export const SidebarContent: React.FC<SidebarContentProps> = ({
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
