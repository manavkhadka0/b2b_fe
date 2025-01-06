"use client";

import { UseFormReturn } from "react-hook-form";
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
  images: ImageUpload[];
  setImages: (images: ImageUpload[]) => void;
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
  images,
  setImages,
}: Step2DetailsProps) {
  const wishType = form.watch("wish_type");

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        {wishType === "Product" ? "Select Product" : "Select Service"}
      </h2>

      {wishType === "Product" ? (
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
                        : "No products found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {products.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={product.id.toString()}
                          onSelect={() => {
                            form.setValue("product", product.id.toString());
                            setSelectedProduct(product);
                            setProductSearchOpen(false);
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
        <ImageUploadSection images={images} setImages={setImages} />
      </div>
    </div>
  );
}
