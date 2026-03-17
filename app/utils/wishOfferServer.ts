import { Wish, Offer } from "@/types/wish";

export async function fetchWish(id: string): Promise<Wish | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/${id}/`,
      { headers: { Accept: "application/json" }, next: { revalidate: 300 } }
    );
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`Error fetching wish ${id}:`, error);
    return null;
  }
}

export async function fetchOffer(id: string): Promise<Offer | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/offers/${id}/`,
      { headers: { Accept: "application/json" }, next: { revalidate: 300 } }
    );
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`Error fetching offer ${id}:`, error);
    return null;
  }
}

export async function fetchCategories() {
  try {
    const [productRes, serviceRes] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/?type=Product`,
        { headers: { Accept: "application/json" }, next: { revalidate: 3600 } }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/?type=Service`,
        { headers: { Accept: "application/json" }, next: { revalidate: 3600 } }
      ),
    ]);

    const productData = await productRes.json();
    const serviceData = await serviceRes.json();

    return {
      productCategories: productData?.results || [],
      serviceCategories: serviceData?.results || [],
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { productCategories: [], serviceCategories: [] };
  }
}

export const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
