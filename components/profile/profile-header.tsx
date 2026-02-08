"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Mail, Plus } from "lucide-react";
import type { User } from "@/types/auth";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const displayName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || null;
  const address = user.address?.trim() || null;

  return (
    <div className="relative w-full bg-[#020A33] text-white rounded-xl overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 pointer-events-none">
        <div className="w-48 h-48 bg-[#E31B54] rounded-full opacity-20 translate-x-20 -translate-y-20" />
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none">
        <div className="w-32 h-32 bg-blue-800 rounded-full opacity-20 translate-x-16 translate-y-16" />
      </div>

      <div className="relative p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {displayName || "Add your name"}
          </h1>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="w-4 h-4 shrink-0 text-gray-400" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/wishOffer/wishes/create-wish">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent border-white/60 text-white hover:bg-white hover:text-[#020A33]"
            >
              <Plus className="w-4 h-4" />
              Create Wish
            </Button>
          </Link>
          <Link href="/wishOffer/offer/create-offer">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent border-white/60 text-white hover:bg-white hover:text-[#020A33]"
            >
              <Plus className="w-4 h-4" />
              Create Offer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
