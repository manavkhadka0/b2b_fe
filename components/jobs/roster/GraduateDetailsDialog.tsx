"use client";

import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import type { GraduateRoster } from "@/types/graduate-roster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GraduateDetailsDialogProps {
  graduate: GraduateRoster | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GraduateDetailsDialog({
  graduate,
  open,
  onOpenChange,
}: GraduateDetailsDialogProps) {
  if (!graduate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {graduate.name}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm">
            {graduate.subject_trade_stream || "Skilled workforce roster entry"}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Contact
              </p>
              <p className="flex items-center gap-1.5 text-slate-800">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{graduate.email}</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-800">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{graduate.phone_number}</span>
              </p>
              <p className="text-xs text-slate-500">Gender: {graduate.gender}</p>
              <p className="text-xs text-slate-500">
                Date of birth:{" "}
                {new Date(graduate.date_of_birth).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Education
              </p>
              <p className="text-slate-800">
                {graduate.level_completed || "Level not specified"}
              </p>
              {graduate.subject_trade_stream && (
                <p className="text-xs text-slate-500">
                  {graduate.subject_trade_stream}
                </p>
              )}
              {graduate.passed_year && (
                <p className="text-xs text-slate-500">
                  Passed year: {graduate.passed_year}
                </p>
              )}
              {graduate.certifying_agency && (
                <p className="text-xs text-slate-500">
                  Certifying agency: {graduate.certifying_agency}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Permanent address
              </p>
              <p className="flex items-center gap-1.5 text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">
                  {graduate.permanent_municipality},{" "}
                  {graduate.permanent_district}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                Province: {graduate.permanent_province}, Ward:{" "}
                {graduate.permanent_ward}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Current address
              </p>
              {graduate.current_municipality || graduate.current_district ? (
                <>
                  <p className="flex items-center gap-1.5 text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">
                      {graduate.current_municipality || "—"},{" "}
                      {graduate.current_district || "—"}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Province: {graduate.current_province || "—"}, Ward:{" "}
                    {graduate.current_ward || "—"}
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-500">
                  Not specified (may be same as permanent).
                </p>
              )}
            </div>
          </div>

          {graduate.specialization_key_skills && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Specialization / key skills
              </p>
              <p className="text-slate-800 whitespace-pre-line text-sm">
                {graduate.specialization_key_skills}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
                graduate.job_status === "Available for Job"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-slate-50 text-slate-600 border border-slate-100"
              }`}
            >
              {graduate.job_status}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

