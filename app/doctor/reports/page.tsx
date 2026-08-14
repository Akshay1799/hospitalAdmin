import { SectionHeading, Card, Pill } from "@/components/ui";
import { appointments, diagnoses, patients, prescriptions, followUps } from "@/lib/mock-data";

const weeklyVolume = [
  { day: "Mon", count: 14 },
  { day: "Tue", count: 18 },
  { day: "Wed", count: 11 },
  { day: "Thu", count: 16 },
  { day: "Fri", count: 20 },
  { day: "Sat", count: 9 },
  { day: "Sun", count: 3 },
];

export default function ReportsPage() {
  const totalConsultations = appointments.filter((a) => a.status === "Completed").length;
  const completedFollowUps = followUps.filter((f) => f.status === "Completed").length;
  const followUpRate = Math.round((completedFollowUps / Math.max(followUps.length, 1)) * 100);

  const dxCounts = new Map<string, number>();
  diagnoses.forEach((d) => dxCounts.set(d.description, (dxCounts.get(d.description) ?? 0) + 1));
  const topDx = [...dxCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const statusCounts = new Map<string, number>();
  appointments.forEach((a) => statusCounts.set(a.status, (statusCounts.get(a.status) ?? 0) + 1));

  const maxWeekly = Math.max(...weeklyVolume.map((w) => w.count));

  return (
    <div>
      <SectionHeading
        eyebrow="13 · Reports"
        title="Reports"
        description="Consultation statistics, patient trends and your personal clinical performance."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Patients", value: patients.length },
          { label: "Consultations Completed", value: totalConsultations },
          { label: "Prescriptions Issued", value: prescriptions.length },
          { label: "Follow-up Completion", value: `${followUpRate}%` },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-[11px] uppercase tracking-wide text-ink-muted mb-1.5">{s.label}</p>
            <p className="font-mono text-3xl text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <h2 className="font-display text-lg text-ink mb-5">Appointment Volume This Week</h2>
          <div className="flex items-end gap-4 h-48">
            {weeklyVolume.map((w) => (
              <div key={w.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="font-mono text-xs text-ink-muted">{w.count}</span>
                <div
                  className="w-full rounded-t-md bg-brand-500"
                  style={{ height: `${(w.count / maxWeekly) * 140}px` }}
                />
                <span className="text-xs text-ink-muted">{w.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg text-ink mb-4">Appointment Status Mix</h2>
          <div className="space-y-3">
            {[...statusCounts.entries()].map(([status, count]) => (
              <div key={status}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink-soft">{status}</span>
                  <span className="font-mono text-ink-muted">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-paper overflow-hidden">
                  <div
                    className="h-full bg-brand-400 rounded-full"
                    style={{ width: `${(count / appointments.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-display text-lg text-ink mb-4">Most Frequent Diagnoses</h2>
        <div className="space-y-3">
          {topDx.map(([desc, count]) => (
            <div key={desc} className="flex items-center gap-3">
              <span className="text-sm text-ink-soft flex-1">{desc}</span>
              <div className="w-40 h-1.5 rounded-full bg-paper overflow-hidden hidden sm:block">
                <div className="h-full bg-clay-400 rounded-full" style={{ width: `${(count / topDx[0][1]) * 100}%` }} />
              </div>
              <Pill tone="neutral">{count}</Pill>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
