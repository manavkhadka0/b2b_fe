"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

function AdminHeaderNav() {
  const pathname = usePathname();

  const linkBaseClasses =
    "text-sm font-medium px-3 py-1.5 rounded-md transition-colors";

  return (
    <nav className="flex items-center gap-2">
      <Link
        href="/admin/events"
        className={`${linkBaseClasses} ${
          pathname?.startsWith("/admin/events")
            ? "bg-sky-100 text-sky-700"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        Events
      </Link>
      <Link
        href="/admin/wishes-offers"
        className={`${linkBaseClasses} ${
          pathname?.startsWith("/admin/wishes-offers")
            ? "bg-sky-100 text-sky-700"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        Wishes &amp; Offers
      </Link>
    </nav>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-500">
                Internal tools for managing events, wishes &amp; offers
              </p>
            </div>
            <AdminHeaderNav />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </div>
    </AdminAuthProvider>
  );
}

