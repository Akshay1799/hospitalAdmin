"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, ScanLine } from "lucide-react";
import { SectionHeading, Card, Avatar, Pill, OrderStatusBadge, Modal } from "@/components/ui";
import { patients, radiologyOrders as seedOrders, getPatient } from "@/lib/mock-data";
import { ImagingType } from "@/lib/types";

const imagingTypes: ImagingType[] = ["X-Ray", "CT Scan", "MRI", "Ultrasound"];

function RadiologyOrdersList() {
  const params = useSearchParams();
  const preselected = params.get("patient");
  const [orders, setOrders] = useState(seedOrders);
  const [patientId, setPatientId] = useState(preselected ?? patients[0].id);
  const [showForm, setShowForm] = useState(false);
  const [imagingType, setImagingType] = useState<ImagingType>("X-Ray");
  const [bodyRegion, setBodyRegion] = useState("");
  const [priority, setPriority] = useState<"Routine" | "Urgent">("Routine");

  function placeOrder() {
    if (!bodyRegion.trim()) return;
    setOrders((prev) => [
      {
        id: `rad-${Date.now()}`,
        patientId,
        doctorId: "doc-1",
        imagingType,
        bodyRegion,
        orderedOn: "2026-08-13",
        status: "Ordered",
        priority,
      },
      ...prev,
    ]);
    setBodyRegion("");
    setShowForm(false);
  }

  return (
    <div>
      <SectionHeading
        eyebrow="10 · Radiology Orders"
        title="Radiology Orders"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={14} /> New Imaging Order
          </button>
        }
        description="Order imaging investigations including X-Ray, CT Scan, MRI and Ultrasound while reviewing radiology reports."
      />

      <Modal
        open={showForm}
        title="New Imaging Order"
        eyebrow="Radiology Orders"
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
            <label className="text-[11px] text-ink-muted block mb-1">Type</label>
            <select value={imagingType} onChange={(e) => setImagingType(e.target.value as ImagingType)} className="input-field">
              {imagingTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-ink-muted block mb-1">Body Region</label>
            <input
              value={bodyRegion}
              onChange={(e) => setBodyRegion(e.target.value)}
              placeholder="e.g. Chest"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-[11px] text-ink-muted block mb-1">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="input-field">
              <option>Routine</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>
      </Modal>

      <Card padded={false}>
        <div className="px-5 pt-5 pb-3 flex items-center gap-2">
          <ScanLine size={16} className="text-brand-600" />
          <h2 className="font-display text-lg text-ink">All Radiology Orders</h2>
        </div>
        <table className="w-full table-clean">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Study</th>
              <th>Ordered</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const patient = getPatient(o.patientId);
              return (
                <tr key={o.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      {patient && <Avatar initials={patient.avatarInitials} size={26} />}
                      {patient?.name}
                    </div>
                  </td>
                  <td>
                    {o.imagingType} — {o.bodyRegion}
                  </td>
                  <td className="font-mono text-xs">{o.orderedOn}</td>
                  <td>
                    <Pill tone={o.priority === "Urgent" ? "alert" : "neutral"}>{o.priority}</Pill>
                  </td>
                  <td>
                    <OrderStatusBadge status={o.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function RadiologyOrdersPage() {
  return (
    <Suspense fallback={null}>
      <RadiologyOrdersList />
    </Suspense>
  );
}
