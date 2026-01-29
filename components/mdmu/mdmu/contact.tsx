import { ContactForm } from "../contact/contact-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: "021-515712",
    color: "text-blue-600",
  },
  {
    icon: Mail,
    title: "Email",
    details: "cim.biratnagar@gmail.com",
    color: "text-emerald-600",
  },
  {
    icon: MapPin,
    title: "Location",
    details: "Chamber of Industries Morang Biratnagar, Nepal",
    color: "text-red-600",
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: "Mon - Fri: 9:00 AM - 5:00 PM",
    color: "text-purple-600",
  },
];

export const Contact = () => {
  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 relative inline-block">
              Get in Touch
              <div className="relative mt-4">
                <img
                  src="/Rectangle.svg"
                  alt="decorative underline"
                  className="absolute left-1/2 -translate-x-1/2 transform scale-110 w-full h-8"
                />
              </div>
            </h2>
            <p className="mt-8 text-gray-600 text-lg max-w-2xl mx-auto">
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`${info.color} mb-4`}>
                  <info.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 text-sm truncate">{info.details}</p>
              </div>
            ))}
          </div>

          {/* Map and Form Container */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Map */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.6457970089036!2d87.28419512542412!3d26.467144076915595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef7415d678ca1d%3A0x94e788713945c85d!2sChamber%20of%20Industries%20Morang%2C%20Biratnagar%2056613!5e0!3m2!1sen!2snp!4v1737609540531!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
