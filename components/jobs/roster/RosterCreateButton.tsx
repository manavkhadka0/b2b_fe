"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RosterCreateButtonProps {
  /** When provided, used instead of Link navigation (e.g. for auth check) */
  onClick?: () => void;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function RosterCreateButton({
  onClick,
  variant = "default",
  size = "default",
  className,
}: RosterCreateButtonProps) {
  if (onClick) {
    return (
      <Button
        onClick={onClick}
        variant={variant}
        size={size}
        className={cn("inline-flex items-center gap-2", className)}
      >
        <Plus className="w-4 h-4" />
        Create roster
      </Button>
    );
  }
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link
        href="/jobs-and-oppourtunities/roster/create"
        className="inline-flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Create roster
      </Link>
    </Button>
  );
}
