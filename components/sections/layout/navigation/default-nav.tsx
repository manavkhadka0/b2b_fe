"use client";

import { useState, useEffect, useRef } from "react";
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
import { AuthDialog } from "@/components/auth/AuthDialog";

export function DefaultNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mdmuOpen, setMdmuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<"login" | "register">(
    "login",
  );
  const mdmuLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const moreLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
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

  const handleLogoutClick = async () => {
    try {
      if (session) {
        await signOut({ redirect: false });
      } else {
        logout();
      }
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
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
  ];

  const moreNavItems = [
    { label: t("navigation.contact"), href: "/contacts" },
    { label: t("navigation.howToApply"), href: "/howtoapply" },
  ];

  const mdmuNavItems = [
    { label: "MDMU", href: "/mdmu" },
    { label: "About Us", href: "/mdmu/about-us" },
    { label: "Endorsements", href: "/mdmu/endorsements" },
    { label: "Newsletter", href: "/mdmu/newsletter" },
  ];
  const isMdmuActive = pathname.startsWith("/mdmu");
  const isMoreActive = pathname === "/contacts" || pathname === "/howtoapply";

  const NavLink = ({
    href,
    label,
    mobile,
  }: {
    href: string;
    label: string;
    mobile?: boolean;
  }) => (
    <Link
      href={href}
      onClick={mobile ? () => setMobileOpen(false) : undefined}
      className={`
        text-sm font-medium transition-colors relative whitespace-nowrap
        after:absolute after:left-0 after:bottom-[-3px] after:h-[2px] after:w-full
        after:origin-left after:scale-x-0 after:bg-blue-800 after:transition-transform
        ${
          mobile
            ? "block py-3 text-base active:bg-gray-50 rounded-md px-1 -mx-1"
            : ""
        }
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
        isScrolled ? "shadow-sm" : "border-b"
      }`}
    >
      <ResponsiveContainer>
        <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between gap-2 sm:gap-4 min-h-0">
          {/* Logo Section - responsive size */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3 min-w-0">
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="/b2blogo.png"
                alt="Jobbriz"
                className="h-7 sm:h-8 md:h-9 lg:h-11 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left"
              />
            </Link>
            {/* <Link href="/" className="">
              <img src="/cim-logo.webp" alt="cim" className="h-12 w-auto" />
            </Link> */}
          </div>

          {/* Center: Nav links (desktop) - flex-1 centers between logo and right */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-6 min-w-0">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
            <NavLink href="/jobs" label="Jobbriz" />
            <DropdownMenu
              open={mdmuOpen}
              onOpenChange={(open) => {
                if (!open) setMdmuOpen(false);
              }}
            >
              <div
                className="relative"
                onMouseEnter={() => {
                  if (mdmuLeaveTimeoutRef.current) {
                    clearTimeout(mdmuLeaveTimeoutRef.current);
                    mdmuLeaveTimeoutRef.current = null;
                  }
                  setMdmuOpen(true);
                }}
                onMouseLeave={() => {
                  mdmuLeaveTimeoutRef.current = setTimeout(() => {
                    setMdmuOpen(false);
                    mdmuLeaveTimeoutRef.current = null;
                  }, 150);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    onClick={() => router.push("/mdmu")}
                    className={`
                      text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-0.5
                      after:absolute after:left-0 after:bottom-[-3px] after:h-[2px] after:w-full
                      after:origin-left after:scale-x-0 after:bg-blue-800 after:transition-transform
                      ${
                        isMdmuActive
                          ? "text-blue-800 after:scale-x-100"
                          : "text-gray-600 hover:text-blue-800 after:hover:scale-x-100"
                      }
                    `}
                  >
                    MDMU
                    <ChevronDown className="h-4 w-4 opacity-80" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-48"
                  onMouseEnter={() => {
                    if (mdmuLeaveTimeoutRef.current) {
                      clearTimeout(mdmuLeaveTimeoutRef.current);
                      mdmuLeaveTimeoutRef.current = null;
                    }
                    setMdmuOpen(true);
                  }}
                  onMouseLeave={() => {
                    mdmuLeaveTimeoutRef.current = setTimeout(() => {
                      setMdmuOpen(false);
                      mdmuLeaveTimeoutRef.current = null;
                    }, 150);
                  }}
                >
                  {mdmuNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="cursor-pointer">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </div>
            </DropdownMenu>
            <DropdownMenu
              open={moreOpen}
              onOpenChange={(open) => {
                if (!open) setMoreOpen(false);
              }}
            >
              <div
                className="relative"
                onMouseEnter={() => {
                  if (moreLeaveTimeoutRef.current) {
                    clearTimeout(moreLeaveTimeoutRef.current);
                    moreLeaveTimeoutRef.current = null;
                  }
                  setMoreOpen(true);
                }}
                onMouseLeave={() => {
                  moreLeaveTimeoutRef.current = setTimeout(() => {
                    setMoreOpen(false);
                    moreLeaveTimeoutRef.current = null;
                  }, 150);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={`
                      text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-0.5
                      after:absolute after:left-0 after:bottom-[-3px] after:h-[2px] after:w-full
                      after:origin-left after:scale-x-0 after:bg-blue-800 after:transition-transform
                      ${
                        isMoreActive
                          ? "text-blue-800 after:scale-x-100"
                          : "text-gray-600 hover:text-blue-800 after:hover:scale-x-100"
                      }
                    `}
                  >
                    More
                    <ChevronDown className="h-4 w-4 opacity-80" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-48"
                  onMouseEnter={() => {
                    if (moreLeaveTimeoutRef.current) {
                      clearTimeout(moreLeaveTimeoutRef.current);
                      moreLeaveTimeoutRef.current = null;
                    }
                    setMoreOpen(true);
                  }}
                  onMouseLeave={() => {
                    moreLeaveTimeoutRef.current = setTimeout(() => {
                      setMoreOpen(false);
                      moreLeaveTimeoutRef.current = null;
                    }, 150);
                  }}
                >
                  {moreNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="cursor-pointer">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </div>
            </DropdownMenu>
          </nav>

          {/* Right: Language, Auth, Create */}
          <div className="flex shrink-0 items-center gap-4 lg:gap-5">
            {/* Language Switcher - compact in nav */}
            <LanguageSwitcher compact />

            {/* Login / Register when not logged in */}
            {!currentUser && (
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-4"
                  onClick={() => {
                    setAuthDialogMode("login");
                    setAuthDialogOpen(true);
                  }}
                >
                  {t("auth.login")}
                </Button>
                <Button
                  size="sm"
                  className="h-10 px-4 bg-blue-800 hover:bg-blue-900 shrink-0"
                  onClick={() => {
                    setAuthDialogMode("register");
                    setAuthDialogOpen(true);
                  }}
                >
                  {t("auth.signup")}
                </Button>
              </div>
            )}

            {/* User menu when logged in */}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hidden lg:inline-flex shrink-0"
                  >
                    <Avatar className="h-9 w-9">
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
                        `${authUser?.first_name || ""} ${
                          authUser?.last_name || ""
                        }`.trim() ||
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
                    className="h-10 px-4 gap-2 bg-blue-800 hover:bg-blue-900"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>{t("common.create")}</span>
                    <ChevronDown className="h-4 w-4 opacity-80" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => router.push("/wishOffer/wishes/create-wish")}
                    className="cursor-pointer"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("navigation.makeAWish")} (क्रेता)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/wishOffer/offer/create-offer")}
                    className="cursor-pointer"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("navigation.makeAnOffer")} (बिक्रेता)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-10 w-10 shrink-0"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[min(100vw-2rem,320px)] overflow-y-auto"
              >
                <nav className="flex flex-col gap-1 mt-6 pb-6">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} mobile />
                  ))}
                  <NavLink href="/jobs" label="Jobbriz" mobile />
                  <div className="flex flex-col gap-1 pt-2 mt-2 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1 mb-1">
                      MDMU
                    </span>
                    {mdmuNavItems.map((item) => (
                      <NavLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        mobile
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-1 pt-2 mt-2 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1 mb-1">
                      More
                    </span>
                    {moreNavItems.map((item) => (
                      <NavLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        mobile
                      />
                    ))}
                  </div>
                  {/* Language Switcher - Mobile */}
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <LanguageSwitcher />
                  </div>
                  {/* Mobile: Logged-in user section (Profile, Log out) */}
                  {currentUser && (
                    <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 px-1 py-2 rounded-lg bg-gray-50">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage
                            src={(session?.user as any)?.image || "/avatar.png"}
                            alt=""
                          />
                          <AvatarFallback>{getInitial()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {(session?.user as any)?.name ||
                              `${authUser?.first_name || ""} ${
                                authUser?.last_name || ""
                              }`.trim() ||
                              authUser?.email}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {(session?.user as any)?.email || authUser?.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 h-11 text-gray-700"
                        onClick={() => {
                          setMobileOpen(false);
                          handleProfileClick();
                        }}
                      >
                        <User className="h-4 w-4 shrink-0" />
                        <span>Profile</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 h-11 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setMobileOpen(false);
                          handleLogoutClick();
                        }}
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        <span>Log out</span>
                      </Button>
                    </div>
                  )}
                  {/* Mobile Login / Register when not logged in */}
                  {!currentUser && (
                    <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        className="h-11 text-blue-800 border-blue-800"
                        onClick={() => {
                          setMobileOpen(false);
                          setAuthDialogMode("login");
                          setAuthDialogOpen(true);
                        }}
                      >
                        {t("auth.login")}
                      </Button>
                      <Button
                        className="h-11 bg-blue-800 hover:bg-blue-900"
                        onClick={() => {
                          setMobileOpen(false);
                          setAuthDialogMode("register");
                          setAuthDialogOpen(true);
                        }}
                      >
                        {t("auth.signup")}
                      </Button>
                    </div>
                  )}
                  {/* Mobile CTA Buttons - Create Wish / Create Offer */}
                  <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2 h-11 text-blue-800 border-blue-800"
                      onClick={() => {
                        setMobileOpen(false);
                        router.push("/wishOffer/wishes/create-wish");
                      }}
                    >
                      <PlusCircle className="w-4 h-4 shrink-0" />
                      {t("navigation.makeAWish")} ({t("navigation.buyer")})
                    </Button>
                    <Button
                      className="flex items-center justify-center gap-2 h-11 bg-blue-800 hover:bg-blue-900"
                      onClick={() => {
                        setMobileOpen(false);
                        router.push("/wishOffer/offer/create-offer");
                      }}
                    >
                      <PlusCircle className="w-4 h-4 shrink-0" />
                      {t("navigation.makeAnOffer")} ({t("navigation.seller")})
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </ResponsiveContainer>
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode={authDialogMode}
      />
    </header>
  );
}
