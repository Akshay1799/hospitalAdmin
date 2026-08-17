"use client";

import { Building2, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { hospitalDepartments } from "@/lib/mock-data/hospital-operations";

export default function DepartmentsPage() {
  return (
    <div>
      <PageHeader
        title="Departments"
        description="Operational departments, care units and department heads across the hospital network."
        crumbs={[{ label: "Care Delivery" }, { label: "Departments" }]}
        actions={
          <Button>
            <Plus /> Add department
          </Button>
        }
      />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hospitalDepartments.map((dept) => (
          <Card key={dept.id}>
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4 text-primary" />
                  {dept.name}
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{dept.type}</p>
              </div>
              <StatusBadge status={dept.status} />
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Location</span>
                <span className="font-medium text-foreground">{dept.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Head</span>
                <span className="font-medium text-foreground">{dept.headName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active patients</span>
                <span className="font-medium text-foreground">{dept.activePatients}</span>
              </div>
              {dept.bedCapacity && (
                <div className="flex items-center justify-between">
                  <span>Bed capacity</span>
                  <span className="font-medium text-foreground">{dept.bedCapacity}</span>
                </div>
              )}
              <div className="pt-2">
                <Badge variant="outline">Department scope</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
