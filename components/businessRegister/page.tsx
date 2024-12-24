"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import HeaderSection from "@/components/businessRegister/businesslist/businesshero";
import LoadingComponent from "@/components/businessRegister/loading";
import { DataNotFound } from "@/components/sections/errors/data-not-found";
import BusinessCard from "@/components/businessRegister/businesslist/businessGrid";

type BusinessInfo = {
  id: number;
  name: string;
  description: string;
  category: number;
};

export default function BusinessInformationPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await axios.get<{
          count: number;
          next: string | null;
          previous: string | null;
          results: BusinessInfo[];
        }>(
          "https://ratishshakya.pythonanywhere.com/api/business_information/business-information/"
        );
        setBusinessInfo(response.data.results);
      } catch (error) {
        console.error("Failed to fetch business information:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!businessInfo.length) {
    return (
      <DataNotFound
        title="No Business Information Found"
        message="We couldn't find any business information at this time. Please try again later."
      />
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <HeaderSection
          title="Business Information"
          subtitle="Explore key business details and insights for informed decision-making."
        />
        <div className="space-y-6">
          {businessInfo.map((info: BusinessInfo) => (
            <BusinessCard key={info.id} info={info} />
          ))}
        </div>
      </div>
    </div>
  );
}
