"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getSubCategoriesPaginated,
  deleteSubCategory,
  getCategoryById,
} from "@/services/categories";
import type { SubCategory, Category } from "@/types/create-wish-type";
import { TablePagination } from "@/components/admin/TablePagination";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";

export default function CategorySubcategoriesPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const categoryId = parseInt(params.id as string);

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(categoryId);
        setCategory(data);
      } catch {
        setCategory(null);
      }
    };
    if (isAuthenticated && categoryId) fetchCategory();
  }, [isAuthenticated, categoryId]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      setIsLoading(true);
      try {
        const data = await getSubCategoriesPaginated(categoryId, page);
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

    if (isAuthenticated && categoryId) {
      fetchSubcategories();
    }
  }, [isAuthenticated, categoryId, page]);

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

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (!categoryId || isNaN(categoryId)) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Invalid category.
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      <button
        type="button"
        onClick={() => router.push("/admin/categories")}
        className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 -ml-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Categories
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Subcategories for{" "}
            {category ? (
              <span className="text-sky-700">{category.name}</span>
            ) : (
              "Category"
            )}
          </h2>
          <p className="text-sm text-slate-500">
            View, create, and edit subcategories for this category.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() =>
              router.push(`/admin/categories/${categoryId}/edit`)
            }
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Edit Category
          </button>
          <button
            onClick={() =>
              router.push(`/admin/categories/${categoryId}/subcategories/create`)
            }
            className="rounded-md bg-sky-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 sm:px-4"
          >
            Create subcategory
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <AdminTableWrapper minWidthClass="min-w-[560px]">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
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
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Loading subcategories...
                </td>
              </tr>
            ) : subcategories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No subcategories found. Create one to get started.
                </td>
              </tr>
            ) : (
              subcategories.map((subcategory) => (
                <tr key={subcategory.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {subcategory.name}
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
                            `/admin/categories/${categoryId}/subcategories/${subcategory.id}/edit`,
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
