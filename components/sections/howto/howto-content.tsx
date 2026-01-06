"use client";

import { ResponsiveContainer } from "../common/responsive-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const scrollToId = (id: string) => {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function HowToContent() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveContainer className="py-12 md:py-16 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800">
              उद्योग संगठन मोरङ
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Birat Bazaar B2B कसरी दर्ता गर्ने
            </h2>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            यो भर्चुअल प्लेटफर्म क्रेता र बिक्रेता बिच प्रत्यक्ष भेट गराउने
            माध्यम हो । यो प्लेटफर्म व्यवसाय व्यवसाय बिचको सम्बन्ध स्थापना गर्ने
            भएकोले उद्योगी व्यवसायीहरुले मात्रै यस प्लेटफर्मको प्रयोग गर्न सक्नु
            हुनेछ । यसका तिनवटा मुख्य विशेषताहरु छन ।
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => scrollToId("wish")}
              className="px-6 py-4 rounded-xl border border-gray-200 bg-white text-left hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <span className="text-base font-semibold text-blue-800 block">
                Wish Screen
              </span>
              <p className="text-sm text-gray-700 mt-1">
                वस्तु तथा सेवाहरु खरिद
              </p>
            </button>
            <button
              type="button"
              onClick={() => scrollToId("offer")}
              className="px-6 py-4 rounded-xl border border-gray-200 bg-white text-left hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <span className="text-base font-semibold text-blue-800 block">
                Offer Screen
              </span>
              <p className="text-sm text-gray-700 mt-1">
                वस्तु तथा सेवाहरुको बिक्रि
              </p>
            </button>
            <button
              type="button"
              onClick={() => scrollToId("events")}
              className="px-6 py-4 rounded-xl border border-gray-200 bg-white text-left hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <span className="text-base font-semibold text-blue-800 block">
                B2B Events
              </span>
              <p className="text-sm text-gray-700 mt-1">
                प्रत्यक्ष इभेन्ट्सहरुमा सहभागिता
              </p>
            </button>
          </div>
        </div>

        {/* Make a Wish Section */}
        <Card
          id="wish"
          className="border border-gray-200 shadow-sm bg-white overflow-hidden"
        >
          <CardHeader className="border-b border-gray-100">
            <div className="flex flex-col gap-2 text-left">
              <CardTitle className="text-2xl md:text-3xl font-semibold text-blue-800">
                Make a Wish (क्रेता)
              </CardTitle>
              <p className="text-sm md:text-base text-gray-700">
                वस्तु तथा सेवाहरु खरिद गर्न चाहनेहरुका लागी
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    तपाईं कुनै वस्तु तथा सेवा खरिद गर्न चाहनु हुन्छ, अर्थात
                    तपाईंले खरिद गर्न खोजेका वस्तु वा चाहनाका वस्तुहरुका लागि
                    क्रेता{" "}
                    <span className="font-semibold text-blue-800">
                      Make a Wish
                    </span>{" "}
                    मा क्लिक गर्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Product Name (Wish Title)
                    </span>{" "}
                    मा गएर आफूले किन्न खोजेको वस्तु तथा सेवाहरुको नाम लेख्नुहोस
                    । (एक पटकमा बढिमा ३ वटासम्म वस्तु तथा सेवाको नाम लेख्न सक्नु
                    हुने छ ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    त्यस पछि{" "}
                    <span className="font-semibold text-blue-800">
                      Products or Service
                    </span>{" "}
                    मध्ये आफूले खोजेको के हो ? त्यसमा क्लिक गर्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    त्यस पछि{" "}
                    <span className="font-semibold text-blue-800">Next</span>{" "}
                    बटम थिच्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    5
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Products
                    </span>{" "}
                    मा क्लिक गर्नु भए पछि{" "}
                    <span className="font-semibold text-blue-800">
                      Select Product (HS Code)
                    </span>{" "}
                    एचएस कोड अनुसारको नंम्बर ३ वटा अंक वा वस्तुको नाम उल्लेख
                    गर्नु होस । एसएस कोड थाहा नभएमा पतालगाउन यहा क्लिक गर्नु होस
                    (एचएस कोडको नेपालीमा बनाएको पिडिएफ राखिदिने डाउनलोड गर्न
                    मिल्ने गरि) वा स्क्रोल गर्न मिल्ने गरि ।
                  </p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-md border-l-4 border-blue-800">
                    <p className="text-gray-700 text-xs md:text-sm">
                      एचएस कोड थाहा नभएमा छोडिदिनुहोस र अगाडी बढ्नु होस ।
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    6
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Product Image
                    </span>{" "}
                    तपाईले खरिद गर्न खोजेको वस्तु तथा सेवाको फोटो छ भने यहा
                    अपलोड गरिदिनुहोस । इमेज जेपिजी बढिमा ३ वटा सम्म फोटो अपलोड
                    गर्न सक्नु हुनेछ । यो स्वेच्छिक हो, फोटो छैन भने अघि
                    बढ्नुहोस ।{" "}
                    <span className="font-semibold text-blue-800">Next</span>{" "}
                    बटम थिच्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    7
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Company Information
                    </span>{" "}
                    कम्पनीको नाम, ठेगाना, भर्नु होस । र{" "}
                    <span className="font-semibold text-blue-800">Next</span>{" "}
                    बटम थिच्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    8
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Personal Information
                    </span>{" "}
                    सम्पर्क गर्न मुख्य व्यक्तीको नाम, पद, इमेल, मोबाईल नं,
                    अल्टनेट नम्बर आदि भर्नुहोस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    9
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">Review</span>{" "}
                    तपाईले भरेको सबै बिबरणहरु रुजू गर्नु होस । ठिक छ भने{" "}
                    <span className="font-semibold text-blue-800">
                      Create Wish
                    </span>{" "}
                    बटममा थिच्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    10
                  </div>
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    अब तपाईको Wish वा खरिद गर्न सामानहरु दर्ता भयो । अब तपाईको
                    चाहना{" "}
                    <span className="font-semibold text-blue-800">
                      Wish & Offer Section
                    </span>{" "}
                    मा देख सक्नु हुने छ । यदि तपाईले खोज्नु भएको वस्तु तथा सेवा
                    अर्कोले बिक्रीका लागी राखेको बिक्रेतासंग मेल खाएमा तपाईलाई
                    सूचना प्राप्त हुन्छ । र तपाईले आफ्नो व्यवसायीक डिल अघि बढाउन
                    सक्नु हुनेछ ।
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Make an Offer Section */}
        <Card
          id="offer"
          className="border border-gray-200 shadow-sm bg-white overflow-hidden"
        >
          <CardHeader className="border-b border-gray-100">
            <div className="flex flex-col gap-2 text-left">
              <CardTitle className="text-2xl md:text-3xl font-semibold text-blue-800">
                Make an Offer (बिक्रेता)
              </CardTitle>
              <p className="text-sm md:text-base text-gray-700">
                वस्तु तथा सेवाहरुको बिक्रि गर्न चाहने बिक्रेताहरुका लागी
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    तपाईं कुनै वस्तु तथा सेवा बिक्रि गर्न चाहनु हुन्छ, अर्थात
                    तपाईंले बिक्रि गर्न चाहेका वस्तु वा सेवाहरुका लागि बिक्रेता{" "}
                    <span className="font-semibold text-blue-800">
                      Make an Offer
                    </span>{" "}
                    मा क्लिक गर्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Product Name (Offer Title)
                    </span>{" "}
                    मा गएर आफूले बिक्रि गर्न चाहेका वस्तु तथा सेवाहरुको नाम
                    लेख्नुहोस । (एक पटकमा बढिमा ३ वटासम्म वस्तु तथा सेवाको नाम
                    लेख्न सक्नु हुने छ ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    त्यस पछि{" "}
                    <span className="font-semibold text-blue-800">
                      Products or Service
                    </span>{" "}
                    मध्ये आफूले खोजेको के हो ? त्यसमा क्लिक गर्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    त्यस पछि{" "}
                    <span className="font-semibold text-blue-800">Next</span>{" "}
                    बटम थिच्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    5
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Products
                    </span>{" "}
                    मा क्लिक गर्नु भए पछि{" "}
                    <span className="font-semibold text-blue-800">
                      Select Product (HS Code)
                    </span>{" "}
                    एचएस कोड अनुसारको नंम्बर ३ वटा अंक वा वस्तुको नाम उल्लेख
                    गर्नु होस । एसएस कोड थाहा नभएमा पत्तालगाउन यहा क्लिक गर्नु
                    होस ।
                  </p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-md border-l-4 border-blue-800">
                    <p className="text-gray-700 text-xs md:text-sm">
                      एचएस कोड थाहा नभएमा छोडिदिनुहोस र अगाडी बढ्नु होस ।
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    6
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Product Image
                    </span>{" "}
                    तपाईंले बिक्रि गर्न चाहेका वस्तु तथा सेवाको फोटो छ भने यहा
                    अपलोड गरिदिनुहोस । इमेज जेपिजी बढिमा ३ वटा सम्म फोटो अपलोड
                    गर्न सक्नु हुनेछ । यो स्वेच्छिक हो, फोटो छैन भने अघि
                    बढ्नुहोस ।{" "}
                    <span className="font-semibold text-blue-800">Next</span>{" "}
                    बटम थिच्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    7
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Company Information
                    </span>{" "}
                    कम्पनीको नाम, ठेगाना, भर्नु होस । र{" "}
                    <span className="font-semibold text-blue-800">Next</span>{" "}
                    बटम थिच्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    8
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Personal Information
                    </span>{" "}
                    सम्पर्क गर्न मुख्य व्यक्तीको नाम, पद, इमेल, मोबाईल नं,
                    अल्टनेट नम्बर आदि भर्नुहोस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    9
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">Review</span>{" "}
                    तपाईले भरेको सबै बिबरणहरु रुजू गर्नु होस । ठिक छ भने{" "}
                    <span className="font-semibold text-blue-800">
                      Create Offer
                    </span>{" "}
                    बटममा थिच्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    10
                  </div>
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    अब तपाईको Offer वा बिक्रि गर्न चाहेका वस्तु तथा सेवाहरु
                    दर्ता भयो । अब तपाईका बिक्रिका लागी राखिएका वस्तु तथा
                    सेवाहरु{" "}
                    <span className="font-semibold text-blue-800">
                      Wish & Offer Section
                    </span>{" "}
                    मा देख सक्नु हुने छ । यदि तपाईले बिक्रि गर्न चाहनु भएका
                    वस्तु तथा सेवा अर्कोले खरिदलागी लागी राखेको क्रेतासंग मेल
                    खाएमा तपाईलाई सूचना प्राप्त हुन्छ । र तपाईले आफ्नो व्यवसायीक
                    डिल अघि बढाउन सक्नु हुनेछ ।
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* B2B Events Section */}
        <Card
          id="events"
          className="border border-gray-200 shadow-sm bg-white overflow-hidden"
        >
          <CardHeader className="border-b border-gray-100">
            <div className="flex flex-col gap-2 text-left">
              <CardTitle className="text-2xl md:text-3xl font-semibold text-blue-800">
                B2B Events
              </CardTitle>
              <p className="text-sm md:text-base text-gray-700">
                प्रत्यक्ष इभेन्ट्सहरुमा सहभागिता हुन चाहनेका लागी
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    यदि तपाई विभिन्न स्थानमा, विभिन्न समयमा प्रत्यक्ष भौतिकरुपमा
                    आयोजना हुने B2B Events हरुमा सहभागि हुन चाहनु हुन्छ भने{" "}
                    <span className="font-semibold text-blue-800">
                      B2B Events
                    </span>{" "}
                    मा क्लिक गर्नु होस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    <span className="font-semibold text-blue-800">
                      Popular Upcoming Events
                    </span>{" "}
                    तपाई स्क्रिनमा देखिन्छ । त्यसमा विभिन्न इभेन्ट्सहरु आयोजना
                    हुने बमोजिमका विवरणहरु राखिएको छ । आफूलाई उपयुक्तहुने
                    इभेन्टमा क्लिक गर्नुहोस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    तपाईले छनौट गर्नु भएको इभेन्टको बिष्टुत विवरण हेर्न सक्नु
                    हुनेछ ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    यदि तपाई उक्त इभेन्ट्समा सहभागि हुन चाहनु हुन्छ भने{" "}
                    <span className="font-semibold text-blue-800">
                      Participate with
                    </span>{" "}
                    मा भएको ठाँउमा जानुहोस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    5
                  </div>
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    तपाई क्रेताका रुपमा सहभागि हुने भए{" "}
                    <span className="font-semibold text-blue-800">Wish</span>{" "}
                    अप्सनमा र बिक्रेताका रुपमा सहभागि हुने भए{" "}
                    <span className="font-semibold text-blue-800">Offer</span>{" "}
                    अप्सनमा गई विवरणहरु भर्नुहोस ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-blue-800 text-blue-800 flex items-center justify-center text-sm font-semibold">
                    6
                  </div>
                </div>
                <div className="flex-1 pb-6 bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                    तपाई उक्त इभेन्टको स्पोन्सरका रुपमा समेत सहभागि हुन सक्नु
                    हुनेछ । यसका लागी{" "}
                    <span className="font-semibold text-blue-800">
                      Contact us
                    </span>{" "}
                    ठेगानामा वा{" "}
                    <span className="font-semibold text-blue-800">
                      ९८६२१८२५६०
                    </span>{" "}
                    मा सम्पर्क गर्न सक्नु हुनेछ ।
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    </div>
  );
}
