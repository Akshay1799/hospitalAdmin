"use client";

import React from 'react';
import { mockNurses } from '@/lib/mock/nursing';
import { ScopeIndicator } from '@/components/shared/ScopeIndicator';
import { PermissionMatrix } from '@/components/permissions/PermissionMatrix';

export default function StaffPermissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Permissions</h1>
          <p className="text-muted-foreground mt-1">Configure delegated station-scoped and hospital-wide access.</p>
        </div>
        <ScopeIndicator scope="Hospital Admin" />
      </div>

      <div className="bg-background p-6 rounded-md border shadow-sm mt-4">
         <PermissionMatrix staffList={mockNurses} />
      </div>
    </div>
  );
}
