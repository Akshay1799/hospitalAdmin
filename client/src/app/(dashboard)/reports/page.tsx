"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CalendarClock,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Gauge,
  HelpCircle,
  Layers,
  LineChart as LineChartIcon,
  Lock,
  Mail,
  PieChart as PieChartIcon,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { jsPDF } from "jspdf";
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
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { EmptyState } from "@/components/shared/empty-state";
import {
  mockHospitalReports,
  mockScheduledReports,
} from "@/lib/mock-data/reports-analytics";
import {
  HospitalReportDefinition,
  ScheduledReportConfig,
  HospitalReportCategory,
  ReportSensitivityLevel,
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn, formatDateTime, formatDate, formatCurrency } from "@/lib/utils";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Reports & Operational Analytics suite";

const REPORT_CATEGORIES: Array<{ id: string; label: string; icon: any }> = [
  { id: "all", label: "All Categories (12)", icon: Layers },
  { id: "Patient Flow", label: "Patient Flow", icon: Activity },
  { id: "Bed/Ward", label: "Bed / Ward", icon: Building2 },
  { id: "Doctors", label: "Doctors", icon: Stethoscope },
  { id: "Nursing", label: "Nursing", icon: Users },
  { id: "Reception", label: "Reception", icon: CalendarClock },
  { id: "Surgery", label: "Surgery & OT", icon: Zap },
  { id: "Diagnostics", label: "Diagnostics", icon: Activity },
  { id: "Pharmacy", label: "Pharmacy", icon: ShieldCheck },
  { id: "Finance", label: "Finance & Ledger", icon: Wallet },
  { id: "Vendor", label: "Vendors & Supply", icon: FileSpreadsheet },
  { id: "Emergency", label: "Emergency SOS", icon: Flame },
  { id: "Security", label: "Security & Audits", icon: ShieldAlert },
];

