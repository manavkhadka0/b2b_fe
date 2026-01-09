"use client";

import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminEventForm from "@/components/admin/events/AdminEventForm";

export default function AdminCreateEventPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  return <AdminEventForm mode="create" />;
}
