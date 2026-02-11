"use client";

import Link from "next/link";
import type { Institute } from "@/types/institute";
import {
  Building2,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileInstituteSectionProps {
  institute: Institute | null;
  loading: boolean;
}

export function ProfileInstituteSection({
  institute,
  loading,
}: ProfileInstituteSectionProps) {
  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Building2 className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          You have not registered an institute yet. Register to manage the
          skilled workforce roster.
        </p>
        <Button asChild>
          <Link href="/jobs/roster">Go to Roster</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {institute.institute_name}
              </h2>
              <p className="text-sm text-gray-500">
                {institute.institute_type}
              </p>
            </div>
          </div>
          {institute.is_verified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-sm font-medium">
              <Clock className="w-4 h-4" />
              Pending verification
            </span>
          )}
        </div>
        <div className="p-5 space-y-3 text-sm">
          <div className="flex items-start gap-3 text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
            <span>
              {institute.municipality}, {institute.district},{" "}
              {institute.province} · Ward {institute.ward_no}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-4 h-4 shrink-0 text-gray-400" />
            <a
              href={`mailto:${institute.email}`}
              className="text-indigo-600 hover:underline"
            >
              {institute.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-4 h-4 shrink-0 text-gray-400" />
            <span>{institute.phone_number}</span>
          </div>
          {institute.website && (
            <div className="flex items-center gap-3 text-gray-600">
              <span className="w-4 shrink-0 text-gray-400">🔗</span>
              <a
                href={institute.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {institute.website}
              </a>
            </div>
          )}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Primary contact
            </p>
            <p className="text-gray-700">
              {institute.primary_contact_person} ·{" "}
              {institute.primary_contact_person_designation}
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              {institute.primary_contact_person_email} ·{" "}
              {institute.primary_contact_person_phone}
            </p>
          </div>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
          {institute.is_verified && (
            <Button size="sm" asChild>
              <Link href="/jobs/roster/create">Add graduate</Link>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href="/jobs/roster">Manage roster</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
