import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NurseStation, mockNurses } from '@/lib/mock/nursing';

interface NurseStationFormProps {
  isOpen: boolean;
  onClose: () => void;
  station?: NurseStation;
}

export function NurseStationForm({ isOpen, onClose, station }: NurseStationFormProps) {
  const [formData, setFormData] = useState({
    name: station?.name || '',
    department: station?.department || '',
    location: station?.location || '',
    leadId: station?.leadId || 'none',
    status: station?.status || 'Active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  // Only show Head Nurses or Charge Nurses as potential leads
  const potentialLeads = mockNurses.filter(n => n.roleScope === 'Head Nurse' || n.roleScope === 'Charge Nurse');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{station ? 'Edit Nurse Station' : 'Create Nurse Station'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Station Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. ICU Central" 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={formData.department}
                onValueChange={(val) => setFormData({ ...formData, department: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Intensive Care">Intensive Care</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(val: any) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location / Building</Label>
            <Input 
              id="location" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Block A, Floor 2" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lead">Station Lead</Label>
            <Select 
              value={formData.leadId}
              onValueChange={(val) => setFormData({ ...formData, leadId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {potentialLeads.map(lead => (
                  <SelectItem key={lead.id} value={lead.id}>{lead.name} ({lead.roleScope})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Station</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
