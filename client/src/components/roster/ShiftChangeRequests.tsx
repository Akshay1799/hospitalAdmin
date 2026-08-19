import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ShiftChangeRequest, Nurse, ShiftTemplate } from '@/lib/mock/nursing';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AdminOverrideLogBanner } from '@/components/shared/AdminOverrideLogBanner';
import { useToast } from "@/hooks/use-toast";

interface ShiftChangeRequestsProps {
  requests: ShiftChangeRequest[];
  staffList: Nurse[];
  shiftTemplates: ShiftTemplate[];
}

export function ShiftChangeRequests({ requests, staffList, shiftTemplates }: ShiftChangeRequestsProps) {
  const { toast } = useToast();
  
  const handleApprove = (staffName: string) => {
    toast({ title: "Shift Change Approved", description: `Approved shift change for ${staffName}.` });
  };

  const handleReject = (staffName: string) => {
    toast({ title: "Shift Change Rejected", description: `Rejected shift change for ${staffName}.`, variant: "destructive" });
  };

  return (
    <div className="space-y-4">
      <AdminOverrideLogBanner />
      <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Member</TableHead>
            <TableHead>Requested Date</TableHead>
            <TableHead>Target Shift</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => {
            const staff = staffList.find(s => s.id === req.staffId);
            const shift = shiftTemplates.find(s => s.id === req.targetShiftTemplateId);

            return (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{staff?.name || 'Unknown'}</TableCell>
                <TableCell>{req.targetDate}</TableCell>
                <TableCell>{shift?.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate" title={req.reason}>
                  {req.reason}
                </TableCell>
                <TableCell>
                  <StatusBadge status={req.status} />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {req.status === 'Pending' && (
                    <>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10" onClick={() => handleReject(staff?.name || 'Unknown')}>Reject</Button>
                      <Button size="sm" onClick={() => handleApprove(staff?.name || 'Unknown')}>Approve</Button>
                    </>
                  )}
                  {req.status !== 'Pending' && (
                    <span className="text-sm text-muted-foreground"><StatusBadge status={req.status} /></span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No shift change requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
