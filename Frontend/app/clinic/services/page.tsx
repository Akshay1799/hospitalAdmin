"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeading, Card, Pill, Modal, Field } from "@/components/ui";
import { clinic, doctors as seedDoctors } from "@/lib/mock-data";
import { useMode } from "@/lib/mode-context";
import { ApiSyncSkippedError, BackendClinicServiceRow, createBackendClinicService, getBackendBootstrap } from "@/lib/api-client";
import { Doctor } from "@/lib/types";

interface ServiceRow {
  id: string;
  name: string;
  eligibleDoctorIds: string[];
  durationMinutes: number;
  price: number;
}

const initialServices: ServiceRow[] = clinic.services.map((s, i) => ({
  id: `svc-${i}`,
  name: s,
  eligibleDoctorIds: seedDoctors.slice(0, (i % seedDoctors.length) + 1).map((d) => d.id),
  durationMinutes: i % 2 === 0 ? 20 : 30,
  price: 600 + i * 150,
}));

export default function ServicesPage() {
  const { selectedWorkplaceId } = useMode();
  const [services, setServices] = useState<BackendClinicServiceRow[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("20");
  const [price, setPrice] = useState("");
  const [eligibleDoctorIds, setEligibleDoctorIds] = useState<string[]>([]);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    getBackendBootstrap()
      .then((data) => {
        if (cancelled) return;
        setServices(data.services);
        setDoctors(data.doctors);
      })
      .catch(() => {
        if (cancelled) return;
        setServices(initialServices);
        setDoctors(seedDoctors);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function addService() {
    if (!name.trim()) return;
    let nextService: BackendClinicServiceRow = {
      id: `svc-${Date.now()}`,
      name,
      eligibleDoctorIds,
      durationMinutes: Number(durationMinutes) || 20,
      price: Number(price) || 0,
    };
    try {
      nextService = await createBackendClinicService({
        workplaceId: selectedWorkplaceId,
        name,
        durationMinutes: Number(durationMinutes) || 20,
        price: Number(price) || 0,
        eligibleDoctorIds,
      });
      setSyncMessage("Clinic service synced to backend.");
    } catch (error) {
      setSyncMessage(error instanceof ApiSyncSkippedError ? "Mock service saved locally." : "Backend sync failed; local service kept.");
    }
    setServices((prev) => [...prev, nextService]);
    setName("");
    setDurationMinutes("20");
    setPrice("");
    setEligibleDoctorIds([]);
    setShowForm(false);
  }

  function remove(id: string) {
    if (window.confirm("Remove this clinic service from patient booking?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  }

  function toggleDoctor(id: string) {
    setEligibleDoctorIds((prev) => (prev.includes(id) ? prev.filter((doctorId) => doctorId !== id) : [...prev, id]));
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Clinic Operations · Services"
        title="Services"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={14} /> Add Service
          </button>
        }
        description="Define services offered by the clinic and the doctors eligible to deliver them."
      />

      <Modal
        open={showForm}
        title="Add Service"
        eyebrow="Clinic Services"
        onClose={() => setShowForm(false)}
        footer={
          <>
            <button onClick={addService} className="btn-primary">
              <Plus size={14} /> Add Service
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </>
        }
        size="md"
      >
        <Field label="Service Name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vaccination" className="input-field" />
        </Field>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Duration">
            <select value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className="input-field">
              <option value="15">15 min</option>
              <option value="20">20 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
            </select>
          </Field>
          <Field label="Price">
            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="INR" className="input-field" />
          </Field>
        </div>
        <div className="mt-4">
          <p className="eyebrow mb-2">Eligible Doctors</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {doctors.map((doctor) => (
              <label key={doctor.id} className="flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={eligibleDoctorIds.includes(doctor.id)}
                  onChange={() => toggleDoctor(doctor.id)}
                  className="h-4 w-4 accent-brand-500"
                />
                {doctor.name}
              </label>
            ))}
          </div>
        </div>
      </Modal>
      {syncMessage && <p className="mb-3 text-xs text-ink-muted">{syncMessage}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((s) => (
          <Card key={s.id}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-ink">{s.name}</p>
              <button onClick={() => remove(s.id)}>
                <Trash2 size={14} className="text-ink-faint hover:text-alert-500" />
              </button>
            </div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              <Pill tone="neutral">{s.durationMinutes} min</Pill>
              <Pill tone="clay">INR {s.price}</Pill>
            </div>
            <p className="text-[11px] text-ink-muted mb-2">Eligible doctors</p>
            <div className="flex flex-wrap gap-1.5">
              {s.eligibleDoctorIds.length === 0 ? (
                <span className="text-xs text-ink-faint">None assigned</span>
              ) : (
                s.eligibleDoctorIds.map((id) => {
                  const doc = doctors.find((d) => d.id === id);
                  return (
                    <Pill key={id} tone="brand">
                      {doc?.name}
                    </Pill>
                  );
                })
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
