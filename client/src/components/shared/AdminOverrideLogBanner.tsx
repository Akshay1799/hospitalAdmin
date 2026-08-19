import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AdminOverrideLogBanner() {
  return (
    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive mb-4">
      <ShieldAlert className="h-4 w-4" />
      <AlertDescription className="font-semibold text-xs ml-2">
        Performed by Hospital Admin • acting within Nurse Station workflow
      </AlertDescription>
    </Alert>
  );
}
