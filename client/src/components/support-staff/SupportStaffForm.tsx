import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupportStaff, mockStations } from '@/lib/mock/nursing';
import { AdminOverrideLogBanner } from '@/components/shared/AdminOverrideLogBanner';

interface SupportStaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: SupportStaff;
}

export function SupportStaffForm({ isOpen, onClose, staff }: SupportStaffFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Attendant',
    status: 'On Duty',
    stationId: 'none',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: staff?.name || '',
        type: staff?.type || 'Attendant',
        status: staff?.status || 'On Duty',
        stationId: staff?.stationId || 'none',
      });
    }
  }, [isOpen, staff]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{staff ? 'Edit Support Staff' : 'Add Support Staff'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <AdminOverrideLogBanner />
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Staff Type</Label>
            <Select 
              value={formData.type}
              onValueChange={(val: any) => setFormData({ ...formData, type: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Attendant">Attendant</SelectItem>
                <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                <SelectItem value="Assistant">Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stationId">Assigned Station / Task Scope</Label>
            <Select 
              value={formData.stationId}
              onValueChange={(val: any) => setFormData({ ...formData, stationId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Hospital-wide / Unassigned</SelectItem>
                {mockStations.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Current Status</Label>
            <Select 
              value={formData.status}
              onValueChange={(val: any) => setFormData({ ...formData, status: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="On Duty">On Duty</SelectItem>
                <SelectItem value="Off Duty">Off Duty</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
