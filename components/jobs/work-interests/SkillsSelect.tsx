"use client";

import { ChevronsUpDown, Check, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import type { WorkInterestSkill } from "@/services/workInterests";

interface SkillsSelectProps {
  selectedIds: number[];
  skillSuggestions: WorkInterestSkill[];
  skillNameById: Map<number, string>;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  isCreatingSkill?: boolean;
  onAddSkill: (value: string | number) => void;
  onRemoveSkill: (id: number) => void;
}

export function SkillsSelect({
  selectedIds,
  skillSuggestions,
  skillNameById,
  searchInput,
  onSearchInputChange,
  open,
  onOpenChange,
  isLoading = false,
  isCreatingSkill = false,
  onAddSkill,
  onRemoveSkill,
}: SkillsSelectProps) {
  return (
    <div className="space-y-3">
      <Popover
        open={open}
        onOpenChange={(o) => {
          onOpenChange(o);
          if (o) onSearchInputChange("");
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between border-slate-200"
          >
            {selectedIds.length > 0
              ? `${selectedIds.length} skill${selectedIds.length > 1 ? "s" : ""} selected`
              : "Select or create skills"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[360px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search skills..."
              value={searchInput}
              onValueChange={onSearchInputChange}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  searchInput.trim() &&
                  !isCreatingSkill &&
                  skillSuggestions.length === 0
                ) {
                  e.preventDefault();
                  void onAddSkill(searchInput.trim());
                }
              }}
            />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    {searchInput ? (
                      <div className="p-2">
                        <button
                          type="button"
                          className={cn(
                            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                            "border-2 border-dashed border-blue-300 bg-blue-50/80 text-blue-700 hover:bg-blue-100 hover:border-blue-400",
                            "disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed",
                          )}
                          onClick={() => void onAddSkill(searchInput)}
                          disabled={isCreatingSkill}
                        >
                          {isCreatingSkill ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating &quot;{searchInput}&quot;...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              Create new skill: &quot;{searchInput}&quot;
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      "No skills found. Type to search or create a new skill."
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {skillSuggestions.map((skill) => (
                      <CommandItem
                        key={skill.id}
                        value={skill.name}
                        onSelect={() => void onAddSkill(skill.id)}
                      >
                        <span>{skill.name}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedIds.includes(skill.id) ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIds.map((skillId) => (
            <Badge
              key={skillId}
              variant="outline"
              className="flex items-center gap-1 bg-white border-slate-200"
            >
              {skillNameById.get(skillId) ?? `Skill #${skillId}`}
              <button
                type="button"
                onClick={() => onRemoveSkill(skillId)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Remove skill"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
