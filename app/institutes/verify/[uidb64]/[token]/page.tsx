"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { verifyInstituteEmail } from "@/services/institute";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Deduplicate verify calls across React strict-mode remounts (dev).
const verifyRequestCache = new Map<
  string,
  Promise<{ success: boolean; message?: string }>
>();

export default function InstituteVerifyPage() {
  const params = useParams();
  const uidb64 = params.uidb64 as string;
  const token = params.token as string;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!uidb64 || !token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }
    let cancelled = false;
    const key = `${uidb64}:${token}`;
    let req = verifyRequestCache.get(key);
    if (!req) {
      req = verifyInstituteEmail(uidb64, token);
      verifyRequestCache.set(key, req);
    }

    req
      .then((result) => {
        if (cancelled) return;
        if (result.success) {
          setStatus("success");
          if (result.message) setMessage(result.message);
        } else {
          setStatus("error");
          setMessage(result.message || "Verification failed.");
          // Allow retry on next visit if it failed
          verifyRequestCache.delete(key);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setMessage(err?.message || "Verification failed.");
        verifyRequestCache.delete(key);
      });
    return () => {
      cancelled = true;
    };
  }, [uidb64, token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <h1 className="text-lg font-semibold text-gray-900">
              Verifying your email...
            </h1>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-lg font-semibold text-gray-900 mb-2">
              Email verified
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              {message || "Your institute email has been verified. You can now use the roster and other features."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/jobs/roster">Go to Roster</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
            </div>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-lg font-semibold text-gray-900 mb-2">
              Verification failed
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              {message || "This link may be invalid or expired."}
            </p>
            <Button asChild>
              <Link href="/jobs/roster">Go to Roster</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
