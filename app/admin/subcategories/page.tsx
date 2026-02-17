"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getSubCategoriesPaginated,
  deleteSubCategory,
  getCategories,
} from "@/services/categories";
import type { SubCategory, Category } from "@/types/create-wish-type";
import { TablePagination } from "@/components/admin/TablePagination";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";

export default function AdminSubCategoriesPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
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
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };
    if (isAuthenticated) fetchCategories();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      setIsLoading(true);
      try {
        const categoryFilter =
          selectedCategory === "" ? undefined : (selectedCategory as number);
        const data = await getSubCategoriesPaginated(categoryFilter, page);
        setSubcategories(data.results || []);
        setCount(data.count ?? 0);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
        if ((data.results?.length ?? 0) > 0 && (data.next || page === 1)) {
          setPageSize(data.results!.length);
        }
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setError("Failed to load subcategories. Please try again.");
        setSubcategories([]);
        setCount(0);
        setHasNext(false);
        setHasPrevious(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSubcategories();
    }
  }, [isAuthenticated, selectedCategory, page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteSubCategory(id);
      setSubcategories((prev) => prev.filter((subcat) => subcat.id !== id));
      setCount((c) => Math.max(0, c - 1));
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
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Subcategories Management
          </h2>
          <p className="text-sm text-slate-500">
            View, edit, create, and delete subcategories.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/subcategories/create")}
          className="shrink-0 self-start rounded-md bg-sky-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 sm:px-4"
        >
          Create subcategory
        </button>
      </div>

      {/* Filter by Category */}
      <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm">
        <label
          htmlFor="category-filter"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Filter by Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(
              e.target.value === "" ? "" : parseInt(e.target.value),
            );
            setPage(1);
          }}
          className="w-full min-w-0 max-w-xs rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

      <AdminTableWrapper minWidthClass="min-w-[600px]">
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
                            `/admin/subcategories/${subcategory.id}/edit`,
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
      </AdminTableWrapper>

      {subcategories.length > 0 && (
        <TablePagination
          page={page}
          count={count}
          resultsLength={subcategories.length}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          pageSize={pageSize}
          onPageChange={setPage}
          entityLabel="subcategories"
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
