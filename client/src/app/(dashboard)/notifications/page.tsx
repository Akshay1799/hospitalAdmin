"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { notifications as initialNotifications } from "@/lib/mock-data/operations";
import { cn, formatDateTime } from "@/lib/utils";

const categories = ["all", "emergency", "appointment", "billing", "lab", "staff", "vendor", "system"] as const;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [tab, setTab] = useState<(typeof categories)[number]>("all");

  const filtered = notifications.filter((n) => tab === "all" || n.category === tab);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Appointments, billing, lab, staffing and emergency alerts in one place."
        crumbs={[{ label: "Notifications" }]}
        actions={
          <Button variant="outline" onClick={markAllRead}>
            <CheckCheck /> Mark all as read
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="flex-wrap">
          {categories.map((c) => (
            <TabsTrigger key={c} value={c} className="capitalize">
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={tab}>
          {filtered.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications" description="You're all caught up in this category." />
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((n) => (
                <Card key={n.id} className={cn(!n.read && "border-primary/30 bg-primary/[0.03]")}>
                  <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-1 h-2 w-2 shrink-0 rounded-full",
                          n.read ? "bg-transparent" : "bg-primary"
                        )}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                        <p className="mt-1.5 text-xs text-muted-foreground">{formatDateTime(n.timestamp)}</p>
                      </div>
                    </div>
                    <StatusBadge status={n.severity === "critical" ? "critical" : n.severity} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
