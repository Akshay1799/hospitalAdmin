"use client";

import { useState } from "react";
import { AlertOctagon, FlaskConical, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Toolbar } from "@/components/shared/toolbar";
import { useToast } from "@/hooks/use-toast";
import { labOrders } from "@/lib/mock-data/operations";
import { formatDate } from "@/lib/utils";

export default function LabOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { toast } = useToast();

  const filtered = labOrders.filter((o) => {
    const matchesSearch =
      o.patientName.toLowerCase().includes(search.toLowerCase()) || o.test.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || o.status === status;
    return matchesSearch && matchesStatus;
  });

  const critical = labOrders.filter((o) => o.critical);

  return (
    <div>
      <PageHeader
        title="Lab Orders"
        description="Independent lab network — standalone, clinic-connected and hospital-connected orders."
        crumbs={[{ label: "Care Delivery" }, { label: "Lab Orders" }]}
      />

      {critical.length > 0 && (
        <Card className="mb-4 border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertOctagon className="h-5 w-5 text-destructive" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">{critical.length} critical result(s)</span> awaiting clinician
              acknowledgement — {critical.map((c) => c.patientName).join(", ")}.
            </p>
          </CardContent>
        </Card>
      )}

      <Toolbar searchValue={search} onSearchChange={setSearch} placeholder="Search by patient or test">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="sample-pending">Sample Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="awaiting-validation">Awaiting Validation</SelectItem>
            <SelectItem value="released">Released</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState icon={FlaskConical} title="No lab orders found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Ordering Doctor</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>TAT</TableHead>
                <TableHead>Ordered On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.orderNo}</TableCell>
                  <TableCell className="text-sm font-medium">
                    {o.patientName}
                    {o.critical && (
                      <Badge variant="destructive" className="ml-2">
                        Critical
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{o.test}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.orderingDoctor}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.source}</TableCell>
                  <TableCell className="text-sm">{o.tat}</TableCell>
                  <TableCell className="text-sm">{formatDate(o.orderedOn)}</TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({ title: "Report opened" })}>
                          View report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Recollection requested" })}>
                          Request recollection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
