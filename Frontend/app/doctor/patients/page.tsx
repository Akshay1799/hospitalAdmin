"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, ChevronRight } from "lucide-react";
import { SectionHeading, Card, Avatar, Pill, EmptyState, Modal, Field } from "@/components/ui";
import { patients, doctors, getDoctor, patientInWorkContext } from "@/lib/mock-data";
import { useMode } from "@/lib/mode-context";
import { Patient } from "@/lib/types";

const tagTone: Record<string, "brand" | "clay" | "alert" | "sage"> = {
  New: "brand",
  "Follow-up": "clay",
  Critical: "alert",
  "Shared-care": "sage",
};

export default function PatientsPage() {
  const { workContext } = useMode();
  const [patientRows, setPatientRows] = useState(patients);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male" as Patient["gender"],
    phone: "",
    bloodGroup: "O+",
    condition: "",
    doctorId: doctors[0].id,
  });

  const filtered = useMemo(() => {
    return patientRows.filter((p) => {
      if (!patientInWorkContext(p, workContext)) return false;
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.mrn.toLowerCase().includes(query.toLowerCase());
      const matchesTag = !tagFilter || p.tags?.includes(tagFilter as any);
      return matchesQuery && matchesTag;
    });
  }, [patientRows, query, tagFilter, workContext]);

  const contextRows = patientRows.filter((p) => patientInWorkContext(p, workContext));
  const allTags = Array.from(new Set(contextRows.flatMap((p) => p.tags ?? [])));

  function registerPatient() {
    if (!form.name.trim()) return;
    const initials = form.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    const nextPatient: Patient = {
      id: `local-pat-${Date.now()}`,
      mrn: `MRN-${10230 + patientRows.length + 1}`,
      name: form.name,
      age: Number(form.age) || 0,
      gender: form.gender,
      phone: form.phone || "Not added",
      avatarInitials: initials || "PT",
      primaryDoctorId: form.doctorId,
      clinicId: workContext === "clinic" ? "clinic-1" : undefined,
      workContexts: [workContext],
      bloodGroup: form.bloodGroup,
      allergies: [],
      conditions: form.condition ? [form.condition] : [],
      lastVisit: "New registration",
      tags: ["New"],
    };
    setPatientRows((prev) => [nextPatient, ...prev]);
    setForm({
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      bloodGroup: "O+",
      condition: "",
      doctorId: doctors[0].id,
    });
    setShowForm(false);
  }

  return (
    <div>
      <SectionHeading
        eyebrow="02 - My Patients"
        title="My Patients"
        description={`Centralized list of your assigned ${workContext} patients, medical history and ongoing treatments.`}
        action={
          <button onClick={() => setShowForm((value) => !value)} className="btn-primary">
            <Plus size={14} /> Add Patient
          </button>
        }
      />

      <Modal
        open={showForm}
        title="Register Patient"
        eyebrow="My Patients"
        onClose={() => setShowForm(false)}
        footer={
          <>
            <button onClick={registerPatient} className="btn-primary">
              Register Patient
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </>
        }
      >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full Name" className="sm:col-span-2">
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Full name"
              className="input-field"
            />
            </Field>
            <Field label="Age">
            <input
              value={form.age}
              onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
              placeholder="Age"
              type="number"
              className="input-field"
            />
            </Field>
            <Field label="Gender">
            <select
              value={form.gender}
              onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value as Patient["gender"] }))}
              className="input-field"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            </Field>
            <Field label="Phone">
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone"
              className="input-field"
            />
            </Field>
            <Field label="Blood Group">
            <input
              value={form.bloodGroup}
              onChange={(event) => setForm((prev) => ({ ...prev, bloodGroup: event.target.value }))}
              placeholder="Blood group"
              className="input-field"
            />
            </Field>
            <Field label="Primary Condition">
            <input
              value={form.condition}
              onChange={(event) => setForm((prev) => ({ ...prev, condition: event.target.value }))}
              placeholder="Primary condition"
              className="input-field"
            />
            </Field>
            <Field label="Primary Doctor">
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
          </div>
      </Modal>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or MRN…"
            className="input-field pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTagFilter(null)}
            className={`badge border ${!tagFilter ? "bg-brand-500 text-white border-brand-500" : "border-line text-ink-muted"}`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag === tagFilter ? null : tag)}
              className={`badge border ${tagFilter === tag ? "bg-brand-500 text-white border-brand-500" : "border-line text-ink-muted"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <Card padded={false}>
        {filtered.length === 0 ? (
          <EmptyState title="No patients match" description="Try a different name, MRN, or clear your filters." />
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((p) => {
              const doctor = getDoctor(p.primaryDoctorId);
              return (
                <Link
                  key={p.id}
                  href={p.id.startsWith("local-") ? "/doctor/patients" : `/doctor/patients/${p.id}`}
                  className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-brand-50/40 transition-colors"
                >
                  <Avatar initials={p.avatarInitials} size={38} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-medium text-ink">{p.name}</p>
                      <span className="font-mono text-[11px] text-ink-faint">{p.mrn}</span>
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {p.age} yrs · {p.gender} · {p.conditions.join(", ") || "No active conditions"}
                    </p>
                    <p className="text-[11px] text-ink-faint mt-0.5">{doctor?.name ?? "Unassigned doctor"}</p>
                  </div>
                  <div className="hidden md:flex flex-wrap gap-1 max-w-[220px] justify-end">
                    {p.tags?.map((t) => (
                      <Pill key={t} tone={tagTone[t]}>
                        {t}
                      </Pill>
                    ))}
                  </div>
                  <p className="hidden lg:block text-xs text-ink-muted w-28 text-right shrink-0">
                    Last visit {p.lastVisit}
                  </p>
                  <ChevronRight size={16} className="text-ink-faint shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
