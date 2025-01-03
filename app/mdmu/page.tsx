"use client";

import Image from "next/image";
import { MDMUForm } from "./components/mdmu-form";
import { MDMUList } from "./components/mdmu-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const objectives = [
  {
    title: "Promotion and market expansion",
    description:
      "Promotion and market expansion of domestic products through a common brand",
    icon: "/mountain-flag.svg",
  },
  {
    title: "Quality Standards",
    description: "Encouraging quality and standards",
    icon: "/quality-badge.svg",
  },
  {
    title: "Mainstreaming MSMEs",
    description:
      "Mainstreaming MSMEs, women, and entrepreneurs from marginalized segments",
    icon: "/people-group.svg",
  },
];

const advantages = [
  "Economic Growth and Development",
  "Market Expansion",
  "Encouragement of Quality Standards",
  "Brand Identity and Recognition",
  "Consumer Awareness and Behavior",
];

export default function MDMUPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Image
              src="/mdmu-logo.png"
              alt="MDMU Logo"
              width={120}
              height={120}
              className="mx-auto mb-6"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              मेरो देश, मेरै उत्पादन अभियान
            </h1>
            <p className="text-gray-600 mb-8">
              CIM and Mero Desh Merai Utpadan (A Campaign Initiated for the
              Promotion of Domestic Products)
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-blue-900 hover:bg-blue-800">
                Apply For Logo
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12 bg-red-600 text-white py-2 max-w-xs mx-auto rounded">
            OBJECTIVES
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {objectives.map((objective, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <Image
                    src={objective.icon}
                    alt={objective.title}
                    width={120}
                    height={120}
                    className="mx-auto"
                  />
                </div>
                <h3 className="font-semibold mb-2">{objective.title}</h3>
                <p className="text-gray-600">{objective.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12 bg-red-600 text-white py-2 max-w-xs mx-auto rounded">
            ADVANTAGES
          </h2>
          <div className="max-w-2xl mx-auto">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className="flex items-center bg-white rounded-lg p-4 mb-4 shadow-sm"
              >
                <CheckCircle className="text-green-500 mr-4" />
                <span>{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12 bg-red-600 text-white py-2 max-w-xs mx-auto rounded">
            APPLY FOR THE LOGO
          </h2>
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid w-[400px] grid-cols-2 mx-auto mb-8">
              <TabsTrigger value="form">Registration Form</TabsTrigger>
              <TabsTrigger value="list">Registered Businesses</TabsTrigger>
            </TabsList>

            <TabsContent value="form">
              <MDMUForm />
            </TabsContent>

            <TabsContent value="list">
              <MDMUList />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-center mb-8 bg-red-600 text-white py-2 max-w-xs mx-auto rounded">
            CONTACT NOW
          </h2>
          <Button size="lg" className="bg-blue-900 hover:bg-blue-800">
            Get in Touch
          </Button>
        </div>
      </section>
    </div>
  );
}
