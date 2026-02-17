"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getCategoriesPaginated, deleteCategory } from "@/services/categories";
import type { Category } from "@/types/create-wish-type";
import { TablePagination } from "@/components/admin/TablePagination";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";

export default function AdminCategoriesPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
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
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await getCategoriesPaginated(page);
        setCategories(data.results || []);
        setCount(data.count ?? 0);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
        if ((data.results?.length ?? 0) > 0 && (data.next || page === 1)) {
          setPageSize(data.results!.length);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Please try again.");
        setCategories([]);
        setCount(0);
        setHasNext(false);
        setHasPrevious(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setCount((c) => Math.max(0, c - 1));
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Categories Management
          </h2>
          <p className="text-sm text-slate-500">
            View, edit, create, and delete categories.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/categories/create")}
          className="inline-flex items-center rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
        >
          Create category
        </button>
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
                Type
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
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <span className="inline-block rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {category.type || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => {
                          router.push(`/admin/categories/${category.id}/edit`);
                        }}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting === category.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTableWrapper>

      {categories.length > 0 && (
        <TablePagination
          page={page}
          count={count}
          resultsLength={categories.length}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          pageSize={pageSize}
          onPageChange={setPage}
          entityLabel="categories"
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
