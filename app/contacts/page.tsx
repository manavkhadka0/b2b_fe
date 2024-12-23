"use client";
import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number.")
    .nonempty("Phone number is required."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(1, "Message is required."),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Handle form submission
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        className="p-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        className="p-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="p-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your message"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="py-9">
                <Button
                  type="submit"
                  className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-transform hover:scale-105"
                >
                  Send Message →
                </Button>
              </div>
            </form>
          </Form>
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
