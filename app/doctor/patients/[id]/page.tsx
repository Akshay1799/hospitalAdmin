import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Phone, Droplet, Stethoscope, FilePlus2, FlaskConical, CalendarClock } from "lucide-react";
import { Card, SectionHeading, Avatar, Pill, OrderStatusBadge } from "@/components/ui";
import {
  getPatient,
  diagnoses,
  prescriptions,
  labOrders,
  radiologyOrders,
  followUps,
  appointments,
  consultationNotes,
  getDoctor,
} from "@/lib/mock-data";

const tagTone: Record<string, "brand" | "clay" | "alert" | "sage"> = {
  New: "brand",
  "Follow-up": "clay",
  Critical: "alert",
  "Shared-care": "sage",
};

export default function PatientDetail({ params }: { params: { id: string } }) {
  const patient = getPatient(params.id);
  if (!patient) return notFound();

  const patientDx = diagnoses.filter((d) => d.patientId === patient.id);
  const patientRx = prescriptions.filter((r) => r.patientId === patient.id);
  const patientLabs = labOrders.filter((l) => l.patientId === patient.id);
  const patientRadiology = radiologyOrders.filter((r) => r.patientId === patient.id);
  const patientFollowUps = followUps.filter((f) => f.patientId === patient.id);
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
  const patientNotes = consultationNotes.filter((c) => c.patientId === patient.id);
  const doctor = getDoctor(patient.primaryDoctorId);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <Avatar initials={patient.avatarInitials} size={56} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl text-ink">{patient.name}</h1>
              {patient.tags?.map((t) => (
                <Pill key={t} tone={tagTone[t]}>
                  {t}
                </Pill>
              ))}
            </div>
            <p className="text-sm text-ink-muted mt-1">
              {patient.age} yrs · {patient.gender} · <span className="font-mono">{patient.mrn}</span> · Blood group{" "}
              {patient.bloodGroup}
            </p>
            <p className="text-xs text-ink-muted mt-1 flex items-center gap-1">
              <Phone size={12} /> {patient.phone} &nbsp;·&nbsp; Primary doctor: {doctor?.name ?? "—"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/doctor/consultation?patient=${patient.id}`} className="btn-primary">
            <Stethoscope size={15} /> Start Consultation
          </Link>
          <Link href={`/doctor/prescriptions?patient=${patient.id}`} className="btn-secondary">
            <FilePlus2 size={15} /> New Rx
          </Link>
          <Link href={`/doctor/lab-orders?patient=${patient.id}`} className="btn-secondary">
            <FlaskConical size={15} /> Order Test
          </Link>
        </div>
      </div>

      {patient.allergies.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-card border border-alert-100 bg-alert-50 px-4 py-3 mb-6">
          <AlertTriangle size={16} className="text-alert-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-alert-500">Allergy alert</p>
            <p className="text-xs text-ink-soft mt-0.5">
              {patient.allergies.map((a) => `${a.substance} (${a.severity} — ${a.reaction})`).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {patient.latestVitals && (
        <div className="vitals-strip mb-6">
          <div className="vitals-cell">
            <span className="vitals-label">Blood Pressure</span>
            <span className="vitals-value">
              {patient.latestVitals.bp}
              <span className="vitals-unit">mmHg</span>
            </span>
          </div>
          <div className="vitals-cell">
            <span className="vitals-label">Pulse</span>
            <span className="vitals-value">
              {patient.latestVitals.pulse}
              <span className="vitals-unit">bpm</span>
            </span>
          </div>
          <div className="vitals-cell">
            <span className="vitals-label">Temp</span>
            <span className="vitals-value">
              {patient.latestVitals.temp}
              <span className="vitals-unit">°F</span>
            </span>
          </div>
          <div className="vitals-cell">
            <span className="vitals-label">SpO2</span>
            <span className="vitals-value">
              {patient.latestVitals.spo2}
              <span className="vitals-unit">%</span>
            </span>
          </div>
          <div className="vitals-cell">
            <span className="vitals-label">Weight / BMI</span>
            <span className="vitals-value">
              {patient.latestVitals.weight}
              <span className="vitals-unit">kg · {patient.latestVitals.bmi}</span>
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <h2 className="font-display text-lg text-ink mb-3">Diagnoses &amp; ICD History</h2>
            {patientDx.length === 0 ? (
              <p className="text-sm text-ink-muted">No diagnoses on record.</p>
            ) : (
              <div className="space-y-2.5">
                {patientDx.map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-3 border-b border-line/70 pb-2.5 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm text-ink-soft">{d.description}</p>
                      <p className="text-xs text-ink-faint font-mono mt-0.5">{d.icdCode} · diagnosed {d.diagnosedOn}</p>
                    </div>
                    <Pill tone={d.status === "Chronic" ? "clay" : d.status === "Active" ? "alert" : "sage"}>{d.status}</Pill>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-display text-lg text-ink mb-3">Prescriptions</h2>
            {patientRx.length === 0 ? (
              <p className="text-sm text-ink-muted">No prescriptions yet.</p>
            ) : (
              <div className="space-y-4">
                {patientRx.map((rx) => (
                  <div key={rx.id} className="border-b border-line/70 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs text-ink-muted">{rx.date}</p>
                      <Pill tone={rx.status === "Active" ? "brand" : "neutral"}>{rx.status}</Pill>
                    </div>
                    <ul className="text-sm text-ink-soft space-y-1">
                      {rx.medicines.map((m) => (
                        <li key={m.id}>
                          <span className="font-medium">{m.name}</span> {m.dosage} — {m.frequency}, {m.duration}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-display text-lg text-ink mb-3">Consultation History</h2>
            {patientNotes.length === 0 ? (
              <p className="text-sm text-ink-muted">No consultation notes yet.</p>
            ) : (
              <div className="space-y-3">
                {patientNotes.map((n) => (
                  <div key={n.id} className="border-b border-line/70 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-ink">{n.chiefComplaint || "Consultation"}</p>
                      <Pill tone={n.status === "Finalized" ? "sage" : "clay"}>{n.status}</Pill>
                    </div>
                    <p className="text-xs text-ink-muted">{n.date}</p>
                    {n.diagnosis && <p className="text-sm text-ink-soft mt-1">{n.diagnosis}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-display text-lg text-ink mb-3">Laboratory Orders</h2>
            <div className="space-y-2.5">
              {patientLabs.map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-ink-soft truncate">{l.testName}</p>
                    <p className="text-[11px] text-ink-faint">{l.orderedOn}</p>
                  </div>
                  <OrderStatusBadge status={l.status} />
                </div>
              ))}
              {patientLabs.length === 0 && <p className="text-sm text-ink-muted">No lab orders.</p>}
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-lg text-ink mb-3">Radiology Orders</h2>
            <div className="space-y-2.5">
              {patientRadiology.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-ink-soft truncate">
                      {r.imagingType} · {r.bodyRegion}
                    </p>
                    <p className="text-[11px] text-ink-faint">{r.orderedOn}</p>
                  </div>
                  <OrderStatusBadge status={r.status} />
                </div>
              ))}
              {patientRadiology.length === 0 && <p className="text-sm text-ink-muted">No radiology orders.</p>}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg text-ink">Follow-ups</h2>
              <Link href="/doctor/follow-up" className="btn-ghost text-xs">
                <CalendarClock size={13} /> Manage
              </Link>
            </div>
            <div className="space-y-2.5">
              {patientFollowUps.map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-2">
                  <p className="text-sm text-ink-soft">{f.reason}</p>
                  <Pill tone={f.status === "Overdue" ? "alert" : f.status === "Completed" ? "sage" : "clay"}>
                    {f.status}
                  </Pill>
                </div>
              ))}
              {patientFollowUps.length === 0 && <p className="text-sm text-ink-muted">No follow-ups scheduled.</p>}
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-lg text-ink mb-3">Appointment History</h2>
            <div className="space-y-2.5">
              {patientAppointments.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-ink-soft">{a.date}</p>
                    <p className="text-[11px] text-ink-faint">{a.reason}</p>
                  </div>
                  <Pill tone="neutral">{a.status}</Pill>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
