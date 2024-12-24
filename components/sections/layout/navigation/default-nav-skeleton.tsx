export function DefaultNavSkeleton() {
  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left section with logo and nav items */}
          <div className="flex items-center gap-8">
            {/* Mobile menu button skeleton */}
            <div className="lg:hidden">
              <div className="h-9 w-9 rounded bg-gray-200 animate-pulse" />
            </div>

            {/* Logo skeleton */}
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />

            {/* Desktop nav items skeleton */}
            <div className="hidden lg:flex items-center gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-4 w-24 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Right section with buttons */}
          <div className="flex items-center gap-4">
            {/* Sign in button skeleton */}
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />

            {/* Membership button skeleton */}
            <div className="hidden md:block h-9 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
