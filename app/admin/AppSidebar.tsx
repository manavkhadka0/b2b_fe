"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

const SIDEBAR_MAIN_LINKS = [
  { href: "/admin/events", label: "Events" },
  { href: "/admin/contacts", label: "Contacts" },
] as const;

const SIDEBAR_EXPERIENCE_ZONE_LINKS = [
  { href: "/admin/experience-zone", label: "Experience Zone" },
] as const;

const SIDEBAR_CO_WORKING_LINKS = [
  { href: "/admin/co-working-space", label: "Co-Working Space" },
] as const;

const SIDEBAR_WISHES_OFFERS_LINKS = [
  { href: "/admin/wishes-offers", label: "Wishes & Offers" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/subcategories", label: "Subcategories" },
  { href: "/admin/services", label: "Services" },
] as const;

const SIDEBAR_JOBBRIZE_LINKS = [
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/apprenticeships", label: "Apprenticeships" },
  { href: "/admin/internships", label: "Internships" },
  { href: "/admin/industry", label: "Industries" },
] as const;

const SIDEBAR_MDMU_LINKS = [
  { href: "/admin/mdmu", label: "Applications" },
  { href: "/admin/mdmu/logos", label: "Endorsements" },
] as const;

function NavLink({
  href,
  label,
  isActive,
  onNavigate,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={href} onClick={onNavigate}>
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeOnNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-slate-200">
      <SidebarHeader className="border-b border-slate-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="cursor-default" isActive={false}>
              <span className="font-semibold text-sidebar-foreground">
                BIRAT BAZAAR
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_MAIN_LINKS.map(({ href, label }) => {
                const isActive = pathname?.startsWith(href);
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={label}
                    isActive={isActive}
                    onNavigate={closeOnNavigate}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Experience Zone</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_EXPERIENCE_ZONE_LINKS.map(({ href, label }) => {
                const isActive = pathname?.startsWith(href);
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={label}
                    isActive={isActive}
                    onNavigate={closeOnNavigate}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Co-Working</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_CO_WORKING_LINKS.map(({ href, label }) => {
                const isActive = pathname?.startsWith(href);
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={label}
                    isActive={isActive}
                    onNavigate={closeOnNavigate}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Wishes & Offers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_WISHES_OFFERS_LINKS.map(({ href, label }) => {
                const isActive = pathname?.startsWith(href);
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={label}
                    isActive={isActive}
                    onNavigate={closeOnNavigate}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Jobbriz</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_JOBBRIZE_LINKS.map(({ href, label }) => {
                const isActive = pathname?.startsWith(href);
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={label}
                    isActive={isActive}
                    onNavigate={closeOnNavigate}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>MDMU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_MDMU_LINKS.map(({ href, label }) => {
                const isActive =
                  href === "/admin/mdmu"
                    ? pathname === "/admin/mdmu"
                    : pathname?.startsWith(href);
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={label}
                    isActive={isActive}
                    onNavigate={closeOnNavigate}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
