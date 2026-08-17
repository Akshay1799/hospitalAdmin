"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Toolbar } from "@/components/shared/toolbar";
import { useToast } from "@/hooks/use-toast";
import { invoices } from "@/lib/mock-data/invoices";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CheckCircle2, IndianRupee, Receipt as ReceiptIcon, Wallet } from "lucide-react";

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filtered = invoices.filter((i) => {
    const matchesSearch =
      i.patientName.toLowerCase().includes(search.toLowerCase()) || i.invoiceNo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || i.status === status;
    return matchesSearch && matchesStatus;
  });

  const totals = useMemo(() => {
    const collected = invoices.reduce((sum, i) => sum + i.paid, 0);
    const outstanding = invoices.reduce((sum, i) => sum + i.outstanding, 0);
    const paidCount = invoices.filter((i) => i.status === "paid").length;
    return { collected, outstanding, paidCount };
  }, []);

  return (
    <div>
      <PageHeader
        title="Billing & Invoices"
        description="One shared billing engine across solo doctor, clinic and hospital contexts."
        crumbs={[{ label: "Finance" }, { label: "Billing & Invoices" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  toast({ title: "Invoice created" });
                }}
              >
                <DialogHeader>
                  <DialogTitle>Create invoice</DialogTitle>
                  <DialogDescription>Generated from a chargeable service linked to a patient encounter.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="inv-patient">Patient</Label>
                    <Input id="inv-patient" placeholder="Search patient by name or UHID" required />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="inv-service">Service</Label>
                    <Input id="inv-service" placeholder="e.g. Consultation - Cardiology" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="inv-amount">Amount (₹)</Label>
                      <Input id="inv-amount" type="number" min={0} required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="inv-method">Payment method</Label>
                      <Select defaultValue="Cash">
                        <SelectTrigger id="inv-method">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Insurance">Insurance</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create invoice</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Collected" value={formatCurrency(totals.collected)} icon={IndianRupee} tone="success" />
        <StatCard label="Outstanding" value={formatCurrency(totals.outstanding)} icon={Wallet} tone="warning" />
        <StatCard label="Paid Invoices" value={`${totals.paidCount} / ${invoices.length}`} icon={CheckCircle2} tone="primary" />
      </div>

      <div className="mt-4">
        <Toolbar searchValue={search} onSearchChange={setSearch} placeholder="Search by patient or invoice no.">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="partially-paid">Partially Paid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </Toolbar>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState icon={Receipt} title="No invoices found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Issued On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs">{inv.invoiceNo}</TableCell>
                  <TableCell className="text-sm font-medium">{inv.patientName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.service}</TableCell>
                  <TableCell className="text-sm">{formatCurrency(inv.amount)}</TableCell>
                  <TableCell className="text-sm">
                    {inv.outstanding > 0 ? (
                      <span className="font-medium text-destructive">{formatCurrency(inv.outstanding)}</span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(inv.issuedOn)}</TableCell>
                  <TableCell>
                    <StatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({ title: "Invoice opened" })}>
                          <ReceiptIcon className="h-4 w-4" /> View invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Payment recorded" })}>
                          Record payment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Refund requested" })}>
                          Request refund
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
