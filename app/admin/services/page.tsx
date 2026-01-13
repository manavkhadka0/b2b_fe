"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getServices,
  deleteService,
  getSubCategories,
} from "@/services/categories";
import type { Service, SubCategory } from "@/types/create-wish-type";

export default function AdminServicesPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | "">(
    ""
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, subcatsData] = await Promise.all([
          getServices(),
          getSubCategories(),
        ]);
        setServices(servicesRes.results || []);
        setNextPage(servicesRes.next);
        setPrevPage(servicesRes.previous);
        setTotalCount(servicesRes.count);
        setSubcategories(subcatsData);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setError("Failed to load services. Please try again.");
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
      const subcatFilter =
        selectedSubCategory === ""
          ? undefined
          : (selectedSubCategory as number);
      const res = await getServices(subcatFilter, currentPage);
      setServices(res.results || []);
      setNextPage(res.next);
      setPrevPage(res.previous);
      setTotalCount(res.count);
    };

    if (isAuthenticated) {
      fetchFiltered();
    }
  }, [selectedSubCategory, currentPage, isAuthenticated]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteService(id);
      setServices(services.filter((service) => service.id !== id));
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Failed to delete service. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const getSubCategoryName = (service: Service) => {
    const subcatObj =
      (service as any).subcategory ||
      (typeof service.SubCategory === "object" ? service.SubCategory : null);
    const subcatId =
      typeof service.SubCategory === "number"
        ? service.SubCategory
        : subcatObj?.id;

    if (subcatObj) return subcatObj.name;
    const subcategory = subcategories.find((subcat) => subcat.id === subcatId);
    return subcategory?.name || (subcatId ? `SubCategory ${subcatId}` : "-");
  };

  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next" && nextPage) {
      setCurrentPage((p) => p + 1);
    }
    if (direction === "prev" && prevPage && currentPage > 1) {
      setCurrentPage((p) => Math.max(1, p - 1));
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
            Services Management
          </h2>
          <p className="text-sm text-slate-500">
            View, edit, create, and delete services.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/services/create")}
          className="inline-flex items-center rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
        >
          Create service
        </button>
      </div>

      {/* Filter by SubCategory */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <label
          htmlFor="subcategory-filter"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Filter by SubCategory
        </label>
        <select
          id="subcategory-filter"
          value={selectedSubCategory}
          onChange={(e) =>
            setSelectedSubCategory(
              e.target.value === "" ? "" : parseInt(e.target.value)
            )
          }
          className="w-full max-w-xs rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        >
          <option value="">All SubCategories</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
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
                SubCategory
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
                  colSpan={3}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Loading services...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No services found.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {service.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getSubCategoryName(service)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => {
                          router.push(`/admin/services/${service.id}/edit`);
                        }}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={isDeleting === service.id}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting === service.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm shadow-sm">
        <div className="text-slate-600">
          Showing page {currentPage}
          {totalCount
            ? ` of ~${Math.ceil(
                totalCount / Math.max(services.length || 1, 1)
              )} • Total ${totalCount} services`
            : ""}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={!prevPage || currentPage === 1}
            className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange("next")}
            disabled={!nextPage}
            className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
