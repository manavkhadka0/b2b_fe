import { MapPin, Phone, Mail, Globe } from "lucide-react";
import Link from "next/link";

export default function ContactDetails() {
  return (
    <div className="p-4 md:p-8 rounded-lg shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Address */}
        <div className="flex flex-col items-center text-center">
          <MapPin className="text-blue-500 w-8 h-8 md:w-10 md:h-10 mb-3" />
          <div>
            <h3 className="font-semibold text-base md:text-lg mb-2">Address</h3>
            <p className="text-sm md:text-base">
              Sahid Marga Biratnagar - 2,
              <br />
              Koshi Province, Nepal
            </p>
          </div>
        </div>

        {/* Phone Numbers */}
        <div className="flex flex-col items-center text-center">
          <Phone className="text-blue-500 w-8 h-8 md:w-10 md:h-10 mb-3" />
          <h3 className="font-semibold text-base md:text-lg mb-2">
            Contact Numbers
          </h3>
          <div className="text-sm md:text-base space-y-1">
            <p>
              <Link
                href="tel:021515712"
                className="text-blue-500 hover:underline"
              >
                021-515712
              </Link>
              ,{" "}
              <Link
                href="tel:021574426"
                className="text-blue-500 hover:underline"
              >
                021-574426
              </Link>
            </p>
            <p>
              <Link
                href="tel:021577646"
                className="text-blue-500 hover:underline"
              >
                021-577646
              </Link>
              ,{" "}
              <Link
                href="tel:021511449"
                className="text-blue-500 hover:underline"
              >
                021-511449
              </Link>
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col items-center text-center">
          <Mail className="text-blue-500 w-8 h-8 md:w-10 md:h-10 mb-3" />
          <h3 className="font-semibold text-base md:text-lg mb-2">Email</h3>
          <Link
            href="mailto:cim.biratnagar@gmail.com"
            className="text-sm md:text-base text-blue-500 hover:underline"
          >
            cim.biratnagar@gmail.com
          </Link>
        </div>

        {/* Website */}
        <div className="flex flex-col items-center text-center">
          <Globe className="text-blue-500 w-8 h-8 md:w-10 md:h-10 mb-3" />
          <h3 className="font-semibold text-base md:text-lg mb-2">Website</h3>
          <Link
            href="http://www.cim.org.np"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base text-blue-500 hover:underline"
          >
            www.cim.org.np
          </Link>
        </div>
      </div>
    </div>
  );
}
