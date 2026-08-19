"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Bed,
  Building2,
  Calendar,
  Clock,
  HeartPulse,
  Info,
  MapPin,
  Plus,
  Shield,
  ShieldAlert,
  Stethoscope,
  User,
  UserCheck,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { detailedDepartments, DepartmentData } from "@/lib/mock-data/departments";
import { getInitials } from "@/lib/utils";

export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const dept = detailedDepartments.find((d) => d.id === id);

  if (!dept) {
    notFound();
  }

  const occupancyRate =
    dept.bedCapacity && dept.occupiedBeds
      ? Math.round((dept.occupiedBeds / dept.bedCapacity) * 100)
      : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1 text-muted-foreground hover:text-foreground">
          <Link href="/departments">
            <ArrowLeft className="h-4 w-4" /> Back to Departments
          </Link>
        </Button>
      </div>

      <PageHeader
        title={dept.name}
        description={`Operational clinical unit • ${dept.location} (${dept.floor})`}
        crumbs={[
          { label: "Care Delivery" },
          { label: "Departments", href: "/departments" },
          { label: dept.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={dept.status} />
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName={dept.name} />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-warning" />
          <span>Department Operational Oversight • Clinical governance under {dept.headName}</span>
        </div>
      </div>

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="p-3 bg-card border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Department Head</span>
            <User className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-1 font-bold text-sm text-foreground">{dept.headName}</p>
          <p className="text-[11px] text-muted-foreground truncate">{dept.headTitle}</p>
        </Card>

        <Card className="p-3 bg-card border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Patients</span>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-1 font-bold text-lg text-primary">{dept.activePatients}</p>
          <p className="text-[11px] text-muted-foreground">Under active care</p>
        </Card>

        <Card className="p-3 bg-card border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Bed Occupancy</span>
            <Bed className="h-4 w-4 text-primary" />
          </div>
          {dept.bedCapacity !== undefined ? (
            <div>
              <p className="mt-1 font-bold text-sm text-foreground">
                {dept.occupiedBeds || 0} / {dept.bedCapacity} ({occupancyRate || 0}%)
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${
                    (occupancyRate || 0) > 85
                      ? "bg-destructive"
                      : (occupancyRate || 0) > 60
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                  style={{ width: `${Math.min(100, occupancyRate || 0)}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="mt-1 font-bold text-sm text-foreground">Day-Care Bays</p>
              <p className="text-[11px] text-muted-foreground">Outpatient triage</p>
            </div>
          )}
        </Card>

        <Card className="p-3 bg-card border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Clinical Doctors</span>
            <Stethoscope className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-1 font-bold text-lg text-foreground">{dept.activeDoctorsList.length}</p>
          <p className="text-[11px] text-muted-foreground">Assigned & on-duty</p>
        </Card>

        <Card className="p-3 bg-card border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Nursing & Support</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-1 font-bold text-sm text-foreground">
            {dept.activeNursesList.length} Nurses • {dept.supportStaffList.length} Support
          </p>
          <p className="text-[11px] text-muted-foreground">Shift active</p>
        </Card>
      </div>

      {/* Operating Schedule & Stations Banner */}
      <div className="rounded-lg border border-border bg-muted/20 p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <div>
            <span className="text-muted-foreground">Operating Schedule:</span>
            <p className="font-semibold text-foreground">{dept.operatingHours}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Calendar className="h-4 w-4 text-primary shrink-0" />
          <div>
            <span className="text-muted-foreground">Shift Model:</span>
            <p className="font-semibold text-foreground">{dept.shiftModel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <div>
            <span className="text-muted-foreground">Assigned Nurse Stations:</span>
            <p className="font-semibold text-foreground">{dept.nurseStations.join(", ")}</p>
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full">
          <TabsTrigger value="patients" className="text-xs">
            Active Patients ({dept.activePatientsList.length})
          </TabsTrigger>
          <TabsTrigger value="doctors" className="text-xs">
            Active Doctors ({dept.activeDoctorsList.length})
          </TabsTrigger>
          <TabsTrigger value="nurses" className="text-xs">
            Active Nurses ({dept.activeNursesList.length})
          </TabsTrigger>
          <TabsTrigger value="support" className="text-xs">
            Support Staff ({dept.supportStaffList.length})
          </TabsTrigger>
          <TabsTrigger value="scope" className="text-xs">
            Department Scope
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ACTIVE PATIENTS */}
        <TabsContent value="patients" className="space-y-3 pt-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Active Inpatients & Current Visits</span>
                <Badge variant="outline">{dept.activePatientsList.length} admitted</Badge>
              </CardTitle>
              <CardDescription>
                Live inpatient roster and outpatient visit tracking for {dept.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Details</TableHead>
                    <TableHead>Bed / Location</TableHead>
                    <TableHead>Admitting Doctor</TableHead>
                    <TableHead>Diagnosis / Condition</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Clinical Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dept.activePatientsList.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-xs text-foreground">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {p.qlynoId} • {p.age}y ({p.gender})
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-mono font-medium text-primary">
                        {p.bedNumber}
                      </TableCell>
                      <TableCell className="text-xs">{p.admittingDoctor}</TableCell>
                      <TableCell className="text-xs font-medium">{p.condition}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.admissionDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            p.status === "Critical"
                              ? "destructive"
                              : p.status === "Under Observation"
                              ? "warning"
                              : "success"
                          }
                          className="text-[10px]"
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {dept.activePatientsList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                        No active inpatients currently registered in this department.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: ACTIVE DOCTORS */}
        <TabsContent value="doctors" className="space-y-3 pt-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Assigned & Consulting Doctors</span>
                <Badge variant="outline">{dept.activeDoctorsList.length} Doctors</Badge>
              </CardTitle>
              <CardDescription>
                Attending physicians, surgeons, and specialists assigned to {dept.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor Name</TableHead>
                    <TableHead>Specialty & Qualification</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Duty Availability</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dept.activeDoctorsList.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 rounded-full">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {getInitials(doc.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-xs text-foreground">{doc.name}</p>
                            <p className="text-[11px] text-muted-foreground">{dept.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <p className="font-medium text-foreground">{doc.specialty}</p>
                        <p className="text-[11px] text-muted-foreground">{doc.qualification}</p>
                      </TableCell>
                      <TableCell className="text-xs">{doc.experience}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            doc.availability === "On-Duty" || doc.availability === "Consulting"
                              ? "success"
                              : doc.availability === "In-Surgery"
                              ? "warning"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {doc.availability}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-primary">★ {doc.rating}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: ACTIVE NURSES */}
        <TabsContent value="nurses" className="space-y-3 pt-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Deployed Nursing Workforce</span>
                <Badge variant="outline">{dept.activeNursesList.length} Nurses</Badge>
              </CardTitle>
              <CardDescription>
                Staff nurses, leads, and triage specialists active across department nurse stations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nurse Name</TableHead>
                    <TableHead>Assigned Nurse Station</TableHead>
                    <TableHead>Role / Assignment</TableHead>
                    <TableHead>Shift Timing</TableHead>
                    <TableHead>Duty Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dept.activeNursesList.map((nur) => (
                    <TableRow key={nur.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 rounded-full">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {getInitials(nur.name)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-semibold text-xs text-foreground">{nur.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">{nur.station}</TableCell>
                      <TableCell className="text-xs">{nur.role}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{nur.shift}</TableCell>
                      <TableCell>
                        <Badge variant={nur.status === "On-Duty" ? "success" : "secondary"} className="text-[10px]">
                          {nur.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: SUPPORT STAFF */}
        <TabsContent value="support" className="space-y-3 pt-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Support Staff & Orderlies</span>
                <Badge variant="outline">{dept.supportStaffList.length} Staff</Badge>
              </CardTitle>
              <CardDescription>
                Ward assistants, porters, and technical operators allocated to {dept.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Operational Role</TableHead>
                    <TableHead>Task Scope & Responsibilities</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dept.supportStaffList.map((sup) => (
                    <TableRow key={sup.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 rounded-full">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {getInitials(sup.name)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-semibold text-xs text-foreground">{sup.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">{sup.role}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{sup.taskScope}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{sup.shift}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {sup.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: SCOPE & PROTOCOLS */}
        <TabsContent value="scope" className="space-y-3 pt-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Department Operational Scope & Governance</span>
              </CardTitle>
              <CardDescription>
                Authorized medical procedures, bed quotas, equipment readiness, and administrative boundaries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
                <p className="font-semibold text-foreground text-sm">Authorized Clinical Procedures:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                  {dept.scope.clinicalProcedures.map((proc, i) => (
                    <li key={i}>{proc}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-3 space-y-1">
                  <p className="font-semibold text-foreground">Bed Allocation Authority</p>
                  <p className="text-muted-foreground">{dept.scope.bedAllocationRights}</p>
                </div>
                <div className="rounded-lg border border-border p-3 space-y-1">
                  <p className="font-semibold text-foreground">Clinical Supervision Level</p>
                  <p className="text-muted-foreground">{dept.scope.supervisionLevel}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border p-3 space-y-1.5">
                <p className="font-semibold text-foreground">Specialized Equipment in Service</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dept.scope.equipmentReady.map((eq, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {eq}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 space-y-1 text-warning-foreground">
                <p className="font-semibold flex items-center gap-1.5 text-xs text-warning">
                  <ShieldAlert className="h-4 w-4" /> Administrative Delegation Guardrail
                </p>
                <p className="text-xs text-muted-foreground">
                  {dept.scope.delegationLimits}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
