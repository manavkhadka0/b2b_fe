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

export function Footer() {
  return (
    <>
      <footer className="border-t bg-background">
        <div className="container px-4 py-12 mx-auto">
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
