"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { incubationCenterBookingSchema } from "@/types/schemas/incubation-center-booking-schema";
import type { IncubationCenterBookingFormValues } from "@/types/schemas/incubation-center-booking-schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/sections/create-wish/create-wish-steps/step-indicator";
import { IncubationStep1BookingType } from "./steps/step-1-booking-type";
import { IncubationStep2Personal } from "./steps/step-2-personal";
import { IncubationStep3Organization } from "./steps/step-3-organization";
import { IncubationStep4DateTime } from "./steps/step-4-datetime";
import { IncubationStep5Services } from "./steps/step-5-services";
import { IncubationStep6Review } from "./steps/step-6-review";
import { createIncubationCenterBooking } from "@/services/incubationCenterBooking";

const VALID_ROOM_CATEGORIES = [
  "The Big Brain Room",
  "The Grind Garage",
  "The Fusion Lab",
] as const;

type SuccessPayload = {
  message?: string;
};

function ThankYouSection({ message }: SuccessPayload) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="mb-6"
            >
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            >
              Booking Request Submitted
            </motion.h2>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                {message}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Button
                variant="outline"
                asChild
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                <Link href="/co-working-space">
                  Return to Co-Working Space
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface IncubationBookingFormProps {
  preselectedRoom?: string | null;
}

export function IncubationBookingForm({
  preselectedRoom = null,
}: IncubationBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successPayload, setSuccessPayload] =
    useState<SuccessPayload | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const STEPS = [
    { title: "What to Book", description: "Co-working or Private Room" },
    { title: "Applicant", description: "Your information" },
    { title: "Company / Idea", description: "Organization details" },
    { title: "Booking Details", description: "Date, time & capacity" },
    { title: "Services", description: "Optional add-ons" },
    { title: "Review", description: "Confirm & submit" },
  ];

  const form = useForm<IncubationCenterBookingFormValues>({
    resolver: zodResolver(incubationCenterBookingSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      booking_type: preselectedRoom ? "Private Room" : "Co-working Seat",
      full_name: "",
      email: "",
      phone: "",
      address: "",
      name: "",
      founder_name: "",
      founder_designation: "",
      purpose: "",
      no_of_seats: null,
      booking_date: "",
      start_time: "",
      end_time: "",
      room_category:
        preselectedRoom && (VALID_ROOM_CATEGORIES as readonly string[]).includes(preselectedRoom)
          ? (preselectedRoom as (typeof VALID_ROOM_CATEGORIES)[number])
          : null,
      no_of_participants: null,
      wifi: false,
      photocopy: false,
      printing: false,
      interactive_board: false,
      whiteboard_marker: false,
      tea_coffee_water: false,
      other_service: "",
    },
  });

  const getFieldsForStep = (
    step: number
  ): (keyof IncubationCenterBookingFormValues)[] => {
    const bookingType = form.getValues("booking_type");
    switch (step) {
      case 1:
        return ["booking_type"];
      case 2:
        return ["full_name", "email", "phone", "address"];
      case 3:
        return ["name", "purpose"];
      case 4:
        return bookingType === "Co-working Seat"
          ? ["no_of_seats", "booking_date", "start_time", "end_time"]
          : ["room_category", "booking_date", "start_time", "end_time"];
      case 5:
        return [];
      case 6:
        return [];
      default:
        return [];
    }
  };

  const nextStep = async () => {
    const currentFields = getFieldsForStep(currentStep);

    const isValid = await form.trigger(currentFields, {
      shouldFocus: true,
    });

    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const onSubmit = async (data: IncubationCenterBookingFormValues) => {
    if (currentStep !== STEPS.length) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      await createIncubationCenterBooking(
        {
          booking_type: data.booking_type,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          name: data.name,
          founder_name: data.founder_name || null,
          founder_designation: data.founder_designation || null,
          purpose: data.purpose,
          no_of_seats: data.no_of_seats ?? null,
          booking_date: data.booking_date,
          start_time: data.start_time,
          end_time: data.end_time,
          room_category: data.room_category ?? null,
          no_of_participants: data.no_of_participants ?? null,
          wifi: data.wifi,
          photocopy: data.photocopy,
          printing: data.printing,
          interactive_board: data.interactive_board,
          whiteboard_marker: data.whiteboard_marker,
          tea_coffee_water: data.tea_coffee_water,
          other_service: data.other_service || null,
        },
        token
      );

      toast.success("Booking request submitted!");
      form.reset();
      setSuccessPayload({
        message:
          "Your booking request has been submitted successfully. We will contact you shortly.",
      });
    } catch (error) {
      console.error("Failed to submit booking:", error);
      toast.error("Failed to submit booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (successPayload) {
    return <ThankYouSection message={successPayload.message} />;
  }

  const typedForm = form as UseFormReturn<IncubationCenterBookingFormValues>;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <IncubationStep1BookingType form={typedForm} />;
      case 2:
        return <IncubationStep2Personal form={typedForm} />;
      case 3:
        return <IncubationStep3Organization form={typedForm} />;
      case 4:
        return <IncubationStep4DateTime form={typedForm} />;
      case 5:
        return <IncubationStep5Services form={typedForm} />;
      case 6:
        return <IncubationStep6Review form={typedForm} />;
      default:
        return null;
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    const fields = getFieldsForStep(stepIndex);
    return fields.every((field) => {
      const val = form.getValues(field);
      if (val === null || val === undefined) return false;
      if (typeof val === "string" && val.trim() === "") return false;
      return true;
    });
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep || isStepCompleted(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <Form {...typedForm}>
      <form onSubmit={typedForm.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-1 md:col-span-4 shrink-0">
            <StepIndicator
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={(step) => handleStepClick(step)}
            />
          </div>

          <div className="col-span-1 md:col-span-8">
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border mx-4 md:mx-0">
              <div className="min-h-[400px]">{renderStep()}</div>

              <div className="flex justify-between mt-8 gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    onClick={prevStep}
                  >
                    Previous
                  </Button>
                )}

                <Button
                  type="button"
                  className="bg-blue-500 ml-auto hover:bg-blue-600"
                  onClick={async () => {
                    if (currentStep === STEPS.length) {
                      typedForm.handleSubmit(onSubmit)();
                    } else {
                      await nextStep();
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {currentStep === STEPS.length
                    ? isSubmitting
                      ? "Submitting..."
                      : "Submit Booking"
                    : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
