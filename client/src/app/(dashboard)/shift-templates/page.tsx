"use client";

import React, { useState } from 'react';
import { mockShiftTemplates } from '@/lib/mock/nursing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ScopeIndicator } from '@/components/shared/ScopeIndicator';
import { ShiftTemplateForm } from '@/components/shift-templates/ShiftTemplateForm';
import { Badge } from '@/components/ui/badge';

export default function ShiftTemplatesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shift Templates</h1>
          <p className="text-muted-foreground mt-1">Configure hospital-wide default shift timings.</p>
        </div>
        <ScopeIndicator scope="Hospital Admin" />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setIsFormOpen(true)}>+ Create Template</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockShiftTemplates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>{template.startTime}</TableCell>
                <TableCell>{template.endTime}</TableCell>
                <TableCell>
                  {template.isDefault ? <Badge variant="secondary">Hospital Default</Badge> : '-'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ShiftTemplateForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
