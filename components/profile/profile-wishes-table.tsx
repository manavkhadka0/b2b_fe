"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Edit2, Trash2, ArrowRightLeft, ExternalLink } from "lucide-react";
import type { Wish } from "@/types/wish";

interface ProfileWishesTableProps {
  wishes: Wish[];
  deletingWishId: number | null;
  convertingId: number | null;
  onEdit: (wish: Wish) => void;
  onDelete: (id: number) => void;
  onConvert: (wish: Wish) => void;
}

export function ProfileWishesTable({
  wishes,
  deletingWishId,
  convertingId,
  onEdit,
  onDelete,
  onConvert,
}: ProfileWishesTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100 min-w-0">
      <Table className="min-w-[560px]">
        <TableHeader>
          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
            <TableHead className="w-[80px] text-sm font-semibold text-gray-600">Type</TableHead>
            <TableHead className="min-w-[140px] text-sm font-semibold text-gray-600">Title</TableHead>
            <TableHead className="hidden md:table-cell min-w-[180px] text-sm font-semibold text-gray-600">
              Description
            </TableHead>
            <TableHead className="hidden sm:table-cell w-[90px] text-sm font-semibold text-gray-600">
              Location
            </TableHead>
            <TableHead className="w-[90px] text-sm font-semibold text-gray-600">Date</TableHead>
            <TableHead className="w-[80px] text-right text-sm font-semibold text-gray-600">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wishes.map((wish) => {
            const isDeleting = deletingWishId === wish.id;
            const isConverting = convertingId === wish.id;
            const isDisabled = isDeleting || isConverting;

            return (
              <TableRow key={wish.id} className="group hover:bg-gray-50/50">
                <TableCell className="py-3">
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-xs font-semibold uppercase">
                    {wish.type}
                  </Badge>
                  {wish.match_percentage !== undefined && (
                    <span className="ml-1 text-xs text-gray-500">
                      {wish.match_percentage}%
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-3">
                  <Link
                    href={`/wishOffer/wishes/${wish.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                  >
                    {wish.title}
                  </Link>
                </TableCell>
                <TableCell className="hidden md:table-cell py-3 text-sm text-gray-600 max-w-[200px]">
                  <span className="line-clamp-1 leading-relaxed">
                    {wish.description || "—"}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell py-3 text-sm text-gray-600">
                  {wish.province || "N/A"}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-600 whitespace-nowrap">
                  {new Date(wish.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/wishOffer/wishes/${wish.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        title="View"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:bg-gray-100"
                      onClick={() => onEdit(wish)}
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                      onClick={() => onConvert(wish)}
                      disabled={isDisabled}
                      title="Convert"
                    >
                      {isConverting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(wish.id)}
                      disabled={isDisabled}
                      title="Delete"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
