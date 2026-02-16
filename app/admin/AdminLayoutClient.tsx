"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Menu } from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/admin/events", label: "Events" },
  { href: "/admin/wishes-offers", label: "Wishes & Offers" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/subcategories", label: "Subcategories" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/experience-zone", label: "Experience Zone" },
] as const;

const SIDEBAR_JOBBRIZE_LINKS = [
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/apprenticeships", label: "Apprenticeships" },
  { href: "/admin/internships", label: "Internships" },
] as const;

const SIDEBAR_MDMU_LINKS = [
  { href: "/admin/mdmu", label: "Applications" },
  { href: "/admin/mdmu/logos", label: "Logos" },
] as const;

function AdminSidebar({
  onNavigate,
  className = "",
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full w-56 flex-col border-r border-slate-200 bg-white ${className}`}
    >
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
              onClick={onNavigate}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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
            Jobbrize
          </p>
          {SIDEBAR_JOBBRIZE_LINKS.map(({ href, label }) => {
            const isActive = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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
                onClick={onNavigate}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: slide-in on mobile, always visible on lg+ */}
      <div
        className={`fixed left-0 top-0 z-50 h-full transition-transform duration-200 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      <div className="min-w-0 pl-0 lg:pl-56">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-center text-base font-semibold text-slate-900 lg:flex-none lg:text-left">
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
        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
