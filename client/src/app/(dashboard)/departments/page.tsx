"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Baby,
  Brain,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  HeartPulse,
  Layers,
  MapPin,
  Plus,
  Scissors,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  detailedDepartments,
  DEPARTMENT_CATEGORIES,
  DepartmentCategory,
  DepartmentData,
} from "@/lib/mock-data/departments";
import { cn, getInitials } from "@/lib/utils";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Department Management workflow";

// Category icon helper
function getCategoryIcon(iconName: DepartmentCategory["iconName"], className = "h-5 w-5") {
  switch (iconName) {
    case "Stethoscope":
      return <Stethoscope className={className} />;
    case "Scissors":
      return <Scissors className={className} />;
    case "Baby":
      return <Baby className={className} />;
    case "Eye":
      return <Eye className={className} />;
    case "Brain":
      return <Brain className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    default:
      return <Building2 className={className} />;
  }
}

export default function DepartmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [departmentsList, setDepartmentsList] = useState<DepartmentData[]>(detailedDepartments);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modals
  const [selectedScopeDept, setSelectedScopeDept] = useState<DepartmentData | null>(null);
  const [scopeModalOpen, setScopeModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Create Department Form State
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCategory, setNewDeptCategory] = useState<string>("cat_medicine");
  const [newDeptFloor, setNewDeptFloor] = useState("2nd Floor · Wing A");
  const [newDeptHead, setNewDeptHead] = useState("Dr. Sunita Patel");
  const [newDeptDescription, setNewDeptDescription] = useState("");

  // Active Category Data
  const activeCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return DEPARTMENT_CATEGORIES.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  // Matching Categories for Level 1 Search
  const matchingCategories = useMemo(() => {
    if (!search.trim()) return DEPARTMENT_CATEGORIES;
    const q = search.toLowerCase();
    return DEPARTMENT_CATEGORIES.filter((cat) => {
      const catMatches =
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.shortName.toLowerCase().includes(q);
      const hasMatchingDepts = departmentsList.some(
        (d) =>
          d.categoryId === cat.id &&
          (d.name.toLowerCase().includes(q) ||
            d.description?.toLowerCase().includes(q) ||
            d.headName.toLowerCase().includes(q) ||
            d.type.toLowerCase().includes(q))
      );
      return catMatches || hasMatchingDepts;
    });
  }, [departmentsList, search]);

  // Global search results across all departments when searching on Level 1
  const globalMatchingDepartments = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return departmentsList.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.headName.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.categoryName?.toLowerCase().includes(q)
    );
  }, [departmentsList, search]);

  // Filtered sub-departments under the active category
  const displayedDepartments = useMemo(() => {
    let list = departmentsList;
    if (selectedCategoryId) {
      list = list.filter((d) => d.categoryId === selectedCategoryId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.headName.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q)
      );
    }
    return list;
  }, [departmentsList, selectedCategoryId, search]);

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) {
      toast({ title: "Validation Error", description: "Department name is required.", variant: "destructive" });
      return;
    }

    const cat = DEPARTMENT_CATEGORIES.find((c) => c.id === newDeptCategory) || DEPARTMENT_CATEGORIES[0];
    const newDept: DepartmentData = {
      id: `dep_custom_${Date.now()}`,
      name: newDeptName.trim(),
      type: cat.shortName,
      categoryId: cat.id,
      categoryName: cat.name,
      description: newDeptDescription.trim() || `Specialized clinical outpatient services under ${cat.name}.`,
      location: "Qlyno Multispecialty Hospital - Main Campus",
      floor: newDeptFloor,
      headName: newDeptHead,
      headTitle: `Head of ${newDeptName.trim()}`,
      activePatients: 0,
      bedCapacity: 10,
      occupiedBeds: 0,
      status: "active",
      operatingHours: "08:30 AM – 06:30 PM (Mon–Sat)",
      shiftModel: "General OPD Shifts",
      nurseStations: [`Station ${newDeptName.slice(0, 4).toUpperCase()}-1`],
      scope: {
        clinicalProcedures: ["Specialist Clinical Consultations", "Diagnostic Evaluations", "Outpatient Follow-ups"],
        bedAllocationRights: "Day-care consultation and observation rooms",
        equipmentReady: ["Vital Sign Monitors", "Diagnostic Console", "Mobile Emergency Cart"],
        supervisionLevel: "Attending Consultant Level",
        delegationLimits: "Hospital Admin coordinates token queues, nurse assignment, and scheduling.",
      },
      activePatientsList: [],
      activeDoctorsList: [{ id: `doc_${Date.now()}`, name: newDeptHead, specialty: newDeptName.trim(), qualification: "MBBS, MD", experience: "10 yrs", availability: "Consulting", rating: 4.8 }],
      activeNursesList: [{ id: `nur_${Date.now()}`, name: "Staff Nurse Lead", station: "Station 1", role: "Specialty Nurse", shift: "Morning", status: "On-Duty" }],
      supportStaffList: [{ id: `sup_${Date.now()}`, name: "Clinic Coordinator", role: "Assistant", taskScope: "General support", shift: "Morning", status: "Active" }],
    };

    setDepartmentsList((prev) => [newDept, ...prev]);
    setCreateModalOpen(false);
    setNewDeptName("");
    setNewDeptDescription("");
    toast({
      title: "Department Created Successfully",
      description: `${newDept.name} added under ${cat.name}.`,
    });
  };

  const handleScopeClick = (e: React.MouseEvent, dept: DepartmentData) => {
    e.stopPropagation();
    setSelectedScopeDept(dept);
    setScopeModalOpen(true);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      {/* Level 1 / Level 2 Page Header with dynamic breadcrumbs */}
      <PageHeader
        title={
          selectedCategoryId && activeCategory
            ? activeCategory.name
            : "Hospital Clinical Departments"
        }
        description={
          selectedCategoryId && activeCategory
            ? activeCategory.description
            : "Categorized clinical outpatient departments, specialized consultation suites & multidisciplinary care units."
        }
        crumbs={
          selectedCategoryId && activeCategory
            ? [
                { label: "Clinical Services" },
                { label: "Departments", href: "/departments" },
                { label: activeCategory.shortName },
              ]
            : [{ label: "Clinical Services" }, { label: "Departments" }]
        }
        actions={
          <div className="flex items-center gap-2">
            {selectedCategoryId && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-semibold"
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSearch("");
                }}
              >
                <ArrowLeft className="h-4 w-4" /> All Categories
              </Button>
            )}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 font-semibold">
                  <Plus className="h-4 w-4" /> Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Clinical Department</DialogTitle>
                  <DialogDescription>
                    Configure a new clinical department and assign to a clinical category.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateDepartment} className="space-y-3.5 py-2">
                  <div className="space-y-1.5">
                    <Label>Department Name</Label>
                    <Input
                      placeholder="e.g. Pediatric Cardiology"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Clinical Category</Label>
                    <Select value={newDeptCategory} onValueChange={setNewDeptCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENT_CATEGORIES.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Clinical Function / Description</Label>
                    <Input
                      placeholder="e.g. Consultations for congenital and pediatric heart defects"
                      value={newDeptDescription}
                      onChange={(e) => setNewDeptDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Floor / Location</Label>
                      <Input
                        value={newDeptFloor}
                        onChange={(e) => setNewDeptFloor(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Head of Department</Label>
                      <Input
                        value={newDeptHead}
                        onChange={(e) => setNewDeptHead(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter className="pt-2">
                    <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Department</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Categories</span>
          <p className="text-xl font-bold font-mono text-primary mt-0.5">{DEPARTMENT_CATEGORIES.length} Divisions</p>
          <span className="text-[10px] text-muted-foreground">Standard OPD Structure</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Clinical Departments</span>
          <p className="text-xl font-bold font-mono text-foreground mt-0.5">{departmentsList.length} Active</p>
          <span className="text-[10px] text-emerald-600 font-medium">100% Operational</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Consulting Doctors</span>
          <p className="text-xl font-bold font-mono text-foreground mt-0.5">84+ Specialists</p>
          <span className="text-[10px] text-muted-foreground">On-Duty &amp; Consulting</span>
        </Card>
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Daily OPD Capacity</span>
          <p className="text-xl font-bold font-mono text-foreground mt-0.5">650+ Patients</p>
          <span className="text-[10px] text-primary font-medium">Across all suites</span>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* LEVEL 1: DEPARTMENT CATEGORIES CARDS VIEW                                 */}
      {/* ========================================================================= */}
      {!selectedCategoryId && (
        <div className="space-y-4">
          {/* Section Heading & Search Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" /> Hospital Clinical Divisions
              </h2>
              <p className="text-xs text-muted-foreground">
                Select a category below to explore its active outpatient departments, consulting clinics &amp; specialized suites.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search department, specialty, doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-background"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-2 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* If Search is Active: Show Direct Matching Departments Section */}
          {search.trim() !== "" && (
            <div className="space-y-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-primary" /> Search Results ({globalMatchingDepartments.length} matching departments)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-primary p-0"
                  onClick={() => setSearch("")}
                >
                  Reset Search
                </Button>
              </div>

              {globalMatchingDepartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {globalMatchingDepartments.map((dept) => (
                    <Card
                      key={dept.id}
                      onClick={() => router.push(`/departments/${dept.id}`)}
                      className="p-3.5 border-border bg-card hover:border-primary/50 transition-all cursor-pointer group shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {dept.name}
                          </strong>
                          <Badge variant="outline" className="text-[9px] py-0">
                            {dept.categoryName?.split(" ")[0]}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                          {dept.description}
                        </p>
                      </div>
                      <div className="pt-2 mt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                        <span>{dept.headName}</span>
                        <span className="text-primary font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          View Console →
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-2">
                  No specific department matching &quot;{search}&quot;. Try checking the category divisions below.
                </p>
              )}
            </div>
          )}

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingCategories.map((category) => {
              const catDepts = departmentsList.filter((d) => d.categoryId === category.id);
              const matchingInCat = search.trim()
                ? catDepts.filter(
                    (d) =>
                      d.name.toLowerCase().includes(search.toLowerCase()) ||
                      d.description?.toLowerCase().includes(search.toLowerCase()) ||
                      d.headName.toLowerCase().includes(search.toLowerCase())
                  ).length
                : catDepts.length;
              const totalPatients = catDepts.reduce((acc, d) => acc + d.activePatients, 0);

              return (
                <Card
                  key={category.id}
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                  }}
                  className="border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between overflow-hidden relative"
                >
                  <div className={cn("h-1.5 w-full bg-linear-to-r", category.gradient)} />
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className={cn("p-2.5 rounded-xl border flex items-center justify-center shadow-xs", category.themeColor)}>
                        {getCategoryIcon(category.iconName, "h-6 w-6")}
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs font-bold px-2 py-0.5">
                        {search.trim() ? `${matchingInCat} matching` : `${catDepts.length} Departments`}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors mt-3">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
                      {category.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-3">
                    {/* Sub-departments pill preview */}
                    <div className="pt-2 border-t border-border/60">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1.5">
                        Key Specialties:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {catDepts.slice(0, 4).map((d) => (
                          <span
                            key={d.id}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground font-medium truncate max-w-[140px]"
                          >
                            {d.name.split("/")[0].trim()}
                          </span>
                        ))}
                        {catDepts.length > 4 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold">
                            +{catDepts.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Users className="h-3.5 w-3.5 text-primary" /> {totalPatients} Active Consultations
                      </span>
                      <span className="text-primary font-semibold flex items-center gap-1 text-xs group-hover:translate-x-0.5 transition-transform">
                        Explore Departments <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {matchingCategories.length === 0 && (
            <Card className="p-8 text-center border-dashed">
              <p className="text-sm font-semibold text-foreground">No categories or departments matched &quot;{search}&quot;</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different keyword like Medicine, Surgery, Pediatric, Eye, etc.</p>
              <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => setSearch("")}>
                Reset Search
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 2: DRILL-DOWN CATEGORY SUB-DEPARTMENTS VIEW                         */}
      {/* ========================================================================= */}
      {selectedCategoryId && activeCategory && (
        <div className="space-y-4">
          {/* Category Switcher Pill Tabs Bar */}
          <div className="p-1.5 bg-muted/40 rounded-xl border border-border/80 flex items-center gap-1.5 overflow-x-auto">
            <Button
              variant={selectedCategoryId === null ? "default" : "ghost"}
              size="sm"
              className="h-8 text-xs font-semibold whitespace-nowrap shrink-0"
              onClick={() => {
                setSelectedCategoryId(null);
                setSearch("");
              }}
            >
              <Building2 className="h-3.5 w-3.5 mr-1.5" /> All Categories
            </Button>
            <div className="h-4 w-px bg-border shrink-0" />
            {DEPARTMENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setSearch("");
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0",
                  selectedCategoryId === cat.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {getCategoryIcon(cat.iconName, "h-3.5 w-3.5")}
                <span>{cat.shortName}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold",
                    selectedCategoryId === cat.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {departmentsList.filter((d) => d.categoryId === cat.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Active Category Banner */}
          <Card className="border-border bg-card shadow-xs overflow-hidden">
            <div className={cn("h-1 w-full bg-linear-to-r", activeCategory.gradient)} />
            <CardHeader className="p-4 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-xl border", activeCategory.themeColor)}>
                  {getCategoryIcon(activeCategory.iconName, "h-6 w-6")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold text-foreground">{activeCategory.name}</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs text-primary font-bold">
                      {displayedDepartments.length} Departments
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    {activeCategory.description}
                  </CardDescription>
                </div>
              </div>

              {/* Search Bar within Category */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={`Search in ${activeCategory.shortName}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background"
                />
              </div>
            </CardHeader>
          </Card>

          {/* Sub-Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedDepartments.map((dept) => (
              <Card
                key={dept.id}
                onClick={() => router.push(`/departments/${dept.id}`)}
                className="border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <CardHeader className="p-4 pb-2.5 border-b border-border/70">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {dept.name}
                      </CardTitle>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-primary" /> {dept.floor}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold shrink-0">
                      {dept.type}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  {/* Clinical Description / Function */}
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-0.5">
                      Clinical Scope &amp; OPD Role:
                    </span>
                    <p className="text-foreground leading-relaxed text-[11px]">
                      {dept.description || "Outpatient specialist consults, triage diagnostics & care coordination."}
                    </p>
                  </div>

                  {/* Physician & Operational Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                            {getInitials(dept.headName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <strong className="text-foreground text-[11px] block">{dept.headName}</strong>
                          <span className="text-[10px] text-muted-foreground">{dept.headTitle}</span>
                        </div>
                      </div>
                      <StatusBadge status={dept.status} />
                    </div>

                    <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground font-mono">
                      <div>
                        <span>Doctors: </span>
                        <strong className="text-foreground">{dept.activeDoctorsList.length || 2} On-Duty</strong>
                      </div>
                      <div>
                        <span>Queue: </span>
                        <strong className="text-primary">{dept.activePatients} Patients</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-border/80 flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[11px] text-muted-foreground hover:text-foreground px-2"
                      onClick={(e) => handleScopeClick(e, dept)}
                    >
                      <Shield className="h-3 w-3 mr-1" /> Clinical Scope
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs font-semibold group-hover:bg-primary"
                    >
                      Open Console <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {displayedDepartments.length === 0 && (
            <Card className="p-8 text-center border-dashed">
              <p className="text-sm font-semibold text-foreground">No departments match your search</p>
              <p className="text-xs text-muted-foreground mt-1">Try clearing your search query to see all departments under {activeCategory.shortName}.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CLINICAL SCOPE & DELEGATION LIMITS                                 */}
      {/* ========================================================================= */}
      <Dialog open={scopeModalOpen} onOpenChange={setScopeModalOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Clinical Scope &amp; Delegation Boundaries
            </DialogTitle>
            <DialogDescription>
              {selectedScopeDept?.name} ({selectedScopeDept?.categoryName || "Specialist Department"})
            </DialogDescription>
          </DialogHeader>
          {selectedScopeDept && (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="p-2.5 rounded bg-muted/40 border border-border/80">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Clinical Role</span>
                <p className="text-foreground font-medium mt-0.5">{selectedScopeDept.description}</p>
              </div>

              <div className="space-y-1.5">
                <strong className="text-foreground block">Key Clinical Procedures:</strong>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                  {selectedScopeDept.scope.clinicalProcedures.map((proc, i) => (
                    <li key={i}>{proc}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded bg-muted/20 border border-border space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Supervision Level</span>
                  <p className="text-foreground font-semibold">{selectedScopeDept.scope.supervisionLevel}</p>
                </div>
                <div className="p-2.5 rounded bg-muted/20 border border-border space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Bed &amp; Room Rights</span>
                  <p className="text-foreground font-semibold">{selectedScopeDept.scope.bedAllocationRights}</p>
                </div>
              </div>

              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-200">
                <strong className="block font-semibold mb-0.5">Delegation Boundary:</strong>
                <p className="text-[11px] leading-relaxed">{selectedScopeDept.scope.delegationLimits}</p>
              </div>

              <div className="text-[10px] font-mono text-muted-foreground text-center border-t border-border/60 pt-2">
                {DELEGATION_STRING}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setScopeModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
