"use client";

import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { patientSatisfaction, revenueTrend, weeklyAppointments } from "@/lib/mock-data/dashboard";
import { formatCurrency } from "@/lib/utils";
import { Activity, CalendarClock, Smile, Wallet } from "lucide-react";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Operational and financial performance across doctors, clinics and staff."
        crumbs={[{ label: "Finance" }, { label: "Reports & Analytics" }]}
        actions={
          <Button variant="outline">
            <Download /> Export report
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MTD Revenue" value={formatCurrency(742000)} delta="-8.1% vs last month" trend="down" icon={Wallet} tone="primary" />
        <StatCard label="Appointment Completion" value="88.4%" delta="+3.1%" trend="up" icon={CalendarClock} tone="success" />
        <StatCard label="Avg. Staff Utilization" value="76%" delta="+1.4%" trend="up" icon={Activity} tone="info" />
        <StatCard label="Patient Satisfaction" value="4.8 / 5" delta="+0.1" trend="up" icon={Smile} tone="warning" />
      </div>

      <Tabs defaultValue="financial" className="mt-4">
        <TabsList>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="satisfaction">Patient Satisfaction</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses (6 months)</CardTitle>
              <CardDescription>Organization-wide financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid vertical={false} stroke="hsl(214 22% 91%)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(215 16% 45%)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="hsl(215 16% 45%)" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <RechartsTooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(174 68% 26%)" strokeWidth={2.5} dot={false} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="hsl(32 92% 44%)" strokeWidth={2.5} dot={false} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Volume</CardTitle>
              <CardDescription>Scheduled vs completed, current week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyAppointments}>
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
        </TabsContent>

        <TabsContent value="satisfaction">
          <Card>
            <CardHeader>
              <CardTitle>Patient Satisfaction Trend</CardTitle>
              <CardDescription>Quarterly average rating</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={patientSatisfaction}>
                  <CartesianGrid vertical={false} stroke="hsl(214 22% 91%)" />
                  <XAxis dataKey="quarter" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(215 16% 45%)" />
                  <YAxis domain={[4, 5]} tickLine={false} axisLine={false} fontSize={12} stroke="hsl(215 16% 45%)" />
                  <RechartsTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(174 68% 26%)" strokeWidth={2.5} name="Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
