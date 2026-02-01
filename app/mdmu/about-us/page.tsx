"use client";

import About from "@/components/mdmu/mdmu/about";
import { Advantage } from "@/components/mdmu/mdmu/advantage";
import LogoCarousel from "@/components/mdmu/mdmu/components/logo/logo-carousel";
import {
  CompanyLogo,
  CompanyLogoResponse,
} from "@/components/mdmu/mdmu/components/types";
import Contact from "@/components/mdmu/mdmu/contact";
import useSWR from "swr";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/mdmu/company-logo/`;

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  const data: CompanyLogoResponse = await response.json();
  return data.results || [];
};

export default function AboutUsPage() {
  const { data: logos = [] } = useSWR<CompanyLogo[]>(API_URL, fetcher);

  return (
    <>
      <About />
      {logos.length > 0 && (
        <LogoCarousel
          logos={logos.map((logo) => ({
            id: logo.id,
            name: logo.name,
            url: logo.logo,
          }))}
        />
      )}
      <Advantage />
      <Contact />
    </>
  );
}
