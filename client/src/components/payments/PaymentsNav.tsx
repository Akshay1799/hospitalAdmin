"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  CalendarDays,
  CreditCard,
  FileSpreadsheet,
  Globe,
  History,
  Layers,
  QrCode,
  Receipt,
  RotateCcw,
  Scale,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PAYMENT_NAV_ITEMS = [
  {
    href: "/payments",
    label: "Today's Collections",
    icon: Wallet,
    exact: true,
  },
  {
    href: "/payments/cash",
    label: "Cash",
    icon: Banknote,
  },
  {
    href: "/payments/upi",
    label: "UPI / QR",
    icon: QrCode,
  },
  {
    href: "/payments/card",
    label: "Card / POS",
    icon: CreditCard,
  },
  {
    href: "/payments/online",
    label: "Online & TPA",
    icon: Globe,
  },
  {
    href: "/payments/outstanding",
    label: "Outstanding",
    icon: Scale,
  },
  {
    href: "/payments/refunds",
    label: "Refunds Lens",
    icon: RotateCcw,
  },
  {
    href: "/payments/history",
    label: "Payment History",
    icon: History,
  },
];

export function PaymentsNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-muted/20 border border-border rounded-xl">
      {PAYMENT_NAV_ITEMS.map((item) => {
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
