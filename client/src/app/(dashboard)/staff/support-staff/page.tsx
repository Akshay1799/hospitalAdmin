"use client";

import { BellRing, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { supportStaff } from "@/lib/mock-data/hospital-operations";
import { getInitials } from "@/lib/utils";

export default function SupportStaffPage() {
  return (
    <div>
      <PageHeader
        title="Support Staff"
        description="Task-based operational support staff for admissions, housekeeping, triage assistance and other service units."
        crumbs={[{ label: "Hospital Operations" }, { label: "Support Staff" }]}
        actions={
          <Button>
            <Plus /> Add support staff
          </Button>
        }
      />

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {supportStaff.map((member) => (
          <div key={member.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <StatusBadge status={member.status} />
            </div>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Department</span>
                <span className="font-medium text-foreground">{member.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Assignment</span>
                <span className="font-medium text-foreground">{member.assignment}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Availability</span>
                <span className="font-medium text-foreground">{member.availability}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {member.taskScope.map((task) => (
                  <Badge key={task} variant="outline">{task}</Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <BellRing className="h-3.5 w-3.5" /> Support tasks and service assignments are visible to department heads and admin staff.
      </div>
    </div>
  );
}
