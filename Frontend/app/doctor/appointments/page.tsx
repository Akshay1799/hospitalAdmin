"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Video, MapPin, ChevronRight, Plus } from "lucide-react";
import { SectionHeading, Card, Avatar, EmptyState, Modal, Field } from "@/components/ui";
import {
  appointments as seedAppointments,
  clinic,
  doctors,
  getPatient,
  matchesWorkContext,
  patientInWorkContext,
  patients,
} from "@/lib/mock-data";
import { useMode } from "@/lib/mode-context";
import { Appointment, AppointmentStatus, AppointmentType } from "@/lib/types";

const filterTabs: { label: string; value: "today" | "upcoming" | "past" | "all" }[] = [
  { label: "Today", value: "today" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
  { label: "All", value: "all" },
];

const statusOptions: AppointmentStatus[] = [
  "Scheduled",
  "Checked In",
  "In Consultation",
  "Completed",
  "Cancelled",
  "No Show",
];

const TODAY = "2026-08-13";
const hospitalLocations = [{ id: "hosp-1", name: "Aster City Hospital - Cardiology" }];

export default function AppointmentsPage() {
  const { workContext } = useMode();
  const [appointments, setAppointments] = useState(seedAppointments);
  const [tab, setTab] = useState<"today" | "upcoming" | "past" | "all">("today");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: patients[0].id,
    doctorId: doctors[0].id,
    locationId: clinic.locations[0].id,
    date: TODAY,
    time: "12:00 PM",
    durationMins: "20",
    type: "In-Person" as AppointmentType,
    reason: "",
  });

  const contextPatients = useMemo(
    () => patients.filter((patient) => patientInWorkContext(patient, workContext)),
    [workContext]
  );
  const contextLocations = workContext === "hospital" ? hospitalLocations : clinic.locations;

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      patientId: contextPatients[0]?.id ?? prev.patientId,
      locationId: contextLocations[0]?.id ?? prev.locationId,
    }));
  }, [contextPatients, contextLocations]);

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => {
        if (!matchesWorkContext(a, workContext)) return false;
        if (tab === "today") return a.date === TODAY;
        if (tab === "upcoming") return a.date > TODAY;
        if (tab === "past") return a.date < TODAY;
        return true;
      })
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [appointments, tab, workContext]);

  function updateStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  function createAppointment() {
    if (!form.reason.trim()) return;
    const nextAppointment: Appointment = {
      id: `local-apt-${Date.now()}`,
      patientId: form.patientId,
      doctorId: form.doctorId,
      locationId: form.locationId,
      workContext,
      date: form.date,
      time: form.time,
      durationMins: Number(form.durationMins) || 20,
      type: form.type,
      status: "Scheduled",
      reason: form.reason,
    };
    setAppointments((prev) => [nextAppointment, ...prev]);
    setForm((prev) => ({ ...prev, date: TODAY, time: "12:00 PM", durationMins: "20", reason: "" }));
    setTab("all");
    setShowForm(false);
  }

  return (
    <div>
      <SectionHeading
        eyebrow="03 - Appointment Management"
        title="Appointments"
        description={`View, manage and organize ${workContext} appointments only.`}
        action={
          <button onClick={() => setShowForm((value) => !value)} className="btn-primary">
            <Plus size={14} /> New Appointment
          </button>
        }
      />

      <Modal
        open={showForm}
        title="Schedule Appointment"
        eyebrow="Appointment Management"
        onClose={() => setShowForm(false)}
        footer={
          <>
            <button onClick={createAppointment} className="btn-primary">
              Schedule Appointment
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </>
        }
      >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Patient" className="sm:col-span-2">
            <select
              value={form.patientId}
              onChange={(event) => setForm((prev) => ({ ...prev, patientId: event.target.value }))}
              className="input-field"
            >
              {contextPatients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.mrn})
                </option>
              ))}
            </select>
            </Field>
            <Field label="Doctor">
            <select
              value={form.doctorId}
              onChange={(event) => setForm((prev) => ({ ...prev, doctorId: event.target.value }))}
              className="input-field"
            >
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            </Field>
            <Field label="Location">
            <select
              value={form.locationId}
              onChange={(event) => setForm((prev) => ({ ...prev, locationId: event.target.value }))}
              className="input-field"
            >
              {contextLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            </Field>
            <Field label="Date">
            <input
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              type="date"
              className="input-field"
            />
            </Field>
            <Field label="Time">
            <input
              value={form.time}
              onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
              placeholder="Time"
              className="input-field"
            />
            </Field>
            <Field label="Duration">
            <select
              value={form.durationMins}
              onChange={(event) => setForm((prev) => ({ ...prev, durationMins: event.target.value }))}
              className="input-field"
            >
              <option value="15">15 min</option>
              <option value="20">20 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
            </select>
            </Field>
            <Field label="Type">
            <select
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as AppointmentType }))}
              className="input-field"
            >
              <option>In-Person</option>
              <option>Video</option>
              <option>Follow-up</option>
            </select>
            </Field>
            <Field label="Reason for Visit" className="sm:col-span-2">
            <input
              value={form.reason}
              onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
              placeholder="Reason for visit"
              className="input-field"
            />
            </Field>
          </div>
      </Modal>

      <div className="flex items-center gap-1 mb-5 border-b border-line">
        {filterTabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.value ? "border-brand-500 text-brand-700" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card padded={false}>
        {filtered.length === 0 ? (
          <EmptyState title="No appointments here" description={`Nothing scheduled in this ${workContext} range yet.`} />
        ) : (
          <table className="w-full table-clean">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date &amp; Time</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => {
                const patient = getPatient(apt.patientId);
                if (!patient) return null;
                return (
                  <tr key={apt.id}>
                    <td>
                      <Link href={`/doctor/patients/${patient.id}`} className="flex items-center gap-2.5 group">
                        <Avatar initials={patient.avatarInitials} size={30} />
                        <span className="font-medium text-ink group-hover:text-brand-700">{patient.name}</span>
                      </Link>
                    </td>
                    <td>
                      <span className="font-mono text-xs">
                        {apt.date} · {apt.time}
                      </span>
                      <span className="block text-[11px] text-ink-faint">{apt.durationMins} min</span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-xs">
                        {apt.type === "Video" ? <Video size={12} /> : <MapPin size={12} />}
                        {apt.type}
                      </span>
                    </td>
                    <td>{apt.reason}</td>
                    <td>
                      <select
                        value={apt.status}
                        onChange={(e) => updateStatus(apt.id, e.target.value as AppointmentStatus)}
                        className="text-xs rounded-md border border-line bg-white px-2 py-1 outline-none focus:border-brand-400"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <Link
                        href={`/doctor/consultation?patient=${patient.id}&appointment=${apt.id}`}
                        className="btn-ghost text-xs"
                      >
                        Open <ChevronRight size={13} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
