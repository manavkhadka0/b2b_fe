import { useState, useMemo, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyInformation } from "./CompanyInformation";
import { ContactDetails } from "./ContactDetails";
import { BusinessDetails } from "./BusinessDetails";
import { AdditionalInformation } from "./AdditionalInformation";
import { MDMUFormData, IndustrySize } from "../types";

interface ReviewProps {
  form: UseFormReturn<MDMUFormData & { industry_size: IndustrySize }>;
  isSubmitting?: boolean;
}

type ReviewSection = {
  title: string;
  data: Array<{
    label: string;
    value: string | number | boolean | undefined;
    transform?: (value: any) => string;
  }>;
};

const formatBoolean = (value: "true" | "false" | undefined) =>
  value === "true" ? "Yes" : "No";

export function Review({ form, isSubmitting }: ReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const formData = form.getValues();

  // Watch company_logo to trigger re-renders when it changes
  const companyLogo = form.watch("company_logo");

  // Create preview URL for company logo if it exists
  const logoPreviewUrl = useMemo(() => {
    if (!companyLogo) return null;
    if (companyLogo instanceof FileList && companyLogo.length > 0) {
      return URL.createObjectURL(companyLogo[0]);
    }
    if (typeof companyLogo === "string") {
      return companyLogo;
    }
    return null;
  }, [companyLogo]);

  // Cleanup object URL when it changes or component unmounts
  useEffect(() => {
    const currentUrl = logoPreviewUrl;
    return () => {
      if (currentUrl && currentUrl.startsWith("blob:")) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [logoPreviewUrl]);

  const sections: ReviewSection[] = [
    {
      title: "Company Information",
      data: [
        { label: "Company Name", value: formData.name_of_company },
        { label: "Province", value: formData.address_province },
        { label: "District", value: formData.address_district },
        { label: "Municipality", value: formData.address_municipality },
        { label: "Ward", value: formData.address_ward },
        { label: "Street Address", value: formData.address_street },
      ],
    },
    {
      title: "Contact Information",
      data: [
        { label: "Contact Person", value: formData.contact_name },
        { label: "Contact Number", value: formData.contact_number },
        { label: "Designation", value: formData.contact_designation },
        {
          label: "Alternate Number",
          value: formData.contact_alternate_number,
        },
        { label: "Email", value: formData.contact_email },
      ],
    },
    {
      title: "Business Details",
      data: [
        {
          label: "Industry Category",
          value: formData.nature_of_industry_category?.name,
        },
        {
          label: "Sub Category",
          value: formData.nature_of_industry_sub_category?.name,
        },
        { label: "Product Market", value: formData.product_market },
        { label: "Raw Material", value: formData.raw_material },
        { label: "Industry Size", value: formData.industry_size },
      ],
    },
    {
      title: "Additional Information",
      data: [
        {
          label: "Member of CIM",
          value: formData.member_of_cim,
          transform: formatBoolean,
        },
        {
          label: "Know About MDMU",
          value: formData.know_about_mdmu,
          transform: formatBoolean,
        },
        {
          label: "Already Used Logo",
          value: formData.already_used_logo,
          transform: formatBoolean,
        },
        {
          label: "Interested in Logo",
          value: formData.interested_in_logo,
          transform: formatBoolean,
        },
        {
          label: "Self Declaration",
          value: formData.self_declaration,
          transform: (value: boolean) => (value ? "Yes" : "No"),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Review Your Application
        </h2>
        <p className="text-sm text-gray-500">
          Please review your information carefully before submitting the
          application.
        </p>
      </div>

      {isEditing ? (
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Company Information
            </h3>
            <CompanyInformation form={form} />
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Contact Information
            </h3>
            <ContactDetails form={form} />
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Business Details
            </h3>
            <BusinessDetails form={form} />
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Additional Information
            </h3>
            <AdditionalInformation form={form} />
          </section>
        </div>
      ) : (
        sections.map((section) => (
          <Card key={section.title} className="border-gray-100">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {section.title}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {section.data.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">
                      {item.label}
                    </label>
                    <p className="text-sm text-gray-900">
                      {item.transform
                        ? item.transform(item.value)
                        : item.value || "-"}
                    </p>
                  </div>
                ))}
                {/* Show company logo if uploaded */}
                {section.title === "Company Information" && (
                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      Company Logo
                    </label>
                    <div className="mt-2">
                      {logoPreviewUrl ? (
                        <div className="relative w-full max-w-xs h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                          <img
                            src={logoPreviewUrl}
                            alt="Company Logo Preview"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              console.error("Error loading logo preview:", e);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="relative w-full max-w-xs h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                          <p className="text-sm text-gray-400">
                            No logo uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing((prev) => !prev)}
          className="w-full sm:w-auto hover:bg-gray-100"
        >
          <Pencil className="w-4 h-4 mr-2" />
          {isEditing ? "View Summary" : "Edit Information"}
        </Button>

        <Button
          type="submit"
          className="w-full sm:w-auto bg-[#0A1E4B] hover:bg-blue-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}
