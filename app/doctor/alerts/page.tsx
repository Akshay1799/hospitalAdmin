"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, FileWarning, Siren, ListTodo, CheckCircle2 } from "lucide-react";
import { SectionHeading, Card, SeverityBadge, EmptyState } from "@/components/ui";
import { clinicalAlerts as seedAlerts, getPatient } from "@/lib/mock-data";
import { ClinicalAlert } from "@/lib/types";

const categoryIcon: Record<ClinicalAlert["category"], typeof AlertTriangle> = {
  Allergy: AlertTriangle,
  "Abnormal Report": FileWarning,
  Emergency: Siren,
  Task: ListTodo,
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(seedAlerts);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  function acknowledge(id: string) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }

  const visible = alerts.filter((a) => showAcknowledged || !a.acknowledged);
  const openCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div>
      <SectionHeading
        eyebrow="12 · Clinical Alerts"
        title="Clinical Alerts"
        description="Notifications for allergies, abnormal reports, emergency cases and critical patient conditions."
        action={
          <button
            onClick={() => setShowAcknowledged((v) => !v)}
            className="btn-secondary text-xs"
          >
            {showAcknowledged ? "Hide acknowledged" : `Show acknowledged`}
          </button>
        }
      />

      <p className="text-sm text-ink-muted mb-4">
        <span className="font-medium text-ink">{openCount}</span> open alert{openCount === 1 ? "" : "s"} require your
        attention.
      </p>

      <Card padded={false}>
        {visible.length === 0 ? (
          <EmptyState title="All caught up" description="No alerts need your attention right now." />
        ) : (
          <div className="divide-y divide-line">
            {visible.map((a) => {
              const Icon = categoryIcon[a.category];
              const patient = a.patientId ? getPatient(a.patientId) : undefined;
              return (
                <div key={a.id} className="flex items-start gap-3.5 px-5 py-4">
                  <span
                    className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                      a.severity === "Critical" ? "bg-alert-50" : a.severity === "Warning" ? "bg-clay-50" : "bg-brand-50"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        a.severity === "Critical" ? "text-alert-500" : a.severity === "Warning" ? "text-clay-600" : "text-brand-600"
                      }
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <SeverityBadge severity={a.severity} />
                      <span className="text-[11px] text-ink-faint">{a.category}</span>
                    </div>
                    <p className="text-sm text-ink-soft">{a.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[11px] text-ink-faint">{a.time}</p>
                      {patient && (
                        <Link href={`/doctor/patients/${patient.id}`} className="text-[11px] text-brand-600 hover:underline">
                          View patient chart
                        </Link>
                      )}
                    </div>
                  </div>
                  {!a.acknowledged && (
                    <button onClick={() => acknowledge(a.id)} className="btn-secondary text-xs shrink-0">
                      <CheckCircle2 size={13} /> Acknowledge
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
