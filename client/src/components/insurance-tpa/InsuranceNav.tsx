"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Hourglass,
  Layers,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const INSURANCE_NAV_ITEMS = [
  {
    href: "/insurance-tpa",
    label: "Claims Register",
    icon: FileText,
    exact: true,
  },
  {
    href: "/insurance-tpa/patients",
    label: "Insurance Patients",
    icon: Users,
  },
  {
    href: "/insurance-tpa/pre-authorizations",
    label: "Pre-Authorizations",
    icon: FileCheck,
  },
  {
    href: "/insurance-tpa/pending-approvals",
    label: "Pending Approvals",
    icon: Hourglass,
  },
  {
    href: "/insurance-tpa/rejected",
    label: "Rejected & Queries",
    icon: XCircle,
  },
  {
    href: "/insurance-tpa/settlements",
    label: "Settlements & Bank",
    icon: CheckCircle2,
  },
  {
    href: "/insurance-tpa/reports",
    label: "TPA Reports",
    icon: BarChart3,
  },
];

export function InsuranceNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-muted/20 border border-border rounded-xl">
      {INSURANCE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
