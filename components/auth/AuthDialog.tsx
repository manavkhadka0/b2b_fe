"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginCredentials, SignupData, UserType } from "@/types/auth";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { signIn } from "next-auth/react";

type AuthMode = "login" | "register";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: AuthMode;
  returnTo?: string;
  onAuthenticated?: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone_number: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
  address: z.string().min(1, "Address is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "login",
  returnTo,
  onAuthenticated,
}: AuthDialogProps) {
  const pathname = usePathname();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [open, initialMode]);

  const effectiveReturnTo = returnTo || pathname || "/";
  const encodedReturnTo = encodeURIComponent(effectiveReturnTo);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone_number: "",
      address: "",
    },
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsSubmittingLogin(true);
    try {
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
      };

      await login(credentials, encodedReturnTo);
      toast.success("Login successful!");
      onOpenChange(false);
      onAuthenticated?.();
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Invalid credentials. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const buildSignupPayload = (values: RegisterFormData): SignupData => {
    const usernameFromEmail =
      values.email.split("@")[0] || `${values.first_name}${values.last_name}`;

    const userType: UserType = "Job Seeker";

    return {
      email: values.email,
      password: values.password,
      confirm_password: values.password,
      username: usernameFromEmail,
      gender: "Other",
      address: values.address,
      first_name: values.first_name,
      last_name: values.last_name,
      user_type: userType,
      phone_number: values.phone_number,
      company_name: undefined,
    };
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsSubmittingRegister(true);
    try {
      const payload = buildSignupPayload(data);
      await signup(payload, encodedReturnTo);
      toast.success("Account created successfully!");
      onOpenChange(false);
      onAuthenticated?.();
    } catch (error: any) {
      const backendErrors = error?.response?.data;
      if (backendErrors && typeof backendErrors === "object") {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => {
              toast.error(`${field}: ${message}`);
            });
          } else if (typeof messages === "string") {
            toast.error(`${field}: ${messages}`);
          }
        });
      } else {
        const message =
          error?.message || "Something went wrong while creating your account.";
        toast.error(message);
      }
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  const handleGoogleLogin = () => {
    const callbackUrl = effectiveReturnTo || "/";
    signIn("google", { callbackUrl });
  };

  const renderLoginForm = () => {
    const { handleSubmit, control } = loginForm;

    return (
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-4 text-center pb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-lg text-gray-600">Sign in to your B2B account</p>
        </div>

        <Form {...loginForm}>
          <form
            onSubmit={handleSubmit(handleLoginSubmit)}
            className="space-y-6"
          >
            <div className="space-y-6">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        <Input
                          className="pl-10 h-12 border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-400 transition-all"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors pointer-events-none" />
                        <Input
                          type={showLoginPassword ? "text" : "password"}
                          className="pl-10 pr-10 h-12 border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-400 transition-all"
                          placeholder="Enter your password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors focus:outline-none"
                          aria-label={
                            showLoginPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="text-blue-800 hover:text-purple-600 hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-800 to-purple-600 hover:from-blue-800 hover:to-purple-700 text-white text-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isSubmittingLogin}
              >
                {isSubmittingLogin ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-3 text-xs uppercase tracking-wide text-gray-400">
                  or continue with
                </span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              <GoogleLoginButton onClick={handleGoogleLogin} />

              <p className="text-sm text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-blue-800 hover:text-purple-600 hover:underline font-medium transition-colors"
                  onClick={() => setMode("register")}
                >
                  Create account
                </button>
              </p>
            </div>
          </form>
        </Form>
      </div>
    );
  };

  const renderRegisterForm = () => {
    const { handleSubmit, control } = registerForm;

    return (
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-2 text-center pb-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
            Create your B2B account
          </h2>
          <p className="text-sm text-gray-600">
            A compact, focused signup experience.
          </p>
        </div>

        <Form {...registerForm}>
          <form
            onSubmit={handleSubmit(handleRegisterSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4 px-5 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-10 border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
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
                  control={control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-10 border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
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
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        <Input
                          className="pl-10 h-10 border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
                          placeholder="you@example.com"
                          name={field.name}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors pointer-events-none" />
                        <Input
                          type={showRegisterPassword ? "text" : "password"}
                          className="pl-10 pr-10 h-10 border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
                          placeholder="At least 8 characters"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowRegisterPassword((prev) => !prev)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors focus:outline-none"
                          aria-label={
                            showRegisterPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-10 border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
                            placeholder="9800000000"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <Input
                            className="pl-10 h-10 border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-400 transition-all text-sm"
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

              <GoogleLoginButton isRegister onClick={handleGoogleLogin} />
            </div>

            <div className="flex flex-col gap-3 px-5 pb-5">
              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-blue-800 to-purple-600 hover:from-blue-800 hover:to-purple-700 text-white text-sm font-medium transition-all duration-200"
                disabled={isSubmittingRegister}
              >
                {isSubmittingRegister
                  ? "Creating account..."
                  : "Create account"}
              </Button>

              <p className="text-xs md:text-sm text-center text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-800 hover:text-purple-600 hover:underline font-medium transition-colors"
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </Form>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md border-none bg-white p-0 shadow-none sm:max-w-lg">
        <div className="flex flex-col items-center py-6 px-4 sm:px-0 max-h-[90vh] overflow-y-auto">
          <div className="w-full">
            {mode === "login" ? renderLoginForm() : renderRegisterForm()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
