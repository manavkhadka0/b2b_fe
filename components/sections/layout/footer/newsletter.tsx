"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ResponsiveContainer } from "../../common/responsive-container";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    // Validate email with Zod
    const result = emailSchema.safeParse({ email });

    if (!result.success) {
      toast.error(result.error.errors[0]?.message || "Invalid email address.");
      return;
    }

    setLoading(true); // Set loading to true while submitting
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/apis/newsletter/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to subscribe. Please try again."
        );
      }

      toast("Subscribed Successfully!", {
        description: "You have subscribed to our newsletter.",
      });
      setEmail(""); // Clear the email field on success
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("An error occurred.", {
        description: errorMessage,
      });
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <ResponsiveContainer className="py-10">
      <div className="bg-gradient-to-r from-[#E0F7FF] p-4 rounded-xl overflow-hidden ">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Side */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Subscribe to our Newsletter
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Sign up now to receive offers and information about us and never
              miss an update from B2B!
            </p>
            <form
              onSubmit={handleSubscribe}
              className="bg-white flex items-center justify-center lg:justify-start max-w-md rounded-lg shadow-sm"
            >
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-l-lg px-4 py-3 border-none w-full focus:ring-0 text-gray-700"
                disabled={loading}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#5C67F2] to-[#A77CFF] text-white font-bold text-xl w-14 h-12 flex items-center justify-center rounded-r-lg shadow-lg hover:scale-105 transition-transform"
                disabled={loading}
              >
                {loading ? "..." : "→"}
              </button>
            </form>
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="/newsletter.svg"
              alt="Newsletter Illustration"
              className="w-full max-w-sm lg:max-w-md"
            />
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
}
