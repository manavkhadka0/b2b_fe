"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getEventBySlug } from "@/services/events";
import { Event } from "@/types/events";
import AdminEventForm from "@/components/admin/events/AdminEventForm";

export default function AdminEditEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventBySlug(params.slug);
        if (!data) {
          setError("Event not found.");
        } else {
          setEvent(data);
        }
      } catch (err) {
        console.error("Failed to load event:", err);
        setError("Failed to load event. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !isChecking) {
      fetchEvent();
    }
  }, [isAuthenticated, isChecking, params.slug]);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 -ml-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <p className="text-sm text-slate-500">Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 -ml-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">Edit event</h2>
          <p className="text-sm text-rose-600">{error ?? "Event not found."}</p>
        </div>
      </div>
    );
  }

  return <AdminEventForm mode="edit" slug={params.slug} initialData={event} />;
}
