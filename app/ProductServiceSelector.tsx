import React, { useState, useEffect } from "react";
import axios from "axios";

type Product = {
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

type ProductResponse = {
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

async function createProduct(newProduct: {
  name: string;
  hs_code: string;
  description: string;
  category: number;
}): Promise<void> {
  const url =
    "https://ratishshakya.pythonanywhere.com/api/wish_and_offers/products/";

  try {
    await axios.post(url, newProduct, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    alert("Product created successfully!");
  } catch (error) {
    console.error("Failed to create product:", error);
    alert("Failed to create product. Please try again.");
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
  };

  const handleCustomInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomInput(event.target.value);
    setSelectedItem("");
  };

  const handleNewProductChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleNewProductSubmit = async () => {
    if (
      !newProduct.name ||
      !newProduct.hs_code ||
      !newProduct.description ||
      !newProduct.category
    ) {
      alert("Please fill out all fields.");
      return;
    }

    await createProduct({
      name: newProduct.name,
      hs_code: newProduct.hs_code,
      description: newProduct.description,
      category: parseInt(newProduct.category, 10),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">
          {wishType === "Product" ? "Product Form" : "Service Form"}
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div>
            {/* Instructional Message */}
            <p className="text-gray-700 mb-4">
              If you have a wished {wishType.toLowerCase()}, please select it
              from the dropdown below. Otherwise, you can create your own{" "}
              {wishType.toLowerCase()} by filling out the form.
            </p>

            {/* Dropdown to Select Product/Service */}
            <div>
              <select
                className="w-full p-2 border rounded-md mb-2"
                onChange={handleDropdownChange}
                value={selectedItem}
              >
                <option value="" disabled>
                  Select a {wishType}
                </option>
                {items.length > 0 ? (
                  items.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No {wishType.toLowerCase()} available
                  </option>
                )}
              </select>
            </div>

            {/* Form Fields */}
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Product Name or Custom Input"
              value={selectedItem || customInput}
              onChange={(e) => {
                if (!selectedItem) {
                  setCustomInput(e.target.value);
                  handleNewProductChange(e);
                }
              }}
              disabled={!!selectedItem} // Disable if a product is selected
            />
            <select
              name="category"
              className="w-full p-2 border rounded-md mb-2"
              value={newProduct.category}
              onChange={handleNewProductChange}
              disabled={!!selectedItem} // Disable if a product is selected
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
            <input
              type="text"
              name="hs_code"
              className="w-full p-2 border rounded-md mb-2"
              placeholder="HS Code"
              value={newProduct.hs_code}
              onChange={handleNewProductChange}
              disabled={!!selectedItem} // Disable if a product is selected
            />
            <textarea
              name="description"
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Description"
              value={newProduct.description}
              onChange={handleNewProductChange}
              disabled={!!selectedItem} // Disable if a product is selected
            />

            {/* Action Buttons */}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => {
                  if (selectedItem) {
                    onSelect(selectedItem); // Trigger selection callback
                    onClose();
                  } else {
                    handleNewProductSubmit(); // Submit new product form
                  }
                }}
                disabled={
                  !selectedItem &&
                  (!newProduct.name ||
                    !newProduct.hs_code ||
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
