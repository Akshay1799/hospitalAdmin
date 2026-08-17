"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  FlaskConical,
  Stethoscope,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { appointments } from "@/lib/mock-data/appointments";
import { departmentLoad, revenueTrend, weeklyAppointments } from "@/lib/mock-data/dashboard";
import { doctors } from "@/lib/mock-data/doctors";
import { notifications } from "@/lib/mock-data/operations";
import { formatCurrency, getInitials } from "@/lib/utils";

export default function DashboardPage() {
  const todays = appointments.filter((a) => a.date === "2026-08-14");
  const criticalAlerts = notifications.filter((n) => n.severity === "critical" || n.severity === "warning");

  return (
    <div>
      <PageHeader
        title="Good morning, Hospital Admin"
        description="Here&apos;s what&apos;s happening across your organization today, Friday 14 August 2026."
        actions={
          <Button variant="outline" asChild>
            <Link href="/reports">View reports</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today&apos;s Appointments" value={String(todays.length)} delta="+12% vs yesterday" trend="up" icon={CalendarClock} tone="primary" href="/appointments" />
        <StatCard label="Active Doctors" value={String(doctors.filter((d) => d.status === "active").length)} delta="2 on leave" trend="flat" icon={Stethoscope} tone="info" href="/doctors" />
        <StatCard label="Outstanding Revenue" value={formatCurrency(342600)} delta="-4.2% this week" trend="down" icon={Wallet} tone="warning" href="/billing" />
        <StatCard label="Registered Patients" value="7,482" delta="+58 this week" trend="up" icon={Users} tone="success" href="/patients" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Last 6 months, organization-wide</CardDescription>
            </div>
            <StatusBadge status="active" />
          </CardHeader>
          <CardContent className="pl-1">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(174 68% 26%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(174 68% 26%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(32 92% 44%)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(32 92% 44%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(214 22% 91%)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(215 16% 45%)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="hsl(215 16% 45%)" tickFormatter={(v) => `₹${v / 1000}k`} />
                <RechartsTooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: 8, borderColor: "hsl(214 22% 89%)", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(174 68% 26%)" strokeWidth={2} fill="url(#revenueFill)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="hsl(32 92% 44%)" strokeWidth={2} fill="url(#expenseFill)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Load by Department</CardTitle>
            <CardDescription>Share of this month&apos;s consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={departmentLoad} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {departmentLoad.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-1 gap-1.5">
              {departmentLoad.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-medium text-foreground">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Today&apos;s Appointments</CardTitle>
              <CardDescription>{todays.length} scheduled across all doctors</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/appointments">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border p-0">
            {todays.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(a.patientName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.patientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.doctorName} · {a.clinic}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden font-mono text-xs text-muted-foreground sm:inline">{a.time}</span>
                  <StatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Needs Attention</CardTitle>
              <CardDescription>Alerts requiring admin review</CardDescription>
            </div>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {criticalAlerts.map((n) => (
              <div key={n.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <StatusBadge status={n.severity === "critical" ? "critical" : "warning"} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
              </div>
            ))}
            <Button variant="outline" size="sm" asChild>
              <Link href="/notifications">View all notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Weekly Appointment Volume</CardTitle>
          <CardDescription>Scheduled vs completed, current week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyAppointments} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="hsl(214 22% 91%)" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(215 16% 45%)" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="hsl(215 16% 45%)" />
              <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="appointments" fill="hsl(174 45% 82%)" radius={[4, 4, 0, 0]} name="Scheduled" />
              <Bar dataKey="completed" fill="hsl(174 68% 26%)" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10 text-info">
              <FlaskConical className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">6 lab orders in progress</p>
              <Link href="/lab" className="text-xs text-primary hover:underline">
                Review lab queue
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Wallet className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">23 invoices outstanding</p>
              <Link href="/billing" className="text-xs text-primary hover:underline">
                Go to billing
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
              <Stethoscope className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">1 procurement request closing soon</p>
              <Link href="/vendors/procurement" className="text-xs text-primary hover:underline">
                View vendor network
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
