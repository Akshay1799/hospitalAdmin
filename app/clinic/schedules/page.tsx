"use client";

import { useState } from "react";
import { SectionHeading, Card, Avatar, AvailabilityDot, Pill } from "@/components/ui";
import { doctors, clinic } from "@/lib/mock-data";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const scheduleSeed: Record<string, boolean[]> = {
  "doc-1": [true, true, true, true, true, true, false],
  "doc-2": [true, true, false, true, true, true, false],
  "doc-3": [false, true, true, true, false, true, false],
  "doc-4": [true, false, true, false, true, false, false],
};

export default function SchedulesPage() {
  const [schedule, setSchedule] = useState(scheduleSeed);

  function toggle(doctorId: string, dayIdx: number) {
    setSchedule((prev) => {
      const row = [...(prev[doctorId] ?? days.map(() => false))];
      row[dayIdx] = !row[dayIdx];
      return { ...prev, [doctorId]: row };
    });
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Clinic Operations · Schedules"
        title="Schedules"
        description="Clinic operating hours plus doctor-specific availability."
      />

      <Card className="mb-6">
        <p className="eyebrow mb-2">Clinic Hours</p>
        <p className="text-sm text-ink-soft">{clinic.timings}</p>
      </Card>

      <Card padded={false}>
        <table className="w-full table-clean">
          <thead>
            <tr>
              <th>Doctor</th>
              {days.map((d) => (
                <th key={d} className="text-center">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id}>
                <td>
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={d.avatarInitials} size={28} />
                    <div>
                      <p className="font-medium text-ink text-sm">{d.name}</p>
                      <AvailabilityDot status={d.availability} />
                    </div>
                  </div>
                </td>
                {days.map((_, i) => {
                  const active = schedule[d.id]?.[i];
                  return (
                    <td key={i} className="text-center">
                      <button
                        onClick={() => toggle(d.id, i)}
                        className={`w-7 h-7 rounded-md border transition-colors ${
                          active ? "bg-brand-500 border-brand-500" : "bg-white border-line"
                        }`}
                        aria-label={`Toggle ${days[i]} availability for ${d.name}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-ink-muted mt-3">Click a cell to toggle that doctor&apos;s availability for the day.</p>
    </div>
  );
}
