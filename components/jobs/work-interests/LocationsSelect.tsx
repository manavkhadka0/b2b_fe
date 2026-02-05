"use client";

import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import type { Location } from "@/types/auth";

interface LocationsSelectProps {
  selectedIds: number[];
  onToggle: (id: number) => void;
  locations: Location[];
}

export function LocationsSelect({
  selectedIds,
  onToggle,
  locations,
}: LocationsSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between border-slate-200"
        >
          {selectedIds.length > 0
            ? `${selectedIds.length} location${selectedIds.length > 1 ? "s" : ""} selected`
            : "Select locations"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Search locations..." />
          <CommandList>
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup>
              {locations.map((loc) => {
                const isActive = selectedIds.includes(loc.id);
                return (
                  <CommandItem
                    key={loc.id}
                    value={loc.name}
                    onSelect={() => onToggle(loc.id)}
                  >
                    <span>{loc.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
