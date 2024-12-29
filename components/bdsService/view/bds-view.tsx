"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "@/components/bdsService/bdsList/bsdHero";
import CategoryTabs from "@/components/bdsService/bdsList/bdsCategory";
import GridSection from "@/components/bdsService/bdsList/bdsGrid";
import BDSHeroSection from "@/components/bdsService/bdsList/bsdHero";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";

const categories = [
  "All",
  "Finance",
  "Meet Your Business Advisors",
  "Energy/ Environmental Services",
];

export default function BDSView() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ratishshakya.pythonanywhere.com/api/bds/services/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const formattedServices = data.results.map((item: any) => ({
          id: item.id,
          category: item.category.name,
          title: item.service,
          company: item.Company_name,
          address: item.address,
          tags: item.tags.map((tag: any) => tag.name),
          description: item.description,
          logo: item.logo,
        }));
        setServices(formattedServices);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer className="space-y-8">
      <BDSHeroSection />

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Grid Section */}
      <GridSection
        services={services}
        activeCategory={activeCategory}
        loading={loading}
        error={error}
      />
    </ResponsiveContainer>
  );
}
