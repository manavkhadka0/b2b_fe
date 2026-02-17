"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getInternshipRegistrationById,
  getIndustries,
} from "@/services/internship";
import type { InternshipRegistration, Industry } from "@/types/internship";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";

export default function InternshipDetailPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const [registration, setRegistration] =
    useState<InternshipRegistration | null>(null);
  const [industryName, setIndustryName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    if (!id || !isAuthenticated) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [data, industries] = await Promise.all([
          getInternshipRegistrationById(id),
          getIndustries(),
        ]);
        setRegistration(data);
        if (data.internship_industry != null) {
          const industry = industries.find(
            (i: Industry) => i.id === data.internship_industry,
          );
          setIndustryName(industry?.name ?? null);
        }
      } catch {
        setError("Failed to load application.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated]);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/internships"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to applications
        </Link>
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error || "Application not found."}
        </div>
      </div>
    );
  }

  const InfoSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-900">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-700">{value ?? "—"}</dd>
    </div>
  );

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/internships"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to applications
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">
            {registration.full_name || "Internship Application"}
          </h1>
          <p className="text-sm text-slate-500">
            {registration.preferred_start_date
              ? `Preferred start: ${format(new Date(registration.preferred_start_date), "MMM d, yyyy")}`
              : "No preferred start date"}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <InfoSection title="Personal information">
          <InfoRow label="Full name" value={registration.full_name} />
          <InfoRow label="Email" value={registration.email} />
          <InfoRow label="Contact number" value={registration.contact_number} />
          <InfoRow
            label="Date of birth"
            value={
              registration.date_of_birth
                ? format(new Date(registration.date_of_birth), "MMM d, yyyy")
                : null
            }
          />
        </InfoSection>

        <InfoSection title="Permanent address">
          <InfoRow label="Province" value={registration.permanent_province} />
          <InfoRow label="District" value={registration.permanent_district} />
          <InfoRow
            label="Municipality"
            value={registration.permanent_municipality}
          />
          <InfoRow label="Ward" value={registration.permanent_ward} />
        </InfoSection>

        <InfoSection title="Current address">
          <InfoRow label="Province" value={registration.current_province} />
          <InfoRow label="District" value={registration.current_district} />
          <InfoRow
            label="Municipality"
            value={registration.current_municipality}
          />
          <InfoRow label="Ward" value={registration.current_ward} />
        </InfoSection>

        <InfoSection title="Supervisor">
          <InfoRow
            label="Supervisor name"
            value={registration.supervisor_name}
          />
          <InfoRow
            label="Supervisor email"
            value={registration.supervisor_email}
          />
          <InfoRow
            label="Supervisor phone"
            value={registration.supervisor_phone}
          />
        </InfoSection>

        <InfoSection title="Internship preferences">
          <InfoRow label="Industry" value={industryName} />
          <InfoRow
            label="Preferred department"
            value={registration.preferred_department}
          />
          <InfoRow label="Duration" value={registration.internship_duration} />
          <InfoRow label="Months" value={registration.internship_month} />
          <InfoRow
            label="Preferred start date"
            value={
              registration.preferred_start_date
                ? format(
                    new Date(registration.preferred_start_date),
                    "MMM d, yyyy",
                  )
                : null
            }
          />
          <InfoRow label="Availability" value={registration.availability} />
        </InfoSection>

        {registration.motivational_letter && (
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Motivational letter
            </h3>
            <div
              className="prose prose-sm max-w-none rounded-lg border border-slate-100 bg-slate-50 p-4 text-slate-700"
              dangerouslySetInnerHTML={{
                __html: registration.motivational_letter,
              }}
            />
          </section>
        )}
      </div>
    </div>
  );
}
