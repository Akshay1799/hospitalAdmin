"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, Send } from "lucide-react";
import { SectionHeading, Card, Avatar, Pill, Modal, Field } from "@/components/ui";
import { patients, prescriptions as seedRx, getPatient } from "@/lib/mock-data";
import { Medicine } from "@/lib/types";

function emptyMedicine(): Medicine {
  return { id: crypto.randomUUID?.() ?? String(Math.random()), name: "", dosage: "", frequency: "", duration: "", instructions: "" };
}

function PrescriptionBuilder() {
  const params = useSearchParams();
  const preselected = params.get("patient");
  const [rxList, setRxList] = useState(seedRx);
  const [showForm, setShowForm] = useState(false);
  const [patientId, setPatientId] = useState(preselected ?? patients[0].id);
  const [medicines, setMedicines] = useState<Medicine[]>([emptyMedicine()]);
  const [advice, setAdvice] = useState("");
  const [sent, setSent] = useState(false);

  function updateMed(id: string, field: keyof Medicine, value: string) {
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  }

  function issue() {
    const filled = medicines.filter((m) => m.name.trim());
    if (filled.length === 0) return;
    setRxList((prev) => [
      {
        id: `rx-${Date.now()}`,
        patientId,
        doctorId: "doc-1",
        date: "2026-08-13",
        medicines: filled,
        advice,
        status: "Active",
      },
      ...prev,
    ]);
    setMedicines([emptyMedicine()]);
    setAdvice("");
    setSent(true);
    setShowForm(false);
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <div>
      <SectionHeading
        eyebrow="07 · E-Prescription"
        title="E-Prescription"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={14} /> New Prescription
          </button>
        }
        description="Create digital prescriptions with medicines, dosage instructions, treatment duration and patient guidance."
      />

      <Modal
        open={showForm}
        title="New Prescription"
        eyebrow="E-Prescription"
        onClose={() => setShowForm(false)}
        size="xl"
        footer={
          <>
            <button onClick={issue} className="btn-primary">
              <Send size={14} /> Issue Prescription
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </>
        }
      >
            <label className="eyebrow block mb-1.5">Patient</label>
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="input-field mb-5">
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.mrn}
                </option>
              ))}
            </select>

            <div className="space-y-3 mb-4">
              {medicines.map((m, idx) => (
                <div key={m.id} className="border border-line rounded-card p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-medium text-ink-muted">Medicine {idx + 1}</p>
                    {medicines.length > 1 && (
                      <button onClick={() => setMedicines(medicines.filter((x) => x.id !== m.id))}>
                        <Trash2 size={14} className="text-ink-faint hover:text-alert-500" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Field label="Medicine Name">
                    <input
                      placeholder="Medicine name"
                      value={m.name}
                      onChange={(e) => updateMed(m.id, "name", e.target.value)}
                      className="input-field"
                    />
                    </Field>
                    <Field label="Dosage">
                    <input
                      placeholder="Dosage (500mg)"
                      value={m.dosage}
                      onChange={(e) => updateMed(m.id, "dosage", e.target.value)}
                      className="input-field"
                    />
                    </Field>
                    <Field label="Frequency">
                    <input
                      placeholder="Frequency (1-0-1)"
                      value={m.frequency}
                      onChange={(e) => updateMed(m.id, "frequency", e.target.value)}
                      className="input-field"
                    />
                    </Field>
                    <Field label="Duration">
                    <input
                      placeholder="Duration (7 days)"
                      value={m.duration}
                      onChange={(e) => updateMed(m.id, "duration", e.target.value)}
                      className="input-field"
                    />
                    </Field>
                    <Field label="Instructions" className="sm:col-span-2">
                    <input
                      placeholder="Instructions (after food)"
                      value={m.instructions}
                      onChange={(e) => updateMed(m.id, "instructions", e.target.value)}
                      className="input-field"
                    />
                    </Field>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setMedicines([...medicines, emptyMedicine()])} className="btn-secondary mb-5">
              <Plus size={14} /> Add Medicine
            </button>

            <label className="eyebrow block mb-1.5">Patient Guidance</label>
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              rows={3}
              placeholder="Diet, lifestyle notes, warning signs to watch for…"
              className="input-field resize-none mb-4"
            />

      </Modal>
      {sent && <span className="text-xs text-sage-500 mb-3 inline-block">Prescription issued</span>}

        <div>
          <Card padded={false}>
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-display text-lg text-ink">Recent Prescriptions</h2>
            </div>
            <div className="divide-y divide-line max-h-[640px] overflow-y-auto">
              {rxList.map((rx) => {
                const patient = getPatient(rx.patientId);
                return (
                  <div key={rx.id} className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      {patient && <Avatar initials={patient.avatarInitials} size={26} />}
                      <p className="text-[13px] font-medium text-ink">{patient?.name}</p>
                      <Pill tone={rx.status === "Active" ? "brand" : "neutral"}>{rx.status}</Pill>
                    </div>
                    <p className="text-xs text-ink-muted">{rx.medicines.map((m) => m.name).join(", ") || "—"}</p>
                    <p className="text-[11px] text-ink-faint mt-0.5">{rx.date}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
    </div>
  );
}

export default function PrescriptionsPage() {
  return (
    <Suspense fallback={null}>
      <PrescriptionBuilder />
    </Suspense>
  );
}
