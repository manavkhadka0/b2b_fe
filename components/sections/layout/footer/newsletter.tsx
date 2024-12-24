export function Newsletter() {
  return (
    <div className="container mx-auto w-full rounded-xl overflow-hidden bg-gradient-to-r from-[#E0F7FF] mt-10">
      <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-12 gap-8">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Subscribe to our Newsletter
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Sign up now to receive offers and information about us and never
            miss an update from B2B!
          </p>
          <div className="bg-white flex items-center justify-center lg:justify-start max-w-md rounded-lg shadow-sm">
            <input
              type="email"
              placeholder="Email address"
              className="rounded-l-lg px-4 py-3 border-none w-full focus:ring-0 text-gray-700"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#5C67F2] to-[#A77CFF] text-white font-bold text-xl w-14 h-12 flex items-center justify-center rounded-r-lg shadow-lg hover:scale-105 transition-transform"
            >
              →
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="/newsletter.svg"
            alt="Newsletter Illustration"
            className="w-full max-w-sm lg:max-w-md"
          />
        </div>
      </div>
    </div>
  );
}
