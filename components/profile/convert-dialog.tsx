"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface ConvertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  sourceType: "wish" | "offer" | null;
  targetType: "wish" | "offer" | null;
  itemTitle?: string;
  isConverting: boolean;
}

export function ConvertDialog({
  open,
  onOpenChange,
  onConfirm,
  sourceType,
  targetType,
  itemTitle,
  isConverting,
}: ConvertDialogProps) {
  if (!sourceType || !targetType) return null;

  const sourceLabel = sourceType === "wish" ? "Wish" : "Offer";
  const targetLabel = targetType === "wish" ? "Wish" : "Offer";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle>
              Convert {sourceLabel} to {targetLabel}?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 space-y-2">
            <p>
              You are about to convert this{" "}
              <strong>{sourceLabel.toLowerCase()}</strong> to a{" "}
              <strong>{targetLabel.toLowerCase()}</strong>.
            </p>
            {itemTitle && (
              <p className="text-sm font-medium text-gray-700">"{itemTitle}"</p>
            )}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800 font-medium mb-1">
                ⚠️ Important:
              </p>
              <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                <li>This action cannot be undone</li>
                <li>All associated data will be preserved</li>
                <li>
                  The {sourceLabel.toLowerCase()} will be removed and replaced
                  with a {targetLabel.toLowerCase()}
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Are you sure you want to proceed?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConverting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isConverting}
            className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
          >
            {isConverting ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Converting...
              </>
            ) : (
              `Convert to ${targetLabel}`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
