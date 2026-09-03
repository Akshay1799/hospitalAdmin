"use client";

import * as React from "react";
import { Receipt, IndianRupee } from "lucide-react";
import { Card, SectionHeader, Table, Badge, Mono, StatCard } from "./ui";
import { useReceptionistData } from "./data-context";

interface BillingRow {
  id: string;
  patient: string;
  uhid: string;
  item: string;
  amount: number;
  status: "Paid" | "Pending" | "Advance received";
}

export function BillingCoordination() {
  const { patients } = useReceptionistData();

  const rows: BillingRow[] = [
    { id: "BILL-5511", patient: patients[0]?.name ?? "—", uhid: patients[0]?.uhid ?? "—", item: "Registration fee", amount: 200, status: "Paid" },
    { id: "BILL-5512", patient: patients[0]?.name ?? "—", uhid: patients[0]?.uhid ?? "—", item: "Cardiology consultation", amount: 800, status: "Paid" },
    { id: "BILL-5513", patient: patients[1]?.name ?? "—", uhid: patients[1]?.uhid ?? "—", item: "Advance for admission", amount: 15000, status: "Advance received" },
    { id: "BILL-5514", patient: patients[2]?.name ?? "—", uhid: patients[2]?.uhid ?? "—", item: "Pediatric consultation", amount: 500, status: "Pending" },
  ];

  const totalCollected = rows.filter((r) => r.status !== "Pending").reduce((s, r) => s + r.amount, 0);
  const totalPending = rows.filter((r) => r.status === "Pending").reduce((s, r) => s + r.amount, 0);

  const tone: Record<BillingRow["status"], "pine" | "amber" | "slate"> = {
    Paid: "pine",
    "Advance received": "slate",
    Pending: "amber",
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Front desk · Billing"
        title="Billing coordination"
        description="Coordinate with the billing department for registration fees, consultation charges, advance payments and billing status updates."
      />

      <div className="rp-grid-4 mb-5">
        <StatCard label="Collected today" value={`₹${totalCollected.toLocaleString("en-IN")}`} tone="pine" icon={<IndianRupee size={16} />} />
        <StatCard label="Pending charges" value={`₹${totalPending.toLocaleString("en-IN")}`} tone="amber" icon={<Receipt size={16} />} />
        <StatCard label="Transactions today" value={rows.length} tone="slate" />
        <StatCard label="Advance payments" value={rows.filter((r) => r.status === "Advance received").length} tone="pine" />
      </div>

      <Card>
        <h2 className="rp-h2">Recent billing activity</h2>
        <Table columns={["Bill ID", "Patient", "UHID", "Charge", "Amount", "Status"]}>
          {rows.map((r) => (
            <tr key={r.id}>
              <td><Mono>{r.id}</Mono></td>
              <td className="font-medium text-[var(--rp-ink)]">{r.patient}</td>
              <td><Mono>{r.uhid}</Mono></td>
              <td>{r.item}</td>
              <td><Mono>₹{r.amount.toLocaleString("en-IN")}</Mono></td>
              <td><Badge tone={tone[r.status]}>{r.status}</Badge></td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card className="mt-5">
        <h2 className="rp-h2">Coordination note</h2>
        <p className="rp-sub">
          Reception confirms charges with the billing counter before check-in for procedures and admissions.
          Registration fees and consultation charges sync automatically once billing confirms payment; advance
          payments against admissions are reflected here as soon as the billing desk records them.
        </p>
      </Card>
    </div>
  );
}
