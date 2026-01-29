"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { mdmuFormSchema, stepValidationSchemas } from "./schemas";
import { validateStepData } from "./utils";
import { API_ENDPOINTS, formSteps } from "./constants";
import { FormProgress } from "./components/FormProgress";
import { CompanyInformation } from "./steps/CompanyInformation";
import { ContactDetails } from "./steps/ContactDetails";
import { BusinessDetails } from "./steps/BusinessDetails";
import { AdditionalInformation } from "./steps/AdditionalInformation";
import { Review } from "./steps/Review";

import type {
  IndustryCategory,
  IndustrySubCategory,
  MDMUFormData,
} from "./types";

export function MDMUForm() {
  const router = useRouter();
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
      nature_of_industry_category: {} as IndustryCategory,
      nature_of_industry_sub_category: {} as IndustrySubCategory,
      product_market: "Domestic",
      raw_material: "Local",
      industry_size: "Startup",

      // Additional Information
      member_of_cim: "false",
      know_about_mdmu: "false",
      already_used_logo: undefined,
      interested_in_logo: undefined,
      self_declaration: false,
    },
    mode: "onChange",
  });

  const handleNextStep = async () => {
    if (currentStep === 5) return; // Don't validate on review step

    const currentStepSchema =
      stepValidationSchemas[currentStep as keyof typeof stepValidationSchemas];
    const currentStepFields = Object.keys(currentStepSchema.shape);

    const hasErrors = await form.trigger(currentStepFields as any);
    if (!hasErrors) return;

    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: MDMUFormData) => {
    try {
      setIsLoading(true);

      // Create FormData for file upload
      const formData = new FormData();

      // Transform and add all form fields to FormData
      formData.append("name_of_company", data.name_of_company);
      formData.append("address_province", data.address_province);
      formData.append("address_district", data.address_district);
      formData.append("address_municipality", data.address_municipality);
      formData.append("address_ward", data.address_ward);
      formData.append("address_street", data.address_street);
      formData.append(
        "nature_of_industry_category",
        data.nature_of_industry_category.id.toString()
      );
      if (data.nature_of_industry_sub_category?.id) {
        formData.append(
          "nature_of_industry_sub_category",
          data.nature_of_industry_sub_category.id.toString()
        );
      }
      formData.append("product_market", data.product_market);
      formData.append("raw_material", data.raw_material);
      formData.append("industry_size", data.industry_size);
      formData.append("contact_name", data.contact_name);
      formData.append("contact_number", data.contact_number);
      formData.append("contact_designation", data.contact_designation);
      if (data.contact_alternate_number) {
        formData.append(
          "contact_alternate_number",
          data.contact_alternate_number
        );
      }
      if (data.contact_email) {
        formData.append("contact_email", data.contact_email);
      }
      formData.append("member_of_cim", data.member_of_cim);
      formData.append("know_about_mdmu", data.know_about_mdmu);
      if (data.already_used_logo) {
        formData.append("already_used_logo", data.already_used_logo);
      }
      if (data.interested_in_logo) {
        formData.append("interested_in_logo", data.interested_in_logo);
      }
      if (data.self_declaration !== undefined) {
        formData.append("self_declaration", data.self_declaration.toString());
      }

      // Add company logo file if present
      if (
        data.company_logo &&
        data.company_logo instanceof FileList &&
        data.company_logo.length > 0
      ) {
        formData.append("company_logo", data.company_logo[0]);
      }

      // Validate final step before submission
      const submitDataForValidation = {
        ...data,
        nature_of_industry_category: data.nature_of_industry_category.id,
        nature_of_industry_sub_category:
          data.nature_of_industry_sub_category?.id ?? null,
        industry_size: data.industry_size,
        self_declaration: data.self_declaration || false,
      };
      const finalStepValidation = await validateStepData(
        5,
        submitDataForValidation
      );
      if (!finalStepValidation.success) return;

      // Submit form data with proper headers for multipart/form-data
      const response = await axios.post(API_ENDPOINTS.register, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        // Get message and file_url from response
        const { message, file_url } = response.data;

        // Construct the URL with parameters
        const searchParams = new URLSearchParams({
          message:
            message ||
            "Thank you for your application. We will review your submission and get back to you soon.",
          fileUrl: file_url || "",
        });

        // Reset form and redirect to thank you page
        form.reset();
        router.push(`/thank-you?${searchParams.toString()}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred while submitting the form";
        form.setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <FormProgress currentStep={currentStep} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="space-y-6"
        >
          {currentStep === 1 && <CompanyInformation form={form} />}
          {currentStep === 2 && <ContactDetails form={form} />}
          {currentStep === 3 && <BusinessDetails form={form} />}
          {currentStep === 4 && <AdditionalInformation form={form} />}
          {currentStep === 5 && (
            <Review form={form as any} isSubmitting={isLoading} />
          )}

          {/* Form Error Message */}
          {form.formState.errors.root && (
            <div className="text-sm text-red-600 mt-4">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Only show navigation buttons if not on review step */}
          {currentStep !== 5 && (
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="w-full sm:w-auto hover:bg-gray-100 "
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}

              <Button
                type={currentStep === 5 ? "submit" : "button"}
                className={`w-full sm:w-auto bg-[#0A1E4B] hover:bg-blue-900 ${
                  currentStep === 1 ? "sm:ml-auto" : ""
                }`}
                disabled={isLoading}
                onClick={currentStep === 5 ? undefined : handleNextStep}
              >
                {currentStep === 5 ? (
                  isLoading ? (
                    "Submitting..."
                  ) : (
                    "Submit Application"
                  )
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
