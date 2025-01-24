"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { DataNotFound } from "@/components/sections/errors/data-not-found"
import type { BDSService } from "@/types/bds-services"

interface GridSectionProps {
  services: BDSService[]
}

export default function BDSGridSection({ services }: GridSectionProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    // Initialize all items as open
    return services.reduce((acc, service) => ({
      ...acc,
      [service.id.toString()]: true
    }), {})
  })

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  if (services.length === 0) {
    return <DataNotFound title="No services found" message="No services found" />
  }

  return (
    <div className="w-full max-w-6xl grid grid-cols-2 gap-4 p-6">
      {services.map((service) => (
        <AccordionItem 
          key={service.id} 
          service={service} 
          isOpen={openItems[service.id.toString()] || false}
          onToggle={() => toggleItem(service.id.toString())}
        />
      ))}
    </div>
  )
}

function AccordionItem({ 
  service, 
  isOpen, 
  onToggle 
}: { 
  service: BDSService
  isOpen: boolean
  onToggle: () => void 
}) {
  return (
    <div className="border border-blue-100 rounded-xl overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 hover:bg-blue-50/50 transition-colors"
      >
        <div className="flex-shrink-0">
          {service.logo ? (
            <img
              src={service.logo || "/placeholder.svg"}
              alt={`${service.Company_name} Logo`}
              className="w-16 h-16 rounded-lg object-cover border border-blue-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg border border-blue-100 bg-blue-50 flex items-center justify-center text-blue-400">
              No Logo
            </div>
          )}
        </div>
        <div className="flex-grow text-left">
          <h2 className="font-semibold text-lg text-gray-900">{service.Company_name}</h2>
          <p className="text-sm text-gray-500">{service.service}</p>
        </div>
        <ChevronDown
          className={`flex-shrink-0 w-5 h-5 text-blue-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div className={`grid transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="p-4 pt-0 space-y-4">
            <div className="pt-4 border-t border-blue-100">
              <p className="text-gray-600 text-justify" dangerouslySetInnerHTML={{ __html: service.description || "" }}></p>
            </div>

            <div>
              <p className="text-sm text-black mb-2 font-bold">Location:</p>
              <p className="text-gray-500">{service.address}</p>
            </div>

            <div>
              <p className="text-sm text-black mb-2 font-bold">Category:</p>
              <p className="text-gray-700">{service.category.name}</p>
            </div>

            <div>
              <p className="text-sm text-black mb-2 font-bold">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
