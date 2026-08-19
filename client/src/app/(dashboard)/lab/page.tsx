"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertOctagon,
  FileText,
  FlaskConical,
  MoreHorizontal,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScopeIndicator } from "@/components/shared/ScopeIndicator";
import { Toolbar } from "@/components/shared/toolbar";
import { useToast } from "@/hooks/use-toast";
import { labOrders } from "@/lib/mock-data/operations";
import { LabOrder } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const DELEGATION_STRING = "Performed by Hospital Admin • acting within Lab Management workflow";

export default function LabOrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { toast } = useToast();

  // Recollection Modal State
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [recollectModalOpen, setRecollectModalOpen] = useState(false);
  const [recollectReason, setRecollectReason] = useState("Hemolyzed sample during transit");
  const [recollectNotes, setRecollectNotes] = useState("");

  const filtered = labOrders.filter((o) => {
    const matchesSearch =
      o.patientName.toLowerCase().includes(search.toLowerCase()) || o.test.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || o.status === status;
    return matchesSearch && matchesStatus;
  });

  const critical = labOrders.filter((o) => o.critical);

  const handleOpenReportPage = (orderId: string) => {
    router.push(`/lab/${orderId}`);
  };

  const handleOpenRecollect = (e: React.MouseEvent, order: LabOrder) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setRecollectModalOpen(true);
  };

  const handleConfirmRecollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    toast({
      title: "Recollection Requested",
      description: `Dispatched recollection alert for ${selectedOrder.patientName} (${selectedOrder.test}) - Reason: ${recollectReason}. (${DELEGATION_STRING})`,
    });
    setRecollectModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Lab Orders & Diagnostic Reports"
        description="Central laboratory management network — clinical pathology, biochemistry, imaging and verified diagnostic reports."
        crumbs={[{ label: "Care Delivery" }, { label: "Lab Orders" }]}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <ScopeIndicator scope="Hospital Admin" stationName="Central Pathology & Diagnostics" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
          <ShieldAlert className="h-3.5 w-3.5 text-warning" />
          <span>Operational report tracking • Click any order to open full diagnostic report page</span>
        </div>
      </div>

      {critical.length > 0 && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <AlertOctagon className="h-5 w-5 text-destructive shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-semibold text-destructive">{critical.length} Critical Result(s)</span> awaiting immediate clinician
                acknowledgement — {critical.map((c) => `${c.patientName} (${c.test})`).join(", ")}.
              </p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleOpenReportPage(critical[0].id)}
            >
              View Critical Report
            </Button>
          </CardContent>
        </Card>
      )}

      <Toolbar searchValue={search} onSearchChange={setSearch} placeholder="Search by patient name, test or order number...">
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

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState icon={FlaskConical} title="No lab orders found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Diagnostic Test</TableHead>
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
                <TableRow
                  key={o.id}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleOpenReportPage(o.id)}
                >
                  <TableCell className="font-mono text-xs font-semibold text-primary">{o.orderNo}</TableCell>
                  <TableCell className="text-sm font-medium">
                    {o.patientName}
                    {o.critical && (
                      <Badge variant="destructive" className="ml-2 text-[10px]">
                        Critical
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{o.test}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.orderingDoctor}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.source}</TableCell>
                  <TableCell className="text-sm font-mono text-xs">{o.tat}</TableCell>
                  <TableCell className="text-sm">{formatDate(o.orderedOn)}</TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/lab/${o.id}`} className="flex items-center cursor-pointer">
                            <FileText className="mr-2 h-4 w-4 text-primary" />
                            View report
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleOpenRecollect(e, o)}>
                          <RefreshCw className="mr-2 h-4 w-4 text-warning" />
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

      {/* REQUEST RECOLLECTION MODAL */}
      <Dialog open={recollectModalOpen} onOpenChange={setRecollectModalOpen}>
        <DialogContent className="max-w-md">
          {selectedOrder && (
            <form onSubmit={handleConfirmRecollection}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-warning" /> Request Sample Recollection
                </DialogTitle>
                <DialogDescription>
                  Trigger immediate notification to phlebotomy & collection station for {selectedOrder.patientName}.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3 text-xs">
                <div className="p-2.5 rounded bg-muted/40 border border-border">
                  <p><strong>Order No:</strong> {selectedOrder.orderNo}</p>
                  <p><strong>Test:</strong> {selectedOrder.test}</p>
                  <p><strong>Ordering Doctor:</strong> {selectedOrder.orderingDoctor}</p>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="recollect-reason">Primary Recollection Reason</Label>
                  <Select value={recollectReason} onValueChange={setRecollectReason}>
                    <SelectTrigger id="recollect-reason">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hemolyzed sample during transit">Hemolyzed sample during transit</SelectItem>
                      <SelectItem value="Insufficient specimen volume (QNS)">Insufficient specimen volume (QNS)</SelectItem>
                      <SelectItem value="Clotted blood specimen in EDTA tube">Clotted blood specimen in EDTA tube</SelectItem>
                      <SelectItem value="Lipemic / Icteric interference">Lipemic / Icteric interference</SelectItem>
                      <SelectItem value="Sample temperature breach during cold-chain">Sample temperature breach during cold-chain</SelectItem>
                      <SelectItem value="Clinician requested repeat confirmation">Clinician requested repeat confirmation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="recollect-notes">Additional Phlebotomy Instructions</Label>
                  <Input
                    id="recollect-notes"
                    placeholder="e.g. Draw minimum 4ml in lavender EDTA tube and keep refrigerated"
                    value={recollectNotes}
                    onChange={(e) => setRecollectNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setRecollectModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="destructive">
                  Send Recollection Request
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
