"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Form steps
const formSteps = [
  {
    id: 1,
    title: "Company Information",
    description: "Basic details about your company",
  },
  {
    id: 2,
    title: "Contact Details",
    description: "Your contact information",
  },
  {
    id: 3,
    title: "Business Details",
    description: "Information about your business operations",
  },
  {
    id: 4,
    title: "Additional Information",
    description: "Other important details",
  },
];

const mdmuFormSchema = z.object({
  // Company Information
  name_of_company: z.string().min(1, "Company name is required"),
  address_province: z.string().min(1, "Province is required"),
  address_district: z.string().min(1, "District is required"),
  address_municipality: z.string().min(1, "Municipality is required"),
  address_ward: z.string().min(1, "Ward is required"),
  address_street: z.string().min(1, "Street address is required"),

  // Contact Information
  contact_name: z.string().min(1, "Contact name is required"),
  contact_number: z.string().min(10, "Valid contact number is required"),
  contact_designation: z.string().min(1, "Designation is required"),
  contact_alternate_number: z.string().optional(),
  contact_email: z.string().email("Invalid email address").optional(),

  // Business Details
  nature_of_industry_category: z
    .string()
    .min(1, "Industry category is required"),
  nature_of_industry_sub_category: z
    .string()
    .min(1, "Sub-category is required"),
  product_market: z.enum(["Domestic", "International", "Both"]),
  raw_material: z.enum(["Local", "International", "Both"]),

  // Additional Information
  member_of_cim: z.boolean(),
  know_about_mdmu: z.boolean(),
  already_used_logo: z.boolean(),
  interested_in_logo: z.boolean(),
  self_declaration: z.boolean(),
  is_other_manufacturing_industries: z.boolean(),
  is_hotel_and_other_service_industries: z.boolean(),
  is_It_service: z.boolean(),
  is_agro_NTFPs: z.boolean(),
  is_others: z.boolean(),
});

type MDMUFormData = z.infer<typeof mdmuFormSchema>;

// Define validation schemas for each step
const stepValidationSchemas = {
  1: z.object({
    name_of_company: z.string().min(1, "Company name is required"),
    address_province: z.string().min(1, "Province is required"),
    address_district: z.string().min(1, "District is required"),
    address_municipality: z.string().min(1, "Municipality is required"),
    address_ward: z.string().min(1, "Ward is required"),
    address_street: z.string().min(1, "Street address is required"),
  }),
  2: z.object({
    contact_name: z.string().min(1, "Contact name is required"),
    contact_number: z.string().min(10, "Valid contact number is required"),
    contact_designation: z.string().min(1, "Designation is required"),
    contact_alternate_number: z.string().optional(),
    contact_email: z.string().email("Invalid email address").optional(),
  }),
  3: z.object({
    nature_of_industry_category: z
      .string()
      .min(1, "Industry category is required"),
    nature_of_industry_sub_category: z
      .string()
      .min(1, "Sub-category is required"),
    product_market: z.enum(["Domestic", "International", "Both"]),
    raw_material: z.enum(["Local", "International", "Both"]),
  }),
  4: z.object({
    member_of_cim: z.boolean(),
    know_about_mdmu: z.boolean(),
    already_used_logo: z.boolean(),
    interested_in_logo: z.boolean(),
    self_declaration: z.boolean(),
    is_other_manufacturing_industries: z.boolean(),
    is_hotel_and_other_service_industries: z.boolean(),
    is_It_service: z.boolean(),
    is_agro_NTFPs: z.boolean(),
    is_others: z.boolean(),
  }),
};

export function MDMUForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MDMUFormData>({
    resolver: zodResolver(mdmuFormSchema),
    defaultValues: {
      // Company Information
      name_of_company: "",
      address_province: "",
      address_district: "",
      address_municipality: "",
      address_ward: "",
      address_street: "",

      // Contact Information
      contact_name: "",
      contact_number: "",
      contact_designation: "",
      contact_alternate_number: "",
      contact_email: "",

      // Business Details
      nature_of_industry_category: "",
      nature_of_industry_sub_category: "",
      product_market: "Domestic",
      raw_material: "Local",

      // Additional Information
      member_of_cim: false,
      know_about_mdmu: false,
      already_used_logo: false,
      interested_in_logo: false,
      self_declaration: false,
      is_other_manufacturing_industries: false,
      is_hotel_and_other_service_industries: false,
      is_It_service: false,
      is_agro_NTFPs: false,
      is_others: false,
    },
    mode: "onChange",
  });

  const handleNextStep = async () => {
    // Get fields to validate for current step
    const currentStepSchema =
      stepValidationSchemas[currentStep as keyof typeof stepValidationSchemas];
    const currentStepFields = Object.keys(currentStepSchema.shape);

    try {
      // Validate only the current step's fields
      await form.trigger(currentStepFields as Array<keyof MDMUFormData>);

      // Check if there are any errors in the current step's fields
      const stepErrors = currentStepFields.some(
        (field) => !!form.formState.errors[field as keyof MDMUFormData]
      );

      if (!stepErrors) {
        setCurrentStep((prev) => Math.min(prev + 1, formSteps.length));
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const onSubmit = async (data: MDMUFormData) => {
    if (currentStep < formSteps.length) {
      await handleNextStep();
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://cim.baliyoventures.com/api/mdmu/mero-desh-merai-utpadan/",
        data
      );
      toast.success("Registration submitted successfully!");
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      toast.error("Failed to submit registration");
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {formSteps.map((step) => (
            <div
              key={step.id}
              className={`flex-1 ${
                step.id !== formSteps.length ? "relative" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.id}
              </div>
              {step.id !== formSteps.length && (
                <div
                  className={`absolute top-4 -right-1/2 w-full h-0.5 ${
                    step.id < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold text-center">
          {formSteps[currentStep - 1].title}
        </h2>
        <p className="text-gray-600 text-center">
          {formSteps[currentStep - 1].description}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Company Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name_of_company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address_province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {/* Add provinces here */}
                              <SelectItem value="province1">
                                Province 1
                              </SelectItem>
                              <SelectItem value="province2">
                                Province 2
                              </SelectItem>
                              {/* Add more provinces */}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address_district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select district" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {/* Add districts here */}
                              <SelectItem value="district1">
                                District 1
                              </SelectItem>
                              <SelectItem value="district2">
                                District 2
                              </SelectItem>
                              {/* Add more districts */}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Add municipality, ward, and street fields similarly */}
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-4">{/* Add contact fields here */}</div>
              )}

              {/* Step 3: Business Details */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  {/* Add business detail fields here */}
                </div>
              )}

              {/* Step 4: Additional Information */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  {/* Add checkbox fields here */}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}

                <Button
                  type={currentStep === formSteps.length ? "submit" : "button"}
                  className={currentStep === 1 ? "ml-auto" : ""}
                  disabled={isLoading}
                  onClick={
                    currentStep === formSteps.length
                      ? undefined
                      : handleNextStep
                  }
                >
                  {currentStep === formSteps.length ? (
                    isLoading ? (
                      "Submitting..."
                    ) : (
                      "Submit Registration"
                    )
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
