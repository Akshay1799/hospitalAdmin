"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { mockStations, mockNurses, mockSupportStaff, mockRoster } from '@/lib/mock/nursing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ScopeIndicator } from '@/components/shared/ScopeIndicator';
import { NurseStationForm } from '@/components/nurse-stations/NurseStationForm';
import { DeactivateStationModal } from '@/components/nurse-stations/DeactivateStationModal';
import { MoreHorizontal } from 'lucide-react';

export default function NurseStationsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<any>(null);
  
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [stationToDeactivate, setStationToDeactivate] = useState<any>(null);

  const handleEdit = (station: any) => {
    setEditingStation(station);
    setIsFormOpen(true);
  };

  const handleDeactivate = (station: any) => {
    setStationToDeactivate(station);
    setDeactivateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nurse Stations</h1>
          <p className="text-muted-foreground mt-1">Manage hospital-wide nursing workforce configuration.</p>
        </div>
        <ScopeIndicator scope="Hospital Admin" />
      </div>

      <div className="flex justify-between items-center bg-background p-4 rounded-md border">
        <div className="flex gap-4 flex-1 max-w-2xl">
          <Input placeholder="Search station name..." className="max-w-xs" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Intensive Care">Intensive Care</SelectItem>
              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location / Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Block A">Block A</SelectItem>
              <SelectItem value="Block B">Block B</SelectItem>
              <SelectItem value="Main Bldg">Main Bldg</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { setEditingStation(null); setIsFormOpen(true); }}>+ Create Nurse Station</Button>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Station Name</TableHead>
              <TableHead>Department / Location</TableHead>
              <TableHead>Station Lead</TableHead>
              <TableHead className="text-center"># Nurses</TableHead>
              <TableHead className="text-center"># Support</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStations.map((station) => {
              const lead = mockNurses.find(n => n.id === station.leadId);
              const nurseCount = mockNurses.filter(n => n.stationId === station.id).length;
              const supportCount = mockSupportStaff.filter(s => s.stationId === station.id).length;

              return (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>
                    <div>{station.department}</div>
                    <div className="text-xs text-muted-foreground">{station.location}</div>
                  </TableCell>
                  <TableCell>{lead?.name || 'Unassigned'}</TableCell>
                  <TableCell className="text-center">{nurseCount}</TableCell>
                  <TableCell className="text-center">{supportCount}</TableCell>
                  <TableCell><StatusBadge status={station.status} /></TableCell>
                  <TableCell className="text-right space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href={`/nurse-stations/${station.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(station)}>
                          Edit Station
                        </DropdownMenuItem>
                        {station.status === 'Active' && (
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeactivate(station)}>
                            Deactivate Station
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <NurseStationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} station={editingStation} />
      
      {stationToDeactivate && (
        <DeactivateStationModal 
          isOpen={deactivateModalOpen} 
          onClose={() => setDeactivateModalOpen(false)} 
          onConfirm={() => {
            // Force reassign logic would go here
            setDeactivateModalOpen(false);
          }}
          stationName={stationToDeactivate.name}
          activeRosterCount={mockRoster.filter(r => r.stationId === stationToDeactivate.id && r.status !== 'Cancelled').length}
        />
      )}
    </div>
  );
}
