import { MapPin } from "lucide-react";

const districts = [
  {
    name: "Taplejung",
    image: "taplejung.jpg", // Kanchenjunga
  },
  {
    name: "Panchthar",
    image: "panchthar.jpg", // Panchthar
  },
  {
    name: "Ilam",
    image: "ilam.jpg", // Ilam Tea Garden
  },
  {
    name: "Jhapa",
    image: "jhapa.jpg", // Jhapa
  },
  {
    name: "Morang",
    image: "morang.jpeg", // Morang
  },
  {
    name: "Sunsari",
    image: "sunsari.jpg", // Koshi Barrage
  },
  {
    name: "Dhankuta",
    image: "dhankuta.jpg", // Dhankuta
  },
  {
    name: "Terhathum",
    image: "ilam.jpg", // Terhathum
  },
  {
    name: "Sankhuwasabha",
    image: "morang.jpeg", // Makalu Base Camp
  },
  {
    name: "Bhojpur",
    image: "sunsari.jpg", // Bhojpur Village
  },
  {
    name: "Solukhumbu",
    image: "panchthar.jpg", // Mount Everest
  },
  {
    name: "Okhaldhunga",
    image: "jhapa.jpg", // Okhaldhunga Hills
  },
  {
    name: "Khotang",
    image: "dhankuta.jpg", // Khotang
  },
  {
    name: "Udayapur",
    image: "panchthar.jpg", // Udayapur
  },
];

export function B2BNetworking() {
  return (
    <div className="container px-4 py-12 mx-auto">
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
          className="flex overflow-x-auto gap-4 scroll-smooth no-scrollbar"
        >
          {districts.map((district) => (
            <div
              key={district.name}
              className="relative shrink-0 w-36 h-44 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
            >
              {/* Image */}
              <img
                src={district.image}
                alt={district.name}
                className="w-full h-full object-cover"
              />
              {/* Overlay Text with Icon */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-center p-2 flex items-center justify-center gap-1">
                <MapPin size={16} className="inline-block text-white" />
                <span className="text-sm font-medium">{district.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
