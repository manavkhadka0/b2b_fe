"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const isLoginPage = pathname === "/admin";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-3 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <SidebarTrigger
              className="-ml-1"
              aria-label="Toggle sidebar"
            />
            <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              Admin Panel
            </h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:px-3 sm:py-2 sm:text-sm"
          >
            Logout
          </button>
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8">
          <div className="mx-auto min-w-0 w-full max-w-7xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50">
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </div>
  );
}
