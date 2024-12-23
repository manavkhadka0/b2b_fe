import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the types for the product response
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

// Fetch products from the API
async function getProducts(wishType: string): Promise<Product[]> {
  const url =
    wishType === "Product"
      ? "https://be01-103-156-26-69.ngrok-free.app/api/wish_and_offers/products/"
      : "https://be01-103-156-26-69.ngrok-free.app/api/wish_and_offers/services/";

  try {
    console.log("Fetching data from:", url); // Log the URL being called
    const response = await axios.get<ProductResponse>(url, {
      headers: {
        Accept: "application/json",
      },
    });
    console.log("API Response Data:", response.data); // Log the response data
    return response.data.results || [];
  } catch (error) {
    console.error(`Failed to fetch ${wishType.toLowerCase()}s:`, error);
    return [];
  }
}

// Main Component
interface ProductServiceSelectorProps {
  onClose: () => void;
  onSelect: (selectedItem: string) => void;
  wishType: string; // Determines whether "Product" or "Service" should be displayed
}

const ProductServiceSelector: React.FC<ProductServiceSelectorProps> = ({
  onClose,
  onSelect,
  wishType,
}) => {
  const [items, setItems] = useState<Product[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const products = await getProducts(wishType);
      console.log("Fetched Products:", products); // Log the fetched products
      setItems(products);
      setLoading(false);
    };

    fetchData();
  }, [wishType]);

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedItem(event.target.value);
    setCustomInput(""); // Clear custom input when dropdown is used
  };

  const handleCustomInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomInput(event.target.value);
    setSelectedItem(""); // Clear dropdown selection when typing in input
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">
          Choose {wishType === "Product" ? "Product" : "Service"}
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
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
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder={`Or enter custom ${wishType.toLowerCase()}`}
                value={customInput}
                onChange={handleCustomInputChange}
              />
            </div>
          </>
        )}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const finalSelection = customInput || selectedItem;
              onSelect(finalSelection || "None");
              onClose();
            }}
            disabled={!customInput && !selectedItem}
            className="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductServiceSelector;
