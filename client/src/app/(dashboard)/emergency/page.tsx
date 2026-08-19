"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Siren,
  Ambulance as AmbulanceIcon,
  Clock,
  Filter,
  CheckCircle2,
  Settings,
  FileText,
  Plus,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  MapPin,
  Flame,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { RootState } from "@/store/store";
import {
  acknowledgeCase,
  markSlaBreached,
  triggerAlertSimulation,
  EmergencyCase,
} from "@/store/slices/emergencySlice";
import { useToast } from "@/hooks/use-toast";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Emergency workflow";

const PRIORITY_WEIGHT: Record<string, number> = { Critical: 3, High: 2, Medium: 1 };
const SLA_LIMITS_MINUTES: Record<string, number> = { Critical: 5, High: 15, Medium: 30 };

function getSlaStatus(createdAt: string, status: string, priority: string) {
  const elapsedMinutes = (Date.now() - new Date(createdAt).getTime()) / 60000;
  const limit = SLA_LIMITS_MINUTES[priority] || 30;

  if (status !== "Hospital Notified" && status !== "SOS Created") {
    return { breached: false, timeRemaining: 0, text: "SLA Met / Acked" };
  }

  const remaining = limit - elapsedMinutes;
  return {
    breached: remaining < 0,
    timeRemaining: remaining,
    text:
      remaining < 0
        ? `Breached by ${Math.abs(Math.round(remaining))}m`
        : `${Math.max(1, Math.round(remaining))}m remaining`,
  };
}

