"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card, CardContent } from "@/components/ui/card";
import { UnitGroup } from "@/types/unit-groups";
import { Job } from "@/types/job";
import { useDebounce } from "@/hooks/use-debounce";
import { getUnitGroups } from "@/services/jobs";
import { Loader2 } from "lucide-react";

const postJobSchema = z
  .object({
    title: z.string().min(2, "Job title is required"),
    company_name: z.string().optional(),
    unit_group: z.string().min(1, "Unit group is required"),
    required_skill_level: z.enum([
      "RPL",
      "Level 1",
      "Level 2",
      "Level 3",
      "Level 4",
      "Level 5",
      "Level 6",
      "Level 7",
      "Level 8",
      "None",
    ]),
    required_education: z.enum([
      "General Literate",
      "Below SLC",
      "+2",
      "Bachelors",
      "Master & above",
      "Pre-Diploma",
      "Diploma",
      "TLSC",
      "No Education",
    ]),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    responsibilities: z.string().optional(),
    requirements: z.string().optional(),
    show_salary: z.boolean(),
    salary_range_min: z.number().optional(),
    salary_range_max: z.number().optional(),
    location: z.string().min(1, "Location is required"),
    deadline: z.date({
      required_error: "Deadline is required",
    }),
    employment_type: z.enum([
      "Full Time",
      "Part Time",
      "Contract",
      "Internship",
      "All",
    ]),
  })
  .refine(
    (data) => {
      if (data.show_salary) {
        if (
          data.salary_range_min === undefined ||
          data.salary_range_max === undefined
        ) {
          return false; // Both salary fields must be provided
        }
        return data.salary_range_max > data.salary_range_min;
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than minimum salary",
      path: ["salary_range_max"],
    },
  );

const qualifications = [
  { label: "General Literate", value: "General Literate" },
  { label: "Below SLC", value: "Below SLC" },
  { label: "+2", value: "+2" },
  { label: "Bachelors", value: "Bachelors" },
  { label: "Master & above", value: "Master & above" },
  { label: "Pre-Diploma", value: "Pre-Diploma" },
  { label: "Diploma", value: "Diploma" },
  { label: "TLSC", value: "TLSC" },
  { label: "No Education", value: "No Education" },
] as const;

const skillLevels = [
  { label: "RPL", value: "RPL" },
  { label: "Level 1", value: "Level 1" },
  { label: "Level 2", value: "Level 2" },
  { label: "Level 3", value: "Level 3" },
  { label: "Level 4", value: "Level 4" },
  { label: "Level 5", value: "Level 5" },
  { label: "Level 6", value: "Level 6" },
  { label: "Level 7", value: "Level 7" },
  { label: "Level 8", value: "Level 8" },
  { label: "None", value: "None" },
] as const;

const employmentTypes = [
  { label: "Full Time", value: "Full Time" },
  { label: "Part Time", value: "Part Time" },
  { label: "Contract", value: "Contract" },
  { label: "Internship", value: "Internship" },
  { label: "All", value: "All" },
] as const;

interface PostJobFormProps {
  unitGroups: UnitGroup[];
  initialData?: Job;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export function PostJobForm({
  unitGroups,
  initialData,
  isEditing,
  onSuccess,
}: PostJobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unitGroupSearchInput, setUnitGroupSearchInput] = useState("");
  const [unitGroupsForForm, setUnitGroupsForForm] = useState<UnitGroup[]>([]);
  const [unitGroupComboboxOpen, setUnitGroupComboboxOpen] = useState(false);
  const [isLoadingUnitGroups, setIsLoadingUnitGroups] = useState(false);
  const debouncedUnitGroupSearch = useDebounce(unitGroupSearchInput, 300);
  const router = useRouter();

  // Helper function to safely cast enum values
  const getEmploymentType = (
    value?: string,
  ): z.infer<typeof postJobSchema>["employment_type"] => {
    if (value && employmentTypes.some((t) => t.value === value)) {
      return value as z.infer<typeof postJobSchema>["employment_type"];
    }
    return "Full Time";
  };

  const getSkillLevel = (
    value?: string,
  ): z.infer<typeof postJobSchema>["required_skill_level"] => {
    if (value && skillLevels.some((l) => l.value === value)) {
      return value as z.infer<typeof postJobSchema>["required_skill_level"];
    }
    return "None";
  };

  const getEducation = (
    value?: string,
  ): z.infer<typeof postJobSchema>["required_education"] => {
    if (value && qualifications.some((q) => q.value === value)) {
      return value as z.infer<typeof postJobSchema>["required_education"];
    }
    return "No Education";
  };

  const form = useForm<z.infer<typeof postJobSchema>>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      title: initialData?.title || "",
      company_name: initialData?.company_name || "",
      unit_group: initialData?.unit_group.code || "",
      employment_type: getEmploymentType(initialData?.employment_type),
      required_skill_level: getSkillLevel(initialData?.required_skill_level),
      required_education: getEducation(initialData?.required_education),
      salary_range_min: parseInt(
        initialData?.salary_range_min?.toString() || "0",
      ),
      salary_range_max: parseInt(
        initialData?.salary_range_max?.toString() || "0",
      ),
      location:
        initialData?.location?.map((l) => l.name).join(", ") || "",
      deadline: initialData?.deadline
        ? new Date(initialData.deadline)
        : new Date(),
      description: initialData?.description || "",
      responsibilities: initialData?.responsibilities || "",
      requirements: initialData?.requirements || "",
      show_salary: initialData?.show_salary ?? true,
    },
  });

  async function onSubmit(data: z.infer<typeof postJobSchema>) {
    setIsSubmitting(true);
    try {
      // Format deadline as ISO string
      const payload = {
        ...data,
        deadline: data.deadline.toISOString(),
      };

      if (isEditing && initialData) {
        // Update existing job
        await api.put(`/api/jobs/${initialData.slug}/`, payload);
        toast.success("Job updated successfully");
      } else {
        // Create new job
        await api.post("/api/jobs/", payload);
        toast.success("Job posted successfully");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/jobs");
      }
    } catch (error: any) {
      console.error("Error saving job:", error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else if (error.response?.data) {
        // Handle field-specific errors
        const errorData = error.response.data;
        const errorMessages = Object.entries(errorData)
          .map(
            ([key, value]) =>
              `${key}: ${Array.isArray(value) ? value[0] : value}`,
          )
          .join(", ");
        toast.error(errorMessages || "Failed to save job");
      } else {
        toast.error(
          `Failed to ${isEditing ? "update" : "post"} job. Please try again.`,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Watch show_salary to conditionally render salary fields
  const showSalary = form.watch("show_salary");

  useEffect(() => {
    if (!unitGroupComboboxOpen) return;
    const fetchUnitGroups = async () => {
      setIsLoadingUnitGroups(true);
      try {
        const data = await getUnitGroups(debouncedUnitGroupSearch || undefined);
        setUnitGroupsForForm(data);
      } catch (err) {
        console.warn("Failed to fetch unit groups", err);
        setUnitGroupsForForm([]);
      } finally {
        setIsLoadingUnitGroups(false);
      }
    };
    void fetchUnitGroups();
  }, [unitGroupComboboxOpen, debouncedUnitGroupSearch]);

  // Group unit groups by major group (for combobox options from backend search)
  const groupedUnitGroupsForForm = unitGroupsForForm.reduce(
    (acc, unitGroup) => {
      const majorGroup = unitGroup?.minor_group?.sub_major_group?.major_group;
      if (!majorGroup) return acc;
      if (!acc[majorGroup.title]) acc[majorGroup.title] = [];
      acc[majorGroup.title].push(unitGroup);
      return acc;
    },
    {} as Record<string, UnitGroup[]>,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section Title Component */}
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">
              {isEditing ? "Edit Job Posting" : "Create New Job Posting"}
            </h1>
          </div>

          {/* Basic Information Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Basic Information
            </h2>
            <Card className="shadow-sm border border-slate-200">
              <CardContent className="pt-6 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Senior Software Engineer"
                            {...field}
                            className="border-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Company Name */}
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Tech Solutions Inc."
                            {...field}
                            className="border-slate-200"
                          />
                        </FormControl>
                        <FormDescription>
                          Optional - Leave blank to use your profile name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Unit Group */}
                  <FormField
                    control={form.control}
                    name="unit_group"
                    render={({ field }) => {
                      const selectedGroup =
                        unitGroups.find((g) => g.code === field.value) ??
                        unitGroupsForForm.find((g) => g.code === field.value);
                      return (
                        <FormItem>
                          <FormLabel>Unit Group</FormLabel>
                          <Popover
                            open={unitGroupComboboxOpen}
                            onOpenChange={(open) => {
                              setUnitGroupComboboxOpen(open);
                              if (open) setUnitGroupSearchInput("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between border-slate-200",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value && selectedGroup
                                    ? selectedGroup.title
                                    : "Select unit group"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[450px] p-0">
                              <Command shouldFilter={false}>
                                <CommandInput
                                  placeholder="Search unit group..."
                                  value={unitGroupSearchInput}
                                  onValueChange={setUnitGroupSearchInput}
                                />
                                <CommandList>
                                  {isLoadingUnitGroups ? (
                                    <div className="flex items-center justify-center py-6">
                                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                  ) : (
                                    <>
                                      <CommandEmpty>
                                        No unit group found.
                                      </CommandEmpty>
                                      {Object.entries(
                                        groupedUnitGroupsForForm,
                                      ).map(([majorGroupTitle, groups]) => (
                                        <CommandGroup
                                          key={majorGroupTitle}
                                          heading={majorGroupTitle}
                                        >
                                          {groups.map((group) => (
                                            <CommandItem
                                              key={group.code}
                                              value={group.code}
                                              onSelect={() => {
                                                form.setValue(
                                                  "unit_group",
                                                  group.code,
                                                );
                                              }}
                                            >
                                              <div className="flex flex-col">
                                                <span>{group.title}</span>
                                                <span className="text-xs text-muted-foreground">
                                                  {
                                                    group.minor_group
                                                      ?.sub_major_group?.title
                                                  }{" "}
                                                  - {group.code}
                                                </span>
                                              </div>
                                              <Check
                                                className={cn(
                                                  "ml-auto h-4 w-4",
                                                  group.code === field.value
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                                )}
                                              />
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      ))}
                                    </>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {/* Employment Type */}
                  <FormField
                    control={form.control}
                    name="employment_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between border-slate-200",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? employmentTypes.find(
                                      (type) => type.value === field.value,
                                    )?.label
                                  : "Select employment type"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search employment type..." />
                              <CommandList>
                                <CommandEmpty>No type found.</CommandEmpty>
                                <CommandGroup>
                                  {employmentTypes.map((type) => (
                                    <CommandItem
                                      value={type.label}
                                      key={type.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "employment_type",
                                          type.value,
                                        );
                                      }}
                                    >
                                      {type.label}
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          type.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requirements Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Requirements
            </h2>
            <Card className="shadow-sm border border-slate-200">
              <CardContent className="pt-6 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Required Skill Level */}
                  <FormField
                    control={form.control}
                    name="required_skill_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skill Level</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between border-slate-200",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? skillLevels.find(
                                      (level) => level.value === field.value,
                                    )?.label
                                  : "Select skill level"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search skill level..." />
                              <CommandList>
                                <CommandEmpty>No level found.</CommandEmpty>
                                <CommandGroup>
                                  {skillLevels.map((level) => (
                                    <CommandItem
                                      value={level.label}
                                      key={level.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "required_skill_level",
                                          level.value,
                                        );
                                      }}
                                    >
                                      {level.label}
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          level.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Required Education */}
                  <FormField
                    control={form.control}
                    name="required_education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Education</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between border-slate-200",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? qualifications.find(
                                      (qualification) =>
                                        qualification.value === field.value,
                                    )?.label
                                  : "Select education level"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search education level..." />
                              <CommandList>
                                <CommandEmpty>No level found.</CommandEmpty>
                                <CommandGroup>
                                  {qualifications.map((qualification) => (
                                    <CommandItem
                                      value={qualification.label}
                                      key={qualification.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "required_education",
                                          qualification.value,
                                        );
                                      }}
                                    >
                                      {qualification.label}
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          qualification.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Details Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Job Details
            </h2>
            <Card className="shadow-sm border border-slate-200">
              <CardContent className="pt-6 space-y-6">
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Controller
                          name="description"
                          control={form.control}
                          render={({ field }) => (
                            <MinimalTiptapEditor
                              value={field.value}
                              onChange={field.onChange}
                              className="min-h-[200px] border border-slate-200 rounded-md"
                              editorContentClassName="p-4"
                              output="html"
                              placeholder="Enter detailed job description..."
                              autofocus={false}
                              editable={true}
                              editorClassName="focus:outline-none prose prose-sm dark:prose-invert max-w-none"
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Responsibilities */}
                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Controller
                          name="responsibilities"
                          control={form.control}
                          render={({ field }) => (
                            <MinimalTiptapEditor
                              value={field.value}
                              onChange={field.onChange}
                              className="min-h-[200px] border border-slate-200 rounded-md"
                              editorContentClassName="p-4"
                              output="html"
                              placeholder="Enter job responsibilities..."
                              autofocus={false}
                              editable={true}
                              editorClassName="focus:outline-none prose prose-sm dark:prose-invert max-w-none"
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Requirements */}
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Controller
                          name="requirements"
                          control={form.control}
                          render={({ field }) => (
                            <MinimalTiptapEditor
                              value={field.value}
                              onChange={field.onChange}
                              className="min-h-[200px] border border-slate-200 rounded-md"
                              editorContentClassName="p-4"
                              output="html"
                              placeholder="Enter job requirements..."
                              autofocus={false}
                              editable={true}
                              editorClassName="focus:outline-none prose prose-sm dark:prose-invert max-w-none"
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Compensation Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Compensation
            </h2>
            <Card className="shadow-sm border border-slate-200">
              <CardContent className="pt-6 space-y-6">
                <FormField
                  control={form.control}
                  name="show_salary"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 p-4 bg-slate-50">
                      <div className="space-y-0.5">
                        <FormLabel>Show Salary Range</FormLabel>
                        <FormDescription>
                          Display salary range in job posting
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {showSalary && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="salary_range_min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Salary</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Enter minimum salary"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              className="border-slate-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salary_range_max"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Salary</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Enter maximum salary"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              className="border-slate-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Details Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Additional Details
            </h2>
            <Card className="shadow-sm border border-slate-200">
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Job Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Kathmandu, Lalitpur"
                            {...field}
                            className="border-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Deadline */}
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="col-span-full md:col-span-1">
                        <FormLabel>Application Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal border-slate-200",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Buttons */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4 px-6 -mx-4 sm:-mx-6 lg:-mx-8 mt-6">
            <div className="max-w-6xl mx-auto flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-32 border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-32 bg-slate-900 hover:bg-slate-800 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Posting..."
                  : isEditing
                    ? "Update Job"
                    : "Post Job"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
