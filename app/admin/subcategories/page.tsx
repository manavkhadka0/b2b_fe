"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getSubCategories,
  deleteSubCategory,
  getCategories,
} from "@/services/categories";
import type { SubCategory, Category } from "@/types/create-wish-type";

export default function AdminSubCategoriesPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subcatsData, catsData] = await Promise.all([
          getSubCategories(),
          getCategories(),
        ]);
        setSubcategories(subcatsData);
        setCategories(catsData);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        setError("Failed to load subcategories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchFiltered = async () => {
      if (selectedCategory === "") {
        const data = await getSubCategories();
        setSubcategories(data);
      } else {
        const data = await getSubCategories(selectedCategory as number);
        setSubcategories(data);
      }
    };

    if (isAuthenticated) {
      fetchFiltered();
    }
  }, [selectedCategory, isAuthenticated]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteSubCategory(id);
      setSubcategories(subcategories.filter((subcat) => subcat.id !== id));
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
      alert("Failed to delete subcategory. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || `Category ${categoryId}`;
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Subcategories Management
          </h2>
          <p className="text-sm text-slate-500">
            View, edit, create, and delete subcategories.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/subcategories/create")}
          className="inline-flex items-center rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
        >
          Create subcategory
        </button>
      </div>

      {/* Filter by Category */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <label
          htmlFor="category-filter"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Filter by Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value === "" ? "" : parseInt(e.target.value)
            )
          }
          className="w-full max-w-xs rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Example Items
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Reference
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Loading subcategories...
                </td>
              </tr>
            ) : subcategories.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No subcategories found.
                </td>
              </tr>
            ) : (
              subcategories.map((subcategory) => (
                <tr key={subcategory.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {subcategory.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getCategoryName(subcategory.category)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div
                      className="max-w-xs truncate"
                      title={subcategory.example_items}
                    >
                      {subcategory.example_items || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {subcategory.reference || "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => {
                          router.push(
                            `/admin/subcategories/${subcategory.id}/edit`
                          );
                        }}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subcategory.id)}
                        disabled={isDeleting === subcategory.id}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting === subcategory.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
