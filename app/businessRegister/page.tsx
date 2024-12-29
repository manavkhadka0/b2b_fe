import BusinessInformationPage from "@/components/businessRegister/page";
import { BusinessInfo } from "@/types/business-registration";
import axios from "axios";

const fetchBusinessInformation = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/business_information/business-information/`
  );
  return response.json();
};

export default async function BusinessRegisterPage() {
  const businessInformation = await fetchBusinessInformation();

  return <BusinessInformationPage businessInformation={businessInformation} />;
}
