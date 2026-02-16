import { ReactNode } from "react";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminAuthProvider>
  );
}
