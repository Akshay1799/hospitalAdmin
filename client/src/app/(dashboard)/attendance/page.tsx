"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  Lock,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { RosterNav } from "@/components/roster/roster-nav";
import { attendanceRecords as initialRecords, leaveRequests } from "@/lib/mock-data/staff";
import { AttendanceRecord } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function AttendancePage() {
  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState("today");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit Timestamp Modal State (Rule F10-CANNOT-5)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [newPunchIn, setNewPunchIn] = useState("");
  const [newPunchOut, setNewPunchOut] = useState("");
  const [editReason, setEditReason] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenEdit = (rec: AttendanceRecord) => {
    setEditingRecord(rec);
    setNewPunchIn(rec.punchIn || "06:00 AM");
    setNewPunchOut(rec.punchOut || "02:00 PM");
    setEditReason("");
    setEditModalOpen(true);
  };

  const handleSaveTimestampEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    if (!editReason.trim()) {
      toast({
        title: "Reason Required",
        description: "A mandatory justification reason must be logged for security audit trails.",
        variant: "destructive",
      });
      return;
    }

    setRecords((prev) =>
      prev.map((r) =>
        r.id === editingRecord.id
          ? {
              ...r,
              punchIn: newPunchIn,
              punchOut: newPunchOut,
              editedReason: editReason,
              editedBy: "Hospital Admin (Security Logged)",
            }
          : r
      )
    );

    toast({
      title: "Timestamp Corrected & Audit Logged",
      description: `Updated punch record for ${editingRecord.staffName}. Audit ID: SEC-${Date.now().toString().slice(-4)}.`,
    });
    setEditModalOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Staff Name,Department,Date,Scheduled Shift,Punch In,Punch Out,Overtime,Status\n" +
      records
        .map(
          (r) =>
            `${r.id},"${r.staffName}","${r.department}",${r.date},"${r.scheduledShift}","${r.punchIn || ""}","${
              r.punchOut || ""
            }",${r.overtimeMinutes || 0},${r.status}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hospital_Attendance_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Export Downloaded",
      description: "Attendance register exported for payroll & compliance audit.",
    });
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.staffName.toLowerCase().includes(search.toLowerCase()) ||
      r.staffRole.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === "all" || r.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const lateRecords = records.filter((r) => r.status === "Late" || r.status === "Early Departure");
  const overtimeRecords = records.filter((r) => r.overtimeMinutes && r.overtimeMinutes > 0);
  const approvedLeaves = leaveRequests.filter((l) => l.status === "Approved");

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Hospital Workforce Attendance &amp; Clock-In Suite"
          description="Live check-in/out boards, RFID biometric logs, late/early flags, and overtime compliance reports."
          crumbs={[{ label: "People & Staff" }, { label: "Attendance" }]}
        />
        <RosterNav />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading attendance system...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="Hospital Workforce Attendance &amp; Clock-In Suite"
        description="Live check-in/out boards, RFID biometric logs, late/early flags, and overtime compliance reports."
        crumbs={[{ label: "People & Staff" }, { label: "Attendance" }]}
        actions={
          <Button size="sm" variant="outline" className="gap-1.5 font-semibold text-xs" onClick={handleExportCSV}>
            <Download className="h-4 w-4" /> Export Attendance CSV
          </Button>
        }
      />

      <RosterNav />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Present Today</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">
            {records.filter((r) => r.status === "Present").length} / {records.length} Staff
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">96.8% Turnout Rate</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Late Arrivals &amp; Early Exits</span>
          <p className="text-xl font-bold font-mono text-amber-600 mt-0.5">{lateRecords.length} Flagged</p>
          <span className="text-[10px] text-amber-600 font-medium">Auto-calculated time deltas</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Overtime Logged</span>
          <p className="text-xl font-bold font-mono text-primary mt-0.5">
            {overtimeRecords.reduce((acc, r) => acc + (r.overtimeMinutes || 0), 0)} mins
          </p>
          <span className="text-[10px] text-primary font-medium">Beyond scheduled shift ends</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Approved Leaves Today</span>
          <p className="text-xl font-bold font-mono text-cyan-600 mt-0.5">{approvedLeaves.length} On Leave</p>
          <span className="text-[10px] text-cyan-600 font-medium">Mirrored from Duty &amp; Shifts</span>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/40 p-1 border border-border">
          <TabsTrigger value="today" className="text-xs">
            Today&apos;s Live Board ({records.length})
          </TabsTrigger>
          <TabsTrigger value="late-early" className="text-xs">
            Late / Early Flags ({lateRecords.length})
          </TabsTrigger>
          <TabsTrigger value="overtime" className="text-xs">
            Overtime Tracker ({overtimeRecords.length})
          </TabsTrigger>
          <TabsTrigger value="leave-mirror" className="text-xs">
            Leave Register Mirror
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">
            Punctuality Reports
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Today's Live Board */}
        <TabsContent value="today" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Live Check-In / Clock-Out Register</CardTitle>
              <CardDescription className="text-xs">
                Real-time punch timestamps from RFID turnstiles and biometric stations across all departments.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff, role, or department..."
                    className="pl-8 text-xs h-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[150px] text-xs h-9">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="General Ward">General Ward</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="OT Complex">OT Complex</SelectItem>
                      <SelectItem value="OPD Billing">OPD Billing</SelectItem>
                      <SelectItem value="Emergency Fleet">Emergency Fleet</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px] text-xs h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Late">Late</SelectItem>
                      <SelectItem value="Early Departure">Early Departure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold">Staff Member</TableHead>
                      <TableHead className="text-xs font-bold">Role &amp; Department</TableHead>
                      <TableHead className="text-xs font-bold">Scheduled Shift</TableHead>
                      <TableHead className="text-xs font-bold">Clock-In (RFID)</TableHead>
                      <TableHead className="text-xs font-bold">Clock-Out</TableHead>
                      <TableHead className="text-xs font-bold">Overtime</TableHead>
                      <TableHead className="text-xs font-bold">Status</TableHead>
                      <TableHead className="text-xs font-bold text-right">Audit Edit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((rec) => (
                      <TableRow key={rec.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-semibold text-xs">{rec.staffName}</TableCell>
                        <TableCell>
                          <div className="text-xs font-medium">{rec.staffRole}</div>
                          <div className="text-[10px] text-muted-foreground">{rec.department}</div>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{rec.scheduledShift}</TableCell>
                        <TableCell className="text-xs font-mono font-semibold text-emerald-600">
                          {rec.punchIn || "—"}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{rec.punchOut || "—"}</TableCell>
                        <TableCell className="text-xs font-mono text-primary font-semibold">
                          {rec.overtimeMinutes ? `+${rec.overtimeMinutes}m` : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              rec.status === "Present"
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]"
                                : rec.status === "Late"
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]"
                                : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[10px]"
                            }
                          >
                            {rec.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-muted-foreground hover:text-primary"
                            onClick={() => handleOpenEdit(rec)}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Late / Early Flags */}
        <TabsContent value="late-early" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Late Arrivals &amp; Early Departure Exception Queue</CardTitle>
              <CardDescription className="text-xs">
                Auto-calculated variance deltas against scheduled shift template boundaries.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold">Staff Member</TableHead>
                      <TableHead className="text-xs font-bold">Department</TableHead>
                      <TableHead className="text-xs font-bold">Scheduled Window</TableHead>
                      <TableHead className="text-xs font-bold">Actual Punch</TableHead>
                      <TableHead className="text-xs font-bold">Variance Delta</TableHead>
                      <TableHead className="text-xs font-bold">Reason / Audit Log</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lateRecords.map((rec) => (
                      <TableRow key={rec.id}>
                        <TableCell className="text-xs font-semibold">{rec.staffName}</TableCell>
                        <TableCell className="text-xs">{rec.department}</TableCell>
                        <TableCell className="text-xs font-mono">{rec.scheduledShift}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-amber-600">
                          {rec.status === "Late" ? rec.punchIn : rec.punchOut}
                        </TableCell>
                        <TableCell className="text-xs font-mono font-bold text-rose-600">
                          {rec.lateMinutes ? `${rec.lateMinutes} mins late` : `${rec.earlyMinutes} mins early`}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {rec.editedReason || "Logged by automated biometric turnstile sensor"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Overtime Tracker (Rule F10-CANNOT-4: only hours beyond scheduled end) */}
        <TabsContent value="overtime" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Overtime Work Hours Compliance</CardTitle>
              <CardDescription className="text-xs">
                Tracks verified hours worked strictly beyond scheduled shift end times for payroll integration.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold">Staff Member</TableHead>
                      <TableHead className="text-xs font-bold">Department</TableHead>
                      <TableHead className="text-xs font-bold">Shift End</TableHead>
                      <TableHead className="text-xs font-bold">Punch Out</TableHead>
                      <TableHead className="text-xs font-bold">Overtime Logged</TableHead>
                      <TableHead className="text-xs font-bold">Audit Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overtimeRecords.map((rec) => (
                      <TableRow key={rec.id}>
                        <TableCell className="text-xs font-semibold">{rec.staffName}</TableCell>
                        <TableCell className="text-xs">{rec.department}</TableCell>
                        <TableCell className="text-xs font-mono">02:00 PM</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-emerald-600">{rec.punchOut}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-primary">
                          +{rec.overtimeMinutes} mins ({((rec.overtimeMinutes || 0) / 60).toFixed(1)} hrs)
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                            Verified
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Leave Register Mirror (Rule F10-CANNOT-3: read-only mirror from Duty & Shifts) */}
        <TabsContent value="leave-mirror" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Approved Leave Register (Read-Only Mirror)</CardTitle>
              <CardDescription className="text-xs">
                Reflects approved leaves from the Duty &amp; Shifts module directly in the attendance registry without duplicate approval queues.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold">Staff Member</TableHead>
                      <TableHead className="text-xs font-bold">Leave Type</TableHead>
                      <TableHead className="text-xs font-bold">Dates</TableHead>
                      <TableHead className="text-xs font-bold">Reason</TableHead>
                      <TableHead className="text-xs font-bold">Backup Assigned</TableHead>
                      <TableHead className="text-xs font-bold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedLeaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="text-xs font-semibold">{leave.staffName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {leave.leaveType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {leave.startDate} to {leave.endDate}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{leave.reason}</TableCell>
                        <TableCell className="text-xs font-medium text-emerald-600">
                          {leave.assignedBackupStaffName || "Covered"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                            Approved &amp; Synced
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Punctuality Reports */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Monthly Departmental Punctuality &amp; Utilization</CardTitle>
              <CardDescription className="text-xs">
                Aggregate compliance metrics feeding hospital-wide workforce quality audits.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="p-3.5 border-border bg-card">
                  <span className="text-xs font-bold text-muted-foreground">General Nursing</span>
                  <p className="text-xl font-bold font-mono text-emerald-600 mt-1">98.2%</p>
                  <span className="text-[10px] text-muted-foreground">Punctuality compliance</span>
                </Card>
                <Card className="p-3.5 border-border bg-card">
                  <span className="text-xs font-bold text-muted-foreground">Emergency &amp; Fleet</span>
                  <p className="text-xl font-bold font-mono text-cyan-600 mt-1">99.5%</p>
                  <span className="text-[10px] text-muted-foreground">Zero emergency response delays</span>
                </Card>
                <Card className="p-3.5 border-border bg-card">
                  <span className="text-xs font-bold text-muted-foreground">Billing &amp; Cashiers</span>
                  <p className="text-xl font-bold font-mono text-primary mt-1">97.0%</p>
                  <span className="text-[10px] text-muted-foreground">Counter opening punctuality</span>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Timestamp Modal with Mandatory Reason (Rule F10-CANNOT-5) */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSaveTimestampEdit}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Correct Attendance Timestamp
              </DialogTitle>
              <DialogDescription className="text-xs">
                Editing clock-in/out timestamps is a restricted sensitive action requiring a mandatory justification reason.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3 text-xs">
              <div className="p-2.5 rounded-lg border border-border bg-muted/20">
                <div className="font-semibold">{editingRecord?.staffName}</div>
                <div className="text-muted-foreground">{editingRecord?.department} • {editingRecord?.scheduledShift}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="edit-in">Clock-In Time</Label>
                  <Input
                    id="edit-in"
                    className="text-xs font-mono"
                    value={newPunchIn}
                    onChange={(e) => setNewPunchIn(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="edit-out">Clock-Out Time</Label>
                  <Input
                    id="edit-out"
                    className="text-xs font-mono"
                    value={newPunchOut}
                    onChange={(e) => setNewPunchOut(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="edit-reason">Mandatory Justification Reason *</Label>
                <Input
                  id="edit-reason"
                  className="text-xs"
                  placeholder="e.g. RFID card failure at Gate 2, verified by Security Supervisor"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save &amp; Log to Audit Trail
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
