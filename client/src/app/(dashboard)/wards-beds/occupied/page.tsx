"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  Activity,
  ArrowRightLeft,
  Building2,
  Clock,
  Download,
  Eye,
  Filter,
  HeartPulse,
  MoreHorizontal,
  Search,
  User,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { WardsBedsNav } from "@/components/wards-beds/wards-beds-nav";
import { releaseBed } from "@/store/slices/wardsBedsSlice";
import { Bed } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { filterWardsAndBedsByRole } from "@/lib/wards-beds/station-wards-scope";

export default function OccupiedBedsPage() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { wards, beds } = useSelector((state: RootState) => state.wardsBeds);
  const { currentRole, activeStationId, stations, currentUserName } = useSelector(
    (state: RootState) => state.nursingOperations
  );

  const activeStation = useMemo(() => {
    return stations.find((s) => s.station_id === activeStationId) || stations[0];
  }, [stations, activeStationId]);

  const { isStationScoped, scopedBeds } = useMemo(
    () => filterWardsAndBedsByRole(wards, beds, currentRole, activeStation),
    [wards, beds, currentRole, activeStation]
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const occupiedBeds = useMemo(() => {
    return scopedBeds.filter((b) => {
      const isOcc = b.status === "Occupied";
      const matchesSearch =
        b.bedNumber.toLowerCase().includes(search.toLowerCase()) ||
        b.wardName.toLowerCase().includes(search.toLowerCase()) ||
        (b.currentPatientName && b.currentPatientName.toLowerCase().includes(search.toLowerCase())) ||
        (b.currentPatientId && b.currentPatientId.toLowerCase().includes(search.toLowerCase()));
      return isOcc && matchesSearch;
    });
  }, [scopedBeds, search]);

  const handleDischargePatient = (bed: Bed) => {
    dispatch(
      releaseBed({
        bedId: bed.id,
        releasedBy: isStationScoped
          ? `${currentUserName || "Sister Anita Joseph"} (Station Lead)`
          : "Hospital Admin",
        reason: "Discharged following clinical clearance",
      })
    );

    toast({
      title: "Discharge Initiated",
      description: `${bed.bedNumber} released and auto-transitioned to Cleaning Turnaround.`,
    });
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Occupied Inpatient Beds"
          description="Live patient bed occupancy roster, attending physicians, admission dates, and length of stay."
          crumbs={[{ label: "Clinical Operations" }, { label: "Wards & Beds", href: "/wards-beds" }, { label: "Occupied Beds" }]}
        />
        <WardsBedsNav />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading occupied beds...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="Occupied Inpatient Beds"
        description="Live patient bed occupancy roster, attending physicians, admission dates, and length of stay."
        crumbs={[{ label: "Clinical Operations" }, { label: "Wards & Beds", href: "/wards-beds" }, { label: "Occupied Beds" }]}
      />

      <WardsBedsNav />

      {/* Station Scope Enforced Banner */}
      {isStationScoped && activeStation && (
        <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary shadow-xs">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <span className="font-semibold">Station Scope Active:</span>{" "}
              <span>
                {activeStation.name} • {activeStation.department_name} ({activeStation.location_name}) — Showing only station-assigned department units.
              </span>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary border-primary/30">
            Station Lead Scope
          </Badge>
        </div>
      )}

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Total Inpatients Admitted</span>
          <p className="text-xl font-bold font-mono text-rose-600 mt-0.5">{occupiedBeds.length} Patients</p>
          <span className="text-[10px] text-rose-600 font-medium">Active bed occupancy</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Average Length of Stay</span>
          <p className="text-xl font-bold font-mono text-primary mt-0.5">2.6 Days</p>
          <span className="text-[10px] text-primary font-medium">Hospital-wide benchmark</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Critical Care Admitted</span>
          <p className="text-xl font-bold font-mono text-rose-600 mt-0.5">
            {occupiedBeds.filter((b) => b.tier === "ICU" || b.tier === "CCU").length} Patients
          </p>
          <span className="text-[10px] text-rose-600 font-medium">1:1 / 1:2 Nursing ratio</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Nurse Station Sync</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">Live Roster</p>
          <span className="text-[10px] text-emerald-600 font-medium">Feeds ward consoles</span>
        </Card>
      </div>

      {/* Occupied Beds Table */}
      <Card className="border-border shadow-xs">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold">Active Inpatient Beds Roster</CardTitle>
          <CardDescription className="text-xs">
            Review currently admitted patients, attending doctors, and initiate transfers or discharge clearance.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient, UHID, or bed number..."
                className="pl-8 text-xs h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-bold">Bed #</TableHead>
                  <TableHead className="text-xs font-bold">Admitted Patient</TableHead>
                  <TableHead className="text-xs font-bold">Ward Unit &amp; Floor</TableHead>
                  <TableHead className="text-xs font-bold">Attending Doctor</TableHead>
                  <TableHead className="text-xs font-bold">Admission Date</TableHead>
                  <TableHead className="text-xs font-bold">Length of Stay</TableHead>
                  <TableHead className="text-xs font-bold">Nurse Ratio</TableHead>
                  <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {occupiedBeds.map((bed) => (
                  <TableRow key={bed.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-rose-600">
                      {bed.bedNumber}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-xs text-foreground">{bed.currentPatientName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{bed.currentPatientId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium">{bed.wardName}</div>
                      <div className="text-[10px] text-muted-foreground">{bed.floor} • {bed.tier}</div>
                    </TableCell>
                    <TableCell className="text-xs text-foreground font-medium">
                      {bed.admittingDoctor || "Dr. Ananya Patel"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {bed.admissionDate || "2026-08-20"}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {bed.lengthOfStayDays} Days
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {bed.nurseToPatientRatio || "1:4"}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="outline" asChild className="h-7 text-xs">
                        <Link href="/wards-beds/transfer">
                          <ArrowRightLeft className="h-3.5 w-3.5 mr-1" /> Transfer
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs"
                        onClick={() => handleDischargePatient(bed)}
                      >
                        Discharge &amp; Release
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
