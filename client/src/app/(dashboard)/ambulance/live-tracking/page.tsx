"use client";

import Link from "next/link";
import { ArrowLeft, Map, AlertTriangle, Navigation } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { updateCaseStatus, triggerFallback } from "@/store/slices/emergencySlice";
import { updateDispatchDestination } from "@/store/slices/ambulanceSlice";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function LiveTrackingPage() {
  const ambulances = useSelector((state: RootState) => state.ambulance.fleet);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const [rerouteAmbId, setRerouteAmbId] = useState<string | null>(null);
  const [newDestination, setNewDestination] = useState("");

  const handleReroute = (e: React.FormEvent) => {
    e.preventDefault();
    const amb = ambulances.find(a => a.id === rerouteAmbId);
    if (!amb) return;

    if (amb.currentCaseId) {
      dispatch(triggerFallback({ id: amb.currentCaseId, fallbackHospital: newDestination, actor: "Admin Dispatcher" }));
    }
    dispatch(updateDispatchDestination({ ambulanceId: amb.id, newDestination }));
    
    toast({ title: "Ambulance Re-routed", description: `Vehicle ${amb.vehicleNo} re-routed to ${newDestination}.` });
    setRerouteAmbId(null);
    setNewDestination("");
  };

  const activeDispatches = ambulances.filter(a => ['Dispatched', 'En Route', 'At Scene', 'Transporting'].includes(a.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ambulance">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Live Tracking Map"
          description="Real-time GPS tracking and ETA for active dispatches."
        />
      </div>

      <div className="relative w-full h-[400px] bg-muted/30 border border-border rounded-xl flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Simulated Map Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <Map className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <div className="bg-warning/10 border border-warning/20 text-warning px-4 py-2 rounded-lg flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">GPS Integration Unavailable</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          Live tracking requires an active third-party location integration. Falling back to manual status board.
        </p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">Active Dispatches <Badge variant="secondary">{activeDispatches.length}</Badge></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDispatches.map(amb => (
            <Card key={amb.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{amb.vehicleNo}</span>
                  <Badge variant="outline" className="bg-info/10 text-info border-info/20">{amb.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Linked Case</span>
                  <Link href={`/emergency/${amb.currentCaseId}`} className="font-medium text-primary hover:underline">
                    {amb.currentCaseId}
                  </Link>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Driver</span>
                  <span className="font-medium text-foreground">{amb.driverName || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>ETA</span>
                  <span className="font-medium text-foreground">Calculating...</span>
                </div>
                <div className="pt-3 mt-3 border-t flex gap-2">
                  <Button variant="outline" className="w-full h-8 text-xs" onClick={() => setRerouteAmbId(amb.id)}>
                    Re-route
                  </Button>
                  <Link href="/ambulance" className="w-full">
                    <Button variant="secondary" className="w-full h-8 text-xs">
                      <Navigation className="mr-2 h-3.5 w-3.5" /> Status
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {activeDispatches.length === 0 && (
            <div className="col-span-full py-12 text-center border rounded-lg border-dashed text-muted-foreground bg-card">
              No active dispatches currently in transit.
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!rerouteAmbId} onOpenChange={(open) => !open && setRerouteAmbId(null)}>
        <DialogContent>
          <form onSubmit={handleReroute}>
            <DialogHeader>
              <DialogTitle>Re-route Ambulance</DialogTitle>
              <DialogDescription>
                Change the destination hospital for an active dispatch. This will automatically trigger a fallback event on the linked emergency case.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-1.5">
                <Label>New Destination Hospital</Label>
                <Input required value={newDestination} onChange={e => setNewDestination(e.target.value)} placeholder="e.g. City General" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRerouteAmbId(null)}>Cancel</Button>
              <Button type="submit">Confirm Re-route</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
