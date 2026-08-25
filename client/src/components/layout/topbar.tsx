"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  Bed,
  Bell,
  Building2,
  ChevronDown,
  FileBarChart,
  Menu,
  Plus,
  Search,
  ShieldAlert,
  ShoppingBag,
  Siren,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarNav } from "@/components/layout/sidebar";
import { mockExtendedNotifications } from "@/lib/mock-data/notifications-extended";
import { GlobalSearch } from "@/components/layout/global-search";

export function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = mockExtendedNotifications.filter((n) => n.status === "Unread").length;

  return (
    <TooltipProvider delayDuration={200}>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6 print:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="hidden flex-1 sm:block">
          <GlobalSearch />
        </div>
        <div className="flex-1 sm:hidden" />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 1. Notifications Dropdown (with Tooltip) */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    {unread > 0 && (
                      <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
                        {unread}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications &amp; Escalations</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-88">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span className="font-bold text-xs">Alerts &amp; Escalations</span>
                <Badge variant="secondary" className="text-[10px]">{unread} unread</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {mockExtendedNotifications.slice(0, 5).map((n) => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 whitespace-normal py-2" asChild>
                    <Link href="/notifications" className="cursor-pointer">
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground truncate">{n.title}</span>
                        {n.status === "Unread" && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="line-clamp-2 text-[11px] text-muted-foreground">{n.message}</p>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="justify-center text-center text-xs font-semibold text-primary">
                  Open Full Notification Center &rarr;
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 2. Emergency Button with Icon & Text (with Tooltip) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="relative gap-1.5 h-9 font-semibold text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive shadow-sm"
                asChild
              >
                <Link href="/emergency">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  <span>Emergency</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Emergency / SOS Command</p>
            </TooltipContent>
          </Tooltip>

          {/* 3. Quick Action Button & Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-1.5 h-9 font-medium shadow-sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Action</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/verification" className="flex items-center gap-2.5 cursor-pointer text-xs">
                    <UserPlus className="h-4 w-4 text-teal-600" />
                    <span>Add Doctor</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/staff" className="flex items-center gap-2.5 cursor-pointer text-xs">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>Add Staff</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/departments" className="flex items-center gap-2.5 cursor-pointer text-xs">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                    <span>Create Department</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wards-beds" className="flex items-center gap-2.5 cursor-pointer text-xs">
                    <Bed className="h-4 w-4 text-cyan-600" />
                    <span>Allocate Bed</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/surgical-cases/create" className="flex items-center gap-2.5 cursor-pointer text-xs">
                    <Activity className="h-4 w-4 text-purple-600" />
                    <span>Create Surgery Case</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/surgical-cases/surgeon-requests" className="flex items-center gap-2.5 cursor-pointer text-xs">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <span>Request Surgeon</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/procurement/create" className="flex items-center gap-2.5 cursor-pointer text-xs">
                    <ShoppingBag className="h-4 w-4 text-orange-600" />
                    <span>Request Vendor</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/reports" className="flex items-center gap-2.5 cursor-pointer text-xs">
                    <FileBarChart className="h-4 w-4 text-sky-600" />
                    <span>Generate Report</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/emergency" className="flex items-center gap-2.5 cursor-pointer text-xs text-destructive font-semibold focus:text-destructive">
                    <ShieldAlert className="h-4 w-4 text-destructive" />
                    <span>Emergency Control</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ambulance" className="flex items-center gap-2.5 cursor-pointer text-xs text-rose-600 font-semibold focus:text-rose-600">
                    <Siren className="h-4 w-4 text-rose-600" />
                    <span>Dispatch Ambulance</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}
