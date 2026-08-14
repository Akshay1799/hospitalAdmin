"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Stethoscope, ChevronsUpDown } from "lucide-react";
import { doctorWorkspaceNav, clinicOperationsNav } from "./nav-config";
import { useMode } from "@/lib/mode-context";
import { currentDoctor, clinic } from "@/lib/mock-data";
import { AvailabilityDot, Avatar } from "@/components/ui";

export default function Sidebar() {
  const pathname = usePathname();
  const { mode, setMode } = useMode();

  return (
    <aside className="hidden lg:flex flex-col w-[264px] shrink-0 h-screen sticky top-0 border-r border-line bg-surface">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-line">
        <div className="w-8 h-8 rounded-md bg-brand-500 flex items-center justify-center">
          <Stethoscope size={17} className="text-white" strokeWidth={2.25} />
        </div>
        <div className="leading-tight">
          <p className="font-display text-[17px] text-ink">Qlyno</p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Provider Portal</p>
        </div>
      </div>

      {/* Mode switcher */}
      <div className="px-4 pt-4">
        <div className="flex items-center rounded-md border border-line bg-paper p-1 text-xs font-medium">
          <button
            onClick={() => setMode("solo")}
            className={clsx(
              "flex-1 rounded px-2 py-1.5 transition-colors",
              mode === "solo" ? "bg-white shadow-card text-brand-700" : "text-ink-muted hover:text-ink"
            )}
          >
            Solo Doctor
          </button>
          <button
            onClick={() => setMode("clinic")}
            className={clsx(
              "flex-1 rounded px-2 py-1.5 transition-colors",
              mode === "clinic" ? "bg-white shadow-card text-brand-700" : "text-ink-muted hover:text-ink"
            )}
          >
            Clinic
          </button>
        </div>
        {mode === "clinic" && (
          <button className="w-full mt-2 flex items-center justify-between gap-2 rounded-md border border-line px-2.5 py-2 text-left hover:bg-paper transition-colors">
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded bg-clay-100 text-clay-600 text-[11px] font-semibold flex items-center justify-center shrink-0">
                {clinic.logoInitial}
              </span>
              <span className="text-xs font-medium text-ink truncate">{clinic.name}</span>
            </span>
            <ChevronsUpDown size={13} className="text-ink-faint shrink-0" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 mb-1.5 eyebrow">Doctor Workspace</p>
          <div className="space-y-0.5">
            {doctorWorkspaceNav.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={clsx("nav-link", active && "active")}>
                  <Icon size={16} strokeWidth={2} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {mode === "clinic" && (
          <div>
            <p className="px-3 mb-1.5 eyebrow">Clinic Operations</p>
            <div className="space-y-0.5">
              {clinicOperationsNav.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className={clsx("nav-link", active && "active")}>
                    <Icon size={16} strokeWidth={2} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Profile */}
      <div className="border-t border-line p-3">
        <Link
          href="/doctor/settings"
          className="flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-paper transition-colors"
        >
          <Avatar initials={currentDoctor.avatarInitials} size={34} />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-ink truncate">{currentDoctor.name}</p>
            <AvailabilityDot status={currentDoctor.availability} />
          </div>
        </Link>
      </div>
    </aside>
  );
}
