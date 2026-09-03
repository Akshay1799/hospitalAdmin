"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeading, Card, Pill, Modal, Field } from "@/components/ui";
import { clinic, doctors } from "@/lib/mock-data";

interface ServiceRow {
  id: string;
  name: string;
  eligibleDoctorIds: string[];
}

const initialServices: ServiceRow[] = clinic.services.map((s, i) => ({
  id: `svc-${i}`,
  name: s,
  eligibleDoctorIds: doctors.slice(0, (i % doctors.length) + 1).map((d) => d.id),
}));

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  function addService() {
    if (!name.trim()) return;
    setServices((prev) => [...prev, { id: `svc-${Date.now()}`, name, eligibleDoctorIds: [] }]);
    setName("");
    setShowForm(false);
  }

  function remove(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
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
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((s) => (
          <Card key={s.id}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-ink">{s.name}</p>
              <button onClick={() => remove(s.id)}>
                <Trash2 size={14} className="text-ink-faint hover:text-alert-500" />
              </button>
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
