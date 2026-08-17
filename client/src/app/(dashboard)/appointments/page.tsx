"use client";

import { useState } from "react";
import { CalendarClock, Video } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Toolbar } from "@/components/shared/toolbar";
import { appointments } from "@/lib/mock-data/appointments";
import { formatDate, getInitials } from "@/lib/utils";

const statusOptions = [
  "all",
  "confirmed",
  "waiting",
  "in-consultation",
  "completed",
  "cancelled",
  "no-show",
  "rescheduled",
];

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || a.status === status;
    return matchesSearch && matchesStatus;
  });

  const grouped = filtered.reduce<Record<string, typeof appointments>>((acc, a) => {
    acc[a.date] = acc[a.date] ? [...acc[a.date], a] : [a];
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Unified appointment engine across phone, WhatsApp and AI-agent bookings."
        crumbs={[{ label: "Care Delivery" }, { label: "Appointments" }]}
      />

      <Toolbar searchValue={search} onSearchChange={setSearch} placeholder="Search by patient or doctor">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All statuses" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Toolbar>

      {Object.keys(grouped).length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={CalendarClock} title="No appointments found" description="Try adjusting your filters." />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-6">
          {Object.entries(grouped)
            .sort(([a], [b]) => (a < b ? -1 : 1))
            .map(([date, items]) => (
              <Card key={date}>
                <CardContent className="p-0">
                  <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <h3 className="text-sm font-semibold text-foreground">{formatDate(date, { weekday: "long", day: "2-digit", month: "long" })}</h3>
                    <span className="text-xs text-muted-foreground">{items.length} appointments</span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Clinic</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback>{getInitials(a.patientName)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{a.patientName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{a.doctorName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{a.clinic}</TableCell>
                          <TableCell className="font-mono text-xs">{a.time}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-sm">
                              {a.type === "Video" && <Video className="h-3.5 w-3.5 text-info" />}
                              {a.type}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">{a.reason}</TableCell>
                          <TableCell>
                            <StatusBadge status={a.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
