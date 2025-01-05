"use client";
import React, { useState } from "react";
import CreateOffer from "@/app/wishOffer/offer/create-offer/page";
import EventForm from "@/app/wishOffer/wishes/create-wish/page";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const ParticipateSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<"wish" | "offer" | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleFormSelect = (formType: "wish" | "offer") => {
    setActiveForm(formType);
    setIsDialogOpen(true);
    setIsPopoverOpen(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setActiveForm(null);
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            Participate Now →
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-center mb-2">
              Choose Your Participation
            </h3>
            <Button
              onClick={() => handleFormSelect("wish")}
              variant="default"
              className="bg-blue-500 hover:bg-blue-600 w-full"
            >
              Create a Wish
            </Button>
            <Button
              onClick={() => handleFormSelect("offer")}
              variant="default"
              className="bg-green-500 hover:bg-green-600 w-full"
            >
              Make an Offer
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {activeForm === "wish" ? <EventForm /> : <CreateOffer />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParticipateSection;
