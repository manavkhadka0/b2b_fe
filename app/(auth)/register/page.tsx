"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { signIn } from "next-auth/react";

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone_number: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
  address: z.string().min(1, "Address is required"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function SimpleRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone_number: "",
      address: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/accounts/register/", values);
      toast.success("Account created successfully. You can now sign in.");
      router.push("/login");
    } catch (error: any) {
      // Try to surface backend validation errors if present
      const data = error?.response?.data;
      if (data && typeof data === "object") {
        Object.entries(data).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => {
              toast.error(`${field}: ${message}`);
            });
          } else if (typeof messages === "string") {
            toast.error(`${field}: ${messages}`);
          }
        });
      } else {
        toast.error("Something went wrong while creating your account.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Themed gradient background (matches other auth pages) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-100/30 to-blue-100/30 animate-gradient" />
      </div>

      {/* Subtle floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <Card className="w-full max-w-2xl mx-4 shadow-xl bg-white/80 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-3 text-center pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
            Create your B2B account
          </CardTitle>
          <CardDescription className="text-gray-600">
            A clean, simple signup to get you started quickly.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6 px-6 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                            placeholder="Jane"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                            placeholder="Doe"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        <Input
                          type="email"
                          className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        <Input
                          type="password"
                          className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                          placeholder="At least 8 characters"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                            placeholder="+1 555 000 1234"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                            placeholder="City, country"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-3 text-xs uppercase tracking-wide text-gray-400">
                  or continue with
                </span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              <GoogleLoginButton isRegister onClick={() => signIn("google")} />
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-6 pb-6">
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-800 to-purple-600 hover:from-blue-800 hover:to-purple-700 text-white text-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Sign up"}
              </Button>

              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-800 hover:text-purple-600 hover:underline font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
