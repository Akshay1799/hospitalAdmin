"use client";

import React, { useState } from 'react';
import { mockSupportStaff, mockStations } from '@/lib/mock/nursing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ScopeIndicator } from '@/components/shared/ScopeIndicator';
import { SupportStaffForm } from '@/components/support-staff/SupportStaffForm';

export default function SupportStaffPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const handleEdit = (staff: any) => {
    setEditingStaff(staff);
    setIsFormOpen(true);
  };

  const handleDeactivate = (staff: any) => {
    console.log('Deactivating support staff:', staff.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Staff</h1>
          <p className="text-muted-foreground mt-1">Manage attendants, housekeeping, and assistants.</p>
        </div>
        <ScopeIndicator scope="Hospital Admin" />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setIsFormOpen(true)}>+ Add Support Staff</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assigned Station</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSupportStaff.map((staff) => {
              const stationName = mockStations.find(s => s.id === staff.stationId)?.name || 'Unassigned';
              return (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.type}</TableCell>
                  <TableCell>{stationName}</TableCell>
                  <TableCell><StatusBadge status={staff.status} /></TableCell>
                  <TableCell className="text-right space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(staff)}>
                          Edit Staff
                        </DropdownMenuItem>
                        {staff.status !== 'Unassigned' && (
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeactivate(staff)}>
                            Deactivate Staff
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

      <SupportStaffForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} staff={editingStaff} />
    </div>
  );
}
