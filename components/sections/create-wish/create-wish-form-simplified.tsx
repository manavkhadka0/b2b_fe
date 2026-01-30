"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { createWishOfferSimplifiedSchema } from "@/types/schemas/create-wish-schemas";
import type {
  CreateWishFormValues,
  ImageUpload,
  HSCode,
  Service,
  Category,
  SubCategory,
} from "@/types/create-wish-type";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./create-wish-steps/step-indicator";
import { Step1Type } from "./create-wish-steps/step-1-type";
import { Step2Details } from "./create-wish-steps/step-2-details";
import { X } from "lucide-react";

interface CreateWishFormSimplifiedProps {
  onClose?: () => void;
  is_wish_or_offer: "wishes" | "offers";
  initialValues?: Partial<CreateWishFormValues>;
}

export function CreateWishOfferFormSimplified({
  onClose,
  is_wish_or_offer,
  initialValues,
}: CreateWishFormSimplifiedProps) {
  const [image, setImage] = useState<ImageUpload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const STEPS = [
    {
      title: "Type",
      description: `Choose ${
        is_wish_or_offer === "wishes" ? "wish" : "offer"
      } type`,
    },
    {
      title: "Review",
      description: "Review and submit",
    },
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
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
  const hasFetchedService = useRef(false);

  const form = useForm<CreateWishFormValues>({
    resolver: zodResolver(createWishOfferSimplifiedSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      title: "",
      product: "",
      service: "",
      category: "",
      subcategory: "",
      description: "",
      images: [],
      type: "Product",
      ...initialValues,
    },
  });

  // Fetch service details when service ID is provided in initialValues
  useEffect(() => {
    const serviceId = initialValues?.service;
    if (serviceId && serviceId.toString().trim() !== "" && !hasFetchedService.current) {
      hasFetchedService.current = true;
      const fetchServiceDetails = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/services/${serviceId}/`,
          );
          if (!response.ok) throw new Error("Failed to fetch service details");
          const data = await response.json();
          setServiceDetails(data);
          setSelectedService(data);
          
          // Set subcategory if available
          if (data.subcategory?.id) {
            form.setValue("subcategory", data.subcategory.id.toString());
            setSelectedSubcategory(data.subcategory);
          } else if (data.SubCategory) {
            const subcategoryId = typeof data.SubCategory === 'number' 
              ? data.SubCategory.toString() 
              : (data.SubCategory as SubCategory)?.id?.toString();
            if (subcategoryId) {
              form.setValue("subcategory", subcategoryId);
              // Try to find and set the subcategory object
              if (typeof data.SubCategory === 'object' && data.SubCategory.id) {
                setSelectedSubcategory(data.SubCategory as SubCategory);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch service details:", error);
        }
      };
      fetchServiceDetails();
    }
  }, [initialValues?.service]);

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

  const getFieldsForStep = (step: number): (keyof CreateWishFormValues)[] => {
    switch (step) {
      case 1:
        return ["title", "type"];
      case 2:
        return ["title", "type"];
      default:
        return ["title", "type"];
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

  const onSubmit = async (data: CreateWishFormValues) => {
    if (currentStep !== STEPS.length) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append non-file fields, including product/service if present in initialValues
      Object.entries(data).forEach(([key, value]) => {
        if (value && key !== "images") {
          // Only append product/service if they have values (from initialValues)
          if (key === "product" || key === "service") {
            if (value && value.toString().trim() !== "") {
              formData.append(key, value.toString());
            }
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Append service name if service ID is present
      if (data.service && data.service.toString().trim() !== "" && serviceDetails) {
        formData.append("service_name", serviceDetails.name);
      }

      // Append subcategory ID if present
      if (data.subcategory && data.subcategory.toString().trim() !== "") {
        formData.append("subcategory_id", data.subcategory.toString());
      } else if (serviceDetails?.subcategory?.id) {
        formData.append("subcategory_id", serviceDetails.subcategory.id.toString());
      } else if (serviceDetails?.SubCategory) {
        const subcategoryId = typeof serviceDetails.SubCategory === 'number' 
          ? serviceDetails.SubCategory.toString() 
          : (serviceDetails.SubCategory as SubCategory)?.id?.toString();
        if (subcategoryId) {
          formData.append("subcategory_id", subcategoryId);
        }
      }

      // Append single image if it exists
      if (image) {
        formData.append("image", image.file);
      }

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/${is_wish_or_offer}/`;
      const url = baseUrl;

      const response = await fetch(url, {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
        body: formData,
      });

      if (!response.ok)
        throw new Error(
          `Failed to create ${
            is_wish_or_offer === "wishes" ? "wish" : "offer"
          }`,
        );

      toast.success(
        `${
          is_wish_or_offer === "wishes" ? "Wish" : "Offer"
        } created successfully!`,
      );

      if (onClose) {
        form.reset();
        setImage(null);
        onClose();
      }
    } catch (error) {
      console.error(
        `Failed to create ${
          is_wish_or_offer === "wishes" ? "wish" : "offer"
        }:`,
        error,
      );
      toast.error(
        `Failed to create ${
          is_wish_or_offer === "wishes" ? "wish" : "offer"
        }`,
      );
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Type form={form} is_wish_or_offer={is_wish_or_offer} />;
      case 2:
        return (
          <Step3ReviewSimplified
            form={form}
            selectedProduct={selectedProduct}
            selectedService={selectedService}
            image={image}
            is_wish_or_offer={is_wish_or_offer}
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
          {/* Left side - Steps */}
          <div className="col-span-1 md:col-span-4 shrink-0">
            <StepIndicator
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={(step) => handleStepClick(step)}
            />
          </div>

          {/* Right side - Form content */}
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
                      ? "Creating..."
                      : is_wish_or_offer === "wishes"
                        ? "Create Wish"
                        : "Create Offer"
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

// Simplified Review Step without company and personal information
function Step3ReviewSimplified({
  form,
  selectedProduct,
  selectedService,
  image,
  is_wish_or_offer,
}: {
  form: any;
  selectedProduct: HSCode | null;
  selectedService: Service | null;
  image: { url: string } | null;
  is_wish_or_offer: "wishes" | "offers";
}) {
  const values = form.getValues();

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold">
        Review Your {is_wish_or_offer === "wishes" ? "Wish" : "Offer"}
      </h2>

      <div className="space-y-6">
        {/* Wish/Offer Details */}
        <div className="space-y-2">
          <h3 className="font-medium">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">Title:</span>
              <p className="font-medium">{values.title || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Type:</span>
              <p className="font-medium">{values.type}</p>
            </div>
            {values.description && (
              <div className="col-span-full">
                <span className="text-sm text-gray-500">Description:</span>
                <p className="font-medium">{values.description}</p>
              </div>
            )}
            {/* Only show product/service info if it exists in form values */}
            {values.product && (
              <div className="col-span-full">
                <span className="text-sm text-gray-500">Product ID:</span>
                <p className="font-medium">{values.product}</p>
              </div>
            )}
            {values.service && (
              <div className="col-span-full">
                <span className="text-sm text-gray-500">Service ID:</span>
                <p className="font-medium">{values.service}</p>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        {image && (
          <div className="space-y-2">
            <h3 className="font-medium">Uploaded Image</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <img
                src={image.url}
                alt="Uploaded Image"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
