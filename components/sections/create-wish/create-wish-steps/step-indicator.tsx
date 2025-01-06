"use client";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: {
    title: string;
    description: string;
  }[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-2/4 h-0.5 w-full bg-gray-200" />
      <div
        className="absolute left-0 top-2/4 h-0.5 bg-blue-600 transition-all duration-500"
        style={{ width: `${(currentStep / steps.length) * 100}%` }}
      />
      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-200",
                index < currentStep
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-gray-500"
              )}
            >
              {index + 1}
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
