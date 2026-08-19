import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RosterEntry, Nurse, SupportStaff, ShiftTemplate } from '@/lib/mock/nursing';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface RosterGridProps {
  roster: RosterEntry[];
  staffList: (Nurse | SupportStaff)[];
  shiftTemplates: ShiftTemplate[];
}

export function RosterGrid({ roster, staffList, shiftTemplates }: RosterGridProps) {
  // A simplified view for mock data. In reality, this would be a calendar grid by day/week.
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Staff Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roster.map((entry) => {
            const staff = staffList.find(s => s.id === entry.staffId);
            const shift = shiftTemplates.find(s => s.id === entry.shiftTemplateId);
            const role = entry.staffType === 'Nurse' 
              ? (staff as Nurse)?.roleScope 
              : (staff as SupportStaff)?.type;

            return (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.date}</TableCell>
                <TableCell>{staff?.name || 'Unknown'}</TableCell>
                <TableCell>{role}</TableCell>
                <TableCell>
                  {shift?.name} <span className="text-muted-foreground text-xs">({shift?.startTime}-{shift?.endTime})</span>
                </TableCell>
                <TableCell>{entry.stationId}</TableCell>
                <TableCell>
                  <StatusBadge status={entry.status} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
