"use client";

import { useState } from "react";

import { SidebarNav } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const collapsed = !isPinned && !isHovered;

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className="hidden shrink-0 border-r border-sidebar-border lg:block transition-[width] duration-300 ease-out"
        style={{ width: collapsed ? 78 : 248 }}
        onMouseEnter={() => !isPinned && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="fixed h-screen transition-[width] duration-300 ease-out" style={{ width: collapsed ? 78 : 248 }}>
          <SidebarNav
            collapsed={collapsed}
            onToggleCollapse={() => {
              setIsPinned((prev) => !prev);
              setIsHovered(false);
            }}
          />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
