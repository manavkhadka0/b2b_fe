"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "B2B Events", href: "/events" },
  { label: "Wish & Offer", href: "/wishOffer" },
  { label: "BDS Services", href: "#" },
  { label: "Business Registration", href: "#" },
  { label: "JobBriz", href: "#" },
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
    <>
      <header
        className={`w-full sticky top-0 z-50 bg-white ${
          isScrolled ? "shadow-md" : "border-b"
        }`}
      >
        <div className="container mx-auto px-4 md:px-0 py-2">
          <div className="flex h-20 items-center justify-between">
            {/* Logo Section */}
            <Link href="/" className="">
              <img src="/Container.svg" alt="Jobbriz" className="h-12 w-auto" />
            </Link>

            {/* Nav and Membership Section */}
            <div className="flex items-center gap-8">
              <nav className="hidden lg:flex items-center gap-6">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="hidden md:block text-sm font-medium bg-blue-500 text-white hover:bg-blue-400"
              >
                Sign-Up
              </Button>

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
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
