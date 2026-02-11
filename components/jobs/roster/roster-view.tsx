"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, CheckCircle, Clock } from "lucide-react";
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
import { RosterEmptyState } from "./RosterEmptyState";
import { CreateInstituteDialog } from "./CreateInstituteDialog";
import { RosterHeader } from "./RosterHeader";
import { RosterControls } from "./RosterControls";
import { RosterCards } from "./RosterCards";
import { GraduateDetailsDialog } from "./GraduateDetailsDialog";
import { RosterFiltersSidebar } from "./RosterFiltersSidebar";
import { useRosterFilters } from "@/contexts/roster-filters";

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
  const [selectedGraduate, setSelectedGraduate] =
    useState<GraduateRoster | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, next: null, previous: null });

  const debouncedSearch = useDebounce(searchQuery, 500);
  const lastFetchKeyRef = useRef<string | null>(null);
  const {
    tradeStream,
    level,
    passedYearMin,
    passedYearMax,
    district,
    municipality,
    status,
    certifyingAgency,
    institutionName,
  } = useRosterFilters();
  const fetchGraduates = useCallback(
    async (pageNum: number = 1) => {
      const searchValue = debouncedSearch.trim();
      const filtersKey = JSON.stringify({
        page: pageNum,
        search: searchValue,
        tradeStream,
        level,
        passedYearMin,
        passedYearMax,
        district,
        municipality,
        status,
        certifyingAgency,
        institutionName,
      });
      const key = filtersKey;
      if (lastFetchKeyRef.current === key) {
        return;
      }
      lastFetchKeyRef.current = key;
      setGraduatesLoading(true);
      try {
        const res = await getGraduates({
          page: pageNum,
          search: searchValue || undefined,
          trade_stream: tradeStream || undefined,
          level: level || undefined,
          passed_year_min: passedYearMin ? Number(passedYearMin) : undefined,
          passed_year_max: passedYearMax ? Number(passedYearMax) : undefined,
          district: district || undefined,
          municipality: municipality || undefined,
          status: status || undefined,
          certifying_agency: certifyingAgency || undefined,
          institution_name: institutionName || undefined,
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
    [
      debouncedSearch,
      tradeStream,
      level,
      passedYearMin,
      passedYearMax,
      district,
      municipality,
      status,
      certifyingAgency,
      institutionName,
    ],
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
    fetchGraduates(page);
  }, [fetchGraduates, page]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    tradeStream,
    level,
    passedYearMin,
    passedYearMax,
    district,
    municipality,
    status,
    certifyingAgency,
    institutionName,
  ]);

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

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          <RosterHeader />

          <RosterControls
            showControls={instituteCheck !== false || isContentLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery("")}
            onOpenFilters={() => setSidebarOpen(true)}
            institute={institute}
          />

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
            <div className="overflow-hidden">
              <div className="py-6">
                {/* {institute && (
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
                )} */}
                <RosterCards
                  graduates={graduates}
                  graduatesLoading={graduatesLoading}
                  pagination={pagination}
                  page={page}
                  onPageChange={setPage}
                  hasSearch={hasSearch}
                  institute={institute}
                  onSelectGraduate={(g) => {
                    setSelectedGraduate(g);
                    setDetailsOpen(true);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <RosterFiltersSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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

      <GraduateDetailsDialog
        graduate={selectedGraduate}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) {
            setSelectedGraduate(null);
          }
        }}
      />
    </div>
  );
}
