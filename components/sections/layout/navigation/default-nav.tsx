"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, PlusCircle, User, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/sections/layout/language-switcher";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DefaultNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { user: authUser, logout } = useAuth();

  const currentUser = session?.user || authUser;

  const navigateWithAuthCheck = (targetPath: string) => {
    if (currentUser) {
      router.push(targetPath);
      return;
    }

    const encodedReturnTo = encodeURIComponent(targetPath);
    router.push(`/login?returnTo=${encodedReturnTo}`);
  };

  const getInitial = () => {
    if (session?.user) {
      const name = session.user.name || session.user.email || "";
      return name.charAt(0).toUpperCase() || "U";
    }
    if (authUser) {
      const name =
        `${authUser.first_name} ${authUser.last_name}`.trim() ||
        authUser.email ||
        authUser.username;
      return name.charAt(0).toUpperCase() || "U";
    }
    return "U";
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleLogoutClick = () => {
    if (session) {
      signOut({ callbackUrl: "/login" });
    } else {
      logout();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("navigation.home"), href: "/" },
    { label: t("navigation.b2bEvents"), href: "/events" },
    { label: t("navigation.wishOffer"), href: "/wishOffer" },
    { label: t("navigation.contact"), href: "/contacts" },
    { label: t("navigation.howToApply"), href: "/howtoapply" },
    // MDMU campaign landing
    { label: "MDMU", href: "/mdmu" },
    { label: "Jobs", href: "/jobs" },
  ];

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`
        text-xs font-medium transition-colors relative whitespace-nowrap
        after:absolute after:left-0 after:bottom-[-3px] after:h-[2px] after:w-full
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
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/" className="">
              <img src="/b2blogo.png" alt="Jobbriz" className="h-10 w-auto" />
            </Link>
            {/* <Link href="/" className="">
              <img src="/cim-logo.webp" alt="cim" className="h-12 w-auto" />
            </Link> */}
          </div>

          {/* Center: Nav links (desktop) - flex-1 centers between logo and right */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-5 min-w-0">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          {/* Right: Language, Auth, Create */}
          <div className="flex shrink-0 items-center gap-3 lg:gap-4">
            {/* Language Switcher - compact in nav */}
            <LanguageSwitcher compact />

            {/* Login / Register when not logged in */}
            {!currentUser && (
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" asChild className="h-9">
                  <Link href="/login">{t("auth.login")}</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="h-9 bg-blue-800 hover:bg-blue-900 shrink-0"
                >
                  <Link href="/register">{t("auth.signup")}</Link>
                </Button>
              </div>
            )}

            {/* User menu when logged in */}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hidden lg:inline-flex shrink-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={(session?.user as any)?.image || "/avatar.png"}
                        alt={
                          (session?.user as any)?.name ||
                          authUser?.first_name ||
                          "User"
                        }
                      />
                      <AvatarFallback>{getInitial()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <div className="text-sm font-medium">
                      {(session?.user as any)?.name ||
                        `${authUser?.first_name || ""} ${authUser?.last_name || ""}`.trim() ||
                        authUser?.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(session?.user as any)?.email || authUser?.email}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogoutClick}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Create dropdown - single CTA, saves space */}
            <div className="hidden lg:flex items-center shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="h-9 gap-1.5 bg-blue-800 hover:bg-blue-900"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>{t("common.create")}</span>
                    <ChevronDown className="h-4 w-4 opacity-80" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() =>
                      navigateWithAuthCheck("/wishOffer/wishes/create-wish")
                    }
                    className="cursor-pointer"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("navigation.makeAWish")} (क्रेता)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigateWithAuthCheck("/wishOffer/offer/create-offer")
                    }
                    className="cursor-pointer"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("navigation.makeAnOffer")} (बिक्रेता)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  {/* Language Switcher - Mobile */}
                  <div className="mt-4">
                    <LanguageSwitcher />
                  </div>
                  {/* Mobile Login / Register when not logged in */}
                  {!currentUser && (
                    <div className="flex flex-col gap-2 mt-4">
                      <Button
                        variant="outline"
                        asChild
                        className="text-blue-800 border-blue-800"
                      >
                        <Link href="/login">{t("auth.login")}</Link>
                      </Button>
                      <Button asChild className="bg-blue-800 hover:bg-blue-900">
                        <Link href="/register">{t("auth.signup")}</Link>
                      </Button>
                    </div>
                  )}
                  {/* Mobile CTA Buttons */}
                  <div className="flex flex-col gap-3 mt-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-blue-800 border-blue-800"
                      onClick={() =>
                        navigateWithAuthCheck("/wishOffer/wishes/create-wish")
                      }
                    >
                      <PlusCircle className="w-4 h-4" />
                      {t("navigation.makeAWish")} ({t("navigation.buyer")})
                    </Button>
                    <Button
                      className="flex items-center gap-2 bg-blue-800"
                      onClick={() =>
                        navigateWithAuthCheck("/wishOffer/offer/create-offer")
                      }
                    >
                      <PlusCircle className="w-4 h-4" />
                      {t("navigation.makeAnOffer")} ({t("navigation.seller")})
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
