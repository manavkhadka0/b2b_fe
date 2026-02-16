"use client";

import { ReactNode } from "react";
import MDMUHeader from "@/components/mdmu/layout/header/mdmuheader";
import { MDMUFooter } from "@/components/mdmu/layout/footer/mdmufooter";

export function MDMUAppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <MDMUHeader />
      <main>{children}</main>
      <MDMUFooter />
    </>
  );
}
