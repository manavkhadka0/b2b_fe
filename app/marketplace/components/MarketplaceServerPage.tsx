import React from "react";
import { WishOfferContent } from "@/app/marketplace/components/WishOfferContent";
import { Metadata } from "next";
import { fetchCategories, slugify } from "@/app/utils/wishOfferServer";
import { parseMarketplaceSlug } from "@/app/utils/wishOffer";
import { getEventBySlug } from "@/services/events";

type Props = {
  params: { slug?: string[] };
  basePath?: string[]; // To handle explicit routes
};

export async function generateMarketplaceMetadata({ params, basePath = [] }: Props): Promise<Metadata> {
  // Combine basePath with params.slug to get the full slug
  const fullSlug = [...basePath, ...(params.slug || [])];
  const { type, catType, eventSlug, categorySlug, subcategorySlug } = parseMarketplaceSlug(fullSlug);
  const { productCategories, serviceCategories } = await fetchCategories();
  const allCats = [...productCategories, ...serviceCategories];

  let title = "B2B Marketplace | BiratBazar";
  let description = "Discover and share wishes and offers in our B2B marketplace.";

  if (type === "WISH") {
    title = "Marketplace Wishes | BiratBazar";
    description = "Browse business wishes and requirements on BiratBazar.";
  } else if (type === "OFFER") {
    title = "Marketplace Offers | BiratBazar";
    description = "Discover business offers and services on BiratBazar.";
    if (catType === "Product") title = "Product Offers | BiratBazar";
    if (catType === "Service") title = "Service Offers | BiratBazar";
  }

  if (categorySlug) {
    const category = allCats.find(c => slugify(c.name) === categorySlug);
    if (category) {
      title = `${category.name} | BiratBazar`;
      description = `Explore opportunities in ${category.name} on BiratBazar marketplace.`;

      if (subcategorySlug) {
        const subcategory = category.subcategories?.find(
          s => slugify(s.name) === subcategorySlug
        );

        if (subcategory) {
          title = `${subcategory.name} in ${category.name} | BiratBazar`;
          description = `Find specialized ${subcategory.name} opportunities within ${category.name}.`;
        }
      }
    }
  }

  if (eventSlug) {
    const event = await getEventBySlug(eventSlug);
    if (event) {
      title = `${event.title} | BiratBazar`;
      description = `Explore networking opportunities and B2B matches for ${event.title}.`;
    }
  }

  return {
    title,
    description,
  };
}

export default async function MarketplaceServerPage({ params, basePath = [] }: Props) {
  const fullSlug = [...basePath, ...(params.slug || [])];
  const { type, catType, eventSlug, categorySlug, subcategorySlug } = parseMarketplaceSlug(fullSlug);

  let initialCategoryId: number | null = null;
  let initialSubcategoryId: number | null = null;
  let serverProductCategories: any[] = [];
  let serverServiceCategories: any[] = [];

  const { productCategories, serviceCategories } = await fetchCategories();
  serverProductCategories = productCategories;
  serverServiceCategories = serviceCategories;
  
  if (categorySlug) {
    const allCats = [...productCategories, ...serviceCategories];
    const category = allCats.find((c) => slugify(c.name) === categorySlug);
    
    if (category) {
      initialCategoryId = category.id;
      if (subcategorySlug) {
        const subcategory = category.subcategories?.find(
          (s) => slugify(s.name) === subcategorySlug
        );
        if (subcategory) {
          initialSubcategoryId = subcategory.id;
        }
      }
    }
  }

  return (
    <WishOfferContent
      slug={fullSlug}
      initialType={type}
      initialCategoryType={catType}
      initialCategoryId={initialCategoryId}
      initialSubcategoryId={initialSubcategoryId}
      initialCategoryName={categorySlug}
      initialSubcategoryName={subcategorySlug}
      initialEventSlug={eventSlug}
      initialProductCategories={serverProductCategories}
      initialServiceCategories={serverServiceCategories}
    />
  );
}
