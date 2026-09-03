import Link from "next/link";
import { ArrowUpRight, Video, MapPin, Clock } from "lucide-react";
import { Card, SectionHeading, StatusBadge, SeverityBadge, Avatar, Pill } from "@/components/ui";
import {
  appointments,
  followUps,
  clinicalAlerts,
  tasks,
  patients,
  currentDoctor,
  getPatient,
} from "@/lib/mock-data";

const TODAY = "2026-08-13";

export default function DoctorDashboard() {
  const todays = appointments
    .filter((a) => a.date === TODAY && a.doctorId === currentDoctor.id)
    .sort((a, b) => a.time.localeCompare(b.time));

  const waiting = todays.filter((a) => a.status === "Checked In").length;
  const dueFollowUps = followUps.filter((f) => f.status === "Due Today" || f.status === "Overdue");
  const criticalAlerts = clinicalAlerts.filter((a) => a.severity === "Critical" && !a.acknowledged);
  const openTasks = tasks.filter((t) => t.status !== "Done");

  return (
    <div>
      <SectionHeading
        eyebrow="01 · Dashboard"
        title={`Good morning, ${currentDoctor.name.split(" ")[1] ? currentDoctor.name : currentDoctor.name}`}
        description="Thursday, August 13, 2026 — here's what your day looks like across scheduled appointments, waiting patients and open clinical items."
      />

      {/* Signature instrument strip — today at a glance */}
      <div className="vitals-strip mb-8">
        <div className="vitals-cell">
          <span className="vitals-label">Appointments Today</span>
          <span className="vitals-value">
            {todays.length}
            <span className="vitals-unit">total</span>
          </span>
        </div>
        <div className="vitals-cell">
          <span className="vitals-label">Waiting Now</span>
          <span className="vitals-value">
            {waiting}
            <span className="vitals-unit">patients</span>
          </span>
        </div>
        <div className="vitals-cell">
          <span className="vitals-label">Follow-ups Due</span>
          <span className="vitals-value">
            {dueFollowUps.length}
            <span className="vitals-unit">cases</span>
          </span>
        </div>
        <div className="vitals-cell">
          <span className="vitals-label">Critical Alerts</span>
          <span className="vitals-value text-alert-100">
            {criticalAlerts.length}
            <span className="vitals-unit">open</span>
          </span>
        </div>
        <div className="vitals-cell">
          <span className="vitals-label">Open Tasks</span>
          <span className="vitals-value">
            {openTasks.length}
            <span className="vitals-unit">pending</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="xl:col-span-2 space-y-6">
          <Card padded={false}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="font-display text-lg text-ink">Today&apos;s Queue</h2>
              <Link href="/doctor/appointments" className="btn-ghost text-xs">
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-line">
              {todays.map((apt) => {
                const patient = getPatient(apt.patientId);
                if (!patient) return null;
                return (
                  <div key={apt.id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="font-mono text-xs text-ink-muted w-16 shrink-0 flex items-center gap-1">
                      <Clock size={12} /> {apt.time}
                    </span>
                    <Avatar initials={patient.avatarInitials} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-ink truncate">{patient.name}</p>
                      <p className="text-xs text-ink-muted truncate">{apt.reason}</p>
                    </div>
                    <span className="hidden sm:flex items-center gap-1 text-[11px] text-ink-muted">
                      {apt.type === "Video" ? <Video size={12} /> : <MapPin size={12} />}
                      {apt.type}
                    </span>
                    <StatusBadge status={apt.status} />
                    <Link
                      href={`/doctor/consultation?patient=${patient.id}&appointment=${apt.id}`}
                      className="btn-secondary text-xs py-1.5"
                    >
                      Open
                    </Link>
                  </div>
                );
              })}
              {todays.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-ink-muted">No appointments scheduled for today.</p>
              )}
            </div>
          </Card>

          <Card padded={false}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="font-display text-lg text-ink">Follow-ups Needing Attention</h2>
              <Link href="/doctor/follow-up" className="btn-ghost text-xs">
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-line">
              {dueFollowUps.map((f) => {
                const patient = getPatient(f.patientId);
                if (!patient) return null;
                return (
                  <div key={f.id} className="flex items-center gap-3 px-5 py-3.5">
                    <Avatar initials={patient.avatarInitials} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-ink truncate">{patient.name}</p>
                      <p className="text-xs text-ink-muted truncate">{f.reason}</p>
                    </div>
                    <Pill tone={f.status === "Overdue" ? "alert" : "clay"}>{f.status}</Pill>
                    <Link href="/doctor/follow-up" className="btn-secondary text-xs py-1.5">
                      Schedule
                    </Link>
                  </div>
                );
              })}
              {dueFollowUps.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-ink-muted">Nothing due today. Nicely caught up.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg text-ink">Clinical Alerts</h2>
              <Link href="/doctor/alerts" className="btn-ghost text-xs">
                All <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="space-y-3">
              {clinicalAlerts.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-start gap-2.5">
                  <SeverityBadge severity={a.severity} />
                  <div className="min-w-0">
                    <p className="text-xs text-ink-soft leading-snug">{a.message}</p>
                    <p className="text-[11px] text-ink-faint mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg text-ink">My Tasks</h2>
            </div>
            <div className="space-y-3">
              {openTasks.map((t) => (
                <div key={t.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-soft leading-snug">{t.title}</p>
                    <p className="text-[11px] text-ink-faint mt-0.5">Due {t.dueDate}</p>
                  </div>
                  <Pill tone={t.priority === "High" ? "alert" : t.priority === "Medium" ? "clay" : "neutral"}>
                    {t.priority}
                  </Pill>
                </div>
              ))}
              {openTasks.length === 0 && <p className="text-xs text-ink-muted">No open tasks.</p>}
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-lg text-ink mb-3">This Week</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-mono text-2xl text-ink">{patients.length}</p>
                <p className="text-[11px] text-ink-muted">Active patients</p>
              </div>
              <div>
                <p className="font-mono text-2xl text-ink">{appointments.filter((a) => a.status === "Completed").length}</p>
                <p className="text-[11px] text-ink-muted">Consultations done</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
