"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Bed, CalendarClock, CheckCircle2, Clock, MapPin } from "lucide-react";
import { Card, Pill } from "@/components/ui";
import { getPatient } from "@/lib/mock-data";
import {
  ClinicQueueItem,
  DoctorShift,
  DoctorTaskItem,
  HospitalWorkItem,
  shiftTypeLabel,
  Workplace,
} from "@/lib/doctor-workflow-types";

export function WorkplaceBadge({ workplace }: { workplace?: Workplace }) {
  if (!workplace) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2 py-1 text-[11px] font-semibold text-ink-muted">
      <MapPin size={11} />
      {workplace.type === "online"
        ? "Online Consultation"
        : `${workplace.name}${workplace.location ? ` - ${workplace.location}` : ""}`}
    </span>
  );
}

export function ShiftCard({
  shift,
  workplace,
  onClick,
}: {
  shift: DoctorShift;
  workplace?: Workplace;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="block w-full text-left">
      <Card className="!p-4 hover:border-brand-100 hover:bg-brand-50/30 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{workplace?.name ?? "Workplace"}</p>
            <p className="text-xs text-ink-muted mt-0.5">
              {workplace?.location ?? workplace?.department ?? "Online"}
            </p>
          </div>
          <Pill tone={shift.status === "active" ? "sage" : shift.status === "completed" ? "neutral" : "brand"}>
            {shift.status}
          </Pill>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-mono text-xs text-ink-muted">
            {shift.startTime} - {shift.endTime}
          </p>
          <p className="text-xs font-semibold text-ink-soft">{shiftTypeLabel(shift.shiftType)}</p>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Pill tone={shift.bookingEnabled ? "sage" : "neutral"}>
            {shift.bookingEnabled ? "Booking enabled" : "Booking closed"}
          </Pill>
          {shift.note && <span className="text-[11px] text-alert-500">{shift.note}</span>}
        </div>
      </Card>
    </button>
  );
}

export function ActiveShiftBanner({
  shift,
  workplace,
}: {
  shift?: DoctorShift;
  workplace?: Workplace;
}) {
  if (!shift || !workplace) return null;
  return (
    <div className="rounded-card border border-brand-100 bg-brand-50 px-4 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow text-brand-700">Active Shift</p>
          <p className="mt-1 text-sm font-semibold text-ink">
            {workplace.name}
            {workplace.location ? ` - ${workplace.location}` : ""}
          </p>
          <p className="text-xs text-ink-muted">
            {shiftTypeLabel(shift.shiftType)} - {shift.startTime} to {shift.endTime}
          </p>
        </div>
        <Pill tone="sage">
          <CheckCircle2 size={11} /> Active
        </Pill>
      </div>
    </div>
  );
}

