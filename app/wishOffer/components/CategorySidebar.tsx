"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Package,
  Wrench,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { Category } from "@/types/create-wish-type";

interface CategorySidebarProps {
  productCategories: Category[];
  serviceCategories: Category[];
  activeCategory: string | null;
  isLoadingCategories: boolean;
  onCategorySelect: (categoryName: string | null) => void;
}

export function CategorySidebar({
  productCategories,
  serviceCategories,
  activeCategory,
  isLoadingCategories,
  onCategorySelect,
}: CategorySidebarProps) {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [isServicesOpen, setIsServicesOpen] = useState(true);

  return (
    <aside className="hidden lg:block lg:w-1/4">
      <div className="border-r border-gray-100 overflow-hidden sticky top-24 flex flex-col h-[calc(100vh-8rem)]">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
          <LayoutGrid className="w-4 h-4 text-gray-600" />
          <h2 className="font-semibold text-sm text-gray-800">Categories</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoadingCategories ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : (
            <nav className="flex flex-col">
              {/* All Categories Option */}
              <button
                onClick={() => onCategorySelect(null)}
                className={`flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-blue-50/50 group relative border-b border-gray-100 ${
                  activeCategory === null
                    ? "text-blue-600 font-medium bg-blue-50/30"
                    : "text-gray-600"
                }`}
              >
                {activeCategory === null && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600" />
                )}
                <span className="text-sm font-medium">All</span>
              </button>

              {/* Product Categories */}
              {productCategories.length > 0 && (
                <>
                  <button
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between hover:bg-gray-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Products
                      </span>
                    </div>
                    {isProductsOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>
                  {isProductsOpen && (
                    <div className="max-h-64 overflow-y-auto">
                      {productCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() =>
                            onCategorySelect(
                              cat.name === activeCategory ? null : cat.name,
                            )
                          }
                          className={`flex items-center justify-between px-4 py-2.5 pl-8 text-left transition-colors hover:bg-blue-50/50 group relative w-full ${
                            activeCategory === cat.name
                              ? "text-blue-600 font-medium bg-blue-50/30"
                              : "text-gray-600"
                          }`}
                        >
                          {activeCategory === cat.name && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600" />
                          )}
                          <span className="text-sm">{cat.name}</span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-colors ${activeCategory === cat.name ? "text-blue-600" : "text-gray-300 group-hover:text-blue-400"}`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Service Categories */}
              {serviceCategories.length > 0 && (
                <>
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="px-4 py-2 bg-gray-50/50 border-t border-b border-gray-100 mt-1 flex items-center justify-between hover:bg-gray-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Services
                      </span>
                    </div>
                    {isServicesOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>
                  {isServicesOpen && (
                    <div className="max-h-64 overflow-y-auto">
                      {serviceCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() =>
                            onCategorySelect(
                              cat.name === activeCategory ? null : cat.name,
                            )
                          }
                          className={`flex items-center justify-between px-4 py-2.5 pl-8 text-left transition-colors hover:bg-blue-50/50 group relative w-full ${
                            activeCategory === cat.name
                              ? "text-blue-600 font-medium bg-blue-50/30"
                              : "text-gray-600"
                          }`}
                        >
                          {activeCategory === cat.name && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600" />
                          )}
                          <span className="text-sm">{cat.name}</span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-colors ${activeCategory === cat.name ? "text-blue-600" : "text-gray-300 group-hover:text-blue-400"}`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {productCategories.length === 0 &&
                serviceCategories.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    No categories available
                  </div>
                )}
            </nav>
          )}
        </div>
      </div>
    </aside>
  );
}
