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
    <nav className="flex items-center gap-2 flex-wrap">
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
      <Link
        href="/admin/services"
        className={`${linkBaseClasses} ${
          pathname?.startsWith("/admin/services")
            ? "bg-sky-100 text-sky-700"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        Services
      </Link>
      <Link
        href="/admin/categories"
        className={`${linkBaseClasses} ${
          pathname?.startsWith("/admin/categories")
            ? "bg-sky-100 text-sky-700"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        Categories
      </Link>
      <Link
        href="/admin/subcategories"
        className={`${linkBaseClasses} ${
          pathname?.startsWith("/admin/subcategories")
            ? "bg-sky-100 text-sky-700"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        Subcategories
      </Link>
    </nav>
  );
}

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin";

  return (
    <div className="min-h-screen bg-slate-50">
      {!isLoginPage && (
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-500">
                Internal tools for managing events, wishes, offers, categories
                &amp; subcategories
              </p>
            </div>
            <AdminHeaderNav />
          </div>
        </header>
      )}
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
