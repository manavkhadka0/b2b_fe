"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Loader2,
  Search,
  X,
  FilterX,
  Briefcase,
} from "lucide-react";
import * as z from "zod";
import { useDebounce } from "@/hooks/use-debounce";
import {
  AvailabilityOption,
  ProficiencyLevel,
  WorkInterest,
  getWorkInterests,
  hireWorkInterest,
} from "@/services/workInterests";
import {
  getAvailableGraduates,
  hireGraduate,
} from "@/services/graduates";
import type { GraduateRoster } from "@/types/graduate-roster";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  WorkInterestCard,
  AvailableGraduateCard,
  GraduateInterestDetailsDialog,
} from "@/components/jobs/work-interests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWorkInterestsFilters } from "@/contexts/work-interests-filters";

export type MixedCandidate =
  | {
      id: string;
      kind: "work_interest";
      date: string;
      data: WorkInterest;
    }
  | {
      id: string;
      kind: "graduate";
      date: string;
      data: GraduateRoster;
    };

export function WorkInterestsView() {
  // Filters / list state (shared with sidebar via context)
  const {
    search,
    setSearch,
    availability,
    setAvailability,
    proficiency,
    setProficiency,
  } = useWorkInterestsFilters();

  const [workInterests, setWorkInterests] = useState<WorkInterest[]>([]);
  const [graduates, setGraduates] = useState<GraduateRoster[]>([]);

  const [selectedCandidate, setSelectedCandidate] =
    useState<MixedCandidate | null>(null);

  const [workInterestDetailsOpen, setWorkInterestDetailsOpen] = useState(false);
  const [graduateDetailsOpen, setGraduateDetailsOpen] = useState(false);

  // Hire modal states
  const [hireOpen, setHireOpen] = useState(false);
  const [hireName, setHireName] = useState("");
  const [hireEmail, setHireEmail] = useState("");
  const [hirePhone, setHirePhone] = useState("");
  const [hireMessage, setHireMessage] = useState("");
  const [isSubmittingHire, setIsSubmittingHire] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  const hireSchema = z
    .object({
      name: z.string().trim().min(1, "Please enter your name."),
      email: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .optional()
        .or(z.literal("")),
      phone: z
        .string()
        .trim()
        .min(5, "Phone number must be at least 5 characters.")
        .optional()
        .or(z.literal("")),
      message: z
        .string()
        .trim()
        .min(10, "Message must be at least 10 characters long."),
    })
    .refine(
      (data) =>
        !!(data.email && data.email.trim()) ||
        !!(data.phone && data.phone.trim()),
      {
        message: "Provide at least an email or a phone number.",
        path: ["email"],
      },
    );

  const [hireErrors, setHireErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [wiResult, gradResult] = await Promise.allSettled([
        getWorkInterests({
          search: debouncedSearch || undefined,
          availability: availability || undefined,
          proficiency_level: proficiency || undefined,
        }),
        getAvailableGraduates({
          search: debouncedSearch || undefined,
        }),
      ]);

      let hasSuccess = false;

      if (wiResult.status === "fulfilled") {
        setWorkInterests(wiResult.value);
        hasSuccess = true;
      } else {
        console.error("Failed to load work interests", wiResult.reason);
      }

      if (gradResult.status === "fulfilled") {
        setGraduates(gradResult.value);
        hasSuccess = true;
      } else {
        console.error("Failed to load available graduates", gradResult.reason);
      }

      if (!hasSuccess) {
        setError("Could not load work interests. Please try again.");
      }
    } catch (err) {
      console.error("Failed to load work interests", err);
      setError("Could not load work interests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, availability, proficiency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Combined candidates list (Work Interests + Available Graduates mixed together)
  const mixedCandidates = useMemo(() => {
    const list: MixedCandidate[] = [];

    workInterests.forEach((wi) => {
      list.push({
        id: `wi-${wi.id}`,
        kind: "work_interest",
        date: wi.updated_at || wi.created_at || "",
        data: wi,
      });
    });

    graduates.forEach((grad) => {
      list.push({
        id: `grad-${grad.id}`,
        kind: "graduate",
        date: grad.updated_at || grad.created_at || "",
        data: grad,
      });
    });

    // Sort by latest date descending
    list.sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return timeB - timeA;
    });

    return list;
  }, [workInterests, graduates]);

  const activeFilters = useMemo(
    () => availability || proficiency || debouncedSearch,
    [availability, proficiency, debouncedSearch],
  );

  const handleWorkInterestClick = (interest: WorkInterest) => {
    setSelectedCandidate({
      id: `wi-${interest.id}`,
      kind: "work_interest",
      date: interest.updated_at || interest.created_at || "",
      data: interest,
    });
    setWorkInterestDetailsOpen(true);
  };

  const handleGraduateClick = (graduate: GraduateRoster) => {
    setSelectedCandidate({
      id: `grad-${graduate.id}`,
      kind: "graduate",
      date: graduate.updated_at || graduate.created_at || "",
      data: graduate,
    });
    setGraduateDetailsOpen(true);
  };

  const openHireModalForCandidate = (candidate: MixedCandidate) => {
    setSelectedCandidate(candidate);
    setHireName("");
    setHireEmail("");
    setHirePhone("");
    setHireMessage("");
    setHireErrors({});
    setWorkInterestDetailsOpen(false);
    setGraduateDetailsOpen(false);
    setHireOpen(true);
  };

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    try {
      setHireErrors({});
      const validated = hireSchema.parse({
        name: hireName,
        email: hireEmail,
        phone: hirePhone,
        message: hireMessage,
      });

      setIsSubmittingHire(true);

      const payload = {
        name: validated.name,
        email: validated.email || undefined,
        phone: validated.phone || undefined,
        message: validated.message,
      };

      if (selectedCandidate.kind === "work_interest") {
        await hireWorkInterest(selectedCandidate.data.id, payload);
      } else {
        await hireGraduate(selectedCandidate.data.id, payload);
      }

      toast({
        title: "Hire request sent",
        description: "We have shared your interest with this candidate.",
      });

      setHireOpen(false);
      setSelectedCandidate(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: {
          name?: string;
          email?: string;
          phone?: string;
          message?: string;
        } = {};
        for (const issue of err.errors) {
          const field = issue.path[0];
          if (
            typeof field === "string" &&
            !fieldErrors[field as keyof typeof fieldErrors]
          ) {
            (fieldErrors as any)[field] = issue.message;
          }
        }
        setHireErrors(fieldErrors);
        const message =
          err.errors[0]?.message ?? "Please check the hire form fields.";
        toast({
          title: "Could not send hire request",
          description: message,
          variant: "destructive",
        });
        return;
      }
      console.error("Failed to send hire request", err);
      toast({
        title: "Could not send hire request",
        description: "Please review the form and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingHire(false);
    }
  };

  const clearSearch = () => setSearch("");
  const clearAllFilters = () => {
    setSearch("");
    setAvailability("");
    setProficiency("");
  };

  const candidateDisplayName = useMemo(() => {
    if (!selectedCandidate) return "candidate";
    if (selectedCandidate.kind === "work_interest") {
      return (
        selectedCandidate.data.name ||
        selectedCandidate.data.title ||
        "candidate"
      );
    }
    return selectedCandidate.data.name || "candidate";
  }, [selectedCandidate]);

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
            Work Interests
          </h1>
          <Link href="/jobs-and-oppourtunities/work-interests/create">
            <Button
              size="default"
              className="w-full sm:w-auto bg-blue-800 text-white shrink-0"
            >
              Post Your Interest
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
          Browse interests shared by job seekers and available graduates, or post your own so employers can discover and connect with you.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="rounded-md border border-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 bg-white min-w-[200px] max-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search work interests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 h-7 min-w-0"
          />
          {isLoading && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 shrink-0" />
          )}
          {search && !isLoading && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Bar */}
      {activeFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4 py-2 px-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mr-1">
            Active filters:
          </span>
          {availability && (
            <Badge variant="outline" className="bg-white">
              Availability: {availability}
            </Badge>
          )}
          {proficiency && (
            <Badge variant="outline" className="bg-white">
              Level: {proficiency}
            </Badge>
          )}
          {debouncedSearch && (
            <Badge variant="outline" className="bg-white">
              Search: "{debouncedSearch}"
            </Badge>
          )}
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-800 text-xs font-medium transition-colors"
            aria-label="Clear all filters"
          >
            <FilterX className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>
      )}

      {/* Content Grid - All items mixed and shown together */}
      {error ? (
        <div className="bg-white rounded-xl p-6 border border-amber-200 text-amber-800">
          {error}
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center min-h-[320px]">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : mixedCandidates.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm">
          <p className="text-slate-600">
            No work interests found. Be the first to post yours!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mixedCandidates.map((candidate) => {
            if (candidate.kind === "work_interest") {
              return (
                <WorkInterestCard
                  key={candidate.id}
                  interest={candidate.data}
                  onClick={handleWorkInterestClick}
                  onHire={() => openHireModalForCandidate(candidate)}
                />
              );
            }
            return (
              <AvailableGraduateCard
                key={candidate.id}
                graduate={candidate.data}
                onClick={handleGraduateClick}
                onHire={() => openHireModalForCandidate(candidate)}
              />
            );
          })}
        </div>
      )}

      {/* Work Interest Details Dialog */}
      {selectedCandidate?.kind === "work_interest" && (
        <Dialog
          open={workInterestDetailsOpen}
          onOpenChange={(open) => {
            setWorkInterestDetailsOpen(open);
            if (!open && !hireOpen) {
              setSelectedCandidate(null);
            }
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader className="space-y-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  <Briefcase className="w-3 h-3" />
                  Work Interest
                </span>
              </div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                {selectedCandidate.data.title || "Work Interest"}
              </DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {selectedCandidate.data.unit_group ? (
                  <>
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 font-medium uppercase tracking-wide">
                      {selectedCandidate.data.unit_group.code}
                    </span>
                    <span className="truncate">
                      {selectedCandidate.data.unit_group.title}
                    </span>
                  </>
                ) : (
                  "Unit group not set"
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              {/* Top row: Skills, Details, Locations */}
              <div className="flex flex-wrap gap-4">
                {/* Skills */}
                {selectedCandidate.data.skills &&
                  selectedCandidate.data.skills.length > 0 && (
                    <div className="flex-1 min-w-0 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3">
                      <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-2">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCandidate.data.skills.map((skill) => (
                          <Badge
                            key={skill.id ?? skill.name}
                            variant="outline"
                            className="bg-white text-slate-700 border-slate-200 text-[11px] font-medium"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Details */}
                <div className="flex-1 min-w-0 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-2">
                    Details
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="bg-white text-slate-700 border-slate-200 text-[11px]"
                    >
                      {selectedCandidate.data.availability}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white text-slate-700 border-slate-200 text-[11px]"
                    >
                      {selectedCandidate.data.proficiency_level}
                    </Badge>
                  </div>
                </div>

                {/* Preferred locations */}
                {(() => {
                  const loc = selectedCandidate.data.preferred_locations;
                  const hasString =
                    typeof loc === "string" && loc.trim().length > 0;
                  const hasArray = Array.isArray(loc) && loc.length > 0;
                  if (!hasString && !hasArray) return null;
                  return (
                    <div className="flex-1 min-w-0 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3">
                      <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-2">
                        Preferred locations
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {hasString ? (
                          <Badge
                            variant="outline"
                            className="bg-white text-slate-700 border-slate-200 text-[11px]"
                          >
                            {loc.trim()}
                          </Badge>
                        ) : (
                          (
                            loc as Array<
                              number | { id?: number; name?: string }
                            >
                          ).map((locRef, idx) => {
                            const asLocation = locRef as {
                              id?: number;
                              name?: string;
                            };
                            const id =
                              typeof locRef === "number"
                                ? locRef
                                : (asLocation?.id ?? idx);
                            const name =
                              typeof locRef === "number"
                                ? `Location #${locRef}`
                                : (asLocation?.name ?? `Location #${id}`);
                            return (
                              <Badge
                                key={id}
                                variant="outline"
                                className="bg-white text-slate-700 border-slate-200 text-[11px]"
                              >
                                {name}
                              </Badge>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Summary (left) | Person details (right) */}
              <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
                {selectedCandidate.data.summary && (
                  <div className="rounded-lg border border-slate-100 bg-slate-50/30 overflow-hidden">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-4 pt-3 pb-2">
                      Summary
                    </p>
                    <div
                      className="prose prose-sm max-w-none text-slate-700 px-4 pb-4 max-h-[280px] overflow-y-auto"
                      dangerouslySetInnerHTML={{
                        __html: selectedCandidate.data.summary,
                      }}
                    />
                  </div>
                )}

                {(selectedCandidate.data.name ||
                  selectedCandidate.data.email ||
                  selectedCandidate.data.phone) && (
                  <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-700 self-start">
                    <section className="space-y-1">
                      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        Person details
                      </p>
                      {selectedCandidate.data.name && (
                        <p>
                          <span className="font-medium text-slate-800">
                            Name:
                          </span>{" "}
                          {selectedCandidate.data.name}
                        </p>
                      )}
                      {selectedCandidate.data.email && (
                        <p>
                          <span className="font-medium text-slate-800">
                            Email:
                          </span>{" "}
                          {selectedCandidate.data.email}
                        </p>
                      )}
                      {selectedCandidate.data.phone && (
                        <p>
                          <span className="font-medium text-slate-800">
                            Phone:
                          </span>{" "}
                          {selectedCandidate.data.phone}
                        </p>
                      )}
                    </section>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setWorkInterestDetailsOpen(false);
                  setSelectedCandidate(null);
                }}
              >
                Close
              </Button>
              <Button
                className="bg-blue-800 text-white hover:bg-blue-900"
                type="button"
                onClick={() => openHireModalForCandidate(selectedCandidate)}
              >
                Hire
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Graduate Details Dialog */}
      {selectedCandidate?.kind === "graduate" && (
        <GraduateInterestDetailsDialog
          graduate={selectedCandidate.data}
          open={graduateDetailsOpen}
          onOpenChange={(open) => {
            setGraduateDetailsOpen(open);
            if (!open && !hireOpen) {
              setSelectedCandidate(null);
            }
          }}
          onHire={() => openHireModalForCandidate(selectedCandidate)}
        />
      )}

      {/* Hire Modal for Both Candidate Types */}
      {selectedCandidate && (
        <Dialog
          open={hireOpen}
          onOpenChange={(open) => {
            setHireOpen(open);
            if (!open && !workInterestDetailsOpen && !graduateDetailsOpen) {
              setSelectedCandidate(null);
            }
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Hire {candidateDisplayName}</DialogTitle>
              <DialogDescription>
                We’ll share your contact details and message with this candidate.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-3" onSubmit={handleHireSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-600">Name</p>
                  <Input
                    value={hireName}
                    onChange={(e) => setHireName(e.target.value)}
                    placeholder="Your name"
                    className={
                      hireErrors.name
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {hireErrors.name && (
                    <p className="text-xs text-red-500">{hireErrors.name}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-600">Email</p>
                  <Input
                    type="email"
                    value={hireEmail}
                    onChange={(e) => setHireEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={
                      hireErrors.email
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {hireErrors.email && (
                    <p className="text-xs text-red-500">{hireErrors.email}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-600">Phone</p>
                  <Input
                    value={hirePhone}
                    onChange={(e) => setHirePhone(e.target.value)}
                    placeholder="Contact number"
                    className={
                      hireErrors.phone
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {hireErrors.phone && (
                    <p className="text-xs text-red-500">{hireErrors.phone}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-600">Message</p>
                <Textarea
                  value={hireMessage}
                  onChange={(e) => setHireMessage(e.target.value)}
                  placeholder="Briefly describe the role or next steps for this candidate..."
                  rows={4}
                  className={
                    hireErrors.message
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {hireErrors.message && (
                  <p className="text-xs text-red-500">{hireErrors.message}</p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setHireOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingHire}>
                  {isSubmittingHire ? "Sending..." : "Send hire request"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
