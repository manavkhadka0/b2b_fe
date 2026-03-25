"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateWishOfferForm } from "@/components/sections/create-wish/create-wish-form";
import { Plus } from "lucide-react";
import { Event } from "@/types/events";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { AuthDialog } from "@/components/auth/AuthDialog";

interface ParticipateSectionProps {
  event?: Event;
}

const ParticipateSection = ({ event }: ParticipateSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<"wish" | "offer" | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<"login" | "register">(
    "login",
  );
  const [pendingForm, setPendingForm] = useState<"wish" | "offer" | null>(
    null,
  );

  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const openForm = (formType: "wish" | "offer") => {
    setActiveForm(formType);
    setIsDialogOpen(true);
  };

  const handleFormSelect = (formType: "wish" | "offer") => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!user && !token && !isLoading) {
      setPendingForm(formType);
      setAuthDialogMode("login");
      setAuthDialogOpen(true);
      return;
    }

    openForm(formType);
  };

  useEffect(() => {
    if (!user || !pendingForm) return;
    openForm(pendingForm);
    setPendingForm(null);
  }, [user, pendingForm]);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setActiveForm(null);
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <h3 className="font-semibold text-gray-700">Participate with</h3>
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => handleFormSelect("wish")}
          variant="default"
          className="bg-blue-500 hover:bg-blue-600 text-xs"
        >
          Create a Wish(क्रेता) <Plus />
        </Button>
        <Button
          onClick={() => handleFormSelect("offer")}
          variant="default"
          className="bg-green-500 hover:bg-green-600 text-xs"
        >
          Create a Offer(बिक्रेता) <Plus />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {activeForm === "wish" ? (
            <CreateWishOfferForm
              event={event}
              onClose={handleDialogClose}
              is_wish_or_offer="wishes"
            />
          ) : (
            <CreateWishOfferForm
              event={event}
              onClose={handleDialogClose}
              is_wish_or_offer="offers"
            />
          )}
        </DialogContent>
      </Dialog>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={(open) => {
          setAuthDialogOpen(open);
          if (!open && pendingForm) {
            window.setTimeout(() => {
              const token = localStorage.getItem("accessToken");
              if (!token) setPendingForm(null);
            }, 0);
          }
        }}
        initialMode={authDialogMode}
        returnTo={pathname || undefined}
      />
    </div>
  );
};

export default ParticipateSection;
