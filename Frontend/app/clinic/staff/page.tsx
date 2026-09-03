"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeading, Card, Avatar, Pill, Modal, Field } from "@/components/ui";
import { staff as seedStaff, clinic } from "@/lib/mock-data";
import { ClinicLocation, StaffMember, StaffRole } from "@/lib/types";
import { ApiSyncSkippedError, createBackendClinicStaff, getBackendBootstrap } from "@/lib/api-client";
import { useMode } from "@/lib/mode-context";

const roles: StaffRole[] = ["Receptionist", "Nurse", "Assistant", "Lab/Pharmacy User"];

const rolePermissions: Record<StaffRole, string[]> = {
  Receptionist: ["Appointments", "Queue", "Patient registration", "Billing"],
  Nurse: ["Vitals", "Queue handoff", "Patient preparation"],
  Assistant: ["Tasks", "Follow-ups", "Documents"],
  "Lab/Pharmacy User": ["Lab status", "Inventory", "Prescription handoff"],
};

const statusTone: Record<string, "brand" | "clay" | "alert"> = {
  Active: "brand",
  Invited: "clay",
  Suspended: "alert",
};

export default function StaffManagementPage() {
  const { selectedWorkplaceId } = useMode();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [locations, setLocations] = useState<ClinicLocation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffRole>("Receptionist");
  const [locationId, setLocationId] = useState(clinic.locations[0].id);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    getBackendBootstrap()
      .then((data) => {
        if (cancelled) return;
        setStaff(data.staff);
        setLocations(data.locations);
        setLocationId(data.locations[0]?.id ?? clinic.locations[0].id);
      })
      .catch(() => {
        if (cancelled) return;
        setStaff(seedStaff);
        setLocations(clinic.locations);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function invite() {
    if (!name.trim()) return;
    let nextStaff: StaffMember = { id: `staff-${Date.now()}`, name, role, locationId, status: "Invited" };
    try {
      nextStaff = {
        ...(await createBackendClinicStaff({
          workplaceId: selectedWorkplaceId,
          fullName: name,
          role,
        })),
        locationId,
      };
      setSyncMessage("Staff invite synced to backend.");
    } catch (error) {
      setSyncMessage(error instanceof ApiSyncSkippedError ? "Mock staff invite saved locally." : "Backend sync failed; local staff invite kept.");
    }
    setStaff((prev) => [nextStaff, ...prev]);
    setName("");
    setShowForm(false);
  }

  function remove(id: string) {
    if (window.confirm("Remove this staff member and revoke clinic access?")) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
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
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          </Field>
        </div>
      </Modal>
      {syncMessage && <p className="mb-3 text-xs text-ink-muted">{syncMessage}</p>}

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
              const location = locations.find((l) => l.id === s.locationId);
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

      <Card className="mt-6">
        <p className="eyebrow mb-3">Role Access</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {roles.map((item) => (
            <div key={item} className="rounded-md border border-line bg-paper px-3 py-2">
              <p className="text-sm font-semibold text-ink">{item}</p>
              <p className="mt-1 text-xs text-ink-muted">{rolePermissions[item].join(" - ")}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
