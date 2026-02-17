"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getApprenticeshipApplicationById } from "@/services/apprenticeship";
import type { ApprenticeshipApplication } from "@/types/apprenticeship";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";

export default function ApprenticeshipDetailPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const [application, setApplication] =
    useState<ApprenticeshipApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    if (!id || !isAuthenticated) return;

    const fetchApplication = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getApprenticeshipApplicationById(id);
        setApplication(data);
      } catch {
        setError("Failed to load application.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
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

  if (error || !application) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/apprenticeships"
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
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/apprenticeships"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to applications
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">
            {application.full_name}
          </h1>
          <p className="text-sm text-slate-500">
            Applied{" "}
            {format(new Date(application.created_at), "MMM d, yyyy 'at' HH:mm")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <InfoSection title="Personal information">
          <InfoRow label="Full name" value={application.full_name} />
          <InfoRow label="Email" value={application.email_address} />
          <InfoRow label="Mobile" value={application.mobile_number} />
          <InfoRow
            label="Date of birth"
            value={
              application.date_of_birth
                ? format(new Date(application.date_of_birth), "MMM d, yyyy")
                : null
            }
          />
          <InfoRow label="Gender" value={application.gender} />
        </InfoSection>

        <InfoSection title="Address">
          <InfoRow label="Province" value={application.province} />
          <InfoRow label="District" value={application.district} />
          <InfoRow label="Municipality" value={application.municipality} />
          <InfoRow label="Ward" value={application.ward} />
        </InfoSection>

        <InfoSection title="Education">
          <InfoRow
            label="Education level"
            value={application.education_level}
          />
          <InfoRow label="School name" value={application.school_name} />
          <InfoRow
            label="Year of SEE completion"
            value={application.year_of_see_completion}
          />
        </InfoSection>

        <InfoSection title="Apprenticeship">
          <InfoRow label="Trade" value={application.trade} />
          <InfoRow
            label="Preferred training provider"
            value={application.preferred_training_provider}
          />
          <InfoRow
            label="Preferred location"
            value={application.preferred_location}
          />
        </InfoSection>

        {application.motivation_letter && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Motivation letter
            </h3>
            <div
              className="prose prose-sm max-w-none rounded-lg border border-slate-100 bg-slate-50 p-4 text-slate-700"
              dangerouslySetInnerHTML={{
                __html: application.motivation_letter,
              }}
            />
          </section>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Documents
          </h3>
          <div className="space-y-3">
            {application.citizenship && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Citizenship
                </p>
                <a
                  href={application.citizenship}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline"
                >
                  View citizenship document
                </a>
              </div>
            )}
            {application.uploaded_documents &&
              application.uploaded_documents.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Uploaded documents
                  </p>
                  <ul className="mt-2 space-y-1">
                    {application.uploaded_documents.map((doc) => (
                      <li key={doc.id}>
                        <a
                          href={doc.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline"
                        >
                          {doc.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {!application.citizenship &&
              (!application.uploaded_documents ||
                application.uploaded_documents.length === 0) && (
                <p className="text-sm text-slate-500">No documents uploaded.</p>
              )}
          </div>
        </section>
      </div>
    </div>
  );
}
