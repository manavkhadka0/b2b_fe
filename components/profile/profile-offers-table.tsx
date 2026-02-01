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
import type { Offer } from "@/types/wish";

interface ProfileOffersTableProps {
  offers: Offer[];
  deletingOfferId: number | null;
  convertingId: number | null;
  onEdit: (offer: Offer) => void;
  onDelete: (id: number) => void;
  onConvert: (offer: Offer) => void;
}

export function ProfileOffersTable({
  offers,
  deletingOfferId,
  convertingId,
  onEdit,
  onDelete,
  onConvert,
}: ProfileOffersTableProps) {
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
          {offers.map((offer) => {
            const isDeleting = deletingOfferId === offer.id;
            const isConverting = convertingId === offer.id;
            const isDisabled = isDeleting || isConverting;

            return (
              <TableRow key={offer.id} className="group hover:bg-gray-50/50">
                <TableCell className="py-3">
                  <Badge className="bg-green-50 text-green-600 border-green-100 text-xs font-semibold uppercase">
                    {offer.type}
                  </Badge>
                  {offer.match_percentage !== undefined && (
                    <span className="ml-1 text-xs text-gray-500">
                      {offer.match_percentage}%
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-3">
                  <Link
                    href={`/wishOffer/offer/${offer.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors line-clamp-1"
                  >
                    {offer.title}
                  </Link>
                </TableCell>
                <TableCell className="hidden md:table-cell py-3 text-sm text-gray-600 max-w-[200px]">
                  <span className="line-clamp-1 leading-relaxed">
                    {offer.description || "—"}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell py-3 text-sm text-gray-600">
                  {offer.province || "N/A"}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-600 whitespace-nowrap">
                  {new Date(offer.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/wishOffer/offer/${offer.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                        title="View"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:bg-gray-100"
                      onClick={() => onEdit(offer)}
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                      onClick={() => onConvert(offer)}
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
                      onClick={() => onDelete(offer.id)}
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
