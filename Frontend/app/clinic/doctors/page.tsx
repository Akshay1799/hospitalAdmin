"use client";

import { useEffect, useState } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { SectionHeading, Card, Avatar, AvailabilityDot, Pill, Modal, Field } from "@/components/ui";
import { doctors as seedDoctors, clinic } from "@/lib/mock-data";
import { ClinicLocation, Doctor } from "@/lib/types";
import { ApiSyncSkippedError, createBackendClinicDoctor, getBackendBootstrap } from "@/lib/api-client";
import { useMode } from "@/lib/mode-context";

export default function DoctorManagementPage() {
  const { selectedWorkplaceId } = useMode();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [locations, setLocations] = useState<ClinicLocation[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    qualifications: "",
    experienceYears: "",
    locationId: clinic.locations[0].id,
  });

  useEffect(() => {
    let cancelled = false;

    getBackendBootstrap()
      .then((data) => {
        if (cancelled) return;
        setDoctors(data.doctors);
        setLocations(data.locations);
        setForm((prev) => ({ ...prev, locationId: data.locations[0]?.id ?? prev.locationId }));
      })
      .catch(() => {
        if (cancelled) return;
        setDoctors(seedDoctors);
        setLocations(clinic.locations);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function remove(id: string) {
    if (window.confirm("Remove this doctor from the clinic roster?")) {
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    }
  }

  async function inviteDoctor() {
    if (!form.name.trim() || !form.specialty.trim()) return;
    const initials = form.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    let nextDoctor: Doctor = {
      id: `local-doc-${Date.now()}`,
      name: form.name,
      specialty: form.specialty,
      qualifications: form.qualifications || "Verification pending",
      experienceYears: Number(form.experienceYears) || 0,
      avatarInitials: initials || "DR",
      availability: "Off",
      locationId: form.locationId,
      rating: 0,
      patientsCount: 0,
    };
    try {
      nextDoctor = {
        ...(await createBackendClinicDoctor({
          workplaceId: selectedWorkplaceId,
          fullName: form.name,
          specialty: form.specialty,
          qualifications: form.qualifications || undefined,
          experienceYears: Number(form.experienceYears) || 0,
        })),
        locationId: form.locationId,
        rating: 0,
        patientsCount: 0,
      };
      setSyncMessage("Doctor invite synced to backend.");
    } catch (error) {
      setSyncMessage(error instanceof ApiSyncSkippedError ? "Mock doctor invite saved locally." : "Backend sync failed; local doctor invite kept.");
    }
    setDoctors((prev) => [nextDoctor, ...prev]);
    setForm({
      name: "",
      specialty: "",
      qualifications: "",
      experienceYears: "",
      locationId: locations[0]?.id ?? clinic.locations[0].id,
    });
    setShowInvite(false);
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Clinic Operations · Doctor Management"
        title="Doctor Management"
        description="Add or remove doctors, verify profiles, and assign specialties and locations."
        action={
          <button onClick={() => setShowInvite((value) => !value)} className="btn-primary">
            <Plus size={14} /> Invite Doctor
          </button>
        }
      />

      <Modal
        open={showInvite}
        title="Invite Doctor"
        eyebrow="Doctor Management"
        onClose={() => setShowInvite(false)}
        footer={
          <>
            <button onClick={inviteDoctor} className="btn-primary">
              Send Invite
            </button>
            <button onClick={() => setShowInvite(false)} className="btn-secondary">
              Cancel
            </button>
          </>
        }
      >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Doctor Name" className="sm:col-span-2">
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Doctor name"
              className="input-field"
            />
            </Field>
            <Field label="Specialty">
            <input
              value={form.specialty}
              onChange={(event) => setForm((prev) => ({ ...prev, specialty: event.target.value }))}
              placeholder="Specialty"
              className="input-field"
            />
            </Field>
            <Field label="Qualifications">
            <input
              value={form.qualifications}
              onChange={(event) => setForm((prev) => ({ ...prev, qualifications: event.target.value }))}
              placeholder="Qualifications"
              className="input-field"
            />
            </Field>
            <Field label="Experience Years">
            <input
              value={form.experienceYears}
              onChange={(event) => setForm((prev) => ({ ...prev, experienceYears: event.target.value }))}
              placeholder="Years"
              type="number"
              className="input-field"
            />
            </Field>
            <Field label="Assigned Location">
            <select
              value={form.locationId}
              onChange={(event) => setForm((prev) => ({ ...prev, locationId: event.target.value }))}
              className="input-field"
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            </Field>
          </div>
      </Modal>
      {syncMessage && <p className="mb-3 text-xs text-ink-muted">{syncMessage}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {doctors.map((d) => {
          const location = locations.find((l) => l.id === d.locationId);
          return (
            <Card key={d.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={d.avatarInitials} size={44} />
                  <div>
                    <p className="text-sm font-medium text-ink">{d.name}</p>
                    <p className="text-xs text-ink-muted">{d.specialty}</p>
                  </div>
                </div>
                <button onClick={() => remove(d.id)} aria-label="Remove doctor">
                  <Trash2 size={14} className="text-ink-faint hover:text-alert-500" />
                </button>
              </div>
              <p className="text-xs text-ink-muted mb-2">{d.qualifications} · {d.experienceYears} yrs experience</p>
              <div className="flex items-center justify-between mb-3">
                <AvailabilityDot status={d.availability} />
                <span className="flex items-center gap-1 text-xs text-ink-muted">
                  <Star size={12} className="fill-clay-400 text-clay-400" /> {d.rating}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <Pill tone="neutral">{location?.name ?? "Unassigned"}</Pill>
                <span className="text-ink-faint">{d.patientsCount} patients</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
