"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { allocateOT } from "@/store/slices/surgicalSlice";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, AlertCircle, Building, Users } from "lucide-react";

export default function OTSchedulingPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { cases, otRooms, surgeons } = useSelector((state: RootState) => state.surgical);

  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [allocModalOpen, setAllocModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    caseId: "",
    roomId: "",
    time: "08:00",
    team: "",
    resources: ""
  });

  // Display a simplified grid: Rows are Rooms, Columns are Cases scheduled for the selected date
  const selectedDateStart = new Date(`${date}T00:00:00Z`).getTime();
  const selectedDateEnd = new Date(`${date}T23:59:59Z`).getTime();

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    const c = cases.find(c => c.id === formData.caseId);
    if (!c) return;

    if (c.status !== 'Ready') {
      toast({
        title: "Warning: Case Not Ready",
        description: "OT scheduled, but case still has blockers.",
        variant: "destructive"
      });
    }

    const startDateTime = `${date}T${formData.time}:00Z`;
    const endDateTime = new Date(new Date(startDateTime).getTime() + 1000 * 60 * 60 * 2).toISOString();

    dispatch(allocateOT({
      caseId: c.id,
      roomId: formData.roomId,
      startDateTime,
      endDateTime,
      team: formData.team.split(',').map(s => s.trim()).filter(Boolean),
      resources: formData.resources.split(',').map(s => s.trim()).filter(Boolean)
    }));

    toast({ title: "OT Slot Allocated", description: "OT scheduling confirmed from Control View." });
    setAllocModalOpen(false);
  };

  const getSurgeonName = (caseData: any) => {
    if (!caseData.assignedSurgeonId) return "Unassigned";
    const surgeon = surgeons.find(s => s.id === caseData.assignedSurgeonId);
    return surgeon ? surgeon.name : caseData.assignedSurgeonId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Surgical Control View (OT Scheduling)</h1>
          <p className="text-muted-foreground">Manage OT slots. Case readiness and surgeon availability are fully visible here.</p>
        </div>
        <div className="flex gap-2">
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="w-auto"
          />
          <Dialog open={allocModalOpen} onOpenChange={setAllocModalOpen}>
            <DialogTrigger asChild>
              <Button>Allocate OT Slot</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Allocate OT Slot</DialogTitle>
                <DialogDescription>Assign a room and time for a case on {format(new Date(date), "MMM d, yyyy")}.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAllocate} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Case</Label>
                  <Select onValueChange={(val) => setFormData(p => ({ ...p, caseId: val }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case to schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.filter(c => !c.allocatedOT).map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.id} - {c.patientName} ({c.readinessPercent}% Ready)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.caseId && cases.find(c => c.id === formData.caseId)?.status !== 'Ready' && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <strong>Warning:</strong> This case is not yet 100% Ready. Scheduling is allowed, but strongly discouraged until all blockers are resolved.
                    </div>
                  </div>
                )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Team (comma separated)</Label>
                      <Input placeholder="e.g. Dr. Iyer, Nurse Kamala" value={formData.team} onChange={(e) => setFormData(p => ({ ...p, team: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Resources (comma separated)</Label>
                      <Input placeholder="e.g. C-Arm, Ventilator" value={formData.resources} onChange={(e) => setFormData(p => ({ ...p, resources: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Operating Room</Label>
                    <Select onValueChange={(val) => setFormData(p => ({ ...p, roomId: val }))} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select OT Room" />
                      </SelectTrigger>
                      <SelectContent>
                        {otRooms.filter(r => r.status !== 'Maintenance').map(r => (
                          <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="time" value={formData.time} onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))} required />
                  </div>
                </div>
                <Button type="submit" className="w-full">Confirm Slot</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {otRooms.map(room => {
          const roomCases = cases.filter(c => {
            if (!c.allocatedOT) return false;
            if (c.allocatedOT.roomId !== room.id) return false;
            const t = new Date(c.allocatedOT.startDateTime).getTime();
            return t >= selectedDateStart && t <= selectedDateEnd;
          }).sort((a, b) => new Date(a.allocatedOT!.startDateTime).getTime() - new Date(b.allocatedOT!.startDateTime).getTime());

          return (
            <Card key={room.id} className={room.status === 'Maintenance' ? 'opacity-50' : ''}>
              <CardHeader className="py-4 bg-muted/50 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                </div>
                <Badge variant={room.status === 'Available' ? 'default' : 'secondary'}>{room.status}</Badge>
              </CardHeader>
              <CardContent className="p-0">
                {roomCases.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No cases scheduled in this room for {format(new Date(date), "MMM d")}.
                  </div>
                ) : (
                  <div className="divide-y">
                    {roomCases.map(c => (
                      <div key={c.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 text-primary p-3 rounded-md text-center min-w-[100px]">
                            <div className="text-sm font-bold">{format(new Date(c.allocatedOT?.startDateTime || new Date()), "HH:mm")}</div>
                            <div className="text-xs">{format(new Date(c.allocatedOT?.endDateTime || new Date()), "HH:mm")}</div>
                          </div>
                          <div>
                            <Link href={`/surgical-cases/${c.id}`} className="font-semibold text-primary hover:underline block">
                              {c.id} - {c.procedureType}
                            </Link>
                            <div className="text-sm text-muted-foreground mt-1">Patient: {c.patientName}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Surgeon Availability</div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4" />
                              <span className="font-medium">{getSurgeonName(c)}</span>
                              {c.isExternalSurgeon && <Badge variant="outline" className="text-xs scale-90">Ext</Badge>}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Case Readiness</div>
                            <Badge variant="outline" className={c.readinessPercent === 100 ? "text-green-600 border-green-200 bg-green-50" : "text-destructive border-destructive bg-destructive/10"}>
                              {c.readinessPercent}% Ready
                            </Badge>
                          </div>

                          {((c.allocatedOT?.team?.length ?? 0) > 0 || (c.allocatedOT?.resources?.length ?? 0) > 0) && (
                            <div className="text-sm">
                              {(c.allocatedOT?.team?.length ?? 0) > 0 && (
                                <div className="text-muted-foreground"><span className="font-semibold text-foreground">Team:</span> {c.allocatedOT?.team?.join(", ")}</div>
                              )}
                              {(c.allocatedOT?.resources?.length ?? 0) > 0 && (
                                <div className="text-muted-foreground"><span className="font-semibold text-foreground">Resources:</span> {c.allocatedOT?.resources?.join(", ")}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
