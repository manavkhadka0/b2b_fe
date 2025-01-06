"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { CheckIcon } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: {
    title: string;
    description: string;
  }[];
  onStepClick?: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  steps,
  onStepClick,
}: StepIndicatorProps) {
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="relative">
      {/* Desktop view - vertical timeline */}
      <div className="hidden md:block">
        <div className="flex flex-col relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200" />

          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = stepNumber < currentStep;
            const isClickable = stepNumber <= currentStep || isCompleted;

            return (
              <div
                key={step.title}
                className={cn(
                  "relative pl-12 py-4 cursor-pointer transition-colors",
                  isClickable
                    ? "hover:bg-gray-50"
                    : "cursor-not-allowed opacity-60"
                )}
                onClick={() => isClickable && onStepClick?.(stepNumber)}
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    isCompleted
                      ? "bg-green-600 text-white"
                      : isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  {isCompleted ? <CheckIcon className="h-4 w-4" /> : stepNumber}
                </div>

                <div className="space-y-1">
                  <div
                    className={cn(
                      "font-medium",
                      isActive ? "text-blue-600" : "text-gray-900"
                    )}
                  >
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile view - simple step counter with progress */}
      <div className="md:hidden text-center">
        <div className="inline-flex items-center gap-2 text-base font-medium">
          <span className="text-blue-600">{currentStep}</span>
          <span className="text-gray-400">of</span>
          <span className="text-gray-600">{steps.length}</span>
        </div>
        <div className="mt-2 relative h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
