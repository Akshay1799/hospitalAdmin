"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, FlaskConical } from "lucide-react";
import { SectionHeading, Card, Avatar, Pill, Modal } from "@/components/ui";
import { patients, labOrders as seedOrders, getPatient } from "@/lib/mock-data";
import { OrderStatus } from "@/lib/types";

const commonTests = ["HbA1c", "Complete Blood Count", "Lipid Profile", "Thyroid Panel", "Troponin-I", "Liver Function Test", "Kidney Function Test", "Urinalysis"];

const columns: OrderStatus[] = ["Ordered", "Sample Collected", "In Progress", "Report Ready", "Reviewed"];

function LabOrdersBoard() {
  const params = useSearchParams();
  const preselected = params.get("patient");
  const [orders, setOrders] = useState(seedOrders);
  const [patientId, setPatientId] = useState(preselected ?? patients[0].id);
  const [showForm, setShowForm] = useState(false);
  const [testName, setTestName] = useState("");
  const [priority, setPriority] = useState<"Routine" | "Urgent">("Routine");
  const [source, setSource] = useState<"Internal" | "Partner Lab" | "External / Manual">("Internal");

  function placeOrder() {
    if (!testName.trim()) return;
    setOrders((prev) => [
      { id: `lab-${Date.now()}`, patientId, doctorId: "doc-1", testName, orderedOn: "2026-08-13", status: "Ordered", source, priority },
      ...prev,
    ]);
    setTestName("");
    setShowForm(false);
  }

  function advance(id: string) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = columns.indexOf(o.status);
        const next = columns[Math.min(idx + 1, columns.length - 1)];
        return { ...o, status: next };
      })
    );
  }

  return (
    <div>
      <SectionHeading
        eyebrow="09 · Laboratory Orders"
        title="Laboratory Orders"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={14} /> New Lab Order
          </button>
        }
        description="Request pathology investigations, monitor pending tests, and review completed lab reports."
      />

      <Modal
        open={showForm}
        title="New Lab Order"
        eyebrow="Laboratory Orders"
        onClose={() => setShowForm(false)}
        footer={
          <>
            <button onClick={placeOrder} className="btn-primary">
              <Plus size={14} /> Place Order
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-ink-muted block mb-1">Patient</label>
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="input-field">
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-ink-muted block mb-1">Test</label>
            <input
              list="common-tests"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g. HbA1c"
              className="input-field"
            />
            <datalist id="common-tests">
              {commonTests.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-[11px] text-ink-muted block mb-1">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="input-field">
              <option>Routine</option>
              <option>Urgent</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-ink-muted block mb-1">Source</label>
          <select value={source} onChange={(e) => setSource(e.target.value as any)} className="input-field">
            <option>Internal</option>
            <option>Partner Lab</option>
            <option>External / Manual</option>
          </select>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {columns.map((col) => (
          <div key={col}>
            <p className="text-xs font-semibold text-ink-muted mb-2 flex items-center gap-1.5">
              <FlaskConical size={12} /> {col} ({orders.filter((o) => o.status === col).length})
            </p>
            <div className="space-y-2.5">
              {orders
                .filter((o) => o.status === col)
                .map((o) => {
                  const patient = getPatient(o.patientId);
                  return (
                    <Card key={o.id} className="!p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        {patient && <Avatar initials={patient.avatarInitials} size={22} />}
                        <p className="text-xs font-medium text-ink truncate">{patient?.name}</p>
                      </div>
                      <p className="text-sm text-ink-soft mb-1">{o.testName}</p>
                      <div className="flex items-center justify-between">
                        <Pill tone={o.priority === "Urgent" ? "alert" : "neutral"}>{o.priority}</Pill>
                        {col !== "Reviewed" && (
                          <button onClick={() => advance(o.id)} className="text-[11px] text-brand-600 hover:underline">
                            Advance →
                          </button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              {orders.filter((o) => o.status === col).length === 0 && (
                <p className="text-xs text-ink-faint">Empty</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LabOrdersPage() {
  return (
    <Suspense fallback={null}>
      <LabOrdersBoard />
    </Suspense>
  );
}
