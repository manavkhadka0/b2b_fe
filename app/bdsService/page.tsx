import BDSView from "@/components/bdsService/view/bds-view";
import { fetchBDSCategory } from "@/services/bdsService";
import { fetchBDSData } from "@/services/bdsService";

export default async function BDSViewPage() {
  const bdsData = await fetchBDSData();
  const bdsCategory = await fetchBDSCategory();

  return <BDSView bdsData={bdsData} bdsCategory={bdsCategory} />;
}
