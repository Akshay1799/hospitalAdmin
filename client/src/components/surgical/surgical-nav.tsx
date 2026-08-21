"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  History,
  Layers,
  LayoutGrid,
  Radio,
  Scissors,
  Send,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SurgicalNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Surgical Cases", href: "/surgical-cases", icon: Scissors },
    { label: "Upcoming", href: "/upcoming-surgeries", icon: Clock },
    { label: "Emergency Fast-Track", href: "/surgical-cases/emergency", icon: ShieldAlert, highlight: true },
    { label: "Pre-Op Board", href: "/pre-op", icon: FileCheck },
    { label: "Post-Op PACU", href: "/post-op", icon: Activity },
    { label: "Surgery Schedule", href: "/surgery-schedule", icon: Calendar },
    { label: "OT Scheduling", href: "/ot-scheduling", icon: LayoutGrid },
    { label: "OT Rooms", href: "/ot-rooms", icon: Building },
    { label: "OT Live Availability", href: "/ot-availability", icon: Radio },
    { label: "Surgical Teams", href: "/surgical-team", icon: Users },
    { label: "Surgeons", href: "/surgeons", icon: Stethoscope },
    { label: "Surgeon Requests", href: "/surgical-cases/surgeon-requests", icon: Send },
    { label: "Surgery History", href: "/surgery-history", icon: History },
  ];

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/80 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : item.highlight
                  ? "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary-foreground" : item.highlight ? "text-rose-600 dark:text-rose-400" : "")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
