"use client";

import React, { useState } from 'react';
import { mockNurses, mockStations } from '@/lib/mock/nursing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ScopeIndicator } from '@/components/shared/ScopeIndicator';
import { NurseForm } from '@/components/nurses/NurseForm';

export default function NursesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState<any>(null);

  const handleEdit = (nurse: any) => {
    setEditingNurse(nurse);
    setIsFormOpen(true);
  };

  const handleDeactivate = (nurse: any) => {
    // In a real app, this would show a confirmation modal and update the backend
    console.log('Deactivating nurse:', nurse.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nurses</h1>
          <p className="text-muted-foreground mt-1">Global directory of nursing staff.</p>
        </div>
        <ScopeIndicator scope="Hospital Admin" />
      </div>

      <div className="flex justify-between items-center bg-background p-4 rounded-md border">
        <div className="flex gap-4 flex-1 max-w-2xl">
          <Input placeholder="Search by name or ID..." className="max-w-xs" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Intensive Care">Intensive Care</SelectItem>
              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Station" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              {mockStations.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="On Duty">On Duty</SelectItem>
              <SelectItem value="Off Duty">Off Duty</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { setEditingNurse(null); setIsFormOpen(true); }}>+ Register Nurse</Button>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name / ID</TableHead>
              <TableHead>Role / Scope</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Assigned Station</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockNurses.map((nurse) => {
              const stationName = mockStations.find(s => s.id === nurse.stationId)?.name || 'Unassigned';
              return (
                <TableRow key={nurse.id}>
                  <TableCell>
                    <div className="font-medium">{nurse.name}</div>
                    <div className="text-xs text-muted-foreground">{nurse.id}</div>
                  </TableCell>
                  <TableCell>{nurse.roleScope}</TableCell>
                  <TableCell>{nurse.department}</TableCell>
                  <TableCell>{stationName}</TableCell>
                  <TableCell><StatusBadge status={nurse.status} /></TableCell>
                  <TableCell className="text-right space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(nurse)}>
                          Edit Nurse
                        </DropdownMenuItem>
                        {nurse.status !== 'Unassigned' && (
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeactivate(nurse)}>
                            Deactivate Nurse
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

      <NurseForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} nurse={editingNurse} />
    </div>
  );
}
