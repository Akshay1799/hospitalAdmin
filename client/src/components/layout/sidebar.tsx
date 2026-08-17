"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";

import { navGroups } from "@/components/layout/nav-items";
import { Button } from "@/components/ui/button";
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
      <div className={cn("flex h-16 shrink-0 items-center border-b border-sidebar-border px-3 transition-all duration-300 ease-out", collapsed && "px-2")}>
        <Logo collapsed={Boolean(collapsed)} />
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-4">
        {navGroups.map((group) => (
          <div key={group.title} className={cn("mb-5", collapsed && "mb-3") }>
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
      {!collapsed && (
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center justify-between gap-2 rounded-lg bg-white/5 p-3">
            <div>
              <p className="text-xs font-medium text-sidebar-foreground">Qlyno Admin v1.0</p>
              <p className="mt-0.5 text-[11px] text-sidebar-muted">Frontend build · mock data mode</p>
            </div>
            {onToggleCollapse && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-md text-sidebar-muted transition-all duration-200 ease-out hover:bg-muted hover:text-sidebar-foreground"
                onClick={onToggleCollapse}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
