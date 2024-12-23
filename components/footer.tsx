import { MapPin } from "lucide-react";
import FooterBot from "./footerbot";

interface ContactInfo {
  title: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
}

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

export function Footer() {
  return (
    <>
      <footer className="border-t bg-background">
        <div className="container mx-auto w-full rounded-xl overflow-hidden bg-gradient-to-r from-[#E0F7FF] mt-10">
          <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-12 gap-8">
            {/* Left Side */}
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Subscribe to our Newsletter
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Sign up now to receive offers and information about us and never
                miss an update from B2B!
              </p>
              <div className="bg-white flex items-center justify-center lg:justify-start max-w-md rounded-lg shadow-sm">
                <input
                  type="email"
                  placeholder="Email address"
                  className="rounded-l-lg px-4 py-3 border-none w-full focus:ring-0 text-gray-700"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#5C67F2] to-[#A77CFF] text-white font-bold text-xl w-14 h-12 flex items-center justify-center rounded-r-lg shadow-lg hover:scale-105 transition-transform"
                >
                  →
                </button>
              </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src="/newsletter.svg"
                alt="Newsletter Illustration"
                className="w-full max-w-sm lg:max-w-md"
              />
            </div>
          </div>
        </div>

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
      </footer>
      <FooterBot />
    </>
  );
}

export default Footer;
