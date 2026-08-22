"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Cpu,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  Globe,
  Layers,
  Settings,
  ShieldAlert,
  TestTube,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LabNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Test Orders",
      href: "/lab",
      icon: FlaskConical,
      exact: true,
    },
    {
      label: "Sample Collection",
      href: "/lab/sample-collection",
      icon: TestTube,
    },
    {
      label: "Samples in Process",
      href: "/lab/in-process",
      icon: Activity,
    },
    {
      label: "Reports Archive",
      href: "/lab/reports",
      icon: FileSpreadsheet,
    },
    {
      label: "Awaiting Review",
      href: "/lab/awaiting-review",
      icon: FileCheck2,
    },
    {
      label: "Critical Reports",
      href: "/lab/critical",
      icon: AlertOctagon,
      badge: "Panic",
    },
    {
      label: "External Reports",
      href: "/lab/external",
      icon: Globe,
    },
    {
      label: "Lab Staff",
      href: "/lab/staff",
      icon: Users,
    },
    {
      label: "Lab Settings",
      href: "/lab/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-full border-b border-border bg-card/60 backdrop-blur-xs sticky top-0 z-10">
      <div className="flex items-center gap-1 overflow-x-auto py-2 px-1 no-scrollbar">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/lab");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors shrink-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-destructive/15 text-destructive border border-destructive/30"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
