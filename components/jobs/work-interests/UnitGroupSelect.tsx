"use client";

import { ChevronsUpDown, Check, Loader2 } from "lucide-react";
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
import type { UnitGroup } from "@/types/unit-groups";

interface UnitGroupSelectProps {
  value: string;
  onChange: (unitGroupId: string) => void;
  unitGroups: UnitGroup[];
  unitGroupsForForm: UnitGroup[];
  groupedUnitGroupsForForm: Record<string, UnitGroup[]>;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

export function UnitGroupSelect({
  value,
  onChange,
  unitGroups,
  unitGroupsForForm,
  groupedUnitGroupsForForm,
  searchInput,
  onSearchInputChange,
  open,
  onOpenChange,
  isLoading = false,
}: UnitGroupSelectProps) {
  const selected =
    unitGroups.find((g) => String(g.id) === value) ??
    unitGroupsForForm.find((g) => String(g.id) === value);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (o) onSearchInputChange("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between border-slate-200",
            !value && "text-muted-foreground",
          )}
        >
          {selected
            ? `${selected.code} · ${selected.title}`
            : "Select unit group"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search unit group..."
            value={searchInput}
            onValueChange={onSearchInputChange}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>No unit group found.</CommandEmpty>
                {Object.entries(groupedUnitGroupsForForm).map(
                  ([majorGroupTitle, groups]) => (
                    <CommandGroup
                      key={majorGroupTitle}
                      heading={majorGroupTitle}
                    >
                      {groups.map((group) => (
                        <CommandItem
                          key={group.id}
                          value={`${group.id}`}
                          onSelect={() => onChange(String(group.id))}
                        >
                          <div className="flex flex-col">
                            <span>{group.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {
                                group.minor_group?.sub_major_group?.title
                              }{" "}
                              - {group.code}
                            </span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              String(group.id) === value ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ),
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
