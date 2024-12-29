import { ResponsiveContainer } from "@/components/sections/common/responsive-container";

interface Service {
  id: number;
  category: string;
  title: string;
  company: string;
  address: string;
  tags: string[];
  description: string;
  logo: string | null;
}

interface GridSectionProps {
  services: Service[];
  activeCategory: string;
  loading: boolean;
  error: string | null;
}

export default function BDSGridSection({
  services,
  activeCategory,
  loading,
  error,
}: GridSectionProps) {
  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((service) => service.category === activeCategory);

  if (loading) {
    return <p>Loading services...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (filteredServices.length === 0) {
    return <p>No services available for the selected category.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredServices.map((service) => (
        <div
          key={service.id}
          className="p-6 border rounded-lg shadow-md hover:shadow-lg transition"
        >
          <div className="flex items-center space-x-4 mb-4">
            {service.logo ? (
              <img
                src={service.logo}
                alt={`${service.company} Logo`}
                className="w-20 h-20 rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400">
                No Logo
              </div>
            )}
            <div>
              <h2 className="font-bold text-lg">{service.company}</h2>
              <p className="text-sm text-gray-500">{service.address}</p>
            </div>
          </div>
          <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{service.description}</p>
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-500 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
