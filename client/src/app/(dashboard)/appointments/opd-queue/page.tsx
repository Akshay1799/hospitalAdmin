"use client";

import { useState } from "react";
import { Clock, AlertCircle, CheckCircle2, Phone, MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { useToast } from "@/hooks/use-toast";
import { opqueueData, opdRegistrationData } from "@/lib/mock-data/patients";
import { getInitials } from "@/lib/utils";

export default function OPDQueuePage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();

  // Separate queue statuses
  const inConsultation = opqueueData.filter((q) => q.status === "in-consultation");
  const called = opqueueData.filter((q) => q.status === "called");
  const waiting = opqueueData.filter((q) => q.status === "waiting");

  const handleCallNext = (token: string) => {
    toast({
      title: "Patient called",
      description: `Token ${token} has been called to the consultation room.`,
    });
  };

  const handleComplete = (token: string) => {
    toast({
      title: "Consultation complete",
      description: `Token ${token} consultation has been marked as complete.`,
    });
  };

  const handleReschedule = (token: string) => {
    toast({
      title: "Reschedule initiated",
      description: `Token ${token} can be rescheduled to another slot.`,
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="OPD Queue Management"
        description="Live queue status, patient flow, and consultation management for outpatient services."
        crumbs={[{ label: "Care Delivery" }, { label: "Appointments" }, { label: "OPD Queue" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAutoRefresh(!autoRefresh);
                toast({
                  title: autoRefresh ? "Auto-refresh paused" : "Auto-refresh enabled",
                  description: "Queue will " + (autoRefresh ? "not " : "") + "update automatically.",
                });
              }}
            >
              {autoRefresh ? "⏸ Pause" : "▶ Resume"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "Queue refreshed", description: "Latest queue data loaded." })}
            >
              🔄 Refresh
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">In Consultation</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold">{inConsultation.length}</span>
              <span className="text-xs text-muted-foreground">patient{inConsultation.length !== 1 ? "s" : ""}</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Called to Wait</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold">{called.length}</span>
              <span className="text-xs text-muted-foreground">patient{called.length !== 1 ? "s" : ""}</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Waiting in Queue</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold">{waiting.length}</span>
              <span className="text-xs text-muted-foreground">patient{waiting.length !== 1 ? "s" : ""}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="live-queue" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="live-queue">Live Queue</TabsTrigger>
          <TabsTrigger value="by-doctor">By Doctor</TabsTrigger>
          <TabsTrigger value="registrations">Today Registrations</TabsTrigger>
        </TabsList>

        <TabsContent value="live-queue" className="space-y-4">
          <div className="space-y-4">
            {/* In Consultation */}
            {inConsultation.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" /> In Consultation
                  </CardTitle>
                  <CardDescription>Currently being treated</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Consultation Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inConsultation.map((q) => (
                        <TableRow key={q.token} className="bg-white">
                          <TableCell className="font-mono font-semibold text-base text-blue-600">{q.token}</TableCell>
                          <TableCell className="font-medium">{q.patient}</TableCell>
                          <TableCell>{q.doctor}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {q.waitTime} min {q.waitTime > 0 && "(ongoing)"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleComplete(q.token)}>
                                  ✓ Mark complete
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReschedule(q.token)}>
                                  📅 Reschedule
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Called to Wait */}
            {called.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" /> Called to consultation area
                  </CardTitle>
                  <CardDescription>Waiting at door</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Wait Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {called.map((q) => (
                        <TableRow key={q.token} className="bg-white">
                          <TableCell className="font-mono font-semibold text-base text-orange-600">{q.token}</TableCell>
                          <TableCell className="font-medium">{q.patient}</TableCell>
                          <TableCell>{q.doctor}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{q.waitTime} min</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleComplete(q.token)}>
                                  ✓ Mark complete
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReschedule(q.token)}>
                                  📅 Reschedule
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Waiting in Queue */}
            {waiting.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Waiting in Queue</CardTitle>
                  <CardDescription>Next in line based on queue position</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Token</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Expected Wait</TableHead>
                        <TableHead>Arrival Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waiting.map((q, idx) => (
                        <TableRow key={q.token}>
                          <TableCell>
                            <Badge variant={idx === 0 ? "default" : "secondary"} className="font-semibold">
                              {idx + 1}{idx === 0 && " (Next)"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono font-semibold">{q.token}</TableCell>
                          <TableCell className="font-medium">{q.patient}</TableCell>
                          <TableCell>{q.doctor}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">~{q.waitTime} min</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{q.queueTime}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {idx === 0 && (
                                  <DropdownMenuItem onClick={() => handleCallNext(q.token)}>
                                    📢 Call next
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleReschedule(q.token)}>
                                  📅 Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() =>
                                  toast({
                                    title: "Patient contacted",
                                    description: "SMS sent to " + q.patient,
                                  })
                                }>
                                  💬 Send SMS
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="by-doctor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Queue by Doctor</CardTitle>
              <CardDescription>Workload and queue distribution across doctors</CardDescription>
            </CardHeader>
            <CardContent>
              {["Dr. Ananya Rao", "Dr. Neha Kulkarni", "Dr. Simran Kaur", "Dr. Aditya Verma"].map((doctor) => {
                const doctorQueue = opqueueData.filter((q) => q.doctor === doctor);
                const doctorInConsultation = doctorQueue.filter((q) => q.status === "in-consultation");
                const doctorWaiting = doctorQueue.filter((q) => q.status === "waiting");

                return (
                  <div key={doctor} className="mb-4 flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{doctor}</p>
                      <p className="text-sm text-muted-foreground">
                        {doctorInConsultation.length} in consult · {doctorWaiting.length} waiting
                      </p>
                    </div>
                    <Badge variant={doctorWaiting.length > 3 ? "destructive" : "secondary"}>
                      {doctorQueue.length} total
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Registrations</CardTitle>
              <CardDescription>New patient registrations for {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opdRegistrationData.map((reg, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-sm">{reg.time}</TableCell>
                      <TableCell className="font-medium">{reg.patient}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{reg.phone}</TableCell>
                      <TableCell>{reg.doctor}</TableCell>
                      <TableCell className="text-sm">{reg.dept}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{reg.reason}</TableCell>
                      <TableCell>
                        <StatusBadge status={reg.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
