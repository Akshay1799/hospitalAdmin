"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, FilePlus2, FlaskConical, Save, CheckCircle2, X } from "lucide-react";
import { SectionHeading, Card, Avatar, Pill } from "@/components/ui";
import { patients, getPatient } from "@/lib/mock-data";

function ConsultationForm() {
  const params = useSearchParams();
  const preselected = params.get("patient");

  const [patientId, setPatientId] = useState(preselected ?? patients[0].id);
  const [complaint, setComplaint] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState("");
  const [observations, setObservations] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [plan, setPlan] = useState("");
  const [saved, setSaved] = useState<"idle" | "draft" | "final">("idle");

  const patient = useMemo(() => getPatient(patientId), [patientId]);

  function addSymptom() {
    const s = symptomInput.trim();
    if (s && !symptoms.includes(s)) setSymptoms([...symptoms, s]);
    setSymptomInput("");
  }

  return (
    <div>
      <SectionHeading
        eyebrow="05 · Consultation"
        title="Consultation Session"
        description="Record symptoms, observations, diagnosis and the treatment plan for this visit."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Patient panel */}
        <div className="space-y-4">
          <Card>
            <label className="eyebrow block mb-2">Patient</label>
            <select
              value={patientId}
              onChange={(e) => {
                setPatientId(e.target.value);
                setSaved("idle");
              }}
              className="input-field mb-4"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.mrn}
                </option>
              ))}
            </select>

            {patient && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar initials={patient.avatarInitials} size={44} />
                  <div>
                    <p className="text-sm font-medium text-ink">{patient.name}</p>
                    <p className="text-xs text-ink-muted">
                      {patient.age} yrs · {patient.gender} · {patient.bloodGroup}
                    </p>
                  </div>
                </div>
                {patient.allergies.length > 0 && (
                  <div className="flex items-start gap-2 rounded-md border border-alert-100 bg-alert-50 px-3 py-2 mb-3">
                    <AlertTriangle size={14} className="text-alert-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-ink-soft">
                      {patient.allergies.map((a) => `${a.substance} (${a.severity})`).join(", ")}
                    </p>
                  </div>
                )}
                {patient.conditions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {patient.conditions.map((c) => (
                      <Pill key={c} tone="brand">
                        {c}
                      </Pill>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>

          {patient?.latestVitals && (
            <div className="vitals-strip !flex-col divide-x-0 divide-y divide-white/10">
              <div className="vitals-cell flex-row items-center justify-between">
                <span className="vitals-label">BP</span>
                <span className="vitals-value">{patient.latestVitals.bp}</span>
              </div>
              <div className="vitals-cell flex-row items-center justify-between">
                <span className="vitals-label">Pulse</span>
                <span className="vitals-value">{patient.latestVitals.pulse} bpm</span>
              </div>
              <div className="vitals-cell flex-row items-center justify-between">
                <span className="vitals-label">SpO2</span>
                <span className="vitals-value">{patient.latestVitals.spo2}%</span>
              </div>
            </div>
          )}

          <Card>
            <p className="eyebrow mb-2">Continue to</p>
            <div className="space-y-2">
              <Link href={`/doctor/prescriptions?patient=${patientId}`} className="btn-secondary w-full justify-start">
                <FilePlus2 size={14} /> Write Prescription
              </Link>
              <Link href={`/doctor/lab-orders?patient=${patientId}`} className="btn-secondary w-full justify-start">
                <FlaskConical size={14} /> Order Investigation
              </Link>
            </div>
          </Card>
        </div>

        {/* Consultation form */}
        <div className="xl:col-span-2">
          <Card>
            <div className="space-y-5">
              <div>
                <label className="eyebrow block mb-1.5">Chief Complaint</label>
                <input
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="e.g. Fatigue and occasional dizziness for 5 days"
                  className="input-field"
                />
              </div>

              <div>
                <label className="eyebrow block mb-1.5">Symptoms</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSymptom())}
                    placeholder="Type a symptom and press Enter"
                    className="input-field"
                  />
                  <button onClick={addSymptom} type="button" className="btn-secondary shrink-0">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {symptoms.map((s) => (
                    <span key={s} className="badge bg-brand-50 text-brand-700">
                      {s}
                      <button onClick={() => setSymptoms(symptoms.filter((x) => x !== s))}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="eyebrow block mb-1.5">Observations</label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                  placeholder="Clinical findings on examination…"
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="eyebrow block mb-1.5">Diagnosis</label>
                <input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Essential hypertension — suboptimal control"
                  className="input-field"
                />
                <Link href="/doctor/diagnosis" className="text-xs text-brand-600 hover:underline mt-1 inline-block">
                  Look up ICD code →
                </Link>
              </div>

              <div>
                <label className="eyebrow block mb-1.5">Treatment Plan</label>
                <textarea
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  rows={3}
                  placeholder="Medication changes, lifestyle advice, next steps…"
                  className="input-field resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-line">
                <button onClick={() => setSaved("draft")} className="btn-secondary">
                  <Save size={14} /> Save Draft
                </button>
                <button onClick={() => setSaved("final")} className="btn-primary">
                  <CheckCircle2 size={14} /> Finalize Consultation
                </button>
                {saved === "draft" && <span className="text-xs text-clay-500 ml-2">Saved as draft</span>}
                {saved === "final" && <span className="text-xs text-sage-500 ml-2">Consultation finalized</span>}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense fallback={null}>
      <ConsultationForm />
    </Suspense>
  );
}
