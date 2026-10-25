"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ChevronLeft,
  Users,
  Calendar,
  Clock,
  FileText,
  User,
  ChevronRight,
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Search,
  Hash,
  Mail,
  Phone,
  Eye,
  Layers,
  Info,
  CheckCircle2,
  Bookmark,
  Share2,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getJobBySlug } from "@/services/jobs";
import { getJobApplications } from "@/services/applications";
import { Badge } from "@/components/ui/badge";
import type { JobApiResponse } from "@/types/types";
import type { JobApplication } from "@/types/application";

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return format(new Date(value), "MMM d, yyyy");
  } catch {
    return value;
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  try {
    return format(new Date(value), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return value;
  }
}

function getStatusBadge(status: string) {
  const s = (status || "").toLowerCase();
  if (
    s === "approved" ||
    s === "accepted" ||
    s === "hired" ||
    s === "published"
  ) {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
        {status}
      </Badge>
    );
  }
  if (s === "rejected" || s === "declined") {
    return (
      <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
        {status}
      </Badge>
    );
  }
  if (s === "pending") {
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
        {status}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-slate-700 text-xs font-medium">
      {status}
    </Badge>
  );
}

export default function AdminJobApplicantsPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [job, setJob] = useState<JobApiResponse | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    if (!slug || !isAuthenticated) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [jobData, appData] = await Promise.all([
          getJobBySlug(slug).catch(() => null),
          getJobApplications(slug).catch(() => ({
            count: 0,
            next: null,
            previous: null,
            results: [],
          })),
        ]);

        if (jobData) {
          setJob(jobData);
        } else if (appData.results.length > 0) {
          setJob(appData.results[0].job as unknown as JobApiResponse);
        }

        const results = appData.results || [];
        setApplications(results);
        if (results.length > 0) {
          setSelectedApp(results[0]);
        }
      } catch (err) {
        console.error("Failed to load applicants data:", err);
        setError("Failed to load applicants.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [slug, isAuthenticated]);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-500">
          Loading applicants...
        </p>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="space-y-4">
        <Link
          href={`/admin/jobs/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to job
        </Link>
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      </div>
    );
  }

  const jobDetails =
    selectedApp?.job || (job as unknown as JobApplication["job"]);
  const posterUser = jobDetails?.user;
  const companyName = job?.company_name || jobDetails?.company_name || "—";

  const posterFullName = posterUser
    ? [posterUser.first_name, posterUser.last_name].filter(Boolean).join(" ") ||
      posterUser.username ||
      "—"
    : "—";

  const filteredApplications = applications.filter((app) => {
    const idMatch =
      String(app.applicant).includes(searchTerm.trim()) ||
      String(app.id).includes(searchTerm.trim()) ||
      (posterFullName &&
        posterFullName.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusMatch =
      statusFilter === "all" ||
      app.status.toLowerCase() === statusFilter.toLowerCase();
    return (searchTerm ? idMatch : true) && statusMatch;
  });

  return (
    <div className="min-w-0 space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link
              href="/admin/jobs"
              className="hover:text-slate-800 transition-colors"
            >
              Jobs
            </Link>
            <span>/</span>
            <Link
              href={`/admin/jobs/${slug}`}
              className="hover:text-slate-800 transition-colors truncate max-w-[200px]"
            >
              {job?.title || slug}
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Applicants</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Applicants for {job?.title || slug}</span>
            <Badge variant="secondary" className="font-semibold text-xs">
              {applications.length}
            </Badge>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {companyName} • Review all details returned by the applications API.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/admin/jobs/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Job Details
          </Link>
          <Link
            href={`/admin/jobs/${slug}/edit`}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            Edit Job
          </Link>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">
            No applicants yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Candidates who apply for this position will appear here along with
            all application and job details.
          </p>
          <div className="mt-6">
            <Link
              href={`/admin/jobs/${slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Return to Job
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Applicants Sidebar List */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Applications list
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Showing {filteredApplications.length} of {applications.length}
                </span>
              </div>
            </div>

            {/* List of applications */}
            <div className="divide-y divide-slate-100 max-h-[720px] overflow-y-auto">
              {filteredApplications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No applications match your search.
                </div>
              ) : (
                filteredApplications.map((app) => {
                  const isSelected = selectedApp?.id === app.id;

                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className={`w-full text-left p-4 transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-blue-50/60 border-l-4 border-l-blue-600 shadow-2xs"
                          : "hover:bg-slate-50/80 border-l-4 border-l-transparent"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm truncate font-semibold ${
                              isSelected ? "text-blue-900" : "text-slate-800"
                            }`}
                          >
                            Applicant #{app.applicant}
                          </p>
                          {getStatusBadge(app.status)}
                        </div>

                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(app.applied_date)}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            App ID: #{app.id}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className={`h-4 w-4 shrink-0 mt-1 transition-transform ${
                          isSelected
                            ? "text-blue-600 translate-x-0.5"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Full Application & User Details */}
          <div className="lg:col-span-8 space-y-6">
            {selectedApp ? (
              <>
                {/* 1. Header Banner */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-xs">
                        #{selectedApp.applicant}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="text-xl font-bold text-slate-900">
                            Applicant #{selectedApp.applicant}
                          </h2>
                          {getStatusBadge(selectedApp.status)}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                          <span>
                            Application ID:{" "}
                            <strong className="text-slate-700">
                              #{selectedApp.id}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            Position:{" "}
                            <strong className="text-slate-700">
                              {selectedApp.job?.title}
                            </strong>
                          </span>
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            Applied:{" "}
                            <span className="font-medium text-slate-800">
                              {formatDateTime(selectedApp.applied_date)}
                            </span>
                          </span>
                          {selectedApp.updated_at && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              Updated:{" "}
                              <span className="font-medium text-slate-800">
                                {formatDateTime(selectedApp.updated_at)}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. User Details Section (from API job.user) */}
                {posterUser && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        User Details
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-xs text-slate-500"
                      >
                        User ID #{posterUser.id}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Full Name
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-900">
                          {posterFullName}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Email
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {posterUser.email ? (
                            <a
                              href={`mailto:${posterUser.email}`}
                              className="hover:text-blue-600 hover:underline truncate"
                            >
                              {posterUser.email}
                            </a>
                          ) : (
                            "—"
                          )}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Username
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {posterUser.username || "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Phone Number
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {posterUser.phone_number ? (
                            <a
                              href={`tel:${posterUser.phone_number}`}
                              className="hover:text-blue-600 hover:underline"
                            >
                              {posterUser.phone_number}
                            </a>
                          ) : (
                            "—"
                          )}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Designation
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {posterUser.designation || "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Address
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{posterUser.address || "—"}</span>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Date of Birth
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {formatDate(posterUser.date_of_birth)}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Alternate Number
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {posterUser.alternate_no || "—"}
                        </dd>
                      </div>

                      {posterUser.bio && (
                        <div className="sm:col-span-2 lg:col-span-3">
                          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Bio
                          </dt>
                          <dd className="mt-1 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                            {posterUser.bio}
                          </dd>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Cover Letter Section */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Cover Letter
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs font-normal text-slate-500"
                    >
                      Submitted Statement
                    </Badge>
                  </div>

                  {selectedApp.cover_letter ? (
                    <div className="rounded-lg bg-slate-50/70 p-5 border border-slate-100">
                      <div
                        className="prose prose-sm max-w-none text-slate-800 prose-p:leading-relaxed rich-text-content"
                        dangerouslySetInnerHTML={{
                          __html: selectedApp.cover_letter,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="rounded-lg bg-slate-50 p-6 text-center text-xs italic text-slate-400">
                      No cover letter was submitted with this application.
                    </div>
                  )}
                </div>

                {/* 4. Complete Application & Job Details */}
                {selectedApp.job && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        Job & Vacancy Details
                      </h3>
                      {selectedApp.job.status &&
                        getStatusBadge(selectedApp.job.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Job Title
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-900">
                          {selectedApp.job.title}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Company Name
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">
                          {selectedApp.job.company_name || "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Location
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{selectedApp.job.location || "—"}</span>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Employment Type
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {selectedApp.job.employment_type || "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          No. of Vacancies
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {selectedApp.job.no_of_vacancy ?? 1}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Total Applications
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {selectedApp.job.applications_count ??
                            selectedApp.job.total_applicant_count ??
                            "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Posted Date
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {formatDateTime(selectedApp.job.posted_date)}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Deadline
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {formatDateTime(selectedApp.job.deadline)}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Views Count
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800 flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          <span>{selectedApp.job.views_count ?? 0} views</span>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Salary Range
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {selectedApp.job.show_salary
                            ? `NPR ${selectedApp.job.salary_range_min} - ${selectedApp.job.salary_range_max}`
                            : "Hidden (Confidential)"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Already Saved
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800 flex items-center gap-1.5">
                          <Bookmark className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {selectedApp.job.has_already_saved ? "Yes" : "No"}
                          </span>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Is Applied Flag
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {selectedApp.job.is_applied ? "Yes" : "No"}
                        </dd>
                      </div>
                    </div>

                    {/* Unit Group Hierarchy breakdown */}
                    {selectedApp.job.unit_group && (
                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5 text-blue-600" />
                          Unit Group Classification
                        </h4>

                        <div className="rounded-lg bg-slate-50/70 p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-semibold text-slate-700">
                              Unit Group:
                            </span>{" "}
                            <span className="text-slate-900 font-medium">
                              {selectedApp.job.unit_group.title}
                            </span>{" "}
                            (Code: {selectedApp.job.unit_group.code})
                          </div>

                          {selectedApp.job.unit_group.minor_group && (
                            <div>
                              <span className="font-semibold text-slate-700">
                                Minor Group:
                              </span>{" "}
                              <span className="text-slate-900 font-medium">
                                {selectedApp.job.unit_group.minor_group.title}
                              </span>{" "}
                              (Code:{" "}
                              {selectedApp.job.unit_group.minor_group.code})
                            </div>
                          )}

                          {selectedApp.job.unit_group.minor_group
                            ?.sub_major_group && (
                            <div>
                              <span className="font-semibold text-slate-700">
                                Sub-Major Group:
                              </span>{" "}
                              <span className="text-slate-900 font-medium">
                                {
                                  selectedApp.job.unit_group.minor_group
                                    .sub_major_group.title
                                }
                              </span>{" "}
                              (Code:{" "}
                              {
                                selectedApp.job.unit_group.minor_group
                                  .sub_major_group.code
                              }
                              )
                            </div>
                          )}

                          {selectedApp.job.unit_group.minor_group
                            ?.sub_major_group?.major_group && (
                            <div>
                              <span className="font-semibold text-slate-700">
                                Major Group:
                              </span>{" "}
                              <span className="text-slate-900 font-medium">
                                {
                                  selectedApp.job.unit_group.minor_group
                                    .sub_major_group.major_group.title
                                }
                              </span>{" "}
                              (Code:{" "}
                              {
                                selectedApp.job.unit_group.minor_group
                                  .sub_major_group.major_group.code
                              }
                              )
                            </div>
                          )}

                          {selectedApp.job.unit_group.minor_group
                            ?.description && (
                            <div className="sm:col-span-2 text-slate-600 border-t border-slate-200/50 pt-2 text-[11px] leading-relaxed">
                              <span className="font-semibold text-slate-700">
                                Minor Group Description:
                              </span>{" "}
                              {
                                selectedApp.job.unit_group.minor_group
                                  .description
                              }
                            </div>
                          )}

                          {selectedApp.job.unit_group.minor_group
                            ?.sub_major_group?.major_group?.description && (
                            <div className="sm:col-span-2 text-slate-600 border-t border-slate-200/50 pt-2 text-[11px] leading-relaxed">
                              <span className="font-semibold text-slate-700">
                                Major Group Description:
                              </span>{" "}
                              {
                                selectedApp.job.unit_group.minor_group
                                  .sub_major_group.major_group.description
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-400 shadow-xs">
                Select an applicant from the left to view application details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rich-text styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .rich-text-content ul.list-node,
        .rich-text-content ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          display: block !important;
        }
        .rich-text-content ul li {
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
          display: list-item !important;
          list-style-position: outside !important;
        }
        .rich-text-content ul li p.text-node,
        .rich-text-content ul li p {
          margin-bottom: 0 !important;
          display: inline !important;
        }
        .rich-text-content p.text-node {
          margin-bottom: 0.75rem;
        }
      `,
        }}
      />
    </div>
  );
}
