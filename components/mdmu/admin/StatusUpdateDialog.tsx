import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MDMUResponse } from "@/components/mdmu/mdmu/components/mdmu-form/types";

interface StatusUpdateDialogProps {
  application: MDMUResponse | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onStatusUpdate: (status: "Pending" | "Approved" | "Rejected") => void;
}

export function StatusUpdateDialog({
  application,
  isOpen,
  isLoading,
  onClose,
  onStatusUpdate,
}: StatusUpdateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogDescription>
            Change the status for {application?.name_of_company}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            disabled={isLoading}
            variant="outline"
            className="w-full"
            onClick={() => onStatusUpdate("Approved")}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Approve"
            )}
          </Button>
          <Button
            disabled={isLoading}
            variant="destructive"
            className="w-full"
            onClick={() => onStatusUpdate("Rejected")}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Reject"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
