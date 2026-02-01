const About = () => {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 relative inline-block">
              About Us
              <div className="relative mt-4">
                <img
                  src="/Rectangle.svg"
                  alt="decorative underline"
                  className="absolute left-1/2 -translate-x-1/2 transform scale-110 w-full h-8"
                />
              </div>
            </h2>
          </div>

          {/* Content Section */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
            {/* Text Content */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="space-y-6">
                <h3 className="text-lg leading-relaxed text-gray-700">
                  Promoting Domestic Products with Pride
                </h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  The{" "}
                  <span className="font-semibold text-blue-600">
                    &quot;Mero Desh Merai Utpadan Campaign&quot; (My Country, My
                    Products)
                  </span>{" "}
                  is a flagship initiative of the Chamber of Industries, Morang
                  (CIM). Its purpose is to boost awareness and consumption of
                  Nepali products, fostering national pride and strengthening
                  the domestic economy.
                </p>

                <p className="text-lg leading-relaxed text-gray-700">
                  A mnemonic logo has been widely circulated for industries to
                  proudly display on their products. By adopting this symbol,
                  businesses contribute to the collective mission of promoting
                  locally made goods and reinforcing the identity of Nepali
                  products as a common brand.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Section - Full Width */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <p className="text-lg leading-relaxed text-gray-700">
                This campaign is jointly promoted by CIM and the Morang Merchant
                Association, and was inaugurated by the then Prime Minister of
                Nepal, K.P. Sharma Oli, on 2077 Chaitra 13 during the
                installation ceremony of CIM&apos;s newly elected executive
                board.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg border border-blue-100">
              <p className="text-blue-800 font-medium text-lg leading-relaxed">
                Importantly, the campaign is free of cost—any company, from
                micro-enterprises in remote areas to large national industries,
                can use the logo to showcase their commitment to Nepali
                products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
