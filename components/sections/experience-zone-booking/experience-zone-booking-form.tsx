"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { experienceZoneBookingSchema } from "@/types/schemas/experience-zone-booking-schema";
import type {
  ExperienceZoneBookingFormValues,
  HSCode,
  Service,
  Category,
  SubCategory,
  ImageUpload,
} from "@/types/experience-zone-booking-type";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import { StepIndicator } from "../create-wish/create-wish-steps/step-indicator";
import { ZoneStep1Type } from "./steps/step-1-type";
import { ZoneStep2Details } from "./steps/step-2-details";
import { ZoneStep3Company } from "./steps/step-3-company";
import { ZoneStep4Personal } from "./steps/step-4-personal";
import { ZoneStep5Review } from "./steps/step-5-review";
import {
  createExperienceZoneBooking,
  fetchOccupancy,
  formatPreferredMonthForOccupancy,
} from "@/services/experienceZoneBooking";

type SuccessPayload = {
  message?: string;
};

function ThankYouSection({ message }: SuccessPayload) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="mb-6"
            >
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            >
              Booking Request Submitted
            </motion.h2>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                {message}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Button
                variant="outline"
                asChild
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                <Link href="/cim-zone">Return to CIM Zone</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function ExperienceZoneBookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successPayload, setSuccessPayload] = useState<SuccessPayload | null>(
    null,
  );

  const STEPS = [
    { title: "Type", description: "Choose display type" },
    { title: "Details", description: "Product/Service details" },
    { title: "Company", description: "Company information" },
    { title: "Personal", description: "Personal details" },
    { title: "Review", description: "Review and submit" },
  ];

  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [productSearchValue, setProductSearchValue] = useState("");
  const [products, setProducts] = useState<HSCode[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<HSCode | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceSearchOpen, setServiceSearchOpen] = useState(false);
  const [serviceSearchValue, setServiceSearchValue] = useState("");
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SubCategory | null>(null);
  const [subcategorySearchOpen, setSubcategorySearchOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState<ImageUpload | null>(null);

  const form = useForm<ExperienceZoneBookingFormValues>({
    resolver: zodResolver(experienceZoneBookingSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      title: "",
      contact_person: "",
      designation: "",
      email: "",
      phone: "",
      alternate_no: "",
      company_name: "",
      company_website: "",
      product: "",
      service: "",
      category: "",
      subcategory: "",
      description: "",
      country: "Nepal",
      address: "",
      province: "",
      district: "",
      municipality: "",
      ward: "",
      type: "Product",
      preferred_month: "",
    },
  });

  const searchProducts = useDebouncedCallback(async (search: string) => {
    if (search.length < 3) return;

    setIsLoadingProducts(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/hs-codes/?search=${search}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data.results || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, 300);

  useEffect(() => {
    const subcategoryId = form.watch("subcategory");

    if (!subcategoryId) {
      if (productSearchValue.length >= 3) {
        searchProducts(productSearchValue);
      } else if (productSearchValue.length < 3) {
        setProducts([]);
      }
    }
  }, [productSearchValue, searchProducts, form.watch("subcategory")]);

  const getFieldsForStep = (
    step: number,
  ): (keyof ExperienceZoneBookingFormValues)[] => {
    switch (step) {
      case 1:
        return ["title", "type", "description"];
      case 2: {
        const wishType = form.getValues("type");
        if (!wishType) return [];
        return wishType === "Product" ? ["product"] : ["service"];
      }
      case 3:
        return [
          "company_name",
          "address",
          "province",
          "district",
          "municipality",
          "ward",
        ];
      case 4:
        return [
          "contact_person",
          "designation",
          "email",
          "phone",
          "preferred_month",
        ];
      default:
        return [
          "title",
          "type",
          "description",
          "product",
          "service",
          "company_name",
          "address",
          "province",
          "municipality",
          "ward",
          "contact_person",
          "designation",
          "email",
          "phone",
          "preferred_month",
        ];
    }
  };

  const nextStep = async () => {
    const currentFields = getFieldsForStep(currentStep);

    const isValid = await form.trigger(currentFields, {
      shouldFocus: true,
    });

    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const onSubmit = async (data: ExperienceZoneBookingFormValues) => {
    if (currentStep !== STEPS.length) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      // Check occupancy for selected preferred month before submitting
      const occupancyList = await fetchOccupancy();
      const monthLabel = formatPreferredMonthForOccupancy(data.preferred_month);
      const monthOccupancy = occupancyList.find(
        (item) => item.month.toLowerCase() === monthLabel.toLowerCase(),
      );

      if (monthOccupancy) {
        if (monthOccupancy.is_full || monthOccupancy.remaining_seats <= 0) {
          toast.error(
            `${monthLabel} is full. No available seats. Please select another month.`,
          );
          setIsSubmitting(false);
          return;
        }
      }

      const buildAddress = () => {
        if (
          data.country === "Nepal" &&
          data.province &&
          data.district &&
          data.municipality &&
          data.ward
        ) {
          return `${data.address}, Ward ${data.ward}, ${data.municipality}, ${data.district}, ${data.province}, Nepal`;
        }
        return data.address;
      };

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      await createExperienceZoneBooking(
        {
          title: data.title || "",
          company_name: data.company_name,
          address: buildAddress(),
          email: data.email,
          phone: data.phone,
          contact_person: data.contact_person,
          designation: data.designation || null,
          subcategory: data.subcategory ? parseInt(data.subcategory, 10) : null,
          preferred_month: data.preferred_month,
          description: data.description || "",
          product: data.product ? parseInt(data.product, 10) : null,
          type: data.type,
        },
        token,
        image?.file ?? null,
      );

      const message = "Your booking request has been submitted successfully.";

      toast.success("Booking request submitted!");
      form.reset();
      setImage(null);
      setSelectedProduct(null);
      setSelectedService(null);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSuccessPayload({ message });
    } catch (error) {
      console.error("Failed to submit booking:", error);
      toast.error("Failed to submit booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const subcategoryId = form.watch("subcategory");
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/services/`;

        if (subcategoryId) {
          url = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/services/?subcategory_id=${subcategoryId}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data.results || []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        toast.error("Failed to fetch services");
        setServices([]);
      } finally {
        setIsLoadingServices(false);
      }
    };

    const wishType = form.watch("type");

    if (wishType === "Service") {
      fetchServices();
    } else {
      setServices([]);
    }
  }, [form.watch("type"), form.watch("subcategory")]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const wishType = form.watch("type");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/categories/?type=${wishType}`,
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.results || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    const wishType = form.watch("type");
    if (wishType === "Product" || wishType === "Service") {
      fetchCategories();
    }
  }, [form.watch("type")]);

  useEffect(() => {
    const fetchSubcategories = async (categoryId: string) => {
      setIsLoadingSubcategories(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/sub-categories/?category=${categoryId}`,
        );
        if (!response.ok) throw new Error("Failed to fetch subcategories");
        const data = await response.json();
        setSubcategories(data.results || []);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        toast.error("Failed to fetch subcategories");
        setSubcategories([]);
      } finally {
        setIsLoadingSubcategories(false);
      }
    };

    const categoryId = form.watch("category");
    const wishType = form.watch("type");
    if (categoryId && (wishType === "Product" || wishType === "Service")) {
      setSelectedSubcategory(null);
      form.setValue("subcategory", "");
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
      setSelectedSubcategory(null);
      form.setValue("subcategory", "");
    }
  }, [form.watch("category"), form.watch("type")]);

  useEffect(() => {
    const subcategoryId = form.watch("subcategory");
    const wishType = form.watch("type");

    if (subcategoryId && wishType === "Product") {
      setIsLoadingProducts(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/hs-codes/?subcategory_id=${subcategoryId}`,
      )
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch products");
          return response.json();
        })
        .then((data) => {
          setProducts(data.results || []);
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
          toast.error("Failed to fetch products");
          setProducts([]);
        })
        .finally(() => {
          setIsLoadingProducts(false);
        });
    } else if (
      !subcategoryId &&
      wishType === "Product" &&
      productSearchValue.length < 3
    ) {
      setProducts([]);
    }
  }, [form.watch("subcategory"), form.watch("type"), productSearchValue]);

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (successPayload) {
    return <ThankYouSection message={successPayload.message} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ZoneStep1Type form={form} />;
      case 2:
        return (
          <ZoneStep2Details
            form={form}
            products={products}
            services={services}
            categories={categories}
            subcategories={subcategories}
            isLoadingProducts={isLoadingProducts}
            isLoadingServices={isLoadingServices}
            isLoadingCategories={isLoadingCategories}
            isLoadingSubcategories={isLoadingSubcategories}
            selectedProduct={selectedProduct}
            selectedService={selectedService}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            productSearchOpen={productSearchOpen}
            serviceSearchOpen={serviceSearchOpen}
            categorySearchOpen={categorySearchOpen}
            subcategorySearchOpen={subcategorySearchOpen}
            productSearchValue={productSearchValue}
            serviceSearchValue={serviceSearchValue}
            showServiceForm={showServiceForm}
            setProductSearchOpen={setProductSearchOpen}
            setServiceSearchOpen={setServiceSearchOpen}
            setCategorySearchOpen={setCategorySearchOpen}
            setSubcategorySearchOpen={setSubcategorySearchOpen}
            setProductSearchValue={setProductSearchValue}
            setServiceSearchValue={setServiceSearchValue}
            setShowServiceForm={setShowServiceForm}
            setSelectedProduct={setSelectedProduct}
            setSelectedService={setSelectedService}
            setSelectedCategory={setSelectedCategory}
            setSelectedSubcategory={setSelectedSubcategory}
            setServices={setServices}
            setProducts={setProducts}
            setIsLoadingProducts={setIsLoadingProducts}
            image={image}
            setImage={setImage}
          />
        );
      case 3:
        return <ZoneStep3Company form={form} />;
      case 4:
        return <ZoneStep4Personal form={form} />;
      case 5:
        return (
          <ZoneStep5Review
            form={form}
            selectedProduct={selectedProduct}
            selectedService={selectedService}
            image={image}
          />
        );
      default:
        return null;
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    const fields = getFieldsForStep(stepIndex);
    return fields.every((field) => !!form.getValues(field));
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep || isStepCompleted(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-1 md:col-span-4 shrink-0">
            <StepIndicator
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={(step) => handleStepClick(step)}
            />
          </div>

          <div className="col-span-1 md:col-span-8">
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border mx-4 md:mx-0">
              <div className="min-h-[400px]">{renderStep()}</div>

              <div className="flex justify-between mt-8 gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    onClick={prevStep}
                  >
                    Previous
                  </Button>
                )}

                <Button
                  type="button"
                  className="bg-blue-500 ml-auto hover:bg-blue-600"
                  onClick={async () => {
                    if (currentStep === STEPS.length) {
                      form.handleSubmit(onSubmit)();
                    } else {
                      await nextStep();
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {currentStep === STEPS.length
                    ? isSubmitting
                      ? "Submitting..."
                      : "Submit Booking"
                    : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
