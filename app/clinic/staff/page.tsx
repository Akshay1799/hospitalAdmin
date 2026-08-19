"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeading, Card, Avatar, Pill, Modal, Field } from "@/components/ui";
import { staff as seedStaff, clinic } from "@/lib/mock-data";
import { StaffRole } from "@/lib/types";

const roles: StaffRole[] = ["Receptionist", "Nurse", "Assistant", "Lab/Pharmacy User"];

const statusTone: Record<string, "brand" | "clay" | "alert"> = {
  Active: "brand",
  Invited: "clay",
  Suspended: "alert",
};

export default function StaffManagementPage() {
  const [staff, setStaff] = useState(seedStaff);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffRole>("Receptionist");
  const [locationId, setLocationId] = useState(clinic.locations[0].id);

  function invite() {
    if (!name.trim()) return;
    setStaff((prev) => [
      { id: `staff-${Date.now()}`, name, role, locationId, status: "Invited" },
      ...prev,
    ]);
    setName("");
    setShowForm(false);
  }

  function remove(id: string) {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Clinic Operations · Staff Management"
        title="Staff Management"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={14} /> Invite Staff
          </button>
        }
        description="Add receptionist, nurse, assistant and other roles with role-based access."
      />

      <Modal
        open={showForm}
        title="Invite Staff Member"
        eyebrow="Staff Management"
        onClose={() => setShowForm(false)}
        footer={
          <>
            <button onClick={invite} className="btn-primary">
              <Plus size={14} /> Send Invite
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full Name" className="sm:col-span-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="input-field" />
          </Field>
          <Field label="Role">
          <select value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className="input-field">
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          </Field>
          <Field label="Location">
          <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="input-field">
            {clinic.locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          </Field>
        </div>
      </Modal>

      <Card padded={false}>
        <table className="w-full table-clean">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Location</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => {
              const location = clinic.locations.find((l) => l.id === s.locationId);
              return (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")} size={28} />
                      {s.name}
                    </div>
                  </td>
                  <td>{s.role}</td>
                  <td>{location?.name}</td>
                  <td>
                    <Pill tone={statusTone[s.status]}>{s.status}</Pill>
                  </td>
                  <td>
                    <button onClick={() => remove(s.id)} aria-label="Remove staff member">
                      <Trash2 size={14} className="text-ink-faint hover:text-alert-500" />
                    </button>
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
