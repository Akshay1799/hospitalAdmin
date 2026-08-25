"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  Flame,
  Layers,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
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
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { mockExecutiveAnalytics } from "@/lib/mock-data/reports-analytics";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0d9488", "#0284c7", "#f59e0b", "#f43f5e", "#8b5cf6"];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <PageHeader
          title="Hospital Executive & Strategic Analytics"
          description="Executive KPIs, bed occupancy, ALOS trends, revenue cohorts, and clinical quality benchmarks."
          crumbs={[{ label: "Analytics & Growth" }, { label: "Executive Cockpit" }]}
        />
        <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
          Loading analytics cockpit...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      {/* Page Header */}
      <PageHeader
        title="Hospital Executive &amp; Strategic Analytics"
        description="Executive KPIs, bed occupancy, ALOS trends, revenue cohorts, and clinical quality benchmarks."
        crumbs={[{ label: "Analytics & Growth" }, { label: "Executive Cockpit" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-semibold gap-1.5"
              asChild
            >
              <Link href="/reports">
                <Layers className="h-3.5 w-3.5 text-primary" /> Operational Reports Hub
              </Link>
            </Button>
          </div>
        }
      />

      {/* Scope Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Executive Strategic Analytics" />
        <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
          Live Data Stream • Consolidated Campus Telemetry
        </Badge>
      </div>

      {/* Strategic KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mockExecutiveAnalytics.kpis.map((kpi, idx) => (
          <Card key={idx} className="p-3.5 border-border bg-card shadow-xs">
            <span className="text-[11px] text-muted-foreground uppercase font-bold">{kpi.label}</span>
            <p className="text-xl font-bold font-mono text-primary mt-0.5">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-[10px] text-emerald-600 font-medium">{kpi.delta}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Revenue Growth & Target Comparison */}
        <Card className="lg:col-span-2 border-border shadow-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <LineChartIcon className="h-4 w-4 text-primary" /> Hospital Revenue Expansion (₹ Lakhs vs Target)
              </CardTitle>
              <CardDescription className="text-xs">
                Quarterly realized operating revenue vs planned strategic budget trajectory.
              </CardDescription>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[9px]">
              +14.2% YoY Growth
            </Badge>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockExecutiveAnalytics.revenueGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v) => `₹${v}L`} />
                  <RechartsTooltip formatter={(v: any) => `₹${v} Lakhs`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Realized Revenue"
                    stroke="#0d9488"
                    fill="#0d9488"
                    fillOpacity={0.25}
                    strokeWidth={2.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Strategic Target"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Departmental Case Mix Cohorts */}
        <Card className="border-border shadow-xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-cyan-600" /> Specialty Revenue Share
            </CardTitle>
            <CardDescription className="text-xs">
              Contribution breakdown across major super-specialty wings.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockExecutiveAnalytics.departmentCohort}
                    dataKey="share"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {mockExecutiveAnalytics.departmentCohort.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v: any) => `${v}%`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              {mockExecutiveAnalytics.departmentCohort.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="truncate text-foreground font-medium">{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono shrink-0">
                    <span>{dept.share}%</span>
                    <span className="text-emerald-600 font-semibold">{dept.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Quality & Infection Benchmarks */}
      <Card className="border-border shadow-xs">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Clinical Quality &amp; Infection Rate National Benchmarks
          </CardTitle>
          <CardDescription className="text-xs">
            NABH / JCI hospital quality indicators measured against peer tertiary centers.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-bold">Quality Indicator</TableHead>
                  <TableHead className="text-xs font-bold text-center">Qlyno Score</TableHead>
                  <TableHead className="text-xs font-bold text-center">National Benchmark</TableHead>
                  <TableHead className="text-xs font-bold text-right">Accreditation Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExecutiveAnalytics.qualityBenchmarks.map((q, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30 text-xs">
                    <TableCell className="font-semibold text-foreground">{q.indicator}</TableCell>
                    <TableCell className="text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {q.hospitalScore}
                    </TableCell>
                    <TableCell className="text-center font-mono text-muted-foreground">
                      {q.nationalBenchmark}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[9px]">
                        {q.status}
                      </Badge>
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
