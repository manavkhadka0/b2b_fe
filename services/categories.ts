import { api } from "@/lib/api";
import type {
  Category,
  CategoryResponse,
  SubCategory,
  SubCategoryResponse,
  Service,
  ServiceResponse,
} from "@/types/create-wish-type";

// Category CRUD operations
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await api.get<CategoryResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/`,
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
}

export async function getCategoriesPaginated(
  page?: number,
): Promise<CategoryResponse> {
  try {
    const params = new URLSearchParams();
    if (page != null && page > 1) params.set("page", String(page));
    const query = params.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/${query ? `?${query}` : ""}`;
    const response = await api.get<CategoryResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
}

export async function getCategoryById(id: number): Promise<Category> {
  try {
    const response = await api.get<Category>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/${id}/`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch category with id ${id}:`, error);
    throw error;
  }
}

export async function createCategory(data: {
  name: string;
  description: string;
  type: string;
  image?: File | null;
}): Promise<Category> {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("type", data.type);
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.post<Category>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create category:", error);
    throw error;
  }
}

export async function updateCategory(
  id: number,
  data: {
    name?: string;
    description?: string;
    type?: string;
    image?: File | null;
  },
): Promise<Category> {
  try {
    const formData = new FormData();
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.description !== undefined)
      formData.append("description", data.description);
    if (data.type !== undefined) formData.append("type", data.type);
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.patch<Category>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update category with id ${id}:`, error);
    throw error;
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    await api.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/${id}/`,
    );
  } catch (error) {
    console.error(`Failed to delete category with id ${id}:`, error);
    throw error;
  }
}

// SubCategory CRUD operations
export async function getSubCategories(
  categoryId?: number,
): Promise<SubCategory[]> {
  try {
    const url = categoryId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/sub-categories/?category=${categoryId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/sub-categories/`;
    const response = await api.get<SubCategoryResponse>(url);
    return response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch subcategories:", error);
    throw error;
  }
}

export async function getSubCategoriesPaginated(
  categoryId?: number,
  page?: number,
): Promise<SubCategoryResponse> {
  try {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", String(categoryId));
    if (page != null && page > 1) params.set("page", String(page));
    const query = params.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/sub-categories/${query ? `?${query}` : ""}`;
    const response = await api.get<SubCategoryResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch subcategories:", error);
    throw error;
  }
}

export async function getSubCategoryById(id: number): Promise<SubCategory> {
  try {
    const response = await api.get<SubCategory>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/sub-categories/${id}/`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch subcategory with id ${id}:`, error);
    throw error;
  }
}

export async function createSubCategory(data: {
  name: string;
  example_items: string;
  reference: string;
  category: number;
  image?: File | null;
}): Promise<SubCategory> {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("example_items", data.example_items);
    formData.append("reference", data.reference);
    formData.append("category", data.category.toString());
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.post<SubCategory>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/sub-categories/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create subcategory:", error);
    throw error;
  }
}

export async function updateSubCategory(
  id: number,
  data: {
    name?: string;
    example_items?: string;
    reference?: string;
    category?: number;
    image?: File | null;
  },
): Promise<SubCategory> {
  try {
    const formData = new FormData();
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.example_items !== undefined)
      formData.append("example_items", data.example_items);
    if (data.reference !== undefined)
      formData.append("reference", data.reference);
    if (data.category !== undefined)
      formData.append("category", data.category.toString());
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.patch<SubCategory>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/sub-categories/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update subcategory with id ${id}:`, error);
    throw error;
  }
}

export async function deleteSubCategory(id: number): Promise<void> {
  try {
    await api.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/sub-categories/${id}/`,
    );
  } catch (error) {
    console.error(`Failed to delete subcategory with id ${id}:`, error);
    throw error;
  }
}

// Service CRUD operations
export async function getServices(
  subCategoryId?: number,
  page?: number,
): Promise<ServiceResponse> {
  try {
    const params: Record<string, string | number> = {};
    if (subCategoryId) params.SubCategory = subCategoryId;
    if (page) params.page = page;

    const query = new URLSearchParams(
      params as Record<string, string>,
    ).toString();

    const url = query
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/services/?${query}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/services/`;

    const response = await api.get<ServiceResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    throw error;
  }
}

export async function getServiceById(id: number): Promise<Service> {
  try {
    const response = await api.get<Service>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/services/${id}/`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch service with id ${id}:`, error);
    throw error;
  }
}

export async function createService(data: {
  name: string;
  SubCategory: number;
}): Promise<Service> {
  try {
    const response = await api.post<Service>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/services/`,
      {
        name: data.name,
        SubCategory: data.SubCategory,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create service:", error);
    throw error;
  }
}

export async function updateService(
  id: number,
  data: {
    name?: string;
    SubCategory?: number;
  },
): Promise<Service> {
  try {
    const response = await api.patch<Service>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/services/${id}/`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update service with id ${id}:`, error);
    throw error;
  }
}

export async function deleteService(id: number): Promise<void> {
  try {
    await api.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/services/${id}/`,
    );
  } catch (error) {
    console.error(`Failed to delete service with id ${id}:`, error);
    throw error;
  }
}