export default function ReportsAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"catalog" | "builder" | "schedules" | "governance">("catalog");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Active Report Inspection
  const [activeReport, setActiveReport] = useState<HospitalReportDefinition>(mockHospitalReports[0]);
  const [dateRange, setDateRange] = useState("Current Month");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedBranch, setSelectedBranch] = useState("Main Campus (Mumbai)");

  // Scheduled Reports State
  const [scheduledReports, setScheduledReports] = useState<ScheduledReportConfig[]>(mockScheduledReports);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedReportId, setSchedReportId] = useState(mockHospitalReports[0].id);
  const [schedFrequency, setSchedFrequency] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
  const [schedTime, setSchedTime] = useState("08:00");
  const [schedFormat, setSchedFormat] = useState<"PDF" | "CSV" | "Excel">("PDF");
  const [schedRecipient, setSchedRecipient] = useState("admin@qlyno.health, medical.superintendent@qlyno.health");

  // Custom Report Builder State
  const [builderCategory, setBuilderCategory] = useState<string>("Patient Flow");
  const [builderDimension, setBuilderDimension] = useState<string>("Department / Specialty");
  const [builderPrimaryMetric, setBuilderPrimaryMetric] = useState<string>("Volume Footfall");
  const [builderChartType, setBuilderChartType] = useState<"bar" | "line" | "area">("bar");
  const [builderPreviewReady, setBuilderPreviewReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtered Catalog
  const filteredReports = useMemo(() => {
    return mockHospitalReports.filter((r) => {
      const matchCat = selectedCategory === "all" || r.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // CSV Export Generator
  const handleExportCSV = (report: HospitalReportDefinition) => {
    if (!report.tableData || report.tableData.length === 0) {
      toast({ title: "No Data", description: "No tabular data to export." });
      return;
    }

    const headers = report.tableColumns.map((c) => c.label).join(",");
    const rows = report.tableData.map((row) =>
      report.tableColumns
        .map((c) => {
          const val = row[c.key] ?? "";
          return typeof val === "string" && val.includes(",") ? `"${val}"` : val;
        })
        .join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${report.code}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Report Downloaded",
      description: `${report.title} exported as CSV. (${DELEGATION_STRING})`,
    });
  };

  // PDF Export Generator
  const handleExportPDF = (report: HospitalReportDefinition) => {
    const doc = new jsPDF();

    // Header Letterhead
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(13, 148, 136); // Primary teal
    doc.text("QLYNO MULTISPECIALTY HOSPITAL & RESEARCH CENTRE", 15, 20);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("NABH & NABL Accredited Facility • Hospital Operational & Governance Analytics", 15, 26);
    doc.text(`Report Code: ${report.code} | Generated on: ${new Date().toLocaleString()} | Period: ${dateRange}`, 15, 31);

    doc.setDrawColor(203, 213, 225);
    doc.line(15, 35, 195, 35);

    // Title & Description
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(report.title.toUpperCase(), 15, 43);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(report.description, 180);
    doc.text(splitDesc, 15, 49);

    let y = 58;

    // KPI Metrics Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("EXECUTIVE KEY PERFORMANCE INDICATORS (KPIs):", 15, y);
    y += 6;

    report.kpis.forEach((kpi, idx) => {
      const colX = 15 + (idx % 2) * 90;
      const rowY = y + Math.floor(idx / 2) * 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`${kpi.label}:`, colX, rowY);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(13, 148, 136);
      doc.text(`${kpi.value} (${kpi.delta || ""})`, colX, rowY + 4);
    });

    y += Math.ceil(report.kpis.length / 2) * 12 + 6;

    // Tabular Breakdown Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("OPERATIONAL DATASET BREAKDOWN:", 15, y);
    y += 5;

    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, 180, 7, "F");

    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const colStep = 180 / Math.min(report.tableColumns.length, 5);
    report.tableColumns.slice(0, 5).forEach((col, i) => {
      doc.text(col.label, 17 + i * colStep, y + 5);
    });

    y += 8;
    doc.setFont("helvetica", "normal");

    report.tableData.slice(0, 10).forEach((row) => {
      report.tableColumns.slice(0, 5).forEach((col, i) => {
        doc.text(String(row[col.key] ?? ""), 17 + i * colStep, y + 4);
      });
      y += 6;
    });

    // Governance Footer
    y = 275;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y, 195, y);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("CONFIDENTIAL HOSPITAL GOVERNANCE REPORT — PRD SECTION 17 STANDARDS", 15, y + 5);
    doc.text("Generated by Hospital Administration • Unauthorized distribution prohibited", 15, y + 9);

    doc.save(`${report.code}_${new Date().toISOString().split("T")[0]}.pdf`);

    toast({
      title: "PDF Report Generated",
      description: `${report.title} exported as PDF. (${DELEGATION_STRING})`,
    });
  };

  // Schedule Toggling
  const handleToggleSchedule = (id: string) => {
    setScheduledReports((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    toast({
      title: "Schedule Updated",
      description: "Automated recurring report delivery state modified.",
    });
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const targetReport = mockHospitalReports.find((r) => r.id === schedReportId);
    if (!targetReport) return;

    const newSched: ScheduledReportConfig = {
      id: `sch_${Date.now()}`,
      reportId: targetReport.id,
      reportTitle: targetReport.title,
      category: targetReport.category,
      frequency: schedFrequency,
      deliveryTime: schedTime,
      format: schedFormat,
      recipients: schedRecipient.split(",").map((s) => s.trim()),
      enabled: true,
      nextRunAt: new Date(Date.now() + 86400000).toISOString(),
    };

    setScheduledReports((prev) => [...prev, newSched]);
    toast({
      title: "Report Scheduled Successfully",
      description: `${targetReport.title} scheduled for ${schedFrequency} delivery. (${DELEGATION_STRING})`,
    });
    setScheduleModalOpen(false);
  };

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Hospital Reports &amp; Analytics Hub"
          description="Hospital-wide operational, clinical, financial, and workforce reporting engine scoped by permission."
          crumbs={[{ label: "Finance & Admin" }, { label: "Reports" }]}
        />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading reporting catalog...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      {/* Page Header */}
      <PageHeader
        title="Hospital Reports &amp; Analytics Hub"
        description="Hospital-wide operational, clinical, financial, and workforce reporting engine scoped by permission."
        crumbs={[{ label: "Finance & Admin" }, { label: "Reports" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-semibold gap-1.5"
              asChild
            >
              <Link href="/analytics">
                <BarChart3 className="h-3.5 w-3.5 text-primary" /> Strategic Analytics
              </Link>
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground"
              onClick={() => setScheduleModalOpen(true)}
            >
              <CalendarClock className="h-3.5 w-3.5" /> + Schedule Report
            </Button>
          </div>
        }
      />

      {/* Scope Indicator & Delegation Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Operational &amp; Financial Reporting Engine" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>PRD Section 17 &amp; 15 • Hospital-wide reporting subject to sensitive-data permissions and data-minimization</span>
        </div>
      </div>

      {/* Executive KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Standard Report Suite</span>
          <p className="text-xl font-bold font-mono text-primary mt-0.5">12 Categories</p>
          <span className="text-[10px] text-muted-foreground">100% PRD Aligned</span>
        </Card>

        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Automated Schedules</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">
            {scheduledReports.filter((s) => s.enabled).length} Active
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Daily &amp; Weekly Auto-Send</span>
        </Card>

        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Sensitive Datasets Gated</span>
          <p className="text-xl font-bold font-mono text-cyan-600 mt-0.5">3 Restricted</p>
          <span className="text-[10px] text-cyan-600 font-medium">Finance, Security &amp; Surgery</span>
        </Card>

        <Card className="p-3.5 border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground uppercase font-bold">Reports Exported (MTD)</span>
          <p className="text-xl font-bold font-mono text-foreground mt-0.5">482 Generated</p>
          <span className="text-[10px] text-muted-foreground">CSV &amp; Signed PDF</span>
        </Card>
      </div>

      {/* 4 Main Consoles */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 max-w-2xl">
          <TabsTrigger value="catalog" className="text-xs font-semibold flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" /> Report Catalog &amp; Viewer
          </TabsTrigger>
          <TabsTrigger value="builder" className="text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-600" /> Custom Builder
          </TabsTrigger>
          <TabsTrigger value="schedules" className="text-xs font-semibold flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5 text-amber-600" /> Scheduled Deliveries
          </TabsTrigger>
          <TabsTrigger value="governance" className="text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Data Governance
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* TAB 1: REPORT CATALOG & INTERACTIVE VIEWER                     */}
        {/* ============================================================== */}
        <TabsContent value="catalog" className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-muted/20 border border-border rounded-xl">
            {REPORT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 text-xs font-medium gap-1.5",
                    isActive && "bg-primary text-primary-foreground font-semibold"
                  )}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <Icon className="h-3 w-3" /> {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Search and Selection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Report List Selector */}
            <div className="space-y-2 lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search 12 PRD reports..."
                  className="pl-8 text-xs h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {filteredReports.map((report) => {
                  const isSelected = activeReport.id === report.id;
                  return (
                    <Card
                      key={report.id}
                      onClick={() => setActiveReport(report)}
                      className={cn(
                        "p-3 cursor-pointer transition-all border text-xs",
                        isSelected
                          ? "border-primary bg-primary/[0.04] shadow-xs"
                          : "border-border hover:border-primary/40 bg-card"
                      )}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-foreground line-clamp-1">{report.title}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[8px] font-mono px-1 py-0 h-4 shrink-0",
                            report.sensitivity === "Confidential Financial"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                              : report.sensitivity === "Restricted Security"
                              ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30"
                              : "text-muted-foreground"
                          )}
                        >
                          {report.code}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                        {report.description}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/40 text-[10px]">
                        <span className="font-medium text-primary">{report.category}</span>
                        <span className="text-muted-foreground">{report.sensitivity}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right: Active Report Viewer Console */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-border shadow-xs">
                {/* Report Header & Filter Bar */}
                <CardHeader className="p-4 pb-3 border-b border-border/60 bg-muted/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-bold text-foreground">
                          {activeReport.title}
                        </CardTitle>
                        <Badge
                          className={cn(
                            "text-[9px] px-1.5 py-0 h-4 font-mono",
                            activeReport.sensitivity === "Confidential Financial"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                              : activeReport.sensitivity === "Restricted Security"
                              ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
                              : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                          )}
                        >
                          {activeReport.sensitivity}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs mt-0.5">
                        {activeReport.description}
                      </CardDescription>
                    </div>

                    {/* Export Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-semibold gap-1"
                        onClick={() => handleExportCSV(activeReport)}
                      >
                        <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Export CSV
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 text-xs font-semibold bg-primary text-primary-foreground gap-1"
                        onClick={() => handleExportPDF(activeReport)}
                      >
                        <Download className="h-3.5 w-3.5" /> Export PDF
                      </Button>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Reporting Period</Label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Today">Today (Live Stream)</SelectItem>
                          <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                          <SelectItem value="Current Month">Current Month (MTD)</SelectItem>
                          <SelectItem value="Last 90 Days">Last 90 Days (Quarterly)</SelectItem>
                          <SelectItem value="Year to Date">Year to Date (YTD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[10px] text-muted-foreground">Department / Specialty</Label>
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Departments">All Departments</SelectItem>
                          <SelectItem value="Emergency & Trauma">Emergency &amp; Trauma</SelectItem>
                          <SelectItem value="Operation Theatres">Operation Theatres</SelectItem>
                          <SelectItem value="Critical Care / ICU">Critical Care / ICU</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Central Pharmacy">Central Pharmacy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[10px] text-muted-foreground">Facility / Location</Label>
                      <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Main Campus (Mumbai)">Main Campus (Mumbai)</SelectItem>
                          <SelectItem value="South Wing Specialty">South Wing Specialty</SelectItem>
                          <SelectItem value="Day Care Center">Day Care Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                  {/* KPI Mini-Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {activeReport.kpis.map((kpi, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-border bg-card shadow-xs">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block truncate">
                          {kpi.label}
                        </span>
                        <p className="text-base font-bold font-mono text-primary mt-0.5">{kpi.value}</p>
                        {kpi.delta && (
                          <span
                            className={cn(
                              "text-[10px] font-medium block truncate",
                              kpi.isPositive ? "text-emerald-600" : "text-amber-600"
                            )}
                          >
                            {kpi.delta}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Visualizer Chart */}
                  <div className="p-3 rounded-xl border border-border bg-muted/10 space-y-2">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <LineChartIcon className="h-3.5 w-3.5 text-primary" /> Visual Analytics &amp; Trend Distribution
                    </span>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {activeReport.chartType === "bar" ? (
                          <BarChart data={activeReport.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={11} />
                            <YAxis tickLine={false} axisLine={false} fontSize={11} />
                            <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                            {activeReport.chartKeys.map((k) => (
                              <Bar key={k.dataKey} dataKey={k.dataKey} name={k.name} fill={k.color} radius={[4, 4, 0, 0]} />
                            ))}
                          </BarChart>
                        ) : activeReport.chartType === "area" ? (
                          <AreaChart data={activeReport.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={11} />
                            <YAxis tickLine={false} axisLine={false} fontSize={11} />
                            <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                            {activeReport.chartKeys.map((k) => (
                              <Area
                                key={k.dataKey}
                                type="monotone"
                                dataKey={k.dataKey}
                                name={k.name}
                                stroke={k.color}
                                fill={k.color}
                                fillOpacity={0.2}
                              />
                            ))}
                          </AreaChart>
                        ) : activeReport.chartType === "composed" ? (
                          <ComposedChart data={activeReport.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={11} />
                            <YAxis tickLine={false} axisLine={false} fontSize={11} />
                            <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                            {activeReport.chartKeys.map((k) =>
                              k.type === "line" ? (
                                <Line key={k.dataKey} type="monotone" dataKey={k.dataKey} name={k.name} stroke={k.color} strokeWidth={2.5} />
                              ) : (
                                <Bar key={k.dataKey} dataKey={k.dataKey} name={k.name} fill={k.color} radius={[4, 4, 0, 0]} />
                              )
                            )}
                          </ComposedChart>
                        ) : (
                          <LineChart data={activeReport.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={11} />
                            <YAxis tickLine={false} axisLine={false} fontSize={11} />
                            <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                            {activeReport.chartKeys.map((k) => (
                              <Line key={k.dataKey} type="monotone" dataKey={k.dataKey} name={k.name} stroke={k.color} strokeWidth={2.5} />
                            ))}
                          </LineChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Tabular Dataset Breakdown */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground">Operational Data Registry</span>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40">
                            {activeReport.tableColumns.map((col) => (
                              <TableHead
                                key={col.key}
                                className={cn(
                                  "text-xs font-bold",
                                  col.isNumeric && "text-right"
                                )}
                              >
                                {col.label}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeReport.tableData.map((row, idx) => (
                            <TableRow key={idx} className="hover:bg-muted/30 transition-colors text-xs">
                              {activeReport.tableColumns.map((col) => (
                                <TableCell
                                  key={col.key}
                                  className={cn(
                                    col.isNumeric && "text-right font-mono"
                                  )}
                                >
                                  {col.isBadge ? (
                                    <Badge variant="secondary" className="text-[9px]">
                                      {row[col.key]}
                                    </Badge>
                                  ) : (
                                    row[col.key]
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 2: CUSTOM / AD-HOC REPORT BUILDER                          */}
        {/* ============================================================== */}
        <TabsContent value="builder" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-600" /> Ad-Hoc Report &amp; Metric Cross-Tabulation Builder
              </CardTitle>
              <CardDescription className="text-xs">
                Select clinical/operational domains, dimensions, metric aggregations, and generate immediate customizable data exports.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/20 border border-border">
                <div>
                  <Label className="text-xs">1. Report Domain</Label>
                  <Select value={builderCategory} onValueChange={setBuilderCategory}>
                    <SelectTrigger className="h-9 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Patient Flow">Patient Flow &amp; Queues</SelectItem>
                      <SelectItem value="Bed/Ward">Bed Occupancy &amp; ALOS</SelectItem>
                      <SelectItem value="Surgery">OT Surgeries &amp; Turnaround</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy Stock &amp; Dispensing</SelectItem>
                      <SelectItem value="Finance">Financial Collections</SelectItem>
                      <SelectItem value="Emergency">Emergency SOS Activations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">2. Primary Dimension</Label>
                  <Select value={builderDimension} onValueChange={setBuilderDimension}>
                    <SelectTrigger className="h-9 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Department / Specialty">Department / Specialty</SelectItem>
                      <SelectItem value="Doctor / Surgeon">Doctor / Surgeon</SelectItem>
                      <SelectItem value="Shift / Floor Station">Shift / Floor Station</SelectItem>
                      <SelectItem value="Ward / Bed Category">Ward / Bed Category</SelectItem>
                      <SelectItem value="Payment Method / TPA">Payment Method / TPA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">3. Primary Metric</Label>
                  <Select value={builderPrimaryMetric} onValueChange={setBuilderPrimaryMetric}>
                    <SelectTrigger className="h-9 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Volume Footfall">Volume Footfall / Total Cases</SelectItem>
                      <SelectItem value="Mean Turnaround Time (TAT)">Mean Turnaround Time (TAT)</SelectItem>
                      <SelectItem value="Utilization Percentage">Utilization Percentage (%)</SelectItem>
                      <SelectItem value="Revenue Realization (₹)">Revenue Realization (₹)</SelectItem>
                      <SelectItem value="SLA Adherence Rate">SLA Adherence Rate (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">4. Visualization Type</Label>
                  <Select value={builderChartType} onValueChange={(v: any) => setBuilderChartType(v)}>
                    <SelectTrigger className="h-9 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Trend Chart</SelectItem>
                      <SelectItem value="area">Area Volume Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground font-semibold text-xs gap-1.5"
                  onClick={() => {
                    setBuilderPreviewReady(true);
                    toast({
                      title: "Ad-Hoc Report Generated",
                      description: `Generated cross-tabulation of ${builderPrimaryMetric} by ${builderDimension}.`,
                    });
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" /> Generate Ad-Hoc Report
                </Button>
              </div>

              {builderPreviewReady && (
                <div className="p-4 rounded-xl border border-primary/30 bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-foreground">
                        Ad-Hoc Report: {builderPrimaryMetric} across {builderDimension}
                      </span>
                      <p className="text-[11px] text-muted-foreground">Domain: {builderCategory} • Filter: Current Month</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-semibold gap-1"
                      onClick={() => handleExportPDF(mockHospitalReports[0])}
                    >
                      <Download className="h-3.5 w-3.5" /> Export Result
                    </Button>
                  </div>

                  <div className="h-60 w-full bg-muted/10 p-3 rounded-lg border border-border">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { dimension: "Emergency & Critical", metricVal: 380 },
                          { dimension: "Cardiology", metricVal: 290 },
                          { dimension: "Surgical OT", metricVal: 240 },
                          { dimension: "Orthopaedics", metricVal: 210 },
                          { dimension: "General Medicine", metricVal: 340 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="dimension" tickLine={false} axisLine={false} fontSize={11} />
                        <YAxis tickLine={false} axisLine={false} fontSize={11} />
                        <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="metricVal" name={builderPrimaryMetric} fill="#0d9488" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 3: SCHEDULED REPORTS MANAGER                               */}
        {/* ============================================================== */}
        <TabsContent value="schedules" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-amber-600" /> Automated Scheduled Report Deliveries
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure recurring PDF/CSV report dispatches to executive stakeholders and departmental heads.
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="h-8 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground shrink-0"
                onClick={() => setScheduleModalOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" /> + Schedule Report
              </Button>
            </CardHeader>

            <CardContent className="p-4 pt-2 space-y-4">
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold w-[240px]">Report Title &amp; Category</TableHead>
                      <TableHead className="text-xs font-bold w-[110px]">Frequency</TableHead>
                      <TableHead className="text-xs font-bold w-[90px]">Format</TableHead>
                      <TableHead className="text-xs font-bold w-[260px]">Recipient Email List</TableHead>
                      <TableHead className="text-xs font-bold w-[130px]">Next Run Time</TableHead>
                      <TableHead className="text-xs font-bold text-right w-[80px]">Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledReports.map((sched) => (
                      <TableRow key={sched.id} className="hover:bg-muted/30 transition-colors text-xs">
                        <TableCell className="align-top">
                          <div className="font-semibold text-foreground">{sched.reportTitle}</div>
                          <Badge variant="outline" className="text-[8px] font-mono mt-0.5">
                            {sched.category}
                          </Badge>
                        </TableCell>

                        <TableCell className="align-top">
                          <Badge className="bg-primary/10 text-primary border-primary/30 text-[9px]">
                            {sched.frequency} @ {sched.deliveryTime}
                          </Badge>
                        </TableCell>

                        <TableCell className="align-top">
                          <Badge variant="secondary" className="text-[9px] font-mono">
                            {sched.format}
                          </Badge>
                        </TableCell>

                        <TableCell className="align-top">
                          <div className="space-y-0.5 font-mono text-[10px] text-muted-foreground">
                            {sched.recipients.map((email, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <Mail className="h-2.5 w-2.5 text-primary shrink-0" /> {email}
                              </div>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell className="font-mono text-muted-foreground align-top">
                          {formatDateTime(sched.nextRunAt)}
                        </TableCell>

                        <TableCell className="align-top text-right">
                          <Switch
                            checked={sched.enabled}
                            onCheckedChange={() => handleToggleSchedule(sched.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 4: SENSITIVE DATA GOVERNANCE & ACCESS CONTROL               */}
        {/* ============================================================== */}
        <TabsContent value="governance" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Module 17 Sensitive-Data Permissions &amp; Access Controls
              </CardTitle>
              <CardDescription className="text-xs">
                Governing principles strictly enforcing permission-based report gating and Module 14 data minimization.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] space-y-2">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Allowed Capabilities (Admin CAN)
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px] leading-relaxed">
                    <li>Generate hospital-wide operational summaries across all 12 PRD categories.</li>
                    <li>Inspect aggregate clinical flow, bed turnover, and doctor slot utilization.</li>
                    <li>Export signed PDF &amp; structured CSV summaries for board reviews.</li>
                    <li>Automate multi-channel report dispatches for leadership teams.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/[0.04] space-y-2">
                  <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-rose-600" /> Negative Constraints (Admin CANNOT)
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px] leading-relaxed">
                    <li>Cannot bypass sensitive financial/security permissions without explicit role tokens.</li>
                    <li>Cannot dump raw un-anonymized identifiable patient histories (Module 14 compliance).</li>
                    <li>Cannot treat hospital-wide reporting as blanket access to confidential clinical files.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============================================================== */}
      {/* MODAL: SCHEDULE NEW REPORT                                     */}
      {/* ============================================================== */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSaveSchedule}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2 text-primary">
                <CalendarClock className="h-5 w-5 text-primary" /> Schedule Automated Report Delivery
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure automated recurring email delivery of hospital operational reports.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="grid gap-1">
                <Label htmlFor="sch-rep">Select Report *</Label>
                <Select value={schedReportId} onValueChange={setSchedReportId}>
                  <SelectTrigger id="sch-rep" className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockHospitalReports.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title} ({r.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="sch-freq">Frequency</Label>
                  <Select value={schedFrequency} onValueChange={(v: any) => setSchedFrequency(v)}>
                    <SelectTrigger id="sch-freq" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="sch-fmt">Format</Label>
                  <Select value={schedFormat} onValueChange={(v: any) => setSchedFormat(v)}>
                    <SelectTrigger id="sch-fmt" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">Signed PDF Document</SelectItem>
                      <SelectItem value="CSV">Raw CSV Dataset</SelectItem>
                      <SelectItem value="Excel">Excel Workbook (.xlsx)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="sch-time">Delivery Time (24h)</Label>
                <Input
                  id="sch-time"
                  type="time"
                  required
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="sch-rec">Recipient Emails (comma-separated) *</Label>
                <Input
                  id="sch-rec"
                  required
                  placeholder="e.g. director@qlyno.health, admin@qlyno.health"
                  value={schedRecipient}
                  onChange={(e) => setSchedRecipient(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setScheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Activate Schedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
