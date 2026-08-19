"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AmbulanceIcon, Plus, Play, Navigation, MapPin } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RootState } from "@/store/store";
import { updateAmbulanceStatus, freeAmbulance, type AmbulanceStatus } from "@/store/slices/ambulanceSlice";
import { updateCaseStatus } from "@/store/slices/emergencySlice";
import { DispatchCreationModal } from "@/components/ambulance/DispatchCreationModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const STATUS_COLORS: Record<AmbulanceStatus, string> = {
  'Available': 'bg-success/20 text-success',
  'Dispatched': 'bg-warning/20 text-warning-foreground',
  'En Route': 'bg-info/20 text-info',
  'At Scene': 'bg-destructive/20 text-destructive',
  'Transporting': 'bg-info/20 text-info',
  'At Hospital': 'bg-success/20 text-success',
  'Maintenance/Offline': 'bg-muted text-muted-foreground',
};

export default function AmbulancePage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const ambulances = useSelector((state: RootState) => state.ambulance.fleet);
  
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState<string | null>(null);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  
  // Crew Assignment Modal State
  const [crewModalAmb, setCrewModalAmb] = useState<string | null>(null);
  const [driverName, setDriverName] = useState("");
  const [crewMembers, setCrewMembers] = useState("");
  const [contactDetails, setContactDetails] = useState("");

  const filteredAmbulances = ambulances.filter(a => {
    if (filterType !== "All" && a.type !== filterType) return false;
    if (filterStatus !== "All" && a.status !== filterStatus) return false;
    if (filterLocation !== "All" && a.baseLocation !== filterLocation) return false;
    return true;
  });

  const handleStatusChange = (ambId: string, newStatus: AmbulanceStatus, currentCaseId?: string) => {
    if (newStatus === 'Available') {
      dispatch(freeAmbulance(ambId));
    } else {
      dispatch(updateAmbulanceStatus({ id: ambId, status: newStatus }));
    }
    
    // Auto-sync status to Emergency Case if linked
    if (currentCaseId) {
      // Map ambulance status to emergency case status
      let caseStatus = undefined;
      if (newStatus === 'En Route') caseStatus = 'Ambulance Dispatched';
      if (newStatus === 'At Hospital') caseStatus = 'Arrived';
      
      if (caseStatus) {
        dispatch(updateCaseStatus({ id: currentCaseId, status: caseStatus as any, actor: 'System (Ambulance Update)' }));
      }
    }
  };

  const handleAssignCrew = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Crew Assigned", description: `Updated driver and crew for vehicle.` });
    setCrewModalAmb(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ambulance Dispatch & Fleet Registry"
        description="Hospital transport availability, live state, and standalone dispatch."
        crumbs={[{ label: "Hospital Operations" }, { label: "Ambulance Dispatch" }]}
        actions={
          <div className="flex gap-3">
            <Link href="/ambulance/live-tracking">
              <Button variant="outline">
                <MapPin className="mr-2 h-4 w-4" /> Live Map
              </Button>
            </Link>
            <Link href="/ambulance/history">
              <Button variant="outline">
                <Navigation className="mr-2 h-4 w-4" /> History
              </Button>
            </Link>
            <Button onClick={() => setShowDispatchModal(true)}>
              <Play className="mr-2 h-4 w-4" /> Standalone Dispatch
            </Button>
          </div>
        }
      />

      <div className="bg-card border border-border rounded-xl p-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="grid gap-1.5 w-48">
            <Label className="text-xs text-muted-foreground">Vehicle Type</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="ALS">ALS</SelectItem>
                <SelectItem value="BLS">BLS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5 w-48">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Dispatched">Dispatched</SelectItem>
                <SelectItem value="En Route">En Route</SelectItem>
                <SelectItem value="Maintenance/Offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5 w-48">
            <Label className="text-xs text-muted-foreground">Base Location</Label>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Locations</SelectItem>
                <SelectItem value="Qlyno Main Campus">Main Campus</SelectItem>
                <SelectItem value="Qlyno City Center">City Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto mt-4">
            <Button variant="outline" size="sm" onClick={() => setShowAddVehicleModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </div>
        </div>

        {/* Registry & Status Board Table */}
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Base Location</TableHead>
                <TableHead>Driver & Crew</TableHead>
                <TableHead>Current Case</TableHead>
                <TableHead className="w-[200px]">Live Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAmbulances.map(amb => (
                <TableRow key={amb.id}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-2">
                      <AmbulanceIcon className="h-4 w-4 text-muted-foreground" />
                      {amb.vehicleNo}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{amb.type}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {amb.equipment.map(eq => (
                        <Badge key={eq} variant="outline" className="text-[10px]">{eq}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{amb.baseLocation}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{amb.driverName || 'Unassigned'}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {amb.crew?.join(', ') || 'No crew'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {amb.currentCaseId ? (
                      <Link href={`/emergency/${amb.currentCaseId}`} className="text-sm font-medium text-primary hover:underline">
                        {amb.currentCaseId}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={amb.status} 
                      onValueChange={(val) => handleStatusChange(amb.id, val as AmbulanceStatus, amb.currentCaseId)}
                    >
                      <SelectTrigger className={`h-8 text-xs font-medium border-0 ${STATUS_COLORS[amb.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Dispatched" disabled>Dispatched</SelectItem>
                        <SelectItem value="En Route" disabled={!amb.currentCaseId}>En Route</SelectItem>
                        <SelectItem value="At Scene" disabled={!amb.currentCaseId}>At Scene</SelectItem>
                        <SelectItem value="Transporting" disabled={!amb.currentCaseId}>Transporting</SelectItem>
                        <SelectItem value="At Hospital" disabled={!amb.currentCaseId}>At Hospital</SelectItem>
                        <SelectItem value="Maintenance/Offline">Maintenance/Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setEditVehicleId(amb.id)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCrewModalAmb(amb.id)}>
                      Assign Crew
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAmbulances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No vehicles match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DispatchCreationModal 
        open={showDispatchModal} 
        onOpenChange={setShowDispatchModal} 
      />

      {/* Crew Assignment Modal */}
      <Dialog open={!!crewModalAmb} onOpenChange={(open) => !open && setCrewModalAmb(null)}>
        <DialogContent>
          <form onSubmit={handleAssignCrew}>
            <DialogHeader>
              <DialogTitle>Assign Driver & Crew</DialogTitle>
              <DialogDescription>Assign personnel to vehicle {ambulances.find(a => a.id === crewModalAmb)?.vehicleNo}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-1.5">
                <Label>Driver Name</Label>
                <Input required value={driverName} onChange={e => setDriverName(e.target.value)} placeholder="e.g. Ramesh Patel" />
              </div>
              <div className="grid gap-1.5">
                <Label>Crew Members (Comma separated)</Label>
                <Input value={crewMembers} onChange={e => setCrewMembers(e.target.value)} placeholder="e.g. Sunita (Paramedic), Amit (EMT)" />
              </div>
              <div className="grid gap-1.5">
                <Label>Primary Contact Details</Label>
                <Input value={contactDetails} onChange={e => setContactDetails(e.target.value)} placeholder="e.g. +91 90000 00000" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCrewModalAmb(null)}>Cancel</Button>
              <Button type="submit">Assign</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showAddVehicleModal || !!editVehicleId} onOpenChange={(open) => {
        if (!open) {
          setShowAddVehicleModal(false);
          setEditVehicleId(null);
        }
      }}>
        <DialogContent>
          <form onSubmit={e => { 
            e.preventDefault(); 
            toast({ title: editVehicleId ? "Vehicle Updated" : "Vehicle Registered", description: editVehicleId ? "Changes saved." : "New ambulance added to fleet."}); 
            setShowAddVehicleModal(false); 
            setEditVehicleId(null);
          }}>
            <DialogHeader>
              <DialogTitle>{editVehicleId ? "Edit Ambulance" : "Register New Ambulance"}</DialogTitle>
              <DialogDescription>{editVehicleId ? "Update vehicle configuration." : "Add a new vehicle to the hospital fleet."}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>Vehicle Registration ID</Label>
                  <Input required defaultValue={editVehicleId ? ambulances.find(a => a.id === editVehicleId)?.vehicleNo : ""} placeholder="e.g. MH-12-XX-0000" />
                </div>
                <div className="grid gap-1.5">
                  <Label>Type</Label>
                  <Select defaultValue={editVehicleId ? ambulances.find(a => a.id === editVehicleId)?.type : "ALS"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALS">ALS</SelectItem>
                      <SelectItem value="BLS">BLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>Equipment Capabilities (Comma separated)</Label>
                <Input required defaultValue={editVehicleId ? ambulances.find(a => a.id === editVehicleId)?.equipment.join(', ') : ""} placeholder="e.g. Defibrillator, Ventilator, O2" />
              </div>
              <div className="grid gap-1.5">
                <Label>Base Location</Label>
                <Select defaultValue={editVehicleId ? ambulances.find(a => a.id === editVehicleId)?.baseLocation : "Qlyno Main Campus"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Qlyno Main Campus">Qlyno Main Campus</SelectItem>
                    <SelectItem value="Qlyno City Center">Qlyno City Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowAddVehicleModal(false); setEditVehicleId(null); }}>Cancel</Button>
              <Button type="submit">{editVehicleId ? "Save Changes" : "Register Vehicle"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
