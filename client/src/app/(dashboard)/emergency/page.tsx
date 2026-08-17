"use client";

import { AlertTriangle, Siren, TimerReset } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { emergencyAlerts } from "@/lib/mock-data/hospital-operations";

export default function EmergencyPage() {
  return (
    <div>
      <PageHeader
        title="Emergency Command"
        description="Live critical event coordination, escalation, and ambulance response workflow."
        crumbs={[{ label: "Hospital Operations" }, { label: "Emergency Command" }]}
        actions={
          <Button>
            <Siren /> Trigger alert
          </Button>
        }
      />

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {emergencyAlerts.map((alert) => (
          <Card key={alert.id} className={alert.severity === "critical" ? "border-destructive/30 bg-destructive/5" : ""}>
            <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
              <div>
                <CardTitle className="text-base">{alert.title}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{alert.patient}</p>
              </div>
              <StatusBadge status={alert.severity === "critical" ? "critical" : alert.severity} />
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Assigned team</span>
                <span className="font-medium text-foreground">{alert.assignedTeam}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ETA</span>
                <span className="font-medium text-foreground">{alert.eta}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Alert time</span>
                <span className="font-medium text-foreground">{alert.alertTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant={alert.status === "active" ? "warning" : "secondary"}>{alert.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4 border-warning/40 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-warning" /> Escalation checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-foreground md:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-3">Pre-arrival notification sent to receiving team.</div>
          <div className="rounded-lg border border-border bg-background p-3">Ambulance ETA and patient handoff confirmed.</div>
          <div className="rounded-lg border border-border bg-background p-3">Clinical lead assigned and chart brief created.</div>
          <div className="rounded-lg border border-border bg-background p-3">Consent and risk documentation reviewed.</div>
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <TimerReset className="h-3.5 w-3.5" /> Last dispatch synchronization: 08:55 AM
      </div>
    </div>
  );
}
