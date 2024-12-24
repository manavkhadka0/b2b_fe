"use client";
import React, { useState } from "react";
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
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  phone_number: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number.")
    .nonempty("Phone number is required."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(1, "Message is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [loading, setLoading] = useState(false); // State for tracking loading status
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        "https://ratishshakya.pythonanywhere.com/api/contact/contact/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.phone_number?.[0] ||
          "Failed to send the message. Please try again.";
        toast.error(errorMessage, {
          description: "Please check your input and try again.",
        });
      } else {
        toast("Message sent successfully!", {
          description: "Your message has been sent.",
        });
        form.reset(); // Clear the form fields
      }
    } catch (err) {
      toast.error("An error occurred while sending the message.", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
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
            name="phone_number"
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
              disabled={loading} // Disable button while loading
            >
              {loading ? "Sending..." : "Send Message →"}{" "}
              {/* Update button text */}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
