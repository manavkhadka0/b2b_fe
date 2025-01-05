import { BDSServiceCategoryResponse } from "@/types/bds-services";
import { BDSServiceResponse } from "@/types/bds-services";
import axios from "axios";

export const fetchBDSData = async () => {
  const response = await axios.get<BDSServiceResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bds/services/`
  );
  return response.data;
};

export const fetchBDSCategory = async () => {
  const response = await axios.get<BDSServiceCategoryResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bds/categories/`
  );
  return response.data;
};
