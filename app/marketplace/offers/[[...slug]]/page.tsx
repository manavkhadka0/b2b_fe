import MarketplaceServerPage, { generateMarketplaceMetadata } from "@/app/marketplace/components/MarketplaceServerPage";
import { Metadata } from "next";

type Props = {
  params: { slug?: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateMarketplaceMetadata({ params, basePath: ["offers"] });
}

export default async function OffersPage({ params }: Props) {
  return <MarketplaceServerPage params={params} basePath={["offers"]} />;
}
