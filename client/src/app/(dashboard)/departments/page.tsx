"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Plus,
  Shield,
  ShieldAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { useToast } from "@/hooks/use-toast";
import { detailedDepartments, DepartmentData } from "@/lib/mock-data/departments";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Department Management workflow";

export default function DepartmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<DepartmentData[]>(detailedDepartments);
  const [selectedScopeDept, setSelectedScopeDept] = useState<DepartmentData | null>(null);
  const [scopeModalOpen, setScopeModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Create Department Form State
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptType, setNewDeptType] = useState<DepartmentData["type"]>("IPD");
  const [newDeptLocation, setNewDeptLocation] = useState("Qlyno Multispecialty Hospital - Main Campus");
  const [newDeptFloor, setNewDeptFloor] = useState("4th Floor");
  const [newDeptHead, setNewDeptHead] = useState("Dr. Sunita Patel");
  const [newDeptBeds, setNewDeptBeds] = useState("20");

  const handleCardClick = (deptId: string) => {
    router.push(`/departments/${deptId}`);
  };

  const handleScopeClick = (e: React.MouseEvent, dept: DepartmentData) => {
    e.stopPropagation();
    setSelectedScopeDept(dept);
    setScopeModalOpen(true);
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const newDept: DepartmentData = {
      id: `dep_00${departments.length + 1}`,
      name: newDeptName,
      type: newDeptType,
      location: newDeptLocation,
      floor: newDeptFloor,
      headName: newDeptHead,
      headTitle: `Head of ${newDeptName}`,
      activePatients: 0,
      bedCapacity: Number(newDeptBeds) || 15,
      occupiedBeds: 0,
      status: "active",
      operatingHours: "08:00 AM – 08:00 PM (Daily)",
      shiftModel: "2-Shift General Ward",
      nurseStations: [`Station ${newDeptType}-1`],
      scope: {
        clinicalProcedures: ["Inpatient general care", "Routine clinical reviews"],
        bedAllocationRights: "General ward beds and room allocation",
        equipmentReady: ["Vital sign monitors", "Mobile crash cart"],
        supervisionLevel: "Attending Consultant Level",
        delegationLimits: "Operational bed tracking and nurse assignment managed by Hospital Admin.",
      },
      activePatientsList: [],
      activeDoctorsList: [{ id: "doc_new", name: newDeptHead, specialty: newDeptType, qualification: "MBBS, MD", experience: "10 yrs", availability: "On-Duty", rating: 4.8 }],
      activeNursesList: [{ id: "nur_new", name: "Anjali Bhosale", station: `Station ${newDeptType}-1`, role: "Staff Nurse", shift: "Morning", status: "On-Duty" }],
      supportStaffList: [{ id: "sup_new", name: "Ramesh Shinde", role: "Ward Assistant", taskScope: "General ward support", shift: "Morning", status: "Active" }],
    };

    setDepartments((prev) => [newDept, ...prev]);
    setCreateModalOpen(false);
    toast({
      title: "Department Created",
      description: `Registered '${newDeptName}' with ${newDeptBeds} beds. (${DELEGATION_STRING})`,
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Hospital Departments"
        description="Operational departments, care units, clinical scopes, and active workforce distribution across the hospital network."
        crumbs={[{ label: "Care Delivery" }, { label: "Departments" }]}
        actions={
          <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={handleCreateDepartment}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" /> Create Hospital Department
                  </DialogTitle>
                  <DialogDescription>
                    Register an operational unit, assign department leadership, and set initial bed allocations.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="d-name">Department Name</Label>
                    <Input
                      id="d-name"
                      placeholder="e.g. Pediatrics & Neonatal Care"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="d-type">Type</Label>
                      <Select value={newDeptType} onValueChange={(v: DepartmentData["type"]) => setNewDeptType(v)}>
                        <SelectTrigger id="d-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPD">OPD</SelectItem>
                          <SelectItem value="IPD">IPD / General Ward</SelectItem>
                          <SelectItem value="ICU">ICU</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="OT">OT Complex</SelectItem>
                          <SelectItem value="Radiology">Radiology</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="Laboratory">Laboratory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="d-beds">Bed Capacity</Label>
                      <Input
                        id="d-beds"
                        type="number"
                        placeholder="e.g. 20"
                        value={newDeptBeds}
                        onChange={(e) => setNewDeptBeds(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="d-head">Head of Department</Label>
                    <Input
                      id="d-head"
                      placeholder="e.g. Dr. Sunita Patel"
                      value={newDeptHead}
                      onChange={(e) => setNewDeptHead(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="d-loc">Campus Location</Label>
                      <Input
                        id="d-loc"
                        value={newDeptLocation}
                        onChange={(e) => setNewDeptLocation(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="d-floor">Floor / Wing</Label>
                      <Input
                        id="d-floor"
                        value={newDeptFloor}
                        onChange={(e) => setNewDeptFloor(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Department</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Department Management" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-warning" />
          <span>Operational department oversight • Click any department card to view full operational details page</span>
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((dept) => (
          <Card
            key={dept.id}
            onClick={() => handleCardClick(dept.id)}
            className="relative flex flex-col justify-between border-border bg-card transition-all duration-200 hover:border-primary hover:shadow-md cursor-pointer group"
          >
            <div>
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  {dept.name}
                </CardTitle>
                <StatusBadge status={dept.status} />
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-muted-foreground pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Department Head</span>
                  <span className="font-medium text-foreground text-xs">{dept.headName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs">Active Inpatients / Visits</span>
                  <span className="font-semibold text-foreground text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {dept.activePatients} patients
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                  <span>Staff Deployed</span>
                  <span className="font-medium text-foreground">
                    {dept.activeDoctorsList.length} Doctors • {dept.activeNursesList.length} Nurses • {dept.supportStaffList.length} Support
                  </span>
                </div>
              </CardContent>
            </div>

            {/* Fixed Bottom Bar with Pinned Bottom-Right "Department Scope" Button */}
            <div className="mt-auto border-t border-border/60 p-3 bg-muted/10 flex items-center justify-between rounded-b-xl">
              <Link
                href={`/departments/${dept.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] text-muted-foreground group-hover:text-primary hover:underline transition-colors font-medium flex items-center gap-1"
              >
                Click card for full details →
              </Link>
              <button
                type="button"
                onClick={(e) => handleScopeClick(e, dept)}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm transition-all hover:bg-primary hover:text-primary-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Department scope</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* DEPARTMENT SCOPE & BOUNDARIES MODAL */}
      <Dialog open={scopeModalOpen} onOpenChange={setScopeModalOpen}>
        <DialogContent className="max-w-lg">
          {selectedScopeDept && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {selectedScopeDept.name} — Operational Scope
                </DialogTitle>
                <DialogDescription>
                  Governing clinical scope, resource allocation privileges, and administrative boundaries.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
                  <p className="font-semibold text-foreground text-sm">Clinical Procedures in Scope:</p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {selectedScopeDept.scope.clinicalProcedures.map((proc, i) => (
                      <li key={i}>{proc}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3 space-y-1">
                    <p className="font-semibold text-foreground">Bed Allocation Scope</p>
                    <p className="text-muted-foreground">{selectedScopeDept.scope.bedAllocationRights}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3 space-y-1">
                    <p className="font-semibold text-foreground">Supervision Level</p>
                    <p className="text-muted-foreground">{selectedScopeDept.scope.supervisionLevel}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-3 space-y-1">
                  <p className="font-semibold text-foreground">Allocated Specialized Equipment</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedScopeDept.scope.equipmentReady.map((eq, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">
                        {eq}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 space-y-1 text-warning-foreground">
                  <p className="font-semibold flex items-center gap-1.5 text-xs text-warning">
                    <ShieldAlert className="h-3.5 w-3.5" /> Administrative Delegation Guardrail
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {selectedScopeDept.scope.delegationLimits}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setScopeModalOpen(false)}>
                  Close Scope Overview
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
