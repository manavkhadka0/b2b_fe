"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getWishesPaginated,
  getOffersPaginated,
  deleteWish,
  deleteOffer,
} from "@/services/wishOffer";
import type { Wish, Offer } from "@/types/wish";
import { TablePagination } from "@/components/admin/TablePagination";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";

export default function AdminWishesOffersPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"wishes" | "offers">("wishes");

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishesPage, setWishesPage] = useState(1);
  const [wishesCount, setWishesCount] = useState(0);
  const [wishesPageSize, setWishesPageSize] = useState(10);
  const [wishesHasNext, setWishesHasNext] = useState(false);
  const [wishesHasPrevious, setWishesHasPrevious] = useState(false);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersPage, setOffersPage] = useState(1);
  const [offersCount, setOffersCount] = useState(0);
  const [offersPageSize, setOffersPageSize] = useState(10);
  const [offersHasNext, setOffersHasNext] = useState(false);
  const [offersHasPrevious, setOffersHasPrevious] = useState(false);

  const [isLoadingWishes, setIsLoadingWishes] = useState(true);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [deletingWishId, setDeletingWishId] = useState<number | null>(null);
  const [deletingOfferId, setDeletingOfferId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    type: "wish" | "offer";
    id: number;
    title: string;
  } | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchWishes = async () => {
      setIsLoadingWishes(true);
      try {
        const data = await getWishesPaginated(wishesPage);
        setWishes(data.results || []);
        setWishesCount(data.count ?? 0);
        setWishesHasNext(!!data.next);
        setWishesHasPrevious(!!data.previous);
        if (
          (data.results?.length ?? 0) > 0 &&
          (data.next || wishesPage === 1)
        ) {
          setWishesPageSize(data.results!.length);
        }
      } catch (error) {
        console.error("Failed to fetch wishes:", error);
        setWishes([]);
      } finally {
        setIsLoadingWishes(false);
      }
    };
    const fetchOffers = async () => {
      setIsLoadingOffers(true);
      try {
        const data = await getOffersPaginated(offersPage);
        setOffers(data.results || []);
        setOffersCount(data.count ?? 0);
        setOffersHasNext(!!data.next);
        setOffersHasPrevious(!!data.previous);
        if (
          (data.results?.length ?? 0) > 0 &&
          (data.next || offersPage === 1)
        ) {
          setOffersPageSize(data.results!.length);
        }
      } catch (error) {
        console.error("Failed to fetch offers:", error);
        setOffers([]);
      } finally {
        setIsLoadingOffers(false);
      }
    };
    if (activeTab === "wishes") fetchWishes();
    else fetchOffers();
  }, [isAuthenticated, activeTab, wishesPage, offersPage]);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  const formatAddress = (
    province?: string | null,
    municipality?: string | null,
    ward?: string | null,
  ) => {
    const parts: string[] = [];
    if (province) parts.push(province);
    if (municipality) parts.push(municipality);
    if (ward) parts.push(`Ward ${ward}`);
    return parts.length > 0 ? parts.join(", ") : "-";
  };

  const openConfirmDialog = (
    type: "wish" | "offer",
    id: number,
    title: string,
  ) => {
    setConfirmTarget({ type, id, title });
    setConfirmError(null);
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    if (deletingWishId || deletingOfferId) return;
    setConfirmOpen(false);
    setConfirmTarget(null);
    setConfirmError(null);
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;

    try {
      setConfirmError(null);
      if (confirmTarget.type === "wish") {
        setDeletingWishId(confirmTarget.id);
        await deleteWish(confirmTarget.id);
        setWishes((prev) =>
          prev.filter((wish) => wish.id !== confirmTarget.id),
        );
        setWishesCount((c) => Math.max(0, c - 1));
        setDeletingWishId(null);
      } else {
        setDeletingOfferId(confirmTarget.id);
        await deleteOffer(confirmTarget.id);
        setOffers((prev) =>
          prev.filter((offer) => offer.id !== confirmTarget.id),
        );
        setOffersCount((c) => Math.max(0, c - 1));
        setDeletingOfferId(null);
      }
      closeConfirmDialog();
    } catch (error) {
      console.error("Failed to delete item:", error);
      setConfirmError("Failed to delete. Please try again.");
      setDeletingWishId(null);
      setDeletingOfferId(null);
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Wishes and Offers Management
        </h2>
        <p className="text-sm text-slate-500">
          View all wishes and offers submitted by users.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="min-w-0 overflow-x-auto border-b border-slate-200 [-webkit-overflow-scrolling:touch]">
        <nav className="-mb-px flex min-w-0 gap-4 sm:gap-8">
          <button
            onClick={() => setActiveTab("wishes")}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "wishes"
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            Wishes ({wishesCount})
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "offers"
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            Offers ({offersCount})
          </button>
        </nav>
      </div>

      {/* Wishes Table */}
      {activeTab === "wishes" && (
        <AdminTableWrapper minWidthClass="min-w-[640px]">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Match %
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoadingWishes ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    Loading wishes...
                  </td>
                </tr>
              ) : wishes.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No wishes found.
                  </td>
                </tr>
              ) : (
                wishes.map((wish) => (
                  <tr key={wish.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      <div className="max-w-xs truncate" title={wish.title}>
                        {wish.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <span className="inline-block rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {wish.type || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {wish.company_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatAddress(
                        wish.province,
                        wish.municipality,
                        wish.ward,
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          wish.match_percentage >= 80
                            ? "bg-green-100 text-green-800"
                            : wish.match_percentage >= 50
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {wish.match_percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(wish.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() =>
                          openConfirmDialog("wish", wish.id, wish.title)
                        }
                        disabled={deletingWishId === wish.id}
                        className="inline-flex items-center rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingWishId === wish.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </AdminTableWrapper>
      )}

      {activeTab === "wishes" && wishes.length > 0 && (
        <TablePagination
          page={wishesPage}
          count={wishesCount}
          resultsLength={wishes.length}
          hasNext={wishesHasNext}
          hasPrevious={wishesHasPrevious}
          pageSize={wishesPageSize}
          onPageChange={setWishesPage}
          entityLabel="wishes"
          isLoading={isLoadingWishes}
        />
      )}

      {/* Offers Table */}
      {activeTab === "offers" && (
        <AdminTableWrapper minWidthClass="min-w-[640px]">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Match %
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoadingOffers ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    Loading offers...
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No offers found.
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      <div className="max-w-xs truncate" title={offer.title}>
                        {offer.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <span className="inline-block rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {offer.type || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {offer.company_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatAddress(
                        offer.province,
                        offer.municipality,
                        offer.ward,
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          (offer.match_percentage || 0) >= 80
                            ? "bg-green-100 text-green-800"
                            : (offer.match_percentage || 0) >= 50
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {offer.match_percentage || 0}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(offer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() =>
                          openConfirmDialog("offer", offer.id, offer.title)
                        }
                        disabled={deletingOfferId === offer.id}
                        className="inline-flex items-center rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingOfferId === offer.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </AdminTableWrapper>
      )}

      {activeTab === "offers" && offers.length > 0 && (
        <TablePagination
          page={offersPage}
          count={offersCount}
          resultsLength={offers.length}
          hasNext={offersHasNext}
          hasPrevious={offersHasPrevious}
          pageSize={offersPageSize}
          onPageChange={setOffersPage}
          entityLabel="offers"
          isLoading={isLoadingOffers}
        />
      )}

      {confirmOpen && confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm min-w-0 rounded-lg bg-white p-4 shadow-lg sm:p-6">
            <h3 className="text-base font-semibold text-slate-900">
              Are you sure you want to delete?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently delete the{" "}
              <span className="font-medium">
                {confirmTarget.type === "wish" ? "wish" : "offer"}
              </span>{" "}
              <span className="font-semibold">"{confirmTarget.title}"</span>.
              This action cannot be undone.
            </p>
            {confirmError && (
              <p className="mt-3 text-sm text-red-600">{confirmError}</p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeConfirmDialog}
                disabled={!!deletingWishId || !!deletingOfferId}
                className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={!!deletingWishId || !!deletingOfferId}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deletingWishId || deletingOfferId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
