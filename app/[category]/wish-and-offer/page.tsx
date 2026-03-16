import React, { Suspense } from "react";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { WishOfferContent } from "../../wishOffer/components/WishOfferContent";

interface Category {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  type: string;
}

interface CategoryResponse {
  results: Category[];
}

async function getCategories(): Promise<Category[]> {
  const productUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/?type=Product`;
  const serviceUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/?type=Service`;

  try {
    const [productRes, serviceRes] = await Promise.all([
      fetch(productUrl, { next: { revalidate: 3600 } }),
      fetch(serviceUrl, { next: { revalidate: 3600 } }),
    ]);

    const productData: CategoryResponse = await productRes.json();
    const serviceData: CategoryResponse = await serviceRes.json();

    return [...(productData.results || []), ...(serviceData.results || [])];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const categories = await getCategories();
  const category = categories.find((c) => slugify(c.name) === params.category);

  if (!category) {
    return {
      title: "Wish and Offer | BiratBazaar",
      description: "Connecting Buyers and Sellers on BiratBazaar",
    };
  }

  const title = `${category.name} Wish and Offer | BiratBazaar`;
  const description = category.description || `Explore ${category.name} wishes and offers. Share your wish, discover offers, and seize the best opportunities on BiratBazaar.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: category.image ? [category.image] : [],
    },
  };
}

export default async function CategoryWishOfferPage({
  params,
}: {
  params: { category: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <WishOfferContent initialCategoryName={params.category} />
    </Suspense>
  );
}
