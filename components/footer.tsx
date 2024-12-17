import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import FooterBot from "./footerbot";

interface ContactInfo {
  title: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
}

const offices: ContactInfo[] = [
  {
    title: "HEAD OFFICE",
    name: "Job Briz",
    phone: "+977 9801234567",
    email: "contact@jobbriz.com",
    address: "City Center, Kathmandu, Nepal",
  },
  {
    title: "UNITED STATES",
    name: "John Doe",
    phone: "+1 123 456 7890",
    email: "john.doe@jobbriz.com",
  },
  {
    title: "AUSTRALIA",
    name: "Jane Smith",
    phone: "+61 401 234 567",
    email: "jane.smith@jobbriz.com",
  },
];

const districts = [
  "Taplejung",
  "Panchthar",
  "Ilam",
  "Jhapa",
  "Morang",
  "Sunsari",
  "Dhankuta",
  "Terhathum",
  "Sankhuwasabha",
  "Bhojpur",
  "Solukhumbu",
  "Okhaldhunga",
  "Khotang",
  "Udayapur",
];

export function Footer() {
  return (
    <>
      <footer className="border-t bg-background">
        <div className="container px-4 py-12 mx-auto">
          {/* District B2B Networking Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              District B2B Networking
            </h2>
            <p className="text-gray-600 mb-4">
              Explore business opportunities in specific districts and regions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {districts.map((district) => (
                <div
                  key={district}
                  className="border rounded-lg px-4 py-2 text-center text-gray-800 hover:bg-gray-100 transition"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4 text-blue-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 2.25c-4.556 0-8.25 3.694-8.25 8.25 0 5.978 8.25 11.25 8.25 11.25s8.25-5.272 8.25-11.25c0-4.556-3.694-8.25-8.25-8.25z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11.25c1.242 0 2.25-1.008 2.25-2.25s-1.008-2.25-2.25-2.25-2.25 1.008-2.25 2.25 1.008 2.25 2.25 2.25z"
                      />
                    </svg>
                    {district}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Offices Section */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <div key={office.title} className="space-y-4">
                <h3 className="text-lg font-semibold">{office.title}</h3>
                {office.name && <p className="text-sm">{office.name}</p>}
                {office.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span>{office.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <Link
                    href={`tel:${office.phone}`}
                    className="hover:text-primary"
                  >
                    {office.phone}
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <Link
                    href={`mailto:${office.email}`}
                    className="hover:text-primary"
                  >
                    {office.email}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
      <FooterBot />

      <p className="py-20 text-center bg-gray-100 text-sm text-muted-foreground">
        © Copyright 2024 - B2B. Designed by Baliyo Ventures
      </p>
    </>
  );
}

export default Footer;
