"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import {
  getInstituteDetail,
  isInstituteNotFoundError,
} from "@/services/institute";
import {
  getGraduates,
  deleteGraduate,
  parsePageFromUrl,
} from "@/services/graduates";
import type { Institute } from "@/types/institute";
import type { GraduateRoster } from "@/types/graduate-roster";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RosterEmptyState } from "./RosterEmptyState";
import { CreateInstituteDialog } from "./CreateInstituteDialog";
import { RosterCreateButton } from "./RosterCreateButton";
import { RosterTable } from "./RosterTable";

export default function RosterView() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [instituteCheck, setInstituteCheck] = useState<boolean | null>(null);
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [instituteCheckLoading, setInstituteCheckLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingCreateInstitute, setPendingCreateInstitute] = useState(false);
  const [graduates, setGraduates] = useState<GraduateRoster[]>([]);
  const [graduatesLoading, setGraduatesLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, next: null, previous: null });

  const debouncedSearch = useDebounce(searchQuery, 500);
  const clearSearch = () => setSearchQuery("");
  const closeSidebar = () => setSidebarOpen(false);

  const fetchGraduates = useCallback(
    async (pageNum: number = 1) => {
      if (!user?.username) return;
      setGraduatesLoading(true);
      try {
        const res = await getGraduates({
          page: pageNum,
          search: debouncedSearch.trim() || undefined,
        });
        setGraduates(res.results ?? []);
        setPagination({
          count: res.count,
          next: res.next,
          previous: res.previous,
        });
      } catch (err) {
        console.error("Error fetching graduates:", err);
        setGraduates([]);
        setPagination({ count: 0, next: null, previous: null });
      } finally {
        setGraduatesLoading(false);
      }
    },
    [user?.username, debouncedSearch],
  );

  const fetchInstituteStatus = useCallback(async () => {
    if (!user?.username) return;
    setInstituteCheckLoading(true);
    setInstituteCheck(null);
    setInstitute(null);
    try {
      const data = await getInstituteDetail();
      setInstitute(data);
      setInstituteCheck(true);
    } catch (err) {
      if (isInstituteNotFoundError(err)) {
        setInstitute(null);
        setInstituteCheck(false);
      } else {
        console.error("Error checking institute:", err);
        setInstitute(null);
        setInstituteCheck(false);
      }
    } finally {
      setInstituteCheckLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    if (!user?.username) {
      setInstituteCheck(null);
      setInstitute(null);
      return;
    }
    fetchInstituteStatus();
  }, [user?.username, fetchInstituteStatus]);

  useEffect(() => {
    if (instituteCheck && institute?.is_verified) {
      fetchGraduates(page);
    } else {
      setGraduates([]);
      setPagination({ count: 0, next: null, previous: null });
    }
  }, [instituteCheck, institute?.is_verified, fetchGraduates, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDeleteGraduate = useCallback(async (id: number) => {
    if (!confirm("Remove this graduate from the roster?")) return;
    setDeletingId(id);
    try {
      await deleteGraduate(id);
      setGraduates((prev) => prev.filter((g) => g.id !== id));
      toast.success("Graduate removed from roster.");
    } catch (err) {
      console.error("Error deleting graduate:", err);
      toast.error("Failed to remove graduate.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  useEffect(() => {
    if (user?.username && pendingCreateInstitute && !instituteCheckLoading) {
      setCreateDialogOpen(true);
      setPendingCreateInstitute(false);
    }
  }, [user?.username, pendingCreateInstitute, instituteCheckLoading]);

  const handleCreateInstituteClick = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!user && !token && !authLoading) {
      setPendingCreateInstitute(true);
      setAuthDialogOpen(true);
      return;
    }
    setCreateDialogOpen(true);
  };

  const handleCreateInstituteSuccess = () => {
    fetchInstituteStatus();
  };

  const handleAuthDialogChange = (open: boolean) => {
    setAuthDialogOpen(open);
    if (!open) setPendingCreateInstitute(false);
  };

  const isContentLoading =
    authLoading || (!!user?.username && instituteCheck === null);

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent py-2">
                Skilled Workforce Roster (Human Resource Roster)
              </h1>
            </div>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
              View and manage your skilled workforce. Track availability,
              skills, and assignments in one place.
            </p>
          </div>

          {/* Controls Section - hide when no institute and not loading to reduce clutter */}
          {(instituteCheck !== false || isContentLoading) && (
            <div className="flex items-center gap-3 mb-4 flex-wrap justify-between">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors lg:hidden"
                aria-label="Open filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <div className="flex items-center gap-3 flex-1 min-w-0 justify-end sm:justify-between flex-wrap">
                <div className="rounded-md border border-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 bg-white min-w-[200px] max-w-[280px] flex-1 sm:flex-initial order-2 sm:order-1">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search roster..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 h-7 min-w-0"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <RosterCreateButton
                  isVerified={institute?.is_verified ?? false}
                  variant="default"
                  size="sm"
                  className="order-1 sm:order-2 bg-blue-800 hover:bg-blue-900"
                />
              </div>
            </div>
          )}

          {/* Content Area */}
          {isContentLoading ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 flex justify-center items-center min-h-[320px]">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            </div>
          ) : instituteCheck === false ? (
            <RosterEmptyState
              onCreateClick={handleCreateInstituteClick}
              isCreating={false}
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                {institute && (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      {institute.institute_name}
                    </span>
                    {institute.is_verified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        Pending verification
                      </span>
                    )}
                  </div>
                )}
                {institute?.is_verified ? (
                  graduatesLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <>
                      <RosterTable
                        graduates={graduates}
                        searchQuery={searchQuery}
                        onDelete={handleDeleteGraduate}
                        deletingId={deletingId}
                      />
                      {(pagination.next || pagination.previous) && (
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
                          <p className="text-sm text-slate-500">
                            {pagination.count > 0 && (
                              <span>
                                Page {page}
                                {pagination.count > 0 && (
                                  <span>
                                    {" "}
                                    · {pagination.count} total graduate
                                    {pagination.count !== 1 ? "s" : ""}
                                  </span>
                                )}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              disabled={
                                !pagination.previous || graduatesLoading
                              }
                              className="gap-1.5"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPage((p) => p + 1)}
                              disabled={!pagination.next || graduatesLoading}
                              className="gap-1.5"
                            >
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[280px] text-center text-slate-500">
                    <p className="text-sm">
                      Verify your institute email to add and manage graduates.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar overlay - placeholder for future filters */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <aside
            className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 overflow-y-auto py-4 px-4 transition-transform duration-200 ease-out lg:hidden"
            aria-hidden={!sidebarOpen}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-slate-900 text-sm">Filters</span>
              <button
                type="button"
                onClick={closeSidebar}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-500 text-sm">
              Roster filters (coming soon)
            </p>
          </aside>
        </>
      )}

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={handleAuthDialogChange}
        initialMode="login"
        onAuthenticated={() => {}}
      />

      <CreateInstituteDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateInstituteSuccess}
      />
    </div>
  );
}
