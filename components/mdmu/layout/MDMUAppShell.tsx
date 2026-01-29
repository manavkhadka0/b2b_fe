"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import MDMUHeader from "@/components/mdmu/layout/header/mdmuheader";
import { MDMUFooter } from "@/components/mdmu/layout/footer/mdmufooter";

export function MDMUAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/mdmu/admin");

  return (
    <>
      {!isAdminRoute && <MDMUHeader />}
      <main>{children}</main>
      {!isAdminRoute && <MDMUFooter />}
    </>
  );
}
