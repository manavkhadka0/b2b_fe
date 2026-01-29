const objectives = [
  {
    title: "Promotion and market expansion",
    description:
      "Promotion and market expansion of domestic products through a common brand",
    icon: "/obj1.svg",
    color: "from-blue-50 to-blue-100",
    iconBg: "bg-blue-100",
  },
  {
    title: "Quality Standards",
    description: "Encouraging quality and standards",
    icon: "/obj2.svg",
    color: "from-purple-50 to-purple-100",
    iconBg: "bg-purple-100",
  },
  {
    title: "Mainstreaming MSMEs",
    description:
      "Mainstreaming MSMEs, women, and entrepreneurs from marginalized segments",
    icon: "/obj3.svg",
    color: "from-emerald-50 to-emerald-100",
    iconBg: "bg-emerald-100",
  },
];

export const Objective = () => {
  return (
    <section
      id="objectives"
      className="py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 relative inline-block">
              Our Objectives
              <div className="relative mt-4">
                <img
                  src="/Rectangle.svg"
                  alt="decorative underline"
                  className="absolute left-1/2 -translate-x-1/2 transform scale-110 w-full h-8"
                />
              </div>
            </h2>
            <p className="mt-8 text-gray-600 text-lg max-w-2xl mx-auto">
              We are committed to fostering growth and excellence in domestic
              production
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {objectives.map((obj, index) => (
              <div key={index} className="relative group">
                <div
                  className={`h-full p-8 rounded-2xl bg-gradient-to-br ${obj.color} 
                  border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300
                  transform hover:-translate-y-1`}
                >
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 ${obj.iconBg} rounded-xl p-3 mx-auto 
                      shadow-inner transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <img
                        src={obj.icon}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      {obj.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {obj.description}
                    </p>
                  </div>

                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/4 h-1 
                    bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
