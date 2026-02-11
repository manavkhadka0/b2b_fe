"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GraduateRosterForm } from "@/components/jobs/roster/GraduateRosterForm";
import { getGraduate, updateGraduate } from "@/services/graduates";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import type { GraduateRoster } from "@/types/graduate-roster";

export default function RosterEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id ? Number(params.id) : null;
  const { user, isLoading: authLoading } = useAuth();
  const [graduate, setGraduate] = useState<GraduateRoster | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.username) return;
    if (!id || isNaN(id)) {
      setLoading(false);
      return;
    }
    getGraduate(id)
      .then(setGraduate)
      .catch((err) => {
        console.error(err);
        setGraduate(null);
      })
      .finally(() => setLoading(false));
  }, [user?.username, id]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?returnTo=/jobs/roster/create/${id}`);
    }
  }, [authLoading, user, router, id]);

  const handleSubmit = async (
    payload: Parameters<typeof updateGraduate>[1],
  ) => {
    if (!id || isNaN(id)) return;
    try {
      await updateGraduate(id, payload);
      toast.success("Graduate updated.");
      router.push("/jobs/roster");
    } catch (err) {
      console.error("Update graduate error:", err);
      const data = (err as { response?: { data?: Record<string, unknown> } })
        ?.response?.data;
      if (data && typeof data === "object") {
        const msgs = Object.entries(data)
          .map(([k, v]) => (Array.isArray(v) ? v.join(" ") : String(v)))
          .filter(Boolean);
        if (msgs.length) toast.error(msgs.join(" "));
        else toast.error("Failed to update. Please try again.");
      } else {
        toast.error("Failed to update. Please try again.");
      }
      throw err;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (!graduate) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <p className="text-slate-600">Graduate not found.</p>
        <Link
          href="/jobs/roster"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Back to roster
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 min-h-screen">
      <div className="mb-6">
        <Link
          href="/jobs/roster"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to roster
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Edit graduate</h1>
        <p className="text-slate-600 text-sm mt-1">
          Update graduate details in your roster.
        </p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <GraduateRosterForm
          defaultInstituteId={
            typeof graduate.institute === "object" && graduate.institute
              ? graduate.institute.id
              : graduate.institute
          }
          defaultValues={graduate}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
