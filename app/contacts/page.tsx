"use client";
import React, { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";

// Define the Zod schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required."),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number.")
    .nonempty("Phone number is required."),
  email: z
    .string()
    .email("Invalid email address.")
    .nonempty("Email is required."),
  message: z.string().min(1, "Message is required."),
});

// Define the error type
type Errors = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    try {
      contactSchema.parse(formData); // Validate the form data
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Map Zod errors to state
        const errorObject: Errors = {};
        err.errors.forEach((error) => {
          if (error.path[0] && typeof error.path[0] === "string") {
            errorObject[error.path[0] as keyof Errors] = error.message;
          }
        });
        setErrors(errorObject);
      }
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted successfully!");
      // Perform further actions like sending the form data to an API.
    }
  };

  return (
    <div className="container mx-auto px-4 lg:py-12 space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-9">
        <div className="w-full lg:w-1/2 space-y-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-center lg:text-left">
            Drop Us A Line
          </h1>
          <p className="text-gray-500 text-center lg:text-left">
            We normally respond within 2 business days
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-600 mb-2">Name</label>
              <Input
                type="text"
                name="name"
                placeholder="Pietro Adams"
                className="p-5"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Phone Number</label>
              <Input
                type="text"
                name="phone"
                placeholder="+977 9800000000"
                className="p-5"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="johndoel12@gmail.com"
                className="p-5"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Message</label>
              <Textarea
                name="message"
                placeholder="Give short Description"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
            </div>

            <div className="py-9">
              <Button
                type="submit"
                className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-transform hover:scale-105"
              >
                Send Message →
              </Button>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-1/2 hidden lg:flex justify-center animate-fade-in">
          <img
            src="/map.svg"
            alt="Map Illustration"
            className="w-full max-w-[600px] rounded-lg"
          />
        </div>
      </div>

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
};

export default ContactPage;
