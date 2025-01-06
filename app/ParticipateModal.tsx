"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/events";
import { CreateWishOfferForm } from "@/components/sections/create-wish/create-wish-form";

interface ParticipateSectionProps {
  event: Event;
}

const ParticipateSection = ({ event }: ParticipateSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<"wish" | "offer" | null>(null);

  const handleFormSelect = (formType: "wish" | "offer") => {
    setActiveForm(formType);
    setIsDialogOpen(true);
  };

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
          className="bg-blue-500 hover:bg-blue-600"
        >
          Wish →
        </Button>
        <Button
          onClick={() => handleFormSelect("offer")}
          variant="default"
          className="bg-green-500 hover:bg-green-600"
        >
          Offer →
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
    </div>
  );
};

export default ParticipateSection;
