"use client";

import { useState } from "react";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";
import { SectionHeading, Card, Pill, Modal, Field } from "@/components/ui";
import { clinic, doctors } from "@/lib/mock-data";

export default function LocationsPage() {
  const [locations, setLocations] = useState(clinic.locations);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  function addLocation() {
    if (!name.trim() || !address.trim()) return;
    setLocations((prev) => [...prev, { id: `loc-${Date.now()}`, name, address }]);
    setName("");
    setAddress("");
    setShowForm(false);
  }

  function remove(id: string) {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Clinic Operations · Locations"
        title="Locations"
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={14} /> Add Location
          </button>
        }
        description="Physical practice locations for this clinic."
      />

      <Modal
        open={showForm}
        title="Add Location"
        eyebrow="Clinic Locations"
        onClose={() => setShowForm(false)}
        footer={
          <>
            <button onClick={addLocation} className="btn-primary">
              <Plus size={14} /> Add Location
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Location Name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Location name" className="input-field" />
          </Field>
          <Field label="Address">
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="input-field" />
          </Field>
        </div>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {locations.map((l) => {
          const docsHere = doctors.filter((d) => d.locationId === l.id);
          return (
            <Card key={l.id}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-9 h-9 rounded-md bg-brand-50 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-brand-600" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink flex items-center gap-1.5">
                      {l.name}
                      {l.isPrimary && (
                        <span title="Primary location">
                          <Star size={12} className="fill-clay-400 text-clay-400" />
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5">{l.address}</p>
                  </div>
                </div>
                <button onClick={() => remove(l.id)}>
                  <Trash2 size={14} className="text-ink-faint hover:text-alert-500" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {docsHere.length === 0 ? (
                  <span className="text-xs text-ink-faint">No doctors assigned</span>
                ) : (
                  docsHere.map((d) => (
                    <Pill key={d.id} tone="neutral">
                      {d.name}
                    </Pill>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
