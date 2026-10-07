"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Building2,
  Award,
  User,
} from "lucide-react";
import type { GraduateRoster } from "@/types/graduate-roster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GraduateInterestDetailsDialogProps {
  graduate: GraduateRoster | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHire: () => void;
}

function formatDate(value?: string | null) {
  if (!value) return "Not specified";
  try {
    return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
      new Date(value),
    );
  } catch {
    return value;
  }
}

export function GraduateInterestDetailsDialog({
  graduate,
  open,
  onOpenChange,
  onHire,
}: GraduateInterestDetailsDialogProps) {
  if (!graduate) return null;

  const instituteName =
    typeof graduate.institute === "object" && graduate.institute
      ? graduate.institute.institute_name
      : graduate.institute_name;

  const skillsList = graduate.specialization_key_skills
    ? graduate.specialization_key_skills
        .split(/[,،]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <GraduationCap className="w-3 h-3" />
              Available Graduate
            </span>
            {graduate.roster_type && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                {graduate.roster_type}
              </span>
            )}
            {graduate.level_completed && (
              <Badge className="bg-indigo-700 text-white text-[11px] px-2 py-0.5">
                {graduate.level_completed}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900">
            {graduate.name}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-500">
            {graduate.subject_trade_stream || "Skilled workforce roster candidate"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Top Grid: Education, Institute, and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Education Info */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 space-y-2">
              <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                Education & Certification
              </p>
              <div className="text-xs sm:text-sm space-y-1 text-slate-700">
                <p>
                  <span className="font-medium text-slate-900">Level:</span>{" "}
                  {graduate.level_completed || "Not specified"}
                </p>
                {graduate.subject_trade_stream && (
                  <p>
                    <span className="font-medium text-slate-900">
                      Trade / Stream:
                    </span>{" "}
                    {graduate.subject_trade_stream}
                  </p>
                )}
                {graduate.passed_year && (
                  <p>
                    <span className="font-medium text-slate-900">
                      Passed Year:
                    </span>{" "}
                    {graduate.passed_year}
                  </p>
                )}
                {graduate.certifying_agency && (
                  <p>
                    <span className="font-medium text-slate-900">
                      Certifying Agency:
                    </span>{" "}
                    {graduate.certifying_agency}
                    {graduate.certifying_agency_name
                      ? ` (${graduate.certifying_agency_name})`
                      : ""}
                  </p>
                )}
                {graduate.certificate_id && (
                  <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">
                      Certificate ID:
                    </span>{" "}
                    {graduate.certificate_id}
                  </p>
                )}
              </div>
            </div>

            {/* Institute & Availability */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 space-y-2">
              <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Institute & Availability
              </p>
              <div className="text-xs sm:text-sm space-y-1 text-slate-700">
                {instituteName ? (
                  <p>
                    <span className="font-medium text-slate-900">
                      Institute:
                    </span>{" "}
                    {instituteName}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Registered as Individual candidate
                  </p>
                )}
                <p className="flex items-center gap-2 pt-1">
                  <span className="font-medium text-slate-900">Job Status:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {graduate.job_status || "Available for Job"}
                  </span>
                </p>
                {graduate.available_from && (
                  <p className="flex items-center gap-1 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Available from: {formatDate(graduate.available_from)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Key Skills */}
          {skillsList.length > 0 && (
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                Specialization & Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-white text-slate-700 border-slate-200 text-xs font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Address & Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 space-y-2">
              <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Location
              </p>
              <div className="text-xs sm:text-sm space-y-2 text-slate-700">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 uppercase">
                    Permanent Address
                  </p>
                  <p className="capitalize">
                    {graduate.permanent_municipality},{" "}
                    {graduate.permanent_district}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    Province: {graduate.permanent_province}
                    {graduate.permanent_ward
                      ? `, Ward: ${graduate.permanent_ward}`
                      : ""}
                  </p>
                </div>
                {(graduate.current_municipality ||
                  graduate.current_district) && (
                  <div className="pt-1 border-t border-slate-200/60">
                    <p className="text-[11px] font-medium text-slate-500 uppercase">
                      Current Address
                    </p>
                    <p className="capitalize">
                      {graduate.current_municipality || "—"},{" "}
                      {graduate.current_district || "—"}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      Province: {graduate.current_province || "—"}
                      {graduate.current_ward
                        ? `, Ward: ${graduate.current_ward}`
                        : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact & Personal details */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 space-y-2">
              <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Personal Details
              </p>
              <div className="text-xs sm:text-sm space-y-1.5 text-slate-700">
                {graduate.email && (
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{graduate.email}</span>
                  </p>
                )}
                {graduate.phone_number && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{graduate.phone_number}</span>
                  </p>
                )}
                {graduate.gender && (
                  <p className="text-xs text-slate-600">
                    <span className="font-medium text-slate-800">Gender:</span>{" "}
                    {graduate.gender}
                  </p>
                )}
                {graduate.date_of_birth && (
                  <p className="text-xs text-slate-600">
                    <span className="font-medium text-slate-800">
                      Date of Birth:
                    </span>{" "}
                    {formatDate(graduate.date_of_birth)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="bg-blue-800 hover:bg-blue-900 text-white"
            type="button"
            onClick={onHire}
          >
            Hire Candidate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
