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
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label
          htmlFor="filter-company"
          className="mb-1.5 block text-xs font-medium text-slate-500"
        >
          Company
        </label>
        <Input
          id="filter-company"
          placeholder="Search by company name"
          value={filters.company}
          onChange={(e) =>
            onFilterChange({ ...filters, company: e.target.value })
          }
          className="border-slate-200"
        />
      </div>
      <div>
        <label
          htmlFor="filter-category"
          className="mb-1.5 block text-xs font-medium text-slate-500"
        >
          Category
        </label>
        <Select
          value={filters.category}
          onValueChange={(value) =>
            onFilterChange({ ...filters, category: value })
          }
        >
          <SelectTrigger id="filter-category" className="border-slate-200">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION}>All categories</SelectItem>
            {uniqueCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label
          htmlFor="filter-status"
          className="mb-1.5 block text-xs font-medium text-slate-500"
        >
          Status
        </label>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFilterChange({ ...filters, status: value })
          }
        >
          <SelectTrigger id="filter-status" className="border-slate-200">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION}>All status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

