"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { mockRoster, mockNurses, mockSupportStaff, mockShiftTemplates, mockShiftChangeRequests, mockStations } from '@/lib/mock/nursing';
import { ScopeIndicator } from '@/components/shared/ScopeIndicator';
import { RosterGrid } from '@/components/roster/RosterGrid';
import { ShiftChangeRequests } from '@/components/roster/ShiftChangeRequests';
import { ShiftOverlapWarning } from '@/components/roster/ShiftOverlapWarning';
import { Button } from '@/components/ui/button';

export default function RosterPage() {
  const staffList = [...mockNurses, ...mockSupportStaff];
  
  const [hospitalWide, setHospitalWide] = useState(true);
  const [selectedStation, setSelectedStation] = useState('all');
  
  const [overlapWarningOpen, setOverlapWarningOpen] = useState(false);

  // Filter logic
  let filteredRoster = mockRoster;
  if (!hospitalWide && selectedStation !== 'all') {
    filteredRoster = mockRoster.filter(r => r.stationId === selectedStation);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospital Roster</h1>
          <p className="text-muted-foreground mt-1">Global view of scheduled duties and shift change requests.</p>
        </div>
        <ScopeIndicator scope="Hospital Admin" />
      </div>

      <div className="flex justify-between items-center bg-background p-4 rounded-md border">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Switch id="hospital-wide" checked={hospitalWide} onCheckedChange={setHospitalWide} />
            <Label htmlFor="hospital-wide">Hospital-wide View</Label>
          </div>
          
          {!hospitalWide && (
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stations</SelectItem>
                {mockStations.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Mock trigger for the edge case warning */}
        <Button onClick={() => setOverlapWarningOpen(true)}>+ Assign Shift (Demo Overlap)</Button>
      </div>

      <Tabs defaultValue="roster" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roster">Full Roster Grid</TabsTrigger>
          <TabsTrigger value="requests">Shift Change Requests ({mockShiftChangeRequests.filter(r => r.status === 'Pending').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roster">
          <div className="bg-background rounded-md">
             <RosterGrid roster={filteredRoster} staffList={staffList} shiftTemplates={mockShiftTemplates} />
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="bg-background rounded-md">
            <ShiftChangeRequests requests={mockShiftChangeRequests} staffList={mockNurses} shiftTemplates={mockShiftTemplates} />
          </div>
        </TabsContent>
      </Tabs>

      <ShiftOverlapWarning 
        isOpen={overlapWarningOpen}
        onClose={() => setOverlapWarningOpen(false)}
        onConfirm={() => setOverlapWarningOpen(false)}
        staffName="Priya Sharma"
        overlapDetails="Morning Shift (06:00-14:00) overlaps with requested Morning Shift assignment on same date."
      />
    </div>
  );
}
