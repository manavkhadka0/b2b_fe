import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { useState } from "react";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
}) => {
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setIsOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className=" flex lg:hidden items-center justify-between mb-6">
        <div className="text-sm font-medium text-blue-600">
          {activeCategory}
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="flex items-center gap-2 px-4 py-2 text-sm border rounded-full border-blue-300 text-blue-600">
            <Filter size={16} />
            Filter
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[50vh]">
            <div className="flex flex-col gap-2 pt-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-3 text-left rounded-lg transition ${
                    activeCategory === category
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className=" hidden lg:flex space-x-4 mb-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-2 py-2 rounded-full text-sm transition border ${
              activeCategory === category
                ? "bg-blue-100 text-blue-600 border-blue-600"
                : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </>
  );
};

export default CategoryTabs;
