"use client";

import Link from "next/link";
import { ChevronsUpDown, LogOut, PanelLeftClose, PanelLeftOpen, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";

import { navGroups } from "@/components/layout/nav-items";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/dashboard" className={cn("flex items-center gap-2.5 px-2 py-1", collapsed && "justify-center px-0")}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-active/20 text-sidebar-active">
        <span className="h-4 w-4 rounded-sm bg-sidebar-active" />
      </span>
      {!collapsed && (
        <span className="font-display text-[15px] font-semibold tracking-tight text-sidebar-foreground">
          Qlyno <span className="text-sidebar-active">Admin</span>
        </span>
      )}
    </Link>
  );
}

export function SidebarNav({
  onNavigate,
  collapsed,
  onToggleCollapse,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn("flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-3 transition-all duration-300 ease-out", collapsed && "justify-center px-2")}>
        <Logo collapsed={Boolean(collapsed)} />
        {!collapsed && onToggleCollapse && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-md text-sidebar-muted transition-all duration-200 ease-out hover:bg-muted hover:text-sidebar-foreground"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-4">
        {navGroups.map((group) => (
          <div key={group.title} className={cn("mb-5", collapsed && "mb-3")}>
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
                {group.title}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
                      collapsed && "justify-center px-2.5",
                      active
                        ? "bg-primary/10 text-foreground"
                        : "text-sidebar-muted hover:bg-muted hover:text-sidebar-foreground"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-all duration-200 ease-out",
                        collapsed && "h-5 w-5",
                        active ? "text-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                      )}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Hospital Admin Profile at bottom of sidebar */}
      <div className="border-t border-sidebar-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                collapsed ? "justify-center px-1" : "justify-between"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                  <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Hospital Admin" />
                  <AvatarFallback className="rounded-lg bg-primary/20 text-xs font-semibold text-primary">HA</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="min-w-0 flex-1 truncate">
                    <p className="truncate text-xs font-medium text-sidebar-foreground">Hospital Admin</p>
                    <p className="truncate text-[11px] text-sidebar-muted">admin@qlyno.health</p>
                  </div>
                )}
              </div>
              {!collapsed && <ChevronsUpDown className="h-4 w-4 shrink-0 text-sidebar-muted" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={collapsed ? "right" : "top"}
            align={collapsed ? "end" : "center"}
            className="w-56"
          >
            <DropdownMenuLabel>
              <p className="text-sm font-medium">Hospital Admin</p>
              <p className="text-xs font-normal text-muted-foreground">admin@qlyno.health</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" onClick={onNavigate}>
                <User className="mr-2 h-4 w-4" /> My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" onClick={onNavigate}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" onClick={onNavigate} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {collapsed && onToggleCollapse && (
          <div className="mt-2 flex justify-center border-t border-sidebar-border/50 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-sidebar-muted transition-all duration-200 ease-out hover:bg-muted hover:text-sidebar-foreground"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
