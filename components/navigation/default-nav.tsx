"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Job search", href: "/job-search" },
  { label: "Career advice", href: "/career-advice" },
  { label: "Explore companies", href: "/companies" },
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
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
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

              <Link href="/" className="">
                <img src="/JobBriz.svg" alt="Jobbriz" className="h-12 w-auto" />
              </Link>

              <nav className="hidden lg:flex items-center gap-6">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/login")}
                className="text-sm font-medium text-gray-600 hover:text-blue-800"
              >
                Sign in
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/employer-site")}
                className="hidden md:block text-sm font-medium border-blue-800 text-blue-800 hover:bg-blue-50"
              >
                Employer site
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
