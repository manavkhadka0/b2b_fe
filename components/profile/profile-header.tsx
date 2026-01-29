"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { User } from "@/types/auth";

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    (parts[0]?.charAt(0) || "") + (parts[1]?.charAt(0) || "")
  ).toUpperCase();
}

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 md:p-6 mb-5 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 bg-blue-50">
            <AvatarFallback className="text-blue-700 font-semibold">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
              {fullName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <Link href="/wishOffer/wishes/create-wish">
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
            >
              Create Wish
            </Button>
          </Link>
          <Link href="/wishOffer/offer/create-offer">
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
            >
              Create Offer
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
