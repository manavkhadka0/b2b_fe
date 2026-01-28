"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Package,
  Wrench,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Category } from "@/types/create-wish-type";

interface CategorySheetProps {
  productCategories: Category[];
  serviceCategories: Category[];
  activeCategory: string | null;
  isLoadingCategories: boolean;
  onCategorySelect: (categoryName: string | null) => void;
}

export function CategorySheet({
  productCategories,
  serviceCategories,
  activeCategory,
  isLoadingCategories,
  onCategorySelect,
}: CategorySheetProps) {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [isServicesOpen, setIsServicesOpen] = useState(true);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-gray-200">
          <Filter className="w-4 h-4" />
          Categories
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[260px] flex flex-col">
        <SheetHeader className="px-4 py-3 border-b flex-shrink-0">
          <SheetTitle className="text-left text-sm font-semibold">
            Categories
          </SheetTitle>
        </SheetHeader>
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
                className={`flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-blue-50/50 group border-b border-gray-100 ${
                  activeCategory === null
                    ? "bg-blue-50/30 text-blue-600 font-medium"
                    : "text-gray-600"
                }`}
              >
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
                          onClick={() => {
                            onCategorySelect(
                              cat.name === activeCategory ? null : cat.name,
                            );
                          }}
                          className={`flex items-center justify-between px-4 py-2.5 pl-8 text-left transition-colors hover:bg-blue-50/50 group w-full ${
                            activeCategory === cat.name
                              ? "bg-blue-50/30 text-blue-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          <span className="text-sm">{cat.name}</span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 ${activeCategory === cat.name ? "text-blue-600" : "text-gray-300 group-hover:text-blue-400"}`}
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
                          onClick={() => {
                            onCategorySelect(
                              cat.name === activeCategory ? null : cat.name,
                            );
                          }}
                          className={`flex items-center justify-between px-4 py-2.5 pl-8 text-left transition-colors hover:bg-blue-50/50 group w-full ${
                            activeCategory === cat.name
                              ? "bg-blue-50/30 text-blue-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          <span className="text-sm">{cat.name}</span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 ${activeCategory === cat.name ? "text-blue-600" : "text-gray-300 group-hover:text-blue-400"}`}
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
      </SheetContent>
    </Sheet>
  );
}
