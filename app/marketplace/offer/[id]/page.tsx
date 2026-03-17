import { Metadata } from "next";
import { fetchOffer } from "@/app/utils/wishOfferServer";
import OfferDetailClient from "./OfferDetailClient";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const offer = await fetchOffer(params.id);

  if (!offer) {
    return {
      title: "Offer Not Found | BiratBazar",
    };
  }

  const title = `${offer.title} | BiratBazar`;
  const description = offer.description || `View details for ${offer.title} on BiratBazar marketplace.`;

  return {
    title,
    description,

  };
}

export default function OfferDetailPage({ params }: Props) {
  return <OfferDetailClient id={params.id} />;
}
