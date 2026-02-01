"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";

interface CvSectionProps {
  title: string;
  description: string;
  actionText?: string;
  actionIcon?: "add" | "edit";
  children: React.ReactNode;
  form: React.ReactNode | ((onClose: () => void) => React.ReactNode);
}

export function CvSection({
  title,
  description,
  actionText = "Add",
  actionIcon = "add",
  children,
  form,
}: CvSectionProps) {
  const [open, setOpen] = useState(false);
  const formContent =
    typeof form === "function" ? form(() => setOpen(false)) : form;
  const Icon = actionIcon === "edit" ? Pencil : Plus;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              <Icon className="w-4 h-4" />
              {actionText}
            </Button>
          </SheetTrigger>
        </div>
        <div className="mt-4">{children}</div>
      </div>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {formContent}
      </SheetContent>
    </Sheet>
  );
}
