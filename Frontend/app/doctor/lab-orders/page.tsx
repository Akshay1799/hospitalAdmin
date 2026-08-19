"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, FlaskConical } from "lucide-react";
import { SectionHeading, Card, Avatar, Pill, Modal } from "@/components/ui";
import { patients as seedPatients, labOrders as seedOrders, getPatient, matchesWorkContext, patientInWorkContext } from "@/lib/mock-data";
import { useMode } from "@/lib/mode-context";
import { LabOrder, OrderStatus, Patient } from "@/lib/types";
import { CURRENT_DATE_ISO } from "@/lib/app-time";
import { ApiSyncSkippedError, createBackendOrder, getBackendBootstrap, updateBackendOrderStatus } from "@/lib/api-client";

const commonTests = ["HbA1c", "Complete Blood Count", "Lipid Profile", "Thyroid Panel", "Troponin-I", "Liver Function Test", "Kidney Function Test", "Urinalysis"];

const columns: OrderStatus[] = ["Ordered", "Sample Collected", "In Progress", "Report Ready", "Reviewed"];

function LabOrdersBoard() {
  const params = useSearchParams();
  const preselected = params.get("patient");
  const { selectedWorkplaceId, workContext } = useMode();
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [backendDoctorId, setBackendDoctorId] = useState("");
  const [patientId, setPatientId] = useState(preselected ?? "");
  const [showForm, setShowForm] = useState(false);
  const [testName, setTestName] = useState("");
  const [priority, setPriority] = useState<"Routine" | "Urgent">("Routine");
  const [source, setSource] = useState<"Internal" | "Partner Lab" | "External / Manual">("Internal");
  const [syncMessage, setSyncMessage] = useState("");
  const contextPatients = useMemo(
    () => patients.filter((patient) => patientInWorkContext(patient, workContext)),
    [patients, workContext]
  );
  const contextOrders = orders.filter((order) => matchesWorkContext(order, workContext));
  const patientById = useMemo(() => new Map(patients.map((patient) => [patient.id, patient])), [patients]);

  useEffect(() => {
    let cancelled = false;

    getBackendBootstrap()
      .then((data) => {
        if (cancelled) return;
        setPatients(data.patients);
        setOrders(data.labOrders);
        setBackendDoctorId(data.doctors[0]?.id ?? "");
      })
      .catch(() => {
        if (cancelled) return;
        setPatients(seedPatients);
        setOrders(seedOrders);
        setBackendDoctorId("doc-1");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPatientId((current) =>
      contextPatients.some((patient) => patient.id === current) ? current : contextPatients[0]?.id ?? current
    );
  }, [contextPatients]);

  async function placeOrder() {
    if (!testName.trim()) return;
    const localOrder: LabOrder = {
      id: `lab-${Date.now()}`,
      patientId,
      doctorId: backendDoctorId || "doc-1",
      testName,
      orderedOn: CURRENT_DATE_ISO,
      status: "Ordered",
      source,
      priority,
      workContext,
    };
    try {
      const savedOrder = await createBackendOrder({
        patientId,
        doctorId: backendDoctorId,
        workplaceId: selectedWorkplaceId,
        type: "LABORATORY",
        title: testName,
        priority,
        source,
      });
      localOrder.id = savedOrder.id;
      setSyncMessage("Lab order synced to backend.");
    } catch (error) {
      setSyncMessage(error instanceof ApiSyncSkippedError ? "Mock lab order saved locally." : "Backend sync failed; local lab order kept.");
    }
    setOrders((prev) => [localOrder, ...prev]);
    setTestName("");
    setShowForm(false);
  }

  async function advance(id: string) {
    let nextStatus: OrderStatus = "Ordered";
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = columns.indexOf(o.status);
        const next = columns[Math.min(idx + 1, columns.length - 1)];
        nextStatus = next;
        return { ...o, status: next };
      })
    );
    try {
      await updateBackendOrderStatus(id, nextStatus);
      setSyncMessage("Lab order status synced to backend.");
    } catch (error) {
      setSyncMessage(error instanceof ApiSyncSkippedError ? "Mock lab order updated locally." : "Backend sync failed; local lab status kept.");
    }
  }

  return (
    <div>
      <SectionHeading
        eyebrow="09 - Laboratory Orders"
        title="Laboratory Orders"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={14} /> New Lab Order
          </button>
        }
        description={`Request ${workContext} pathology investigations, monitor pending tests, and review completed lab reports.`}
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
              {contextPatients.map((p) => (
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
      {syncMessage && <p className="mb-3 text-xs text-ink-muted">{syncMessage}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {columns.map((col) => (
          <div key={col}>
            <p className="text-xs font-semibold text-ink-muted mb-2 flex items-center gap-1.5">
              <FlaskConical size={12} /> {col} ({contextOrders.filter((o) => o.status === col).length})
            </p>
            <div className="space-y-2.5">
              {contextOrders
                .filter((o) => o.status === col)
                .map((o) => {
                  const patient = patientById.get(o.patientId) ?? getPatient(o.patientId);
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
              {contextOrders.filter((o) => o.status === col).length === 0 && (
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
