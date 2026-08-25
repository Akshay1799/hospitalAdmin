"use client";

import React from 'react';
import { mockAuditLogs, mockStations, mockNurses } from '@/lib/mock/nursing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScopeIndicator } from '@/components/shared/ScopeIndicator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateTime } from '@/lib/utils';

export default function NursingAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nursing Audit Log</h1>
          <p className="text-muted-foreground mt-1">Full scope activity tracking across all stations.</p>
        </div>
        <ScopeIndicator scope="Hospital Admin" />
      </div>

      <div className="flex gap-4 bg-background p-4 rounded-md border">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Station" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stations</SelectItem>
            {mockStations.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Staff Actor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actors</SelectItem>
            <SelectItem value="system">System Admin</SelectItem>
            {mockNurses.map(n => <SelectItem key={n.id} value={n.name}>{n.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="CREATE_STATION">CREATE_STATION</SelectItem>
            <SelectItem value="ASSIGN_SHIFT">ASSIGN_SHIFT</SelectItem>
            <SelectItem value="OVERRIDE_PATIENT">OVERRIDE_PATIENT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Changes</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Scope</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium" suppressHydrationWarning>{formatDateTime(log.timestamp)}</TableCell>
                <TableCell>{log.actor}</TableCell>
                <TableCell><span className="bg-muted px-2 py-1 rounded text-xs font-mono">{log.action}</span></TableCell>
                <TableCell>{log.entity}</TableCell>
                <TableCell className="text-xs">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground line-through">{log.before}</span>
                    <span className="text-foreground">{log.after}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={log.reason}>{log.reason}</TableCell>
                <TableCell>{log.stationScope}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
