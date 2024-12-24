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
  return (
    <div className="flex space-x-4 mb-6 overflow-x-auto">
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
  );
};

export default CategoryTabs;
