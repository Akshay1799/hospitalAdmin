"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  Filter,
  Layers,
  Lock,
  RefreshCw,
  ScrollText,
  Search,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { SecurityNav } from "@/components/security/security-nav";
import { useToast } from "@/hooks/use-toast";
import { mockDetailedAuditLogs } from "@/lib/mock-data/security-operations";
import { AuditLogDetailedEntry } from "@/lib/types";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Global Audit Governance workflow";

export default function AuditLogsPage() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [logs, setLogs] = useState<AuditLogDetailedEntry[]>(mockDetailedAuditLogs);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  // Before/After Diff Inspector Modal State
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogDetailedEntry | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesSearch =
        l.actor.toLowerCase().includes(search.toLowerCase()) ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.entity.toLowerCase().includes(search.toLowerCase()) ||
        l.entityId.toLowerCase().includes(search.toLowerCase()) ||
        l.ipAddress.toLowerCase().includes(search.toLowerCase()) ||
        (l.reason && l.reason.toLowerCase().includes(search.toLowerCase()));

      const matchesModule = moduleFilter === "all" || l.module === moduleFilter;
      const matchesSeverity = severityFilter === "all" || l.severity === severityFilter;

      return matchesSearch && matchesModule && matchesSeverity;
    });
  }, [logs, search, moduleFilter, severityFilter]);

  const handleOpenInspect = (log: AuditLogDetailedEntry) => {
    setSelectedLog(log);
    setInspectModalOpen(true);
  };

  const handleExportAuditCSV = () => {
    toast({
      title: "Audit Log Export Generated",
      description: `Exported ${filteredLogs.length} immutable audit event records to signed CSV. (${DELEGATION_STRING})`,
    });
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Global Multi-Module Audit Log &amp; State Diff Viewer"
          description="Tamper-evident system-wide audit trail capturing actors, actions, timestamps, before/after diffs, and mandatory sensitive action reasons."
          crumbs={[{ label: "Administration" }, { label: "Audit Logs" }]}
        />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading audit trail...
        </div>
      </div>
    );
  }

  const criticalCount = logs.filter((l) => l.severity === "Critical").length;
  const highCount = logs.filter((l) => l.severity === "High").length;
  const stepUpCount = logs.filter((l) => l.status === "step-up-verified").length;

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="Global Multi-Module Audit Log &amp; State Diff Viewer"
        description="Tamper-evident system-wide audit trail capturing actors, actions, timestamps, before/after diffs, and mandatory sensitive action reasons."
        crumbs={[{ label: "Administration" }, { label: "Audit Logs" }]}
        actions={
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 font-semibold text-xs text-primary border-primary/30 hover:bg-primary/10"
            onClick={handleExportAuditCSV}
          >
            <Download className="h-4 w-4" /> Export Audit Log
          </Button>
        }
      />

      <SecurityNav />

      {/* Scope Indicator & Rules 14-CAN-16 to 21 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Central Compliance &amp; Audit Log Vault" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Rules 14-CAN-16 to 21: Full Actor + Action + Timestamp + Entity + Before/After Diff + Reason recording</span>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Total Audit Events</span>
          <p className="text-xl font-bold font-mono text-foreground mt-0.5">{logs.length} Records</p>
          <span className="text-[10px] text-muted-foreground">Aggregated across all modules</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Step-Up Verified</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">{stepUpCount} High-Risk</p>
          <span className="text-[10px] text-emerald-600 font-medium">Secondary PIN challenged</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Critical Severity Events</span>
          <p className="text-xl font-bold font-mono text-rose-600 mt-0.5">{criticalCount} Critical</p>
          <span className="text-[10px] text-rose-600 font-medium">Break-glass &amp; anomalies</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">High Severity Actions</span>
          <p className="text-xl font-bold font-mono text-amber-600 mt-0.5">{highCount} Actions</p>
          <span className="text-[10px] text-amber-600 font-medium">RBAC, refunds &amp; panic flags</span>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card className="border-border shadow-xs">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold">Central Hospital Audit Trail</CardTitle>
          <CardDescription className="text-xs">
            Review detailed timestamps, IP provenance, state mutations, and click &ldquo;Inspect Diff&rdquo; to analyze before/after states.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search actor, action, entity, or reason..."
                className="pl-8 text-xs h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[180px] text-xs h-9">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  <SelectItem value="Roles & Security Controls">Roles & Security</SelectItem>
                  <SelectItem value="Emergency & Clinical Operations">Emergency & Clinical</SelectItem>
                  <SelectItem value="Session Management">Session Management</SelectItem>
                  <SelectItem value="Billing & Finance">Billing & Finance</SelectItem>
                  <SelectItem value="Radiology & Imaging">Radiology & Imaging</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[150px] text-xs h-9">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-bold w-[180px]">Actor &amp; Role</TableHead>
                  <TableHead className="text-xs font-bold w-[200px]">Action &amp; Module</TableHead>
                  <TableHead className="text-xs font-bold w-[160px]">Entity Affected</TableHead>
                  <TableHead className="text-xs font-bold w-[130px]">Timestamp</TableHead>
                  <TableHead className="text-xs font-bold w-[110px]">Severity</TableHead>
                  <TableHead className="text-xs font-bold w-[130px]">Status</TableHead>
                  <TableHead className="text-xs font-bold text-right w-[120px]">State Diff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((l) => (
                  <TableRow key={l.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="font-semibold text-xs text-foreground">{l.actor}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{l.actorRole}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-foreground">{l.action}</div>
                      <div className="text-[10px] text-primary font-mono">{l.module}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-foreground">{l.entity}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{l.entityId}</div>
                    </TableCell>

                    <TableCell className="font-mono text-xs text-muted-foreground">
                      <div>{new Date(l.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      <div className="text-[10px]">{new Date(l.timestamp).toLocaleDateString()}</div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                          l.severity === "Critical"
                            ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[10px]"
                            : l.severity === "High"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]"
                            : "text-[10px]"
                        }
                      >
                        {l.severity}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {l.status === "step-up-verified" ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[9px] gap-1">
                          <Lock className="h-2.5 w-2.5" /> Step-Up Auth
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px]">
                          {l.status}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      {l.beforeState || l.afterState ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs font-semibold text-primary hover:bg-primary/10 gap-1"
                          onClick={() => handleOpenInspect(l)}
                        >
                          <Eye className="h-3 w-3" /> Inspect Diff
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">No Diff</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL: BEFORE / AFTER STATE DIFF INSPECTOR */}
      <Dialog open={inspectModalOpen} onOpenChange={setInspectModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-primary" /> State Mutation Diff Inspector
            </DialogTitle>
            <DialogDescription className="text-xs">
              Audit Event #{selectedLog?.id} • Action: {selectedLog?.action} by {selectedLog?.actor}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-3 text-xs">
            {/* Metadata bar */}
            <div className="p-3 rounded-lg border border-border bg-muted/20 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground block">Actor:</span>
                <span className="font-bold text-foreground">{selectedLog?.actor} ({selectedLog?.actorRole})</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Origin IP Address:</span>
                <span className="font-mono text-primary font-semibold">{selectedLog?.ipAddress}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block font-bold text-foreground">Mandatory Reason Logged:</span>
                <p className="text-foreground italic mt-0.5 leading-relaxed">
                  &ldquo;{selectedLog?.reason || "Standard system operation."}&rdquo;
                </p>
              </div>
            </div>

            {/* Side-by-Side Before vs After JSON Diffs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Before State */}
              <div className="space-y-1">
                <span className="font-bold text-rose-600 text-xs flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> State Before Action:
                </span>
                <pre className="p-3 rounded-lg bg-muted/40 border border-border text-[11px] font-mono overflow-x-auto text-muted-foreground leading-relaxed">
                  {JSON.stringify(selectedLog?.beforeState, null, 2)}
                </pre>
              </div>

              {/* After State */}
              <div className="space-y-1">
                <span className="font-bold text-emerald-600 text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> State After Mutation:
                </span>
                <pre className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/30 text-[11px] font-mono overflow-x-auto text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {JSON.stringify(selectedLog?.afterState, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setInspectModalOpen(false)} className="bg-primary text-primary-foreground font-semibold">
              Close Inspector
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
