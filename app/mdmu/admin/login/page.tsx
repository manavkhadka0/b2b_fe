"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMDMUAdminAuth } from "@/contexts/MDMUAdminAuthContext";

export default function MDMUAdminLoginPage() {
  const { login, isAuthenticated, isChecking } = useMDMUAdminAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated && !isChecking) {
    router.push("/mdmu/admin");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const ok = await login(email.trim(), password);
    setIsSubmitting(false);

    if (!ok) {
      setError("Invalid MDMU admin credentials.");
      return;
    }

    router.push("/mdmu/admin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-center text-2xl font-semibold text-slate-900">
          MDMU Admin Login
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500">
          Sign in to manage MDMU applications and logos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="mdmu-admin-email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="mdmu-admin-email"
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="mdmu@admin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="mdmu-admin-password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="mdmu-admin-password"
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-rose-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
