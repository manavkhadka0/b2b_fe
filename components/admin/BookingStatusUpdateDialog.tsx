"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { IncubationCenterBooking } from "@/services/incubationCenterBooking";

interface BookingStatusUpdateDialogProps {
  booking: IncubationCenterBooking | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onStatusUpdate: (is_approved: boolean) => void;
}

export function BookingStatusUpdateDialog({
  booking,
  isOpen,
  isLoading,
  onClose,
  onStatusUpdate,
}: BookingStatusUpdateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Booking Status</DialogTitle>
          <DialogDescription>
            Change the status for {booking?.full_name} — Booking #{booking?.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            disabled={isLoading}
            variant="outline"
            className="w-full border-slate-200"
            onClick={() => onStatusUpdate(true)}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Approve
          </Button>
          <Button
            disabled={isLoading}
            variant="destructive"
            className="w-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
            onClick={() => onStatusUpdate(false)}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