export function ClinicQueueCard({
  item,
  onStart,
  onComplete,
}: {
  item: ClinicQueueItem;
  onStart: () => void;
  onComplete: () => void;
}) {
  const patient = getPatient(item.patientId);
  return (
    <Card className="!p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-ink-muted">#{item.token}</p>
          <h3 className="mt-1 text-sm font-semibold text-ink">{patient?.name ?? "Patient"}</h3>
          <p className="text-xs text-ink-muted">{item.appointmentTime} - {item.reason}</p>
          <p className="mt-2 text-xs text-clay-600">Waiting {item.waitingMins} min</p>
        </div>
        <Pill tone={item.status === "in_consultation" ? "sage" : item.status === "waiting" ? "clay" : "neutral"}>
          {item.status.replace("_", " ")}
        </Pill>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/doctor/patients/${item.patientId}`} className="btn-secondary text-xs">
          Open Patient
        </Link>
        {item.status !== "completed" && (
          <Link
            href={`/doctor/patients/${item.patientId}/encounter/${item.id}`}
            onClick={onStart}
            className="btn-primary text-xs"
          >
            Start Consultation
          </Link>
        )}
        {item.status === "in_consultation" && (
          <button onClick={onComplete} className="btn-secondary text-xs">
            Complete
          </button>
        )}
      </div>
    </Card>
  );
}

export function HospitalPatientCard({
  item,
  onAccept,
  onComplete,
}: {
  item: HospitalWorkItem;
  onAccept?: () => void;
  onComplete?: () => void;
}) {
  const patient = getPatient(item.patientId);
  return (
    <Card className="!p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-mono text-xs text-ink-muted">
            <Bed size={12} /> Bed {item.bed}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-ink">{patient?.name ?? "Patient"}</h3>
          <p className="text-xs text-ink-muted">Age {patient?.age ?? "-"} - {item.diagnosis}</p>
        </div>
        <Pill tone={item.priority === "Critical" ? "alert" : item.priority === "High" ? "clay" : "neutral"}>
          {item.priority}
        </Pill>
      </div>
      <div className="mt-3 rounded-md border border-line bg-paper px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted">Why assigned</p>
        <p className="mt-1 text-xs text-ink-soft">{item.reasonAssigned}</p>
        {item.requestedBy && <p className="mt-1 text-xs text-ink-muted">Requested by {item.requestedBy}</p>}
      </div>
      {item.pending && item.pending.length > 0 && (
        <div className="mt-3 space-y-1">
          {item.pending.map((pending) => (
            <p key={pending} className="text-xs text-ink-muted">
              - {pending}
            </p>
          ))}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {item.status === "request" && onAccept && (
          <button onClick={onAccept} className="btn-primary text-xs">
            Accept
          </button>
        )}
        <Link href={`/doctor/patients/${item.patientId}/encounter/${item.id}`} className="btn-secondary text-xs">
          Review Patient <ArrowRight size={13} />
        </Link>
        {item.status !== "completed" && onComplete && (
          <button onClick={onComplete} className="btn-ghost text-xs">
            Complete
          </button>
        )}
      </div>
    </Card>
  );
}

export function DoctorTaskCard({
  task,
  workplace,
  onStart,
  onComplete,
}: {
  task: DoctorTaskItem;
  workplace?: Workplace;
  onStart: () => void;
  onComplete: () => void;
}) {
  const patient = task.patientId ? getPatient(task.patientId) : undefined;
  return (
    <Card className="!p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{task.title}</h3>
          <p className="mt-1 text-xs text-ink-muted">{patient?.name ?? workplace?.name ?? "Operational task"}</p>
        </div>
        <Pill tone={task.priority === "Critical" || task.priority === "High" ? "alert" : "neutral"}>
          {task.priority}
        </Pill>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-ink-muted sm:grid-cols-2">
        <p>
          <Clock size={12} className="mr-1 inline" />
          {task.dueTime}
        </p>
        <p>{workplace?.name}</p>
        <p>Source: {task.source}</p>
        <p>Assigned by: {task.assignedBy}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {task.status !== "completed" && (
          <>
            <button onClick={onStart} className="btn-secondary text-xs">
              Start
            </button>
            <button onClick={onComplete} className="btn-primary text-xs">
              Complete
            </button>
          </>
        )}
        {task.patientId && (
          <Link href={`/doctor/patients/${task.patientId}`} className="btn-ghost text-xs">
            Open Patient
          </Link>
        )}
      </div>
    </Card>
  );
}

export function ConflictNotice({ conflicts }: { conflicts: Array<[DoctorShift, DoctorShift]> }) {
  if (conflicts.length === 0) return null;
  const [a, b] = conflicts[0];
  return (
    <Card className="border-alert-100 bg-alert-50">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 text-alert-500" />
        <div>
          <h2 className="font-display text-lg text-ink">Schedule Conflict</h2>
          <p className="mt-1 text-sm text-ink-soft">These shifts overlap. Please edit one shift before publishing availability.</p>
          <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-ink-muted sm:grid-cols-2">
            <p>
              <CalendarClock size={12} className="mr-1 inline" />
              {a.startTime} - {a.endTime}
            </p>
            <p>
              <CalendarClock size={12} className="mr-1 inline" />
              {b.startTime} - {b.endTime}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
