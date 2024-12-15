"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Mail,
  Lock,
  User,
  Phone,
  Building,
  MapPin,
  Briefcase,
  UserCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupData } from "@/types/auth";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Schema remains the same
const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    user_type: z.enum(["Job Seeker", "Employer"]),
    gender: z.enum(["Male", "Female", "Others"]),
    phone_number: z.string().min(10, "Invalid phone number"),
    address: z.string().min(1, "Address is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

// Add these step-specific validation schemas
const stepValidationSchemas = {
  1: z.object({
    user_type: z.enum(["Job Seeker", "Employer"]),
  }),
  2: z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    gender: z.enum(["Male", "Female", "Others"]),
  }),
  3: z
    .object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirm_password: z.string(),
      phone_number: z.string().min(10, "Invalid phone number"),
      address: z.string().min(1, "Address is required"),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"],
    }),
};

// Add step titles with required field indicators
const steps = [
  {
    id: 1,
    title: "Choose Account Type",
    description: "Select the type of account you want to create",
    fields: ["user_type"],
  },
  {
    id: 2,
    title: "Personal Information",
    description: "Tell us about yourself",
    fields: ["first_name", "last_name", "gender"],
  },
  {
    id: 3,
    title: "Account Details",
    description: "Set up your login credentials",
    fields: [
      "username",
      "email",
      "password",
      "confirm_password",
      "phone_number",
      "address",
    ],
  },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      user_type: "Job Seeker",
      gender: "Male",
      phone_number: "",
      address: "",
    },
  });

  const onSubmit = async (data: SignupData) => {
    setIsLoading(true);
    try {
      await signup(data, returnTo || undefined);
      toast.success("Account created successfully!");
    } catch (error: any) {
      // Handle array of error messages
      if (error.response?.data) {
        Object.entries(error.response.data).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => {
              toast.error(`${field}: ${message}`);
            });
          }
        });
      } else {
        toast.error("Signup failed. Please try again.");
      }
      console.error("Signup error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const watchUserType = form.watch("user_type");

  const nextStep = async () => {
    const currentSchema =
      stepValidationSchemas[currentStep as keyof typeof stepValidationSchemas];

    // Get fields to validate for current step
    const fieldsToValidate = steps[currentStep - 1].fields;

    try {
      // Trigger validation for current step fields
      const isStepValid = await form.trigger(
        fieldsToValidate as Array<keyof SignupData>
      );

      if (!isStepValid) {
        return; // Stop if validation fails
      }

      // Get current form data
      const currentData = form.getValues();

      // Validate against step schema
      const validationResult = currentSchema.safeParse(
        Object.fromEntries(
          fieldsToValidate.map((field) => [
            field,
            currentData[field as keyof SignupData],
          ])
        )
      );

      if (!validationResult.success) {
        // Show first validation error
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message);
        return;
      }

      // If validation passes, move to next step
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Please check all fields");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Add this helper function to check if current step is valid
  const isCurrentStepValid = () => {
    const currentStepFields = steps[currentStep - 1].fields;
    return !currentStepFields.some((field) => {
      const fieldState = form.getFieldState(field as keyof SignupData);
      return fieldState.invalid;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <Card className="w-full max-w-2xl shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2  pb-7 mb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
            Elevate Your Business with B2B Today.
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-10">
            Get started effortlessly with custom solutions and collaborative
            opportunities.
          </CardDescription>

          {/* Step Indicator */}
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 px-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Account Type */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={cn(
                          "p-6 rounded-lg border-2 cursor-pointer transition-all",
                          watchUserType === "Job Seeker"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        )}
                        onClick={() => form.setValue("user_type", "Job Seeker")}
                      >
                        <UserCircle className="w-12 h-12 text-primary mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Wisher</h3>
                        <p className="text-sm text-gray-600">
                          Find your Dream Job and Connect with top Employers
                        </p>
                      </div>

                      <div
                        className={cn(
                          "p-6 rounded-lg border-2 cursor-pointer transition-all",
                          watchUserType === "Employer"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        )}
                        onClick={() => form.setValue("user_type", "Employer")}
                      >
                        <Building className="w-12 h-12 text-primary mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Offerer</h3>
                        <p className="text-sm text-gray-600">
                          Post Job and Find the Perfect Candidates
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="font-bold text-blue-800 text-xl">
                      Personal Details
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  className="pl-10"
                                  placeholder="First Name"
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
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  className="pl-10"
                                  placeholder="Last Name"
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
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <RadioGroup
                                className="flex flex-row justify-between gap-2"
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                {["Male", "Female", "Others"].map((gender) => (
                                  <div
                                    key={gender}
                                    className="flex items-center gap-2"
                                  >
                                    <RadioGroupItem value={gender} />
                                    <Label>{gender}</Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Account & Contact Details */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="font-bold text-blue-800 text-xl mt-10">
                      Account & Contact Details
                    </div>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                className="pl-10"
                                placeholder="Choose a username"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="email"
                                className="pl-10"
                                placeholder="Enter your email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  type="password"
                                  className="pl-10"
                                  placeholder="Password"
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
                        name="confirm_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  type="password"
                                  className="pl-10"
                                  placeholder="Confirm Password"
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
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                className="pl-10"
                                placeholder="Enter your phone number"
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
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                className="pl-10"
                                placeholder="Enter your address"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 px-6 pb-6">
              {/* Step Indicator */}

              {/* Navigation Buttons */}
              <div className="flex justify-between w-full mt-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    className="w-24"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Back
                  </Button>
                )}

                {currentStep < 2 && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={nextStep}
                    className="w-24 ml-auto"
                  >
                    Next
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}

                {currentStep === 2 && (
                  <Button
                    type="submit"
                    size="sm"
                    className="w-24 ml-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Sign Up"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Form>

        <div className="text-center pb-8">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-800 hover:text-purple-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
          <div className="flex flex-col items-center gap-1 mt-4">
            {/* Step Indicator */}
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-blue-700">{currentStep}</span>{" "}
              of <span className="font-semibold">2</span>
            </p>

            {/* Thin Progress Bar */}
            <div className="w-16 h-0.5 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-700 transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
