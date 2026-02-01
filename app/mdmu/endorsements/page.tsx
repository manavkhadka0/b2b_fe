"use client";

import { useEffect, useState } from "react";
import LogoGrid from "@/components/mdmu/mdmu/components/logo/logo-gallery";
import {
  LogoItem,
  CompanyLogoResponse,
} from "@/components/mdmu/mdmu/components/types";
import { API_ENDPOINTS } from "@/components/mdmu/mdmu/components/mdmu-form/constants";
import axios from "axios";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading logos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Logos
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (logos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 relative inline-block">
                Champions of Domestic Pride
                <div className="relative mt-4">
                  <img
                    src="/Rectangle.svg"
                    alt="decorative underline"
                    className="absolute left-1/2 -translate-x-1/2 transform scale-110 w-full h-8"
                  />
                </div>
              </h1>
              <p className="text-lg text-gray-600 mt-6">
                Discover the diverse range of companies proudly displaying the{" "}
                <span className="font-semibold text-blue-600">
                  &quot;Mero Desh Merai Utpadan&quot;
                </span>{" "}
                logo, showcasing their commitment to Nepali products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Gallery Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <LogoGrid logos={logos} />
        </div>
      </section>
    </div>
  );
}
