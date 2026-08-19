"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockStations, mockNurses, mockSupportStaff, mockShiftTemplates, mockRoster } from '@/lib/mock/nursing';
import { ScopeIndicator } from '@/components/shared/ScopeIndicator';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { RosterGrid } from '@/components/roster/RosterGrid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { PatientAssignmentOverride } from '@/components/patient-assignment/PatientAssignmentOverride';

export default function NurseStationDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const stationId = params.id as string;
  const station = mockStations.find(s => s.id === stationId);

  const [overrideOpen, setOverrideOpen] = useState(false);

  const nurses = mockNurses.filter(n => n.stationId === stationId);
  const supportStaff = mockSupportStaff.filter(s => s.stationId === stationId);
  const roster = mockRoster.filter(r => r.stationId === stationId);

  if (!station) return <div>Station not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold tracking-tight">{station.name}</h1>
            <StatusBadge status={station.status} />
          </div>
          <p className="text-muted-foreground mt-1">{station.department} • {station.location}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="destructive" onClick={() => setOverrideOpen(true)}>Override Patient Assignment</Button>
          <ScopeIndicator scope="Hospital Admin" />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nurses">Nurses ({nurses.length})</TabsTrigger>
          <TabsTrigger value="support">Support Staff ({supportStaff.length})</TabsTrigger>
          <TabsTrigger value="shift-templates">Shift Templates</TabsTrigger>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="handover">Handover Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-md shadow-sm bg-background">
              <h3 className="text-sm font-medium text-muted-foreground">Station Lead</h3>
              <p className="text-xl font-bold mt-1">
                {mockNurses.find(n => n.id === station.leadId)?.name || 'Unassigned'}
              </p>
            </div>
            <div className="p-4 border rounded-md shadow-sm bg-background">
              <h3 className="text-sm font-medium text-muted-foreground">Active Nurses</h3>
              <p className="text-xl font-bold mt-1">{nurses.length}</p>
            </div>
            <div className="p-4 border rounded-md shadow-sm bg-background">
              <h3 className="text-sm font-medium text-muted-foreground">Support Staff</h3>
              <p className="text-xl font-bold mt-1">{supportStaff.length}</p>
            </div>
            <div className="p-4 border rounded-md shadow-sm bg-background">
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="text-xl font-bold mt-1">{station.status}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nurses">
          <div className="rounded-md border p-4 bg-background">
            <h3 className="font-semibold text-lg mb-4">Assigned Nurses</h3>
            <ul className="space-y-2">
              {nurses.map(n => (
                <li key={n.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                  <span>{n.name} <span className="text-sm text-muted-foreground">({n.roleScope})</span></span>
                  <StatusBadge status={n.status} />
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="support">
           <div className="rounded-md border p-4 bg-background">
            <h3 className="font-semibold text-lg mb-4">Assigned Support Staff</h3>
            <ul className="space-y-2">
              {supportStaff.map(s => (
                <li key={s.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                  <span>{s.name} <span className="text-sm text-muted-foreground">({s.type})</span></span>
                  <StatusBadge status={s.status} />
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="shift-templates">
           <div className="rounded-md border p-4 bg-background">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Station Shift Templates</h3>
                <p className="text-muted-foreground text-sm mt-1">Templates applied to this station. Default templates are inherited globally.</p>
              </div>
              <Button size="sm" variant="outline">+ Assign Template</Button>
            </div>
            <ul className="space-y-2">
              {mockShiftTemplates.map(t => (
                <li key={t.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                  <span>{t.name} <span className="text-sm text-muted-foreground">({t.startTime} - {t.endTime})</span></span>
                  {t.isDefault && <Badge variant="secondary">Global Default</Badge>}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="roster">
          <div className="bg-background rounded-md">
            <RosterGrid roster={roster} staffList={[...nurses, ...supportStaff]} shiftTemplates={mockShiftTemplates} />
          </div>
        </TabsContent>

        <TabsContent value="handover">
          <div className="rounded-md border p-4 bg-background">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Handover Log <span className="text-xs font-normal text-muted-foreground ml-2">(Read-only Monitor)</span></h3>
                <p className="text-muted-foreground text-sm mt-1">Hospital Admin can monitor handovers but cannot create them. This is primarily a Nurse workflow.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast({ title: "Handover Pending", description: "Priya Sharma has an overdue handover for the Morning Shift."})}>Simulate Notification</Button>
            </div>
            <div className="space-y-4">
              <div className="p-3 border rounded-md">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>From: Priya Sharma (Morning Shift)</span>
                  <span>To: Rahul Verma (Evening Shift)</span>
                </div>
                <p className="text-sm">Bed 4 needs IV fluid change at 15:00. Bed 6 patient complaining of mild pain.</p>
                <div className="mt-2"><Badge variant="outline">Completed</Badge></div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <PatientAssignmentOverride 
        isOpen={overrideOpen} 
        onClose={() => setOverrideOpen(false)} 
        patientName="Amit Patel (Bed 4)" 
        currentNurse="Priya Sharma" 
      />
    </div>
  );
}
