"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, Calendar as CalendarIcon, Clock, Users, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { SurgicalCaseStatus } from "@/store/slices/surgicalSlice";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function SurgicalCasesPage() {
  const { cases, surgeons, otRooms } = useSelector((state: RootState) => state.surgical);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [readinessFilter, setReadinessFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesDepartment = departmentFilter === "ALL" || c.department === departmentFilter;
    const matchesDate = !dateFilter || format(new Date(c.preferredDateTime), "yyyy-MM-dd") === dateFilter;
    
    let matchesReadiness = true;
    if (readinessFilter === "READY") matchesReadiness = c.readinessPercent === 100;
    if (readinessFilter === "BLOCKED") matchesReadiness = c.status === "Blocked";
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesDate && matchesReadiness;
  });

  const getReadinessColor = (percent: number) => {
    if (percent === 100) return "text-green-600 bg-green-50 border-green-200";
    if (percent >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getSurgeonName = (caseData: any) => {
    if (!caseData.assignedSurgeonId) return "Unassigned";
    const surgeon = surgeons.find(s => s.id === caseData.assignedSurgeonId);
    return surgeon ? surgeon.name : caseData.assignedSurgeonId;
  };

  const getOTSlotInfo = (caseData: any) => {
    if (!caseData.allocatedOT) return "Unscheduled";
    const room = otRooms.find(r => r.id === caseData.allocatedOT.roomId);
    const roomName = room ? room.name : caseData.allocatedOT.roomId;
    return `${roomName} (${format(new Date(caseData.allocatedOT.startDateTime), "MMM d, HH:mm")})`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Surgical Cases</h1>
          <p className="text-muted-foreground">Manage pre-op readiness, scheduling, and surgeon assignments.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/ot-scheduling">
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Surgical Control
            </Button>
          </Link>
          <Link href="/surgical-cases/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Directory</CardTitle>
          <CardDescription>View and filter all planned and scheduled surgical cases.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or Patient Name..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Input 
                type="date" 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)} 
                className="w-auto"
              />
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Depts</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="General Surgery">General Surgery</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={readinessFilter} onValueChange={setReadinessFilter}>
                <SelectTrigger className="w-[150px]">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Readiness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any Readiness</SelectItem>
                  <SelectItem value="READY">100% Ready</SelectItem>
                  <SelectItem value="BLOCKED">Has Blockers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Patient / Procedure</TableHead>
                  <TableHead>Surgeon</TableHead>
                  <TableHead>OT Slot</TableHead>
                  <TableHead>Readiness %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{c.patientName}</div>
                        <div className="text-xs text-muted-foreground">{c.procedureType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className={!c.assignedSurgeonId ? "text-muted-foreground italic" : ""}>
                          {getSurgeonName(c)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className={!c.allocatedOT ? "text-muted-foreground italic" : ""}>
                          {getOTSlotInfo(c)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getReadinessColor(c.readinessPercent)}>
                        {c.readinessPercent}%
                      </Badge>
                      {c.status === 'Blocked' && (
                        <Badge variant="destructive" className="ml-2">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Blocker
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={c.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/surgical-cases/${c.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No surgical cases found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
