"use client";

import Link from "next/link";
import type { GraduateRoster } from "@/types/graduate-roster";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RosterTableProps {
  graduates: GraduateRoster[];
  searchQuery?: string;
  onDelete?: (id: number) => void;
  deletingId?: number | null;
}

export function RosterTable({
  graduates,
  searchQuery = "",
  onDelete,
  deletingId,
}: RosterTableProps) {
  const q = searchQuery.trim().toLowerCase();
  const filtered =
    q.length > 0
      ? graduates.filter(
          (g) =>
            g.name.toLowerCase().includes(q) ||
            g.email.toLowerCase().includes(q) ||
            (g.phone_number || "").includes(q) ||
            (g.subject_trade_stream || "").toLowerCase().includes(q),
        )
      : graduates;

  if (filtered.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        {graduates.length === 0
          ? "No graduates in roster yet. Add your first graduate to get started."
          : "No graduates match your search."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 font-medium text-slate-700">
              Name
            </th>
            <th className="text-left py-3 px-4 font-medium text-slate-700">
              Contact
            </th>
            <th className="text-left py-3 px-4 font-medium text-slate-700">
              Education
            </th>
            <th className="text-left py-3 px-4 font-medium text-slate-700">
              Job status
            </th>
            <th className="text-right py-3 px-4 font-medium text-slate-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((g) => (
            <tr
              key={g.id}
              className="border-b border-slate-100 hover:bg-slate-50/50"
            >
              <td className="py-3 px-4">
                <span className="font-medium text-slate-900">{g.name}</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  {g.permanent_municipality}, {g.permanent_district}
                </p>
              </td>
              <td className="py-3 px-4">
                <p>{g.email}</p>
                <p className="text-slate-500 text-xs">{g.phone_number}</p>
              </td>
              <td className="py-3 px-4">
                <p>{g.level_completed || "—"}</p>
                <p className="text-slate-500 text-xs">
                  {g.subject_trade_stream || "—"}
                </p>
              </td>
              <td className="py-3 px-4">
                <span
                  className={
                    g.job_status === "Available for Job"
                      ? "text-green-700"
                      : "text-slate-500"
                  }
                >
                  {g.job_status}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/jobs/roster/create/${g.id}`}
                      aria-label="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(g.id)}
                      disabled={deletingId === g.id}
                      aria-label="Delete"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
