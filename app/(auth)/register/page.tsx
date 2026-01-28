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
      const response = await api.post("/api/accounts/register/", values);

      // Expecting { access, refresh } like in your example
      const { access, refresh } = response.data || {};

      if (access && refresh) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
      }

      toast.success("Account created successfully. Redirecting...");

      // Full reload so AuthContext re-runs auth check with fresh tokens
      router.push("/");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg bg-white/90 backdrop-blur-sm border border-slate-100">
        <CardHeader className="space-y-2 text-center pb-4">
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
            Create your B2B account
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            A compact, focused signup experience.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-4 px-5 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
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
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
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
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        <Input
                          type="email"
                          className="pl-10 h-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
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
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        <Input
                          type="password"
                          className="pl-10 h-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
                          placeholder="At least 8 characters"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
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
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
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

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-3 text-xs uppercase tracking-wide text-gray-400">
                  or continue with
                </span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              <GoogleLoginButton isRegister onClick={() => signIn("google")} />
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-5 pb-5">
              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-blue-800 to-purple-600 hover:from-blue-800 hover:to-purple-700 text-white text-sm font-medium transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>

              <p className="text-xs md:text-sm text-center text-gray-600">
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
