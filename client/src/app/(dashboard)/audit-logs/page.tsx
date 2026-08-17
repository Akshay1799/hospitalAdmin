"use client";

import { useState } from "react";
import { Download, ScrollText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Toolbar } from "@/components/shared/toolbar";
import { auditLogs } from "@/lib/mock-data/operations";
import { formatDateTime } from "@/lib/utils";

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const roles = ["all", ...Array.from(new Set(auditLogs.map((l) => l.actorRole)))];

  const filtered = auditLogs.filter((l) => {
    const matchesSearch =
      l.actor.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
    const matchesRole = role === "all" || l.actorRole === role;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Every important action across doctors, staff, vendors and billing is traceable."
        crumbs={[{ label: "Administration" }, { label: "Audit Logs" }]}
        actions={
          <Button variant="outline">
            <Download /> Export logs
          </Button>
        }
      />

      <Toolbar searchValue={search} onSearchChange={setSearch} placeholder="Search by actor or action">
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {r === "all" ? "All roles" : r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Toolbar>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState icon={ScrollText} title="No matching audit events" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Actor</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-sm font-medium">{l.actor}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.actorRole}</TableCell>
                  <TableCell className="text-sm">{l.action}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {l.entity} · {l.entityId}
                  </TableCell>
                  <TableCell className="text-sm">{formatDateTime(l.timestamp)}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{l.ipAddress}</TableCell>
                  <TableCell>
                    <StatusBadge status={l.status === "success" ? "success" : "failed"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
