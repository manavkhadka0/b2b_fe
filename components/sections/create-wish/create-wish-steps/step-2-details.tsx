"use client";

import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import type {
  CreateWishFormValues,
  HSCode,
  Service,
  ImageUpload,
} from "@/types/create-wish-type";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "../service-form";
import { ImageUploadSection } from "./image-upload";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

interface Step2DetailsProps {
  form: UseFormReturn<CreateWishFormValues>;
  products: HSCode[];
  services: Service[];
  isLoadingProducts: boolean;
  isLoadingServices: boolean;
  selectedProduct: HSCode | null;
  selectedService: Service | null;
  productSearchOpen: boolean;
  serviceSearchOpen: boolean;
  productSearchValue: string;
  serviceSearchValue: string;
  showServiceForm: boolean;
  setProductSearchOpen: (open: boolean) => void;
  setServiceSearchOpen: (open: boolean) => void;
  setProductSearchValue: (value: string) => void;
  setServiceSearchValue: (value: string) => void;
  setShowServiceForm: (show: boolean) => void;
  setSelectedProduct: (product: HSCode | null) => void;
  setSelectedService: (service: Service | null) => void;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  image: ImageUpload | null;
  setImage: (image: ImageUpload | null) => void;
  setProducts: React.Dispatch<React.SetStateAction<HSCode[]>>;
  setIsLoadingProducts: (loading: boolean) => void;
}

export function Step2Details({
  form,
  products,
  services,
  isLoadingProducts,
  isLoadingServices,
  selectedProduct,
  selectedService,
  productSearchOpen,
  serviceSearchOpen,
  productSearchValue,
  serviceSearchValue,
  showServiceForm,
  setProductSearchOpen,
  setServiceSearchOpen,
  setProductSearchValue,
  setServiceSearchValue,
  setShowServiceForm,
  setSelectedProduct,
  setSelectedService,
  setServices,
  image,
  setImage,
  setProducts,
  setIsLoadingProducts,
}: Step2DetailsProps) {
  const type = form.watch("type");
  const [localSearchValue, setLocalSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(localSearchValue, 300);
  const [hasLoadedInitialProducts, setHasLoadedInitialProducts] =
    useState(false);

  // Load initial products when popover opens for the first time
  useEffect(() => {
    if (
      type === "Product" &&
      productSearchOpen &&
      !hasLoadedInitialProducts &&
      localSearchValue === "" &&
      products.length === 0
    ) {
      const loadInitialProducts = async () => {
        setIsLoadingProducts(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/hs-codes/?limit=20`
          );

          if (!response.ok) throw new Error("Failed to fetch products");

          const data = await response.json();
          setProducts(data.results || []);
          setHasLoadedInitialProducts(true);
        } catch (error) {
          console.error("Failed to fetch initial products:", error);
          toast.error("Failed to load products");
        } finally {
          setIsLoadingProducts(false);
        }
      };

      loadInitialProducts();
    }
  }, [
    productSearchOpen,
    type,
    hasLoadedInitialProducts,
    localSearchValue,
    products.length,
    setProducts,
    setIsLoadingProducts,
  ]);

  // Handle debounced search - update parent's search value only when >= 3 chars
  useEffect(() => {
    if (type === "Product") {
      if (debouncedSearchValue.length >= 3) {
        // Update parent's search value to trigger search
        setProductSearchValue(debouncedSearchValue);
      } else if (debouncedSearchValue === "" && hasLoadedInitialProducts) {
        // When search is cleared, reload initial products directly
        // We don't update productSearchValue here to avoid triggering parent's clear logic
        const loadInitialProducts = async () => {
          setIsLoadingProducts(true);
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/hs-codes/?limit=20`
            );

            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();
            setProducts(data.results || []);
          } catch (error) {
            console.error("Failed to fetch initial products:", error);
            toast.error("Failed to load products");
          } finally {
            setIsLoadingProducts(false);
          }
        };
        loadInitialProducts();
      } else if (
        debouncedSearchValue.length > 0 &&
        debouncedSearchValue.length < 3
      ) {
        // Clear products if search is less than 3 characters
        setProducts([]);
      }
    }
  }, [
    debouncedSearchValue,
    type,
    setProductSearchValue,
    hasLoadedInitialProducts,
    setProducts,
    setIsLoadingProducts,
  ]);

  // Reset local search when popover closes
  useEffect(() => {
    if (!productSearchOpen) {
      setLocalSearchValue("");
      // Reset flag so initial products load again when popover reopens
      setHasLoadedInitialProducts(false);
    }
  }, [productSearchOpen]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        {type === "Product" ? "Select Product" : "Select Service"}
      </h2>

      {type === "Product" ? (
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search Product (HS Code)</FormLabel>
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
                          products.find((p) => p.id.toString() === field.value)
                            ?.description ||
                          "Select a product"
                        : "Search products..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 max-h-80" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search HS codes..."
                      value={localSearchValue}
                      onValueChange={(value) => {
                        setLocalSearchValue(value);
                        if (value.length < 3 && value.length > 0) {
                          // Clear products if search is less than 3 characters
                          setProducts([]);
                        }
                      }}
                    />
                    <CommandEmpty>
                      {localSearchValue.length > 0 &&
                      localSearchValue.length < 3
                        ? "Type at least 3 characters to search..."
                        : isLoadingProducts
                        ? "Loading..."
                        : products.length === 0 && localSearchValue.length === 0
                        ? "Start typing to search..."
                        : "No products found."}
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {products.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={product.id.toString()}
                          onSelect={() => {
                            form.setValue("product", product.id.toString());
                            setSelectedProduct(product);
                            setProductSearchOpen(false);
                            setLocalSearchValue("");
                            setProductSearchValue("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              product.id.toString() === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span className="font-medium">{product.hs_code}</span>
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
      ) : (
        <>
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
                      <CommandGroup className="max-h-64 overflow-y-auto">
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
                                form.setValue("service", service.id.toString());
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
                                  {service.category?.name}
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

          <Dialog open={showServiceForm} onOpenChange={setShowServiceForm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Service</DialogTitle>
              </DialogHeader>
              <ServiceForm
                onSuccess={(service) => {
                  setServices((prev: Service[]) => [...prev, service]);
                  form.setValue("service", service.id.toString());
                  setSelectedService(service);
                  setShowServiceForm(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Additional Images (Optional)
        </h3>
        <ImageUploadSection image={image} setImage={setImage} />
      </div>
    </div>
  );
}
