"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building,
  CheckCircle2,
  Filter,
  HeartPulse,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SupportStaffForm } from "@/components/support-staff/SupportStaffForm";
import { supportStaffList as initialStaff } from "@/lib/mock-data/staff";
import { SupportStaff, OtherStaffCategory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

export default function SupportStaffPage() {
  const [mounted, setMounted] = useState(false);
  const [staffList, setStaffList] = useState<SupportStaff[]>(initialStaff);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<SupportStaff | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEdit = (staff: SupportStaff) => {
    setEditingStaff(staff);
    setIsFormOpen(true);
  };

  const handleDeactivate = (staff: SupportStaff) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staff.id ? { ...s, availability: s.availability === "available" ? "off-duty" : "available" } : s
      )
    );
    toast({
      title: "Staff Status Updated",
      description: `${staff.name} status updated.`,
    });
  };

  const handleSaveStaff = (formData: any) => {
    if (editingStaff) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editingStaff.id
            ? {
                ...s,
                name: formData.name,
                category: formData.category,
                role: formData.category,
                department: formData.department,
                assignedVehicleId: formData.assignedVehicleId !== "none" ? formData.assignedVehicleId : undefined,
                driverLicenseNumber: formData.driverLicenseNumber,
              }
            : s
        )
      );
      toast({ title: "Profile Updated", description: `${formData.name} profile updated.` });
    } else {
      const newStaff: SupportStaff = {
        id: `sup_${Date.now().toString().slice(-4)}`,
        name: formData.name,
        email: `${formData.name.toLowerCase().replace(/\s+/g, ".")}@qlyno.health`,
        phone: "+91 98200 00000",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        location: "Hospital Campus",
        role: formData.category,
        category: formData.category,
        department: formData.department,
        taskScope: ["General Shift Duties"],
        assignment: "Assigned Unit",
        availability: "assigned",
        driverLicenseNumber: formData.driverLicenseNumber,
        assignedVehicleId: formData.assignedVehicleId !== "none" ? formData.assignedVehicleId : undefined,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 10}`,
      };
      setStaffList((prev) => [newStaff, ...prev]);
      toast({ title: "Staff Registered", description: `${formData.name} registered under ${formData.category}.` });
    }
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      (s.assignedVehicleId && s.assignedVehicleId.toLowerCase().includes(search.toLowerCase())) ||
      (s.driverLicenseNumber && s.driverLicenseNumber.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (cat: OtherStaffCategory) => staffList.filter((s) => s.category === cat).length;

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Allied &amp; Support Workforce Directory"
          description="Consolidated roster of hospital technicians, housekeeping, security, ambulance drivers, and support personnel."
          crumbs={[{ label: "People & Staff" }, { label: "Other Staff" }]}
        />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading workforce directory...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="Allied &amp; Support Workforce Directory"
        description="Consolidated roster of hospital technicians, housekeeping, security, ambulance drivers, and support personnel."
        crumbs={[{ label: "People & Staff" }, { label: "Other Staff" }]}
        actions={
          <Button
            size="sm"
            className="gap-1.5 font-semibold text-xs"
            onClick={() => {
              setEditingStaff(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Register Staff Member
          </Button>
        }
      />

      {/* Category Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <Card
          className={`p-3 border-border cursor-pointer transition-all ${
            selectedCategory === "Technician" ? "ring-2 ring-primary bg-primary/5" : "bg-card"
          }`}
          onClick={() => setSelectedCategory(selectedCategory === "Technician" ? "all" : "Technician")}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground">Technicians</span>
            <Wrench className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-lg font-bold font-mono text-foreground mt-0.5">{getCategoryCount("Technician")}</p>
          <span className="text-[10px] text-muted-foreground">Lab, Rad, OT</span>
        </Card>

        <Card
          className={`p-3 border-border cursor-pointer transition-all ${
            selectedCategory === "Housekeeping" ? "ring-2 ring-primary bg-primary/5" : "bg-card"
          }`}
          onClick={() => setSelectedCategory(selectedCategory === "Housekeeping" ? "all" : "Housekeeping")}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground">Housekeeping</span>
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <p className="text-lg font-bold font-mono text-foreground mt-0.5">{getCategoryCount("Housekeeping")}</p>
          <span className="text-[10px] text-emerald-600">Sanitation &amp; Bio-waste</span>
        </Card>

        <Card
          className={`p-3 border-border cursor-pointer transition-all ${
            selectedCategory === "Security" ? "ring-2 ring-primary bg-primary/5" : "bg-card"
          }`}
          onClick={() => setSelectedCategory(selectedCategory === "Security" ? "all" : "Security")}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground">Security</span>
            <Shield className="h-3.5 w-3.5 text-rose-600" />
          </div>
          <p className="text-lg font-bold font-mono text-foreground mt-0.5">{getCategoryCount("Security")}</p>
          <span className="text-[10px] text-rose-600">Campus &amp; Triage Gates</span>
        </Card>

        <Card
          className={`p-3 border-border cursor-pointer transition-all ${
            selectedCategory === "Driver" ? "ring-2 ring-primary bg-primary/5" : "bg-card"
          }`}
          onClick={() => setSelectedCategory(selectedCategory === "Driver" ? "all" : "Driver")}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground">Ambulance Drivers</span>
            <Truck className="h-3.5 w-3.5 text-cyan-600" />
          </div>
          <p className="text-lg font-bold font-mono text-foreground mt-0.5">{getCategoryCount("Driver")}</p>
          <span className="text-[10px] text-cyan-600">Ambulance Fleet Linked</span>
        </Card>

        <Card
          className={`p-3 border-border cursor-pointer transition-all ${
            selectedCategory === "Support Staff" ? "ring-2 ring-primary bg-primary/5" : "bg-card"
          }`}
          onClick={() => setSelectedCategory(selectedCategory === "Support Staff" ? "all" : "Support Staff")}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground">Ward Attendants</span>
            <HeartPulse className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <p className="text-lg font-bold font-mono text-foreground mt-0.5">{getCategoryCount("Support Staff")}</p>
          <span className="text-[10px] text-amber-600">Orderlies &amp; Escorts</span>
        </Card>

        <Card
          className={`p-3 border-border cursor-pointer transition-all ${
            selectedCategory === "Other Hospital Staff" ? "ring-2 ring-primary bg-primary/5" : "bg-card"
          }`}
          onClick={() =>
            setSelectedCategory(selectedCategory === "Other Hospital Staff" ? "all" : "Other Hospital Staff")
          }
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground">Other Hospital Staff</span>
            <Building className="h-3.5 w-3.5 text-violet-600" />
          </div>
          <p className="text-lg font-bold font-mono text-foreground mt-0.5">
            {getCategoryCount("Other Hospital Staff")}
          </p>
          <span className="text-[10px] text-violet-600">Admin, IT &amp; Biomed</span>
        </Card>
      </div>

      {/* Main Roster Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="p-4 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold">
              {selectedCategory === "all" ? "Hospital Allied Personnel Directory" : `${selectedCategory} Directory`}
            </CardTitle>
            <CardDescription className="text-xs">
              Showing {filteredStaff.length} personnel. Operational &amp; support scope with live station bindings.
            </CardDescription>
          </div>
          {selectedCategory !== "all" && (
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setSelectedCategory("all")}>
              Reset Category Filter
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff, vehicle ID, or license..."
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
                  <TableHead className="text-xs font-bold">Staff Profile</TableHead>
                  <TableHead className="text-xs font-bold">Category &amp; Role</TableHead>
                  <TableHead className="text-xs font-bold">Department / Assignment</TableHead>
                  <TableHead className="text-xs font-bold">Task Scope / Linked Fleet</TableHead>
                  <TableHead className="text-xs font-bold">Duty Status</TableHead>
                  <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-border">
                          <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                          <AvatarFallback className="text-xs font-bold">{getInitials(staff.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-xs text-foreground">{staff.name}</div>
                          <div className="text-[11px] text-muted-foreground">{staff.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {staff.category || staff.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium">{staff.department}</div>
                      <div className="text-[11px] text-muted-foreground">{staff.assignment}</div>
                    </TableCell>
                    <TableCell>
                      {staff.category === "Driver" ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs font-mono font-bold text-cyan-600">
                            <Truck className="h-3 w-3" />
                            {staff.assignedVehicleId || "Float Pool"}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            License: {staff.driverLicenseNumber || "Verified"}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-muted-foreground">
                          {staff.taskScope?.slice(0, 2).join(", ") || "Standard Operating Tasks"}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {staff.availability === "assigned" || staff.status === "active" ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                          On Duty
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Off Duty
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem onClick={() => handleEdit(staff)}>Edit Duty Role &amp; Unit</DropdownMenuItem>
                          {staff.category === "Driver" && (
                            <DropdownMenuItem asChild>
                              <Link href="/ambulance" className="flex items-center justify-between">
                                Open Ambulance Fleet <ExternalLink className="h-3 w-3 ml-1" />
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDeactivate(staff)} className="text-rose-600">
                            Toggle Active Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SupportStaffForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        staff={editingStaff}
        onSave={handleSaveStaff}
      />
    </div>
  );
}
