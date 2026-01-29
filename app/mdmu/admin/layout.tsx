"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MDMUAdminAuthProvider,
  useMDMUAdminAuth,
} from "@/contexts/MDMUAdminAuthContext";

function MDMUAdminHeaderNav() {
  const pathname = usePathname();

  const linkBaseClasses =
    "text-sm font-medium px-3 py-1.5 rounded-md transition-colors";

  return (
    <nav className="flex items-center gap-2 flex-wrap">
      <Link
        href="/mdmu/admin"
        className={`${linkBaseClasses} ${
          pathname?.startsWith("/mdmu/admin") &&
          !pathname?.startsWith("/mdmu/admin/logos")
            ? "bg-sky-100 text-sky-700"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        Applications
      </Link>
      <Link
        href="/mdmu/admin/logos"
        className={`${linkBaseClasses} ${
          pathname === "/mdmu/admin/logos"
            ? "bg-sky-100 text-sky-700"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        Logos
      </Link>
    </nav>
  );
}

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { logout } = useMDMUAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/mdmu/admin/login";

  const handleLogout = () => {
    logout();
    router.push("/mdmu/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!isLoginPage && (
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                MDMU Admin Panel
              </h1>
              <p className="text-xs text-slate-500">
                Internal tools for managing MDMU applications &amp; logos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MDMUAdminHeaderNav />
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="ml-2"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <MDMUAdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </MDMUAdminAuthProvider>
  );
}
