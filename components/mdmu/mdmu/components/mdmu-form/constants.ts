import { Award, Shield } from "lucide-react";

import { FileCheck } from "lucide-react";

export const API_BASE_URL = "https://cim.baliyoventures.com/api";

export const API_ENDPOINTS = {
  categories: `${API_BASE_URL}/mdmu/nature-of-industry-category/`,
  subCategories: `${API_BASE_URL}/mdmu/nature-of-industry-sub-category/`,
  register: `${API_BASE_URL}/mdmu/mero-desh-merai-utpadan/`,
  companyLogo: `${API_BASE_URL}/mdmu/company-logo/`,
};

export const MARKET_CHOICES = [
  { value: "Domestic", label: "Domestic Market" },
  { value: "International", label: "International Market" },
  { value: "Both", label: "Both Markets" },
] as const;

export const RAW_MATERIAL_CHOICES = [
  { value: "Local", label: "Local Sources" },
  { value: "International", label: "International Sources" },
  { value: "Both", label: "Both Sources" },
] as const;

export const PROVINCE_CHOICES = [
  { value: "Koshi", label: "Koshi" },
  { value: "Bagmati", label: "Bagmati" },
  { value: "Gandaki", label: "Gandaki" },
  { value: "Lumbini", label: "Lumbini" },
  { value: "Karnali", label: "Karnali" },
  { value: "Madhesh", label: "Madhesh" },
  { value: "Sudurpashchim", label: "Sudurpashchim" },
] as const;

export const formSteps = [
  {
    id: 1,
    title: "Company Information",
    description: "Basic details about your company",
  },
  {
    id: 2,
    title: "Contact Details",
    description: "Your contact information",
  },
  {
    id: 3,
    title: "Business Details",
    description: "Information about your business operations",
  },
  {
    id: 4,
    title: "Additional Information",
    description: "Other important details",
  },
  {
    id: 5,
    title: "Review Step",
    description: "Review your application",
  },
] as const;

export const applicationBenefits = [
  {
    icon: FileCheck,
    title: "Official Recognition",
    description: "Get certified recognition for your domestic products",
  },
  {
    icon: Shield,
    title: "Build Trust",
    description: "Enhance customer confidence in your products",
  },
  {
    icon: Award,
    title: "Quality Standard",
    description: "Join a network of quality-focused producers",
  },
];
