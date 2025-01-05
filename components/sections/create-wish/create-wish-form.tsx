"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createWishSchema } from "@/types/schemas/create-wish-schemas";
import type {
  CreateWishFormValues,
  ImageUpload,
  HSCode,
  Service,
  Category,
  NewService,
} from "@/types/create-wish-type";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Upload, X } from "lucide-react";
import {
  designationOptions,
  wishTypeOptions,
} from "@/types/schemas/create-wish-schemas";
import { Event } from "@/types/events";
import { useDebouncedCallback } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "@/components/sections/create-wish/service-form";

interface CreateWishFormProps {
  event?: Event;
}

export function CreateWishForm({ event }: CreateWishFormProps) {
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [designationPopoverOpen, setDesignationPopoverOpen] = useState(false);
  const [wishTypePopoverOpen, setWishTypePopoverOpen] = useState(false);
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

  const form = useForm<CreateWishFormValues>({
    resolver: zodResolver(createWishSchema),
    defaultValues: {
      title: "",
      full_name: "",
      designation: "",
      email: "",
      mobile_no: "",
      alternate_no: "",
      company_name: "",
      company_website: "",
      product: "",
      service: "",
      images: [],
      address: "",
      province: "",
      municipality: "",
      ward: "",
      wish_type: "Product",
      event_id: event?.id?.toString() || "",
    },
  });

  const searchProducts = useDebouncedCallback(async (search: string) => {
    if (search.length < 3) return;

    setIsLoadingProducts(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/hs-codes/?search=${search}`
      );

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      console.log("Products data:", data);
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
    if (productSearchValue.length < 3) {
      setProducts([]);
    } else {
      searchProducts(productSearchValue);
    }
  }, [productSearchValue, searchProducts]);

  const onSubmit = async (data: CreateWishFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Handle form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          // Handle arrays separately
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, value);
          }
        }
      });

      // Handle file uploads
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image.file);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/wishes/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to create wish");

      toast.success("Wish created successfully!");
      form.reset();
      setImages([]);
    } catch (error) {
      toast.error("Failed to create wish");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/services/`
        );
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data.results);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        toast.error("Failed to fetch services");
      } finally {
        setIsLoadingServices(false);
      }
    };

    if (form.watch("wish_type") === "Service") {
      fetchServices();
    }
  }, [form.watch("wish_type")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* Dynamic Title */}
        <h1 className="text-2xl font-bold mb-6">
          {event ? `Create Wish for ${event.title}` : "Create New Wish"}
        </h1>

        {/* Title Section */}
        <div className="space-y-1">
          <div className="grid grid-cols-1 gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wish Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter wish title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="space-y-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <Popover
                    open={designationPopoverOpen}
                    onOpenChange={setDesignationPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? designationOptions.find(
                                (option) => option.value === field.value
                              )?.label
                            : "Select designation"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search designation..." />
                        <CommandEmpty>No designation found.</CommandEmpty>
                        <CommandGroup>
                          {designationOptions.map((option) => (
                            <CommandItem
                              value={option.value}
                              key={option.value}
                              onSelect={() => {
                                form.setValue("designation", option.value);
                                setDesignationPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  option.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alternate_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter alternate number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Company Information Section */}
        <div className="space-y-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="company_name"
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

            <FormField
              control={form.control}
              name="company_website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="Enter company website"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter province" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="municipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Municipality</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter municipality" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ward number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Wish Type Section */}
        <div className="space-y-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="wish_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Popover
                    open={wishTypePopoverOpen}
                    onOpenChange={setWishTypePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? wishTypeOptions.find(
                                (option) => option.value === field.value
                              )?.label
                            : "Select wish type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command defaultValue={field.value}>
                        <CommandInput placeholder="Search wish type..." />
                        <CommandEmpty>No type found.</CommandEmpty>
                        <CommandGroup>
                          {wishTypeOptions.map((option) => (
                            <CommandItem
                              value={option.value}
                              key={option.value}
                              onSelect={() => {
                                form.setValue(
                                  "wish_type",
                                  option.value as "Product" | "Service"
                                );
                                setWishTypePopoverOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  option.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Conditional Product Search Field */}
        {form.watch("wish_type") === "Product" && (
          <div className="space-y-1">
            <div className="grid grid-cols-1 gap-3">
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Product</FormLabel>
                    <Popover
                      open={productSearchOpen}
                      onOpenChange={setProductSearchOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? selectedProduct?.description ||
                                products.find(
                                  (p) => p.id.toString() === field.value
                                )?.description ||
                                "Select a product"
                              : "Search products..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search HS codes..."
                            value={productSearchValue}
                            onValueChange={setProductSearchValue}
                          />
                          <CommandEmpty>
                            {productSearchValue.length < 3
                              ? "Type at least 3 characters to search..."
                              : isLoadingProducts
                              ? "Loading..."
                              : products.length === 0
                              ? "No products found."
                              : null}
                          </CommandEmpty>
                          <CommandGroup>
                            {products.map((product) => (
                              <CommandItem
                                key={product.id}
                                value={product.id.toString()}
                                onSelect={() => {
                                  form.setValue(
                                    "product",
                                    product.id.toString()
                                  );
                                  setSelectedProduct(product);
                                  setProductSearchOpen(false);
                                  setProductSearchValue("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "h-4 w-4",
                                    product.id.toString() === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <span className="font-medium">
                                  {product.hs_code}
                                </span>
                                <span className="ml-2 text-gray-600">
                                  - {product.description}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Image Upload Section */}
        <div className="space-y-1">
          <div className="col-span-full">
            <div className="mt-2 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Image Preview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Service Section */}
        {form.watch("wish_type") === "Service" && (
          <div className="space-y-1">
            <div className="grid grid-cols-1 gap-3">
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Service</FormLabel>
                    <Popover
                      open={serviceSearchOpen}
                      onOpenChange={setServiceSearchOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? selectedService?.name ||
                                services.find(
                                  (s) => s.id.toString() === field.value
                                )?.name ||
                                "Select a service"
                              : "Select a service"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search services..."
                            value={serviceSearchValue}
                            onValueChange={setServiceSearchValue}
                          />
                          <CommandEmpty>
                            {isLoadingServices ? (
                              "Loading..."
                            ) : (
                              <div className="p-4 text-center">
                                <p className="text-sm text-gray-500 mb-2">
                                  No services found
                                </p>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowServiceForm(true);
                                    setServiceSearchOpen(false);
                                  }}
                                >
                                  Create New Service
                                </Button>
                              </div>
                            )}
                          </CommandEmpty>
                          <CommandGroup>
                            {services
                              .filter((service) =>
                                service.name
                                  .toLowerCase()
                                  .includes(serviceSearchValue.toLowerCase())
                              )
                              .map((service) => (
                                <CommandItem
                                  key={service.id}
                                  value={service.id.toString()}
                                  onSelect={() => {
                                    form.setValue(
                                      "service",
                                      service.id.toString()
                                    );
                                    setSelectedService(service);
                                    setServiceSearchOpen(false);
                                    setServiceSearchValue("");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      service.id.toString() === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {service.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {service.category.name}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Service Creation Dialog */}
        <Dialog open={showServiceForm} onOpenChange={setShowServiceForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
            </DialogHeader>
            <ServiceForm
              onSuccess={(service) => {
                setServices((prev) => [...prev, service]);
                form.setValue("service", service.id.toString());
                setSelectedService(service);
                setShowServiceForm(false);
                toast.success("Service created successfully!");
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Creating..." : "Create Wish"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
