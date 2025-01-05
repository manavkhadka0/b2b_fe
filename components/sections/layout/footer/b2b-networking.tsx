import { MapPin } from "lucide-react";
import { ResponsiveContainer } from "../../common/responsive-container";

const districts = [
  {
    name: "Taplejung",
    image: "/taplejung.jpg", // Kanchenjunga
  },
  {
    name: "Panchthar",
    image: "/panchthar.jpg", // Panchthar
  },
  {
    name: "Ilam",
    image: "/Ilam.jpg", // Ilam Tea Garden
  },
  {
    name: "Jhapa",
    image: "/jhapa.jpg", // Jhapa
  },
  {
    name: "Morang",
    image: "/morang.jpeg", // Morang
  },
  {
    name: "Sunsari",
    image: "/sunsari.jpg", // Koshi Barrage
  },
  {
    name: "Dhankuta",
    image: "/dhankuta.jpg", // Dhankuta
  },
  {
    name: "Terhathum",
    image: "/Ilam.jpg", // Terhathum
  },
  {
    name: "Sankhuwasabha",
    image: "/morang.jpeg", // Makalu Base Camp
  },
  {
    name: "Bhojpur",
    image: "/sunsari.jpg", // Bhojpur Village
  },
  {
    name: "Solukhumbu",
    image: "/panchthar.jpg", // Mount Everest
  },
  {
    name: "Okhaldhunga",
    image: "/jhapa.jpg", // Okhaldhunga Hills
  },
  {
    name: "Khotang",
    image: "/dhankuta.jpg", // Khotang
  },
  {
    name: "Udayapur",
    image: "/panchthar.jpg", // Udayapur
  },
];

export function B2BNetworking() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50">
      <ResponsiveContainer className="py-10">
        {/* District B2B Networking Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            District B2B Networking
          </h2>
          <p className="text-gray-600 mb-4">
            Explore business opportunities in specific districts and regions.
          </p>

          {/* District Images */}
          <div
            id="districts-scroll"
            className="flex cursor-pointer overflow-x-auto gap-4 scroll-smooth no-scrollbar"
          >
            {districts.map((district) => (
              <div
                key={district.name}
                className="relative shrink-0 w-36 h-44 rounded-lg overflow-hidden shadow-md"
              >
                {/* Image wrapper div with hover effect */}
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={district.image}
                    alt={district.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                {/* Overlay Text with Icon */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-center p-2 flex items-center justify-center gap-1">
                  <MapPin size={16} className="inline-block text-white" />
                  <span className="text-sm font-medium">{district.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
