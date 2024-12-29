import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";

// Define the types for the product response
export type Product = {
  id: number;
  name: string;
  hs_code: string;
  description: string;
  image: string | null;
  category: {
    id: number;
    name: string;
    description: string;
    image: string | null;
  };
};

export type ProductResponse = {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
};

type Category = {
  id: number;
  name: string;
};

async function getProducts(wishType: string): Promise<Product[]> {
  const url =
    wishType === "Product"
      ? "https://ratishshakya.pythonanywhere.com/api/wish_and_offers/products/"
      : "https://ratishshakya.pythonanywhere.com/api/wish_and_offers/services/";

  try {
    const response = await axios.get<ProductResponse>(url, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data.results || [];
  } catch (error) {
    console.error(`Failed to fetch ${wishType.toLowerCase()}s:`, error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  const url =
    "https://ratishshakya.pythonanywhere.com/api/wish_and_offers/categories/";

  try {
    const response = await axios.get<{ results: Category[] }>(url, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

async function createProduct(
  newProduct: {
    name: string;
    hs_code: string;
    description: string;
    category: number;
  },
  apiUrl: string
): Promise<void> {
  try {
    await axios.post(apiUrl, newProduct, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    alert("Created successfully!");
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      console.error("Failed to create:", error);
      throw { message: "Failed to create. Please try again." };
    }
  }
}

interface ProductServiceSelectorProps {
  onClose: () => void;
  onSelect: (selectedItem: string) => void;
  wishType: string;
}

const ProductServiceSelector: React.FC<ProductServiceSelectorProps> = ({
  onClose,
  onSelect,
  wishType,
}) => {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [newProduct, setNewProduct] = useState({
    name: "",
    hs_code: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [products, categoryList] = await Promise.all([
        getProducts(wishType),
        getCategories(),
      ]);
      setItems(products);
      setCategories(categoryList);
      setLoading(false);
    };

    fetchData();
  }, [wishType]);

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedItem(event.target.value);
    setCustomInput("");
    setErrors({});
  };
  const productSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    hs_code: z
      .string()
      .min(1, { message: "HS Code is required for products." })
      .optional()
      .refine((hs_code) => /^[0-9]+$/.test(hs_code || ""), {
        message: "HS Code must be numeric.",
      }),
    description: z.string().min(1, { message: "Description is required." }),
    category: z.string().min(1, { message: "Category is required." }),
  });

  const handleNewProductChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNewProductSubmit = async () => {
    const apiUrl =
      wishType === "Product"
        ? "https://ratishshakya.pythonanywhere.com/api/wish_and_offers/products/"
        : "https://ratishshakya.pythonanywhere.com/api/wish_and_offers/services/";

    try {
      if (
        !newProduct.name ||
        (!newProduct.hs_code && wishType === "Product") ||
        !newProduct.description ||
        !newProduct.category
      ) {
        const newErrors: Record<string, string> = {};
        if (!newProduct.name) newErrors.name = "Name is required.";
        if (!newProduct.hs_code && wishType === "Product")
          newErrors.hs_code = "HS Code is required for products.";
        if (!newProduct.description)
          newErrors.description = "Description is required.";
        if (!newProduct.category) newErrors.category = "Category is required.";
        setErrors(newErrors);
        return;
      }

      await createProduct(
        {
          name: newProduct.name,
          hs_code: newProduct.hs_code,
          description: newProduct.description,
          category: parseInt(newProduct.category, 10),
        },
        apiUrl
      );
      onClose();
    } catch (error) {
      // if (error.hs_code) {
      //   setErrors((prev) => ({ ...prev, hs_code: error.hs_code[0] }));
      // }
      // if (error.name) {
      //   setErrors((prev) => ({ ...prev, name: error.name[0] }));
      // }
      // if (error.description) {
      //   setErrors((prev) => ({ ...prev, description: error.description[0] }));
      // }
      // if (error.category) {
      //   setErrors((prev) => ({ ...prev, category: error.category[0] }));
      // }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full">
        <h2 className="text-2xl font-extrabold text-purple-700 mb-6 text-center">
          {wishType === "Product" ? "Create Product" : "Create Service"}
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-6 text-center">
              {`Have a ${wishType.toLowerCase()} in mind? Select it below or create a new one.`}
            </p>

            {/* Dropdown */}
            <div className="mb-6">
              <select
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-purple-300"
                onChange={handleDropdownChange}
                value={selectedItem}
                disabled={items.length === 0}
              >
                <option value="" disabled>
                  {items.length > 0
                    ? `Select a ${wishType}`
                    : `No ${wishType.toLowerCase()} available`}
                </option>
                {items.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-purple-300"
                placeholder={`${wishType} Name or Custom Input`}
                value={selectedItem || customInput}
                onChange={(e) => {
                  if (!selectedItem) {
                    setCustomInput(e.target.value);
                    handleNewProductChange(e);
                  }
                }}
                disabled={!!selectedItem}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2">{errors.name}</p>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="mb-6">
              <select
                name="category"
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-purple-300"
                value={newProduct.category}
                onChange={handleNewProductChange}
                disabled={!!selectedItem}
              >
                <option value="" disabled>
                  Select a Category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-2">{errors.category}</p>
              )}
            </div>

            {/* HS Code Input (if Product) */}
            {wishType === "Product" && (
              <div className="mb-6">
                <input
                  type="text"
                  name="hs_code"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-purple-300"
                  placeholder="HS Code"
                  value={newProduct.hs_code}
                  onChange={handleNewProductChange}
                  disabled={!!selectedItem}
                />
                {errors.hs_code && (
                  <p className="text-red-500 text-sm mt-2">{errors.hs_code}</p>
                )}
              </div>
            )}

            {/* Description Textarea */}
            <div className="mb-6">
              <textarea
                name="description"
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-purple-300"
                placeholder="Description"
                value={newProduct.description}
                onChange={handleNewProductChange}
                disabled={!!selectedItem}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                className="w-1/3 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-2/3 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                onClick={() => {
                  if (selectedItem) {
                    onSelect(selectedItem);
                    onClose();
                  } else {
                    handleNewProductSubmit();
                  }
                }}
                disabled={
                  !selectedItem &&
                  (!newProduct.name ||
                    (!newProduct.hs_code && wishType === "Product") ||
                    !newProduct.description ||
                    !newProduct.category)
                }
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductServiceSelector;
