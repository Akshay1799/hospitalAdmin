"use client";

import { useState } from "react";
import { Building2, Hospital, MonitorSmartphone } from "lucide-react";
import { WorkplaceBadge } from "@/components/doctor-workflow";
import { SectionHeading, Card, Avatar, Pill } from "@/components/ui";
import { currentDoctor } from "@/lib/mock-data";
import { useDoctorWorkflow } from "@/lib/doctor-workflow-context";

const tabs = ["Profile", "My Workplaces", "Consultation Preferences", "Notifications", "Security"] as const;
type Tab = (typeof tabs)[number];

export default function SettingsPage() {
  const { workplaces } = useDoctorWorkflow();
  const [tab, setTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <SectionHeading
        eyebrow="15 · Settings"
        title="Settings"
        description="Manage your doctor profile, consultation preferences, notifications and account security."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card padded={false} className="lg:col-span-1 h-fit">
          <div className="p-1.5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  tab === t ? "bg-brand-500 text-white" : "text-ink-soft hover:bg-paper"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-3">
          <Card>
            {tab === "Profile" && (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar initials={currentDoctor.avatarInitials} size={64} />
                  <button className="btn-secondary text-xs">Change Photo</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-ink-muted block mb-1">Full Name</label>
                    <input defaultValue={currentDoctor.name} className="input-field" />
                  </div>
                  <div>
                    <label className="text-[11px] text-ink-muted block mb-1">Specialty</label>
                    <input defaultValue={currentDoctor.specialty} className="input-field" />
                  </div>
                  <div>
                    <label className="text-[11px] text-ink-muted block mb-1">Qualifications</label>
                    <input defaultValue={currentDoctor.qualifications} className="input-field" />
                  </div>
                  <div>
                    <label className="text-[11px] text-ink-muted block mb-1">Years of Experience</label>
                    <input defaultValue={currentDoctor.experienceYears} type="number" className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-ink-muted block mb-1">Public Bio</label>
                    <textarea
                      rows={3}
                      placeholder="A short introduction shown on your public doctor profile…"
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {tab === "My Workplaces" && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-xl text-ink">My Workplaces</h2>
                  <p className="mt-1 text-sm text-ink-muted">Clinic, hospital and online affiliations available in the doctor workspace menu.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {workplaces.map((workplace) => {
                    const Icon =
                      workplace.type === "hospital"
                        ? Hospital
                        : workplace.type === "online"
                          ? MonitorSmartphone
                          : Building2;
                    return (
                      <div key={workplace.id} className="rounded-card border border-line bg-paper p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-brand-700">
                              <Icon size={18} />
                            </span>
                            <div>
                              <h3 className="text-sm font-semibold text-ink">{workplace.name}</h3>
                              <p className="mt-1 text-xs text-ink-muted">{workplace.role ?? "Doctor"}</p>
                              <div className="mt-2">
                                <WorkplaceBadge workplace={workplace} />
                              </div>
                            </div>
                          </div>
                          <Pill tone={workplace.status === "Pending" ? "clay" : "sage"}>{workplace.status}</Pill>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-ink-muted sm:grid-cols-2">
                          <p>Type: {workplace.type}</p>
                          <p>Managed by: {workplace.managedBy ?? "Self"}</p>
                          <p>Location: {workplace.location ?? "Online"}</p>
                          <p>Department: {workplace.department ?? "-"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="rounded-md border border-brand-100 bg-brand-50 px-3 py-2 text-xs text-ink-muted">
                  Invite, verification and backend persistence are left as future API work. This screen currently uses mock affiliations.
                </div>
              </div>
            )}

            {tab === "Consultation Preferences" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-ink-muted block mb-1">Default Consultation Length</label>
                    <select className="input-field" defaultValue="15">
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="20">20 minutes</option>
                      <option value="30">30 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-ink-muted block mb-1">Buffer Between Appointments</label>
                    <select className="input-field" defaultValue="5">
                      <option value="0">No buffer</option>
                      <option value="5">5 minutes</option>
                      <option value="10">10 minutes</option>
                    </select>
                  </div>
                </div>
                {[
                  "Allow video consultations",
                  "Show me as available for walk-ins",
                  "Require vitals before consultation starts",
                  "Auto-suggest ICD codes while typing diagnosis",
                ].map((label) => (
                  <label key={label} className="flex items-center gap-2.5 text-sm text-ink-soft">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-500" />
                    {label}
                  </label>
                ))}
              </div>
            )}

            {tab === "Notifications" && (
              <div className="space-y-3">
                {[
                  "New appointment booked",
                  "Patient checked in",
                  "Lab report ready",
                  "Follow-up due today",
                  "Emergency alert",
                  "Direct message from staff",
                ].map((label) => (
                  <div key={label} className="flex items-center justify-between border-b border-line/70 pb-3 last:border-0">
                    <span className="text-sm text-ink-soft">{label}</span>
                    <div className="flex gap-4 text-xs text-ink-muted">
                      <label className="flex items-center gap-1.5">
                        <input type="checkbox" defaultChecked className="accent-brand-500" /> In-app
                      </label>
                      <label className="flex items-center gap-1.5">
                        <input type="checkbox" defaultChecked className="accent-brand-500" /> WhatsApp
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "Security" && (
              <div className="space-y-5">
                <div>
                  <label className="text-[11px] text-ink-muted block mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field max-w-sm" />
                </div>
                <div>
                  <label className="text-[11px] text-ink-muted block mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field max-w-sm" />
                </div>
                <label className="flex items-center gap-2.5 text-sm text-ink-soft">
                  <input type="checkbox" className="w-4 h-4 accent-brand-500" />
                  Enable two-factor authentication
                </label>
              </div>
            )}

            <div className="pt-5 mt-5 border-t border-line">
              <button onClick={save} className="btn-primary">
                Save Changes
              </button>
              {saved && <span className="text-xs text-sage-500 ml-3">Saved</span>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
