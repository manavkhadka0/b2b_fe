"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getIndustriesPaginated,
  deleteIndustry,
} from "@/services/industry";
import type { Industry } from "@/services/industry";
import { TablePagination } from "@/components/admin/TablePagination";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";

export default function AdminIndustryPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [industries, setIndustries] = useState<Industry[]>([]);
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
    if (!isAuthenticated) return;

    const abortController = new AbortController();

    const fetchIndustries = async () => {
      setIsLoading(true);
      try {
        const data = await getIndustriesPaginated(
          page,
          abortController.signal,
        );
        setIndustries(data.results || []);
        setCount(data.count ?? 0);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
        if ((data.results?.length ?? 0) > 0 && (data.next || page === 1)) {
          setPageSize(data.results!.length);
        }
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        console.error("Failed to fetch industries:", err);
        setError("Failed to load industries. Please try again.");
        setIndustries([]);
        setCount(0);
        setHasNext(false);
        setHasPrevious(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustries();

    return () => abortController.abort();
  }, [isAuthenticated, page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this industry?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteIndustry(id);
      setIndustries((prev) => prev.filter((ind) => ind.id !== id));
      setCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Failed to delete industry:", err);
      alert("Failed to delete industry. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Industries Management
          </h2>
          <p className="text-sm text-slate-500">
            View, edit, create, and delete industries.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/industry/create")}
          className="shrink-0 self-start rounded-md bg-sky-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 sm:px-4"
        >
          Create industry
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <AdminTableWrapper minWidthClass="min-w-[640px]">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Website
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Video
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
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Loading industries...
                </td>
              </tr>
            ) : industries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No industries found.
                </td>
              </tr>
            ) : (
              industries.map((industry) => (
                <tr key={industry.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {industry.logo ? (
                        <img
                          src={industry.logo}
                          alt=""
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-xs font-medium text-slate-500">
                          {industry.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-slate-900">
                        {industry.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="max-w-[180px] truncate" title={industry.email}>
                      {industry.email || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div
                      className="max-w-[140px] truncate"
                      title={industry.website_link ?? ""}
                    >
                      {industry.website_link ? (
                        <a
                          href={industry.website_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline"
                        >
                          {industry.website_link}
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div
                      className="max-w-[120px] truncate"
                      title={industry.file_link ?? ""}
                    >
                      {industry.file_link ? (
                        <a
                          href={industry.file_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline"
                        >
                          Video
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/industry/${industry.id}`)
                        }
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/admin/industry/${industry.id}/edit`)
                        }
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(industry.id)}
                        disabled={isDeleting === industry.id}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting === industry.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTableWrapper>

      {industries.length > 0 && (
        <TablePagination
          page={page}
          count={count}
          resultsLength={industries.length}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          pageSize={pageSize}
          onPageChange={setPage}
          entityLabel="industries"
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
