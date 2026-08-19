"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Bell, Menu } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import QuickActions from "./QuickActions";
import { allNavItems } from "./nav-config";
import { clinicalAlerts } from "@/lib/mock-data";

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = allNavItems.find((n) => pathname?.startsWith(n.href));
  const unacknowledged = clinicalAlerts.filter((a) => !a.acknowledged).length;
  const showBackButton = Boolean(
    pathname &&
      pathname !== "/" &&
      pathname !== "/doctor/dashboard" &&
      pathname !== "/clinic/dashboard"
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(pathname?.startsWith("/clinic") ? "/clinic/dashboard" : "/doctor/dashboard");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-line bg-surface/95 backdrop-blur flex items-center gap-4 px-4 lg:px-6">
      <button className="lg:hidden text-ink-muted" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>

      {showBackButton && (
        <button
          type="button"
          onClick={handleBack}
          className="w-9 h-9 rounded-md border border-line flex items-center justify-center text-ink-muted hover:bg-paper hover:text-ink transition-colors"
          aria-label="Go back to previous page"
          title="Go back"
        >
          <ArrowLeft size={17} />
        </button>
      )}

      <div className="hidden lg:block">
        <p className="text-sm font-medium text-ink whitespace-nowrap">{current?.label ?? "Qlyno"}</p>
      </div>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/doctor/alerts"
          className="relative w-9 h-9 rounded-md border border-line flex items-center justify-center text-ink-muted hover:bg-paper transition-colors"
          aria-label="Clinical alerts"
        >
          <Bell size={16} />
          {unacknowledged > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-alert-400 text-white text-[10px] font-semibold flex items-center justify-center">
              {unacknowledged}
            </span>
          )}
        </Link>
        <QuickActions />
      </div>
    </header>
  );
}
