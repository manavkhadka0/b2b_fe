"use client";

import { useEffect, useState } from "react";
import LogoSlideshow from "@/components/mdmu/mdmu/components/logo/logo-slideshow";
import {
  LogoItem,
  CompanyLogoResponse,
} from "@/components/mdmu/mdmu/components/types";
import { API_ENDPOINTS } from "@/components/mdmu/mdmu/components/mdmu-form/constants";
import axios from "axios";
import Image from "next/image";

export default function LogosPage() {
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINTS.companyLogo}`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch logos");
        }

        const data: CompanyLogoResponse = response.data;

        // Transform API response to LogoItem format
        const transformedLogos: LogoItem[] = data.results.map((logo) => ({
          id: logo.id,
          name: logo.name,
          url: logo.logo,
        }));

        setLogos(transformedLogos);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching logos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-xl font-medium">Loading logos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Logos
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (logos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Logos Available
          </h2>
          <p className="text-gray-600">
            There are currently no company logos to display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="py-16 md:py-10">
        <div className="container mx-auto ">
          <Image
            src="/mdmu-logo.png"
            alt=""
            width={200}
            height={200}
            className="mx-auto"
          />
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold  text-gray-800 relative inline-block">
                Champions of Domestic Pride
                <div className="relative mt-4">
                  <img
                    src="/Rectangle.svg"
                    alt="decorative underline"
                    className="absolute left-1/2 -translate-x-1/2 transform scale-110 w-full h-8"
                  />
                </div>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Slideshow Section */}
      <section className="py-12 md:py-16">
        <LogoSlideshow logos={logos} slideInterval={5000} />
      </section>
    </div>
  );
}
