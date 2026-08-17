"use client";

import { Ambulance as AmbulanceIcon, Gauge, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ambulances } from "@/lib/mock-data/hospital-operations";

export default function AmbulancePage() {
  return (
    <div>
      <PageHeader
        title="Ambulance Dispatch"
        description="Hospital transport availability, dispatch state, and emergency-response resource tracking."
        crumbs={[{ label: "Hospital Operations" }, { label: "Ambulance Dispatch" }]}
        actions={
          <Button>
            <Plus /> Add vehicle
          </Button>
        }
      />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ambulances.map((ambulance) => (
          <Card key={ambulance.id}>
            <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AmbulanceIcon className="h-4 w-4 text-primary" />
                  {ambulance.vehicleNo}
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{ambulance.baseLocation}</p>
              </div>
              <StatusBadge status={ambulance.status} />
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Driver</span>
                <span className="font-medium text-foreground">{ambulance.driverName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Capacity</span>
                <span className="font-medium text-foreground">{ambulance.capacity} stretcher/crew seats</span>
              </div>
              {ambulance.lastDispatchAt && (
                <div className="flex items-center justify-between">
                  <span>Last dispatch</span>
                  <span className="font-medium text-foreground">{ambulance.lastDispatchAt}</span>
                </div>
              )}
              <div className="pt-1">
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5" /> Dispatch ready
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
