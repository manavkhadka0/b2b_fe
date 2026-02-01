"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, ExternalLink } from "lucide-react";
import type { Job } from "@/types/types";

interface ProfileJobsTableProps {
  jobs: Job[];
  showEditButton?: boolean;
  onEdit?: (job: Job) => void;
}

export function ProfileJobsTable({
  jobs,
  showEditButton = false,
  onEdit,
}: ProfileJobsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100 min-w-0">
      <Table className="min-w-[520px]">
        <TableHeader>
          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
            <TableHead className="min-w-[140px] text-sm font-semibold text-gray-600">Title</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[120px] text-sm font-semibold text-gray-600">
              Company
            </TableHead>
            <TableHead className="w-[80px] text-sm font-semibold text-gray-600">Type</TableHead>
            <TableHead className="hidden md:table-cell w-[100px] text-sm font-semibold text-gray-600">
              Location
            </TableHead>
            <TableHead className="hidden lg:table-cell w-[100px] text-sm font-semibold text-gray-600">
              Salary
            </TableHead>
            <TableHead className="w-[90px] text-sm font-semibold text-gray-600">Date</TableHead>
            <TableHead className="w-[70px] text-right text-sm font-semibold text-gray-600">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="group hover:bg-gray-50/50">
                <TableCell className="py-3">
                  <Link
                    href={`/jobs/create?slug=${job.slug}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                  >
                    {job.title}
                  </Link>
                </TableCell>
              <TableCell className="hidden sm:table-cell py-3 text-sm text-gray-600">
                {job.company}
              </TableCell>
              <TableCell className="py-3">
                <span className="inline-flex items-center rounded bg-slate-50 border border-slate-100 text-slate-600 text-xs px-2 py-0.5 font-semibold uppercase">
                  {job.type}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell py-3 text-sm text-gray-600">
                {job.location}
              </TableCell>
              <TableCell className="hidden lg:table-cell py-3 text-sm text-gray-600">
                {job.salaryRange}
              </TableCell>
              <TableCell className="py-3 text-sm text-gray-600 whitespace-nowrap">
                {job.postedDate}
              </TableCell>
              <TableCell className="py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/jobs/create?slug=${job.slug}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      title="View"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  {showEditButton && onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:bg-gray-100"
                      onClick={() => onEdit(job)}
                      title="Edit"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
