"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RosterCreateButtonProps {
  /** Only show when institute is verified */
  isVerified?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function RosterCreateButton({
  isVerified = false,
  variant = "default",
  size = "default",
  className,
}: RosterCreateButtonProps) {
  if (!isVerified) return null;

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link
        href="/jobs/roster/create"
        className="inline-flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add graduate
      </Link>
    </Button>
  );
}
