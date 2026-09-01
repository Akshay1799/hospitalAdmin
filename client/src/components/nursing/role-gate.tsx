"use client";

import { ShieldAlert } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AppUserRole } from "@/lib/types/nursing-module";
import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RoleGate({
  allowed,
  message,
  children,
}: {
  allowed: AppUserRole[];
  message?: string;
  children: React.ReactNode;
}) {
  const role = useSelector((state: RootState) => state.nursingOperations.currentRole);
  if (allowed.includes(role)) return <>{children}</>;

  const homeHref =
    role === "nurse"
      ? "/nurse"
      : role === "support_staff"
      ? "/support-staff"
      : role === "nurse_lead" || role === "senior_nurse"
      ? "/nurse-station"
      : "/dashboard";

  return (
    <div className="flex items-center justify-center p-6 min-h-[50vh]">
      <Card className="max-w-xl w-full border-amber-500/30 bg-amber-500/5 shadow-sm">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground text-sm">Access Restricted by Role Scope</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {message || "This workspace is outside your assigned role and patient-care scope according to PRD Section 12 & Section 20."}
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="text-xs shrink-0" asChild>
            <Link href={homeHref}>Return to My Workspace</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
