"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AmbulanceIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store/store";
import { dispatchAmbulance } from "@/store/slices/ambulanceSlice";
import { linkAmbulanceToCase } from "@/store/slices/emergencySlice";
import { useToast } from "@/hooks/use-toast";

interface DispatchCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId?: string; // Optional: if triggered from an emergency case
}

export function DispatchCreationModal({ open, onOpenChange, caseId }: DispatchCreationModalProps) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const ambulances = useSelector((state: RootState) => state.ambulance.fleet);
  const emergencyCase = useSelector((state: RootState) => state.emergency.cases.find(c => c.id === caseId));

  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState("");
  const [destination, setDestination] = useState(emergencyCase?.destinationHospital || "");

  // Filter for dispatch-eligible ambulances
  const availableAmbulances = ambulances.filter(a => a.status === 'Available');

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmbulanceId || !destination) return;

    // 1. Update Ambulance State
    dispatch(dispatchAmbulance({
      ambulanceId: selectedAmbulanceId,
      caseId: caseId,
      destination: destination
    }));

    // 2. Update Emergency Case State if linked
    if (caseId) {
      dispatch(linkAmbulanceToCase({
        caseId: caseId,
        ambulanceId: selectedAmbulanceId,
        actor: "Admin Dispatcher"
      }));
    }

    toast({
      title: "Ambulance Dispatched",
      description: `Vehicle assigned to ${caseId ? `Case ${caseId}` : destination}.`
    });
    
    setSelectedAmbulanceId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleDispatch}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AmbulanceIcon className="h-5 w-5" />
              Dispatch Ambulance
            </DialogTitle>
            <DialogDescription>
              {caseId ? `Assign a vehicle for Emergency Case ${caseId}.` : "Create a standalone ambulance dispatch."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {caseId && emergencyCase && (
              <div className="grid gap-1.5 p-3 border rounded-md bg-muted/20">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Linked Emergency Case</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{emergencyCase.patientName}</span>
                  <span className="text-sm text-muted-foreground">{emergencyCase.location}</span>
                </div>
              </div>
            )}
            
            <div className="grid gap-1.5">
              <Label>Select Vehicle</Label>
              <Select value={selectedAmbulanceId} onValueChange={setSelectedAmbulanceId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an available ambulance..." />
                </SelectTrigger>
                <SelectContent>
                  {availableAmbulances.length === 0 && (
                    <SelectItem value="none" disabled>No vehicles available</SelectItem>
                  )}
                  {availableAmbulances.map(amb => (
                    <SelectItem key={amb.id} value={amb.id}>
                      {amb.vehicleNo} ({amb.type}) - Base: {amb.baseLocation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <Label>Destination / Receiving Hospital</Label>
              <Input 
                required 
                value={destination} 
                onChange={e => setDestination(e.target.value)} 
                placeholder="e.g. Qlyno Main Campus" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!selectedAmbulanceId || !destination}>Confirm Dispatch</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
