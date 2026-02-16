"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const SIDEBAR_LINKS = [
  { href: "/admin/events", label: "Events" },
  { href: "/admin/experience-zone", label: "Experience Zone" },
  { href: "/admin/wishes-offers", label: "Wishes & Offers" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/subcategories", label: "Subcategories" },
] as const;

const SIDEBAR_MDMU_LINKS = [
  { href: "/admin/mdmu", label: "Applications" },
  { href: "/admin/mdmu/logos", label: "Logos" },
] as const;

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-10 flex h-full w-56 flex-col border-r border-slate-200 bg-white">
      <div className="flex flex-col gap-0.5 p-3 pt-6">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Birat bazaar
        </p>
        {SIDEBAR_LINKS.map(({ href, label }) => {
          const isActive = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sky-100 text-sky-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {label}
            </Link>
          );
        })}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            MDMU
          </p>
          {SIDEBAR_MDMU_LINKS.map(({ href, label }) => {
            const isActive =
              href === "/admin/mdmu"
                ? pathname === "/admin/mdmu"
                : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors block ${
                  isActive
                    ? "bg-sky-100 text-sky-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const isLoginPage = pathname === "/admin";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="pl-56">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <h1 className="text-base font-semibold text-slate-900">
            Admin Panel
          </h1>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Logout
          </button>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
