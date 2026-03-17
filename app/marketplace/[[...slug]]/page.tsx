import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { WishOfferContent } from "@/app/marketplace/components/WishOfferContent";
import { Metadata } from "next";
import { fetchCategories, slugify } from "@/app/utils/wishOfferServer";

type Props = {
  params: { slug?: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug || [];
  const { productCategories, serviceCategories } = await fetchCategories();
  const allCats = [...productCategories, ...serviceCategories];

  let title = "B2B Marketplace | BiratBazar";
  let description = "Discover and share wishes and offers in our B2B marketplace.";

  let currentSlug = slug;
  let prefix = "";

  if (currentSlug.length > 0) {
    if (currentSlug[0] === "wishes") {
      title = "Marketplace Wishes | BiratBazar";
      description = "Browse business wishes and requirements on BiratBazar.";
      prefix = "wishes";
      currentSlug = currentSlug.slice(1);
    } else if (currentSlug[0] === "offers") {
      title = "Marketplace Offers | BiratBazar";
      description = "Discover business offers and services on BiratBazar.";
      prefix = "offers";
      currentSlug = currentSlug.slice(1);

      if (currentSlug.length > 0) {
        if (currentSlug[0] === "products") {
          title = "Product Offers | BiratBazar";
          prefix += "/products";
          currentSlug = currentSlug.slice(1);
        } else if (currentSlug[0] === "services") {
          title = "Service Offers | BiratBazar";
          prefix += "/services";
          currentSlug = currentSlug.slice(1);
        } else if (currentSlug[0] === "categories") {
          prefix += "/categories";
          currentSlug = currentSlug.slice(1);
        }
      }
    }
  }

 

  if (currentSlug.length > 0) {
    const catSlug = currentSlug[0];
    const category = allCats.find(c => slugify(c.name) === catSlug);

    if (category) {
      if (!prefix) {
        title = `${category.name} | B2B Marketplace`;
      } else {
        title = `${category.name} [${prefix.split('/').pop()?.toUpperCase()}] | BiratBazar`;
      }
      description = `Explore opportunities in ${category.name} on BiratBazar marketplace.`;

      if (currentSlug.length > 1) {
        const subCatSlug = currentSlug[1];
        const subcategory = category.subcategories?.find(
          s => slugify(s.name) === subCatSlug
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

export default function MarketplaceCategoryPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <WishOfferContent slug={params.slug} />
    </Suspense>
  );
}