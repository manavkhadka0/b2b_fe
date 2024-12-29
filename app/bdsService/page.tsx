import BDSView from "@/components/bdsService/view/bds-view";
import {
  BDSServiceCategoryResponse,
  BDSServiceResponse,
} from "@/types/bds-services";
import axios from "axios";

const fetchBDSData = async () => {
  const response = await axios.get<BDSServiceResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bds/services/`
  );
  return response.data;
};

const fetchBDSCategory = async () => {
  const response = await axios.get<BDSServiceCategoryResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bds/categories/`
  );
  return response.data;
};

export default async function BDSViewPage() {
  const bdsData = await fetchBDSData();
  const bdsCategory = await fetchBDSCategory();

  return <BDSView bdsData={bdsData} bdsCategory={bdsCategory} />;
}
