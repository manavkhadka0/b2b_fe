"use client";

import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import type {
  ExperienceZoneBookingFormValues,
  HSCode,
  Service,
  Category,
  SubCategory,
  ImageUpload,
} from "@/types/experience-zone-booking-type";
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
import { ServiceForm } from "../../create-wish/service-form";
import { ImageUploadSection } from "../../create-wish/create-wish-steps/image-upload";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

interface ZoneStep2DetailsProps {
  form: UseFormReturn<ExperienceZoneBookingFormValues>;
  products: HSCode[];
  services: Service[];
  categories: Category[];
  subcategories: SubCategory[];
  isLoadingProducts: boolean;
  isLoadingServices: boolean;
  isLoadingCategories: boolean;
  isLoadingSubcategories: boolean;
  selectedProduct: HSCode | null;
  selectedService: Service | null;
  selectedCategory: Category | null;
  selectedSubcategory: SubCategory | null;
  productSearchOpen: boolean;
  serviceSearchOpen: boolean;
  categorySearchOpen: boolean;
  subcategorySearchOpen: boolean;
  productSearchValue: string;
  serviceSearchValue: string;
  showServiceForm: boolean;
  setProductSearchOpen: (open: boolean) => void;
  setServiceSearchOpen: (open: boolean) => void;
  setCategorySearchOpen: (open: boolean) => void;
  setSubcategorySearchOpen: (open: boolean) => void;
  setProductSearchValue: (value: string) => void;
  setServiceSearchValue: (value: string) => void;
  setShowServiceForm: (show: boolean) => void;
  setSelectedProduct: (product: HSCode | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedSubcategory: (subcategory: SubCategory | null) => void;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setProducts: React.Dispatch<React.SetStateAction<HSCode[]>>;
  setIsLoadingProducts: (loading: boolean) => void;
  image: ImageUpload | null;
  setImage: (image: ImageUpload | null) => void;
}

export function ZoneStep2Details({
  form,
  products,
  services,
  categories,
  subcategories,
  isLoadingProducts,
  isLoadingServices,
  isLoadingCategories,
  isLoadingSubcategories,
  selectedProduct,
  selectedService,
  selectedCategory,
  selectedSubcategory,
  productSearchOpen,
  serviceSearchOpen,
  categorySearchOpen,
  subcategorySearchOpen,
  productSearchValue,
  serviceSearchValue,
  showServiceForm,
  setProductSearchOpen,
  setServiceSearchOpen,
  setCategorySearchOpen,
  setSubcategorySearchOpen,
  setProductSearchValue,
  setServiceSearchValue,
  setShowServiceForm,
  setSelectedProduct,
  setSelectedService,
  setSelectedCategory,
  setSelectedSubcategory,
  setServices,
  setProducts,
  setIsLoadingProducts,
  image,
  setImage,
}: ZoneStep2DetailsProps) {
  const type = form.watch("type");
  const [localSearchValue, setLocalSearchValue] = useState("");
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [subcategorySearchValue, setSubcategorySearchValue] = useState("");
  const debouncedSearchValue = useDebounce(localSearchValue, 300);
  const [hasLoadedInitialProducts, setHasLoadedInitialProducts] =
    useState(false);

  const filteredCategories = categories.filter((category) => {
    const search = categorySearchValue.toLowerCase().trim();
    if (!search) return true;
    const matchesName = category.name.toLowerCase().includes(search);
    const matchesDescription = category.description
      ?.toLowerCase()
      .includes(search);
    return matchesName || matchesDescription;
  });

  const filteredSubcategories = subcategories.filter((subcategory) => {
    const search = subcategorySearchValue.toLowerCase().trim();
    if (!search) return true;
    const matchesName = subcategory.name.toLowerCase().includes(search);
    const matchesExample = subcategory.example_items
      ?.toLowerCase()
      .includes(search);
    const matchesReference = subcategory.reference
      ?.toLowerCase()
      .includes(search);
    return matchesName || matchesExample || matchesReference;
  });

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
          const subcategoryId = form.watch("subcategory");
          let url = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/hs-codes/?limit=20`;
          if (subcategoryId) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/hs-codes/?subcategory_id=${subcategoryId}`;
          }
          const response = await fetch(url);
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
    form.watch("subcategory"),
  ]);

  useEffect(() => {
    if (type === "Product") {
      if (debouncedSearchValue.length >= 3) {
        setProductSearchValue(debouncedSearchValue);
      } else if (debouncedSearchValue === "" && hasLoadedInitialProducts) {
        const loadInitialProducts = async () => {
          setIsLoadingProducts(true);
          try {
            const subcategoryId = form.watch("subcategory");
            let url = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/hs-codes/?limit=20`;
            if (subcategoryId) {
              url = `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/hs-codes/?subcategory_id=${subcategoryId}`;
            }
            const response = await fetch(url);
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
    form.watch("subcategory"),
  ]);

  useEffect(() => {
    if (!productSearchOpen) {
      setLocalSearchValue("");
      setHasLoadedInitialProducts(false);
    }
  }, [productSearchOpen]);

  useEffect(() => {
    if (!categorySearchOpen) setCategorySearchValue("");
  }, [categorySearchOpen]);

  useEffect(() => {
    if (!subcategorySearchOpen) setSubcategorySearchValue("");
  }, [subcategorySearchOpen]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        {type === "Product" ? "Select Product" : "Select Service"}
      </h2>

      {type === "Product" ? (
        <>
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Category</FormLabel>
                <Popover
                  open={categorySearchOpen}
                  onOpenChange={setCategorySearchOpen}
                  modal={true}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? selectedCategory?.name ||
                            categories.find(
                              (c) => c.id.toString() === field.value,
                            )?.name ||
                            "Select a category"
                          : "Select category..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 max-h-80" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search categories..."
                        value={categorySearchValue}
                        onValueChange={setCategorySearchValue}
                      />
                      <CommandEmpty>
                        {isLoadingCategories
                          ? "Loading..."
                          : categories.length === 0
                            ? "No categories available"
                            : "No categories found."}
                      </CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-y-auto">
                        {filteredCategories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.id.toString()}
                            onSelect={() => {
                              form.setValue("category", category.id.toString());
                              setSelectedCategory(category);
                              setCategorySearchOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                category.id.toString() === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <span className="font-medium">{category.name}</span>
                            {category.description && (
                              <span className="ml-2 text-gray-600">
                                - {category.description}
                              </span>
                            )}
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

          {selectedCategory && (
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Subcategory</FormLabel>
                  <Popover
                    open={subcategorySearchOpen}
                    onOpenChange={setSubcategorySearchOpen}
                    modal={true}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? selectedSubcategory?.name ||
                              subcategories.find(
                                (sc) => sc.id.toString() === field.value,
                              )?.name ||
                              "Select a subcategory"
                            : "Select subcategory..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0 max-h-80"
                      align="start"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search subcategories..."
                          value={subcategorySearchValue}
                          onValueChange={setSubcategorySearchValue}
                        />
                        <CommandEmpty>
                          {isLoadingSubcategories
                            ? "Loading..."
                            : subcategories.length === 0
                              ? "No subcategories available"
                              : "No subcategories found."}
                        </CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-y-auto">
                          {filteredSubcategories.map((subcategory) => (
                            <CommandItem
                              key={subcategory.id}
                              value={subcategory.id.toString()}
                              onSelect={() => {
                                form.setValue(
                                  "subcategory",
                                  subcategory.id.toString(),
                                );
                                setSelectedSubcategory(subcategory);
                                setSubcategorySearchOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  subcategory.id.toString() === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {subcategory.name}
                                </span>
                                {subcategory.example_items && (
                                  <span className="text-xs text-gray-500">
                                    {subcategory.example_items}
                                  </span>
                                )}
                                {subcategory.reference && (
                                  <span className="text-xs text-gray-400">
                                    Ref: {subcategory.reference}
                                  </span>
                                )}
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
          )}

          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Product (HS Code)</FormLabel>
                <Popover
                  open={productSearchOpen}
                  onOpenChange={setProductSearchOpen}
                  modal={true}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? selectedProduct?.description ||
                            products.find(
                              (p) => p.id.toString() === field.value,
                            )?.description ||
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
                            : products.length === 0 &&
                                localSearchValue.length === 0
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
                                  : "opacity-0",
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
        </>
      ) : (
        <>
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Category</FormLabel>
                <Popover
                  open={categorySearchOpen}
                  onOpenChange={setCategorySearchOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? selectedCategory?.name ||
                            categories.find(
                              (c) => c.id.toString() === field.value,
                            )?.name ||
                            "Select a category"
                          : "Select category..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 max-h-80" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search categories..."
                        value={categorySearchValue}
                        onValueChange={setCategorySearchValue}
                      />
                      <CommandEmpty>
                        {isLoadingCategories
                          ? "Loading..."
                          : categories.length === 0
                            ? "No categories available"
                            : "No categories found."}
                      </CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-y-auto">
                        {filteredCategories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.id.toString()}
                            onSelect={() => {
                              form.setValue("category", category.id.toString());
                              setSelectedCategory(category);
                              setCategorySearchOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                category.id.toString() === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <span className="font-medium">{category.name}</span>
                            {category.description && (
                              <span className="ml-2 text-gray-600">
                                - {category.description}
                              </span>
                            )}
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

          {selectedCategory && (
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Subcategory</FormLabel>
                  <Popover
                    open={subcategorySearchOpen}
                    onOpenChange={setSubcategorySearchOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? selectedSubcategory?.name ||
                              subcategories.find(
                                (sc) => sc.id.toString() === field.value,
                              )?.name ||
                              "Select a subcategory"
                            : "Select subcategory..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0 max-h-80"
                      align="start"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search subcategories..."
                          value={subcategorySearchValue}
                          onValueChange={setSubcategorySearchValue}
                        />
                        <CommandEmpty>
                          {isLoadingSubcategories
                            ? "Loading..."
                            : subcategories.length === 0
                              ? "No subcategories available"
                              : "No subcategories found."}
                        </CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-y-auto">
                          {filteredSubcategories.map((subcategory) => (
                            <CommandItem
                              key={subcategory.id}
                              value={subcategory.id.toString()}
                              onSelect={() => {
                                form.setValue(
                                  "subcategory",
                                  subcategory.id.toString(),
                                );
                                setSelectedSubcategory(subcategory);
                                setSubcategorySearchOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  subcategory.id.toString() === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {subcategory.name}
                                </span>
                                {subcategory.example_items && (
                                  <span className="text-xs text-gray-500">
                                    {subcategory.example_items}
                                  </span>
                                )}
                                {subcategory.reference && (
                                  <span className="text-xs text-gray-400">
                                    Ref: {subcategory.reference}
                                  </span>
                                )}
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
          )}

          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Service</FormLabel>
                <Popover
                  open={serviceSearchOpen}
                  onOpenChange={setServiceSearchOpen}
                  modal={true}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? selectedService?.name ||
                            services.find(
                              (s) => s.id.toString() === field.value,
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
                        {services.map((service) => (
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
                                  : "opacity-0",
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
        <h3 className="text-lg font-semibold mb-4">Product Image (Optional)</h3>
        <ImageUploadSection image={image} setImage={setImage} />
      </div>
    </div>
  );
}
