import { formSteps } from "../constants";

interface FormProgressProps {
  currentStep: number;
}

export function FormProgress({ currentStep }: FormProgressProps) {
  return (
    <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
      <div className="relative">
        {/* Mobile Steps Display */}
        <div className="block sm:hidden mb-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600">
              Step {currentStep} of {formSteps.length}
            </span>
            <span className="text-sm text-gray-500">
              {formSteps[currentStep - 1].title}
            </span>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{
                width: `${(currentStep / formSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Desktop Steps Display */}
        <div className="hidden sm:flex justify-between items-center mb-8">
          {formSteps.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              {/* Step Circle */}
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    step.id <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <span className="text-sm font-medium">{step.id}</span>
                </div>
                {/* Step Label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max">
                  <span
                    className={`text-xs font-medium ${
                      step.id <= currentStep ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
              {/* Connection Line */}
              {index < formSteps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-4 transition-colors ${
                    step.id < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Description */}
      <div className="text-center mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {formSteps[currentStep - 1].title}
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          {formSteps[currentStep - 1].description}
        </p>
      </div>
    </div>
  );
}
