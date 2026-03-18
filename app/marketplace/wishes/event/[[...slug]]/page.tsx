import MarketplaceServerPage, { generateMarketplaceMetadata } from "@/app/marketplace/components/MarketplaceServerPage";
import { Metadata } from "next";

type Props = {
  params: { slug?: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateMarketplaceMetadata({ params, basePath: ["wishes", "event"] });
}

export default async function WishesEventPage({ params }: Props) {
  return <MarketplaceServerPage params={params} basePath={["wishes", "event"]} />;
}