export default function EmergencyPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const cases = useSelector((state: RootState) => state.emergency.cases);
  const ambulances = useSelector((state: RootState) => state.ambulance.fleet);

  const [sort, setSort] = useState("newest");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [ackModalOpen, setAckModalOpen] = useState(false);
  const [selectedCaseForAck, setSelectedCaseForAck] = useState<EmergencyCase | null>(null);

  // Simulation form states
  const [simPatientName, setSimPatientName] = useState("Siddharth Mehra");
  const [simLocation, setSimLocation] = useState("MG Road Metro Station, Mumbai");
  const [simPriority, setSimPriority] = useState<"Critical" | "High" | "Medium">("Critical");
  const [simFlowType, setSimFlowType] = useState<"Flow A (Active Relationship)" | "Flow B (Location Routing)">(
    "Flow A (Active Relationship)"
  );
  const [simComplaint, setSimComplaint] = useState("Severe cardiac distress & collapse");

  const [, setTick] = useState(0);

  // Re-evaluate SLA countdown timer every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(interval);
  }, []);

  // Check and dispatch SLA breaches automatically
  useEffect(() => {
    cases.forEach((c) => {
      const sla = getSlaStatus(c.createdAt, c.status, c.priority);
      if (sla.breached && !c.slaBreached) {
        dispatch(markSlaBreached(c.id));
      }
    });
  }, [cases, dispatch]);

  const filteredAndSortedCases = useMemo(() => {
    return [...cases]
      .filter((c) => {
        if (deliveryFilter === "all") return true;
        return c.deliveryState === deliveryFilter;
      })
      .sort((a, b) => {
        if (sort === "priority") {
          return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        }
        if (sort === "sla") {
          const slaA = getSlaStatus(a.createdAt, a.status, a.priority).timeRemaining;
          const slaB = getSlaStatus(b.createdAt, b.status, b.priority).timeRemaining;
          return slaA - slaB;
        }
        // default newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [cases, sort, deliveryFilter]);

  // Ambulance fleet stats
  const ambAvailable = ambulances.filter((a) => a.status === "Available").length;
  const ambDispatched = ambulances.filter((a) =>
    ["Dispatched", "En Route", "At Scene", "Transporting"].includes(a.status)
  ).length;
  const ambOffline = ambulances.filter((a) => a.status === "Maintenance/Offline").length;

  const handleQuickAck = (c: EmergencyCase) => {
    setSelectedCaseForAck(c);
    setAckModalOpen(true);
  };

  const confirmAcknowledgment = () => {
    if (!selectedCaseForAck) return;
    dispatch(
      acknowledgeCase({
        id: selectedCaseForAck.id,
        actor: "Performed by Hospital Admin • acting within Emergency workflow",
      })
    );
    toast({
      title: "Administrative Receipt Acknowledged",
      description: `Case ${selectedCaseForAck.id} acknowledged and routed to clinical emergency team. (${DELEGATION_STRING})`,
    });
    setAckModalOpen(false);
  };

  const handleCreateSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: EmergencyCase = {
      id: `SOS-${Math.floor(100 + Math.random() * 900)}`,
      patientName: simPatientName,
      age: 40,
      gender: "Male",
      phone: "+91 98765 43210",
      location: simLocation,
      destinationHospital: "Qlyno Multispecialty Hospital (Main Campus)",
      priority: simPriority,
      status: "Hospital Notified",
      deliveryState: "Pending Ack",
      flowType: simFlowType,
      chiefComplaint: simComplaint,
      createdAt: new Date().toISOString(),
      slaBreached: false,
      assignedTeam: "Emergency Triage Pool",
    };

    dispatch(triggerAlertSimulation(newCase));
    setSimulationOpen(false);
    toast({
      title: "Simulated SOS Alert Triggered",
      description: `New ${simPriority} emergency alert generated for ${simPatientName} (${simFlowType}). (${DELEGATION_STRING})`,
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Emergency / SOS Command"
        description="High-stakes emergency routing, SLA countdown monitoring, ambulance coordination, and accountable human response."
        crumbs={[{ label: "Hospital Operations" }, { label: "Emergency Command" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/emergency/audit">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" /> Audit Trail
              </Button>
            </Link>
            <Link href="/emergency/config">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" /> Settings & Capacity
              </Button>
            </Link>
            <Button size="sm" onClick={() => setSimulationOpen(true)}>
              <Siren className="mr-2 h-4 w-4" /> Simulate SOS Alert
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Emergency Command" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-warning" />
          <span>Coordination & routing only • Clinical triage remains with Emergency Clinical Team</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Board */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Live SOS Emergency Board
              </h3>
              <Badge variant="secondary">
                {cases.filter((c) => c.status !== "Closed").length} active
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue placeholder="Delivery State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Delivery States</SelectItem>
                  <SelectItem value="Pending Ack">Pending Ack</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="priority">Highest Priority</SelectItem>
                    <SelectItem value="sla">SLA Breach Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {filteredAndSortedCases.map((c) => {
              if (c.status === "Closed") return null;

              const sla = getSlaStatus(c.createdAt, c.status, c.priority);
              const isBreached = (c.status === "Hospital Notified" || c.status === "SOS Created") && sla.breached;
              const isPendingAck = c.status === "Hospital Notified" || c.status === "SOS Created";

              return (
                <Card
                  key={c.id}
                  className={`transition-all hover:shadow-sm border-border ${
                    isBreached
                      ? "border-destructive/80 bg-destructive/5 dark:bg-destructive/10"
                      : isPendingAck
                      ? "border-warning/60 bg-warning/5 dark:bg-warning/10"
                      : "bg-card"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Case Info */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/emergency/${c.id}`}
                            className="font-bold text-foreground hover:text-primary transition-colors hover:underline text-base"
                          >
                            {c.id}
                          </Link>
                          <StatusBadge status={c.priority} />
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              c.flowType.includes("Flow A")
                                ? "border-blue-400 text-blue-700 dark:text-blue-300"
                                : "border-purple-400 text-purple-700 dark:text-purple-300"
                            }`}
                          >
                            {c.flowType}
                          </Badge>
                          <Badge
                            variant={
                              c.deliveryState === "Delivered"
                                ? "success"
                                : c.deliveryState === "Pending Ack"
                                ? "warning"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            Delivery: {c.deliveryState}
                          </Badge>
                        </div>

                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {c.patientName} {c.age ? `(${c.age}y, ${c.gender})` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" /> {c.location}
                          </p>
                          {c.chiefComplaint && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                              "{c.chiefComplaint}"
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                          <span className="font-medium bg-muted/60 px-2 py-0.5 rounded">
                            Owner: <span className="text-foreground">{c.assignedTeam || "Unassigned"}</span>
                          </span>
                          {c.ambulanceId && (
                            <span className="flex items-center gap-1 text-primary font-medium">
                              <AmbulanceIcon className="h-3 w-3" /> {c.ambulanceId} En Route
                            </span>
                          )}
                          {c.fallbackTriggered && (
                            <span className="text-destructive font-medium">
                              Fallback: {c.fallbackHospital}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: SLA, Status & Action */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          <div className="text-xs text-muted-foreground">Current Status</div>
                          <Badge
                            variant={c.status === "Hospital Notified" ? "destructive" : "secondary"}
                            className="mt-0.5"
                          >
                            {c.status}
                          </Badge>
                        </div>

                        <div className="text-left md:text-right">
                          <div className="text-xs text-muted-foreground flex items-center md:justify-end gap-1">
                            <Clock className="h-3 w-3" /> SLA Countdown
                          </div>
                          <div
                            className={`text-xs mt-0.5 font-mono ${
                              isBreached
                                ? "text-destructive font-bold animate-pulse"
                                : "text-muted-foreground font-medium"
                            }`}
                          >
                            {sla.text}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPendingAck && (
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-destructive hover:bg-destructive/90"
                              onClick={() => handleQuickAck(c)}
                            >
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Acknowledge
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                            <Link href={`/emergency/${c.id}`}>
                              Manage Case <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredAndSortedCases.filter((c) => c.status !== "Closed").length === 0 && (
              <div className="py-16 text-center border rounded-lg border-dashed text-muted-foreground bg-muted/10">
                <CheckCircle2 className="h-8 w-8 mx-auto text-success mb-2" />
                <p className="font-medium text-foreground">No Active Emergencies</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All incoming emergency alerts have been managed or closed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-4">
          {/* Transport Widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AmbulanceIcon className="h-4 w-4 text-primary" /> Fleet Transport Status
                </span>
                <Badge variant="outline" className="text-xs">Module 09</Badge>
              </CardTitle>
              <CardDescription>Live ambulance fleet availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div> Available Units
                </span>
                <span className="font-bold text-foreground">{ambAvailable}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div> Dispatched / En Route
                </span>
                <span className="font-bold text-foreground">{ambDispatched}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground"></div> Maintenance / Offline
                </span>
                <span className="font-bold text-foreground">{ambOffline}</span>
              </div>
              <div className="pt-2 border-t">
                <Link href="/ambulance">
                  <Button variant="outline" className="w-full text-xs h-8">
                    View Fleet Dispatch Console
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Escalation Ladder Widget */}
          <Card className="border-warning/40 bg-warning/5 dark:bg-warning/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-warning-foreground">
                <AlertTriangle className="h-4 w-4 text-warning" /> Auto-Escalation Ladder
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-muted-foreground">
              <p>Sequential automated escalation active per policy:</p>
              <div className="space-y-1 bg-card/60 p-2.5 rounded border border-border font-medium">
                <div>1. Triage Desk → Immediate (0m)</div>
                <div>2. Emergency Coordinator → 2 mins</div>
                <div>3. Clinical Lead → 5 mins</div>
                <div>4. Admin Director → 10 mins (SMS/Pager)</div>
              </div>
              <Link href="/emergency/config" className="inline-block text-primary hover:underline font-medium pt-1">
                Configure Thresholds →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ACKNOWLEDGE MODAL */}
      <Dialog open={ackModalOpen} onOpenChange={setAckModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" /> Acknowledge Emergency Receipt
            </DialogTitle>
            <DialogDescription>
              Confirms administrative receipt of alert and stops the SLA countdown timer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-1">
              <p className="font-semibold text-foreground">Case: {selectedCaseForAck?.id} • {selectedCaseForAck?.patientName}</p>
              <p className="text-xs text-muted-foreground">{selectedCaseForAck?.location}</p>
              <p className="text-xs text-muted-foreground">Priority: {selectedCaseForAck?.priority}</p>
            </div>
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/40 p-2.5 text-xs text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-900">
              <strong>Clinical Guardrail:</strong> Acknowledgment notifies the emergency clinical team. Admin does not make clinical triage judgments.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAckModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAcknowledgment}>
              Confirm & Route to Clinical Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SIMULATE ALERT MODAL */}
      <Dialog open={simulationOpen} onOpenChange={setSimulationOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleCreateSimulation}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Siren className="h-5 w-5 text-destructive" /> Simulate Incoming SOS Emergency
              </DialogTitle>
              <DialogDescription>
                Simulate emergency alert creation to test Flow A (active hospital relationship) or Flow B (location-based ad-hoc routing).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3">
              <div className="grid gap-1.5">
                <Label htmlFor="sim-flow">Emergency Source Flow</Label>
                <Select
                  value={simFlowType}
                  onValueChange={(v: "Flow A (Active Relationship)" | "Flow B (Location Routing)") => setSimFlowType(v)}
                >
                  <SelectTrigger id="sim-flow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flow A (Active Relationship)">Flow A — Existing Patient (Active Relationship)</SelectItem>
                    <SelectItem value="Flow B (Location Routing)">Flow B — Unregistered Patient (Location Routing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="sim-name">Patient Name</Label>
                  <Input id="sim-name" value={simPatientName} onChange={(e) => setSimPatientName(e.target.value)} required />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="sim-prio">Priority</Label>
                  <Select
                    value={simPriority}
                    onValueChange={(v: "Critical" | "High" | "Medium") => setSimPriority(v)}
                  >
                    <SelectTrigger id="sim-prio">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical (5m SLA)</SelectItem>
                      <SelectItem value="High">High (15m SLA)</SelectItem>
                      <SelectItem value="Medium">Medium (30m SLA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sim-loc">Incident Location</Label>
                <Input id="sim-loc" value={simLocation} onChange={(e) => setSimLocation(e.target.value)} required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sim-complaint">Chief Complaint / Context</Label>
                <Input id="sim-complaint" value={simComplaint} onChange={(e) => setSimComplaint(e.target.value)} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSimulationOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-destructive hover:bg-destructive/90">
                Trigger Emergency Alert
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
