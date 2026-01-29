"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navigationItems = [
  { href: "/mdmu/about-us", label: "About Us" },
  { href: "/mdmu/#objectives", label: "Objectives" },
  { href: "/mdmu/#contact", label: "Contact" },
  { href: "/mdmu/endorsements", label: "Endorsements" },
  { href: "/mdmu/newsletter", label: "Newsletter" },
];

const MDMUHeader = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white py-2 sticky top-0 z-50 h-[80px]">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/mdmu">
          <div className="flex items-center gap-4">
            <img src="/cim-logo.webp" alt="CIM Logo" className="w-14 h-14" />
            <img src="/mdmu-logo.png" alt="MDMU Logo" className="w-16 h-16" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#2964f0] font-bold px-4 py-3 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button className="bg-[#0A1E4B] hover:bg-blue-900" asChild>
            <Link href={"/mdmu/apply"}>Register Now</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white text-[#0A1E4B] w-64">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:text-[#0A1E4B] text-lg px-4 py-2"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button className="bg-[#0A1E4B] hover:bg-blue-900" asChild>
                  <Link href={"/mdmu/apply"} onClick={() => setOpen(false)}>
                    Register Now
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default MDMUHeader;
