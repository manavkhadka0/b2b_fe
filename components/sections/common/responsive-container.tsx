import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * If true, removes horizontal padding
   * Useful for sections that need full-width backgrounds
   */
  noPadding?: boolean;
}

export const ResponsiveContainer = ({
  children,
  className,
  noPadding = false,
}: ResponsiveContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto py-10",
        // Base max-width and responsive padding
        "max-w-7xl",
        !noPadding && [
          "px-4", // Default padding for mobile
          "sm:px-6", // Slightly larger padding for small screens
          "lg:px-8", // Even larger padding for desktop
        ],
        className
      )}
    >
      {children}
    </div>
  );
};
