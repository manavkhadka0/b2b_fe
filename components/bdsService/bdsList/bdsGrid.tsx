import { DataNotFound } from "@/components/sections/errors/data-not-found";
import { BDSService } from "@/types/bds-services";

interface GridSectionProps {
  services: BDSService[];
}

export default function BDSGridSection({ services }: GridSectionProps) {
  if (services.length === 0) {
    return (
      <DataNotFound title="No services found" message="No services found" />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => (
        <div
          key={service.id}
          className="p-6 border rounded-lg shadow-md hover:shadow-lg transition"
        >
          <div className="flex items-center space-x-4 mb-4">
            {service.logo ? (
              <img
                src={service.logo}
                alt={`${service.Company_name} Logo`}
                className="w-20 h-20 rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400">
                No Logo
              </div>
            )}
            <div>
              <h2 className="font-bold text-lg">{service.Company_name}</h2>
              <p className="text-sm text-gray-500">{service.address}</p>
            </div>
          </div>
          <h3 className="font-semibold text-xl mb-2">{service.service}</h3>
          <p className="text-gray-600 text-sm mb-4">{service.description}</p>
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-500 text-sm rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div className="flex justify-end">{service.category.name}</div>
        </div>
      ))}
    </div>
  );
}
