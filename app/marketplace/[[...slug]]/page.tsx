import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { WishOfferContent } from "@/app/marketplace/components/WishOfferContent";
import { Metadata } from "next";
import { fetchCategories, slugify } from "@/app/utils/wishOfferServer";
import { parseMarketplaceSlug } from "@/app/utils/wishOffer";

type Props = {
  params: { slug?: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug || [];
  const { type, catType, eventSlug, categorySlug, subcategorySlug } = parseMarketplaceSlug(slug);
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

  return {
    title,
    description,
  };
}

export default async function MarketplaceCategoryPage({ params }: Props) {
  const slug = params.slug || [];
  const { type, catType, eventSlug, categorySlug, subcategorySlug } = parseMarketplaceSlug(slug);

  let initialCategoryId: number | null = null;
  let initialSubcategoryId: number | null = null;
  let serverProductCategories: any[] = [];
  let serverServiceCategories: any[] = [];

  if (categorySlug) {
    const { productCategories, serviceCategories } = await fetchCategories();
    serverProductCategories = productCategories;
    serverServiceCategories = serviceCategories;
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
  } else {
    // Also fetch categories if no slug, to prevent flickering "All Industries" section
    const { productCategories, serviceCategories } = await fetchCategories();
    serverProductCategories = productCategories;
    serverServiceCategories = serviceCategories;
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <WishOfferContent
        slug={slug}
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
    </Suspense>
  );
}