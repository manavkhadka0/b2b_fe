"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";

const navItems = [
  { label: "Home", href: "/" },
  { label: "B2B Events", href: "/events" },
  { label: "Wish & Offer", href: "/wishOffer" },
  { label: "Contact", href: "/contacts" },
  { label: "How to Apply", href: "/howtoapply" },
];

export function DefaultNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`
        text-sm font-medium transition-colors relative
        after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full
        after:origin-left after:scale-x-0 after:bg-blue-800 after:transition-transform
        ${
          pathname === href
            ? "text-blue-800 after:scale-x-100"
            : "text-gray-600 hover:text-blue-800 after:hover:scale-x-100"
        }
      `}
    >
      {label}
    </Link>
  );

  return (
    <header
      className={`w-full sticky top-0 z-50 bg-white ${
        isScrolled ? "shadow-md" : "border-b"
      }`}
    >
      <ResponsiveContainer>
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <Link href="/" className="">
              <img src="/Container.svg" alt="Jobbriz" className="h-12 w-auto" />
            </Link>
            <Link href="/" className="">
              <img src="/cim-logo.webp" alt="cim" className="h-16 w-auto" />
            </Link>
          </div>

          {/* Nav and CTA Section */}
          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>

            {/* CTA Buttons - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-blue-800 border-blue-800 hover:bg-blue-50"
                onClick={() => router.push("/wishOffer/wishes/create-wish")}
              >
                <PlusCircle className="w-4 h-4" />
                Make a Wish (क्रेता)
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900"
                onClick={() => router.push("/wishOffer/offer/create-offer")}
              >
                <PlusCircle className="w-4 h-4" />
                Make an Offer (विक्रेता)
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                  {/* Mobile CTA Buttons */}
                  <div className="flex flex-col gap-3 mt-4">
                    <Button
                      variant="outline"
                      asChild
                      className="flex items-center gap-2 text-blue-800 border-blue-800"
                    >
                      <Link href="/wishOffer/wishes/create-wish">
                        <PlusCircle className="w-4 h-4" />
                        Make a Wish (क्रेता)
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="flex items-center gap-2 bg-blue-800"
                    >
                      <Link href="/wishOffer/offer/create-offer">
                        <PlusCircle className="w-4 h-4" />
                        Make an Offer (विक्रेता)
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </ResponsiveContainer>
    </header>
  );
}
