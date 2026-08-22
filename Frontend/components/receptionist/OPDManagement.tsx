"use client";

import * as React from "react";
import { FileText, Printer } from "lucide-react";
import { Card, SectionHeader, Badge, Mono, Table, Button } from "./ui";
import { useReceptionistData } from "./data-context";
import { departments } from "./mock-data";

export function OPDManagement() {
  const { queue } = useReceptionistData();

  const byDepartment = departments
    .filter((d) => d !== "Emergency")
    .map((dept) => ({
      dept,
      entries: queue.filter((q) => q.department === dept),
    }))
    .filter((g) => g.entries.length > 0);

  return (
    <div>
      <SectionHeader
        eyebrow="Front desk · OPD"
        title="OPD management"
        description="Manage outpatient registrations, consultation slips, department allocation and daily OPD workflows."
      />

      <div className="rp-grid-4 mb-5">
        {departments.filter((d) => d !== "Emergency").slice(0, 4).map((d) => {
          const count = queue.filter((q) => q.department === d).length;
          return (
            <Card key={d} className="rp-stat">
              <span className="rp-eyebrow">{d}</span>
              <div className="rp-stat-value">{count}</div>
              <div className="rp-stat-delta">patients today</div>
            </Card>
          );
        })}
      </div>

      {byDepartment.length === 0 ? (
        <Card>
          <p className="rp-sub">No OPD activity recorded yet today. Check a patient in to see it reflected here by department.</p>
        </Card>
      ) : (
        byDepartment.map((g) => (
          <Card key={g.dept} className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="rp-h2 !mb-0">{g.dept}</h2>
              <Badge tone="pine">{g.entries.length} in OPD workflow</Badge>
            </div>
            <Table columns={["Token", "Patient", "Doctor", "Checked in", "Status", "Slip"]}>
              {g.entries.map((e) => (
                <tr key={e.token}>
                  <td><Mono>{e.token}</Mono></td>
                  <td className="font-medium text-[var(--rp-ink)]">{e.patient}</td>
                  <td>{e.doctor}</td>
                  <td>{e.checkedInAt}</td>
                  <td><Badge tone={e.status === "Waiting" ? "amber" : e.status === "In Consultation" ? "pine" : "slate"}>{e.status}</Badge></td>
                  <td>
                    <button className="rp-icon-btn" title="Print consultation slip">
                      <Printer size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        ))
      )}

      <Card>
        <div className="flex items-center gap-2 mb-1">
          <FileText size={16} className="text-[var(--rp-pine)]" />
          <h2 className="rp-h2 !mb-0">Consultation slip template</h2>
        </div>
        <p className="rp-sub mb-3">Standard slip printed at check-in — includes token, department, doctor and patient UHID.</p>
        <Button variant="secondary"><Printer size={16} /> Preview slip</Button>
      </Card>
    </div>
  );
}
