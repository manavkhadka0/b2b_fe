import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_OPTION } from "./constants";

interface ApplicationFiltersProps {
  filters: {
    company: string;
    category: string;
    status: string;
  };
  uniqueCategories: string[];
  onFilterChange: (filters: {
    company: string;
    category: string;
    status: string;
  }) => void;
}

export function ApplicationFilters({
  filters,
  uniqueCategories,
  onFilterChange,
}: ApplicationFiltersProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <Input
        placeholder="Search by Company Name"
        value={filters.company}
        onChange={(e) =>
          onFilterChange({ ...filters, company: e.target.value })
        }
      />
      <Select
        value={filters.category}
        onValueChange={(value) =>
          onFilterChange({ ...filters, category: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value={ALL_OPTION}>All Categories</SelectItem>
          {uniqueCategories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange({ ...filters, status: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value={ALL_OPTION}>All Status</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

