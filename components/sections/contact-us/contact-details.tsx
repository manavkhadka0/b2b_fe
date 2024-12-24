import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactDetails() {
  return (
    <div className="container mx-auto px-4 lg:py-12 space-y-8">
      <div className="p-8 rounded-lg shadow-md py-16">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-start sm:items-center text-center lg:flex-col lg:items-center w-full sm:w-1/3">
            <MapPin className="text-blue-500 w-10 h-10 mb-4 lg:mb-2" />
            <div className="text-left sm:text-center lg:text-center">
              <h3 className="font-semibold text-lg mb-2">Address</h3>
              <p>Naxal-19, Kathmandu, Nepal</p>
              <p>Lorem Ipsum Street 85486</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center w-full sm:w-1/3">
            <Phone className="text-blue-500 w-10 h-10 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Contact Number</h3>
            <p>+01-123456, 561657</p>
            <p>+977 9800000001</p>
          </div>

          <div className="flex flex-col items-end sm:items-center text-center lg:flex-col lg:items-center w-full sm:w-1/3">
            <Mail className="text-blue-500 w-10 h-10 mb-4 lg:mb-2" />
            <div className="text-right sm:text-center lg:text-center">
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p>syangdenholidays@gmail.com</p>
              <p>syangden@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
