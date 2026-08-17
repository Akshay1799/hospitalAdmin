"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, UserCog } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { StatusBadge } from "@/components/shared/status-badge";
import { Toolbar } from "@/components/shared/toolbar";
import { useToast } from "@/hooks/use-toast";
import { billingStaff } from "@/lib/mock-data/staff";
import { formatCurrency, getInitials } from "@/lib/utils";

export default function BillingStaffPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filtered = billingStaff.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Billing Staff"
        description="Invoicing, payments, refunds and reconciliation — scoped by function, never a separate organization."
        crumbs={[{ label: "Clinic Staff" }, { label: "Billing Staff" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Add Billing Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  toast({ title: "Billing staff invited" });
                }}
              >
                <DialogHeader>
                  <DialogTitle>Add billing staff</DialogTitle>
                  <DialogDescription>Assign a billing scope such as OPD, IPD or Insurance/TPA.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="bil-name">Full name</Label>
                    <Input id="bil-name" required />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="bil-scope">Billing scope</Label>
                    <Select defaultValue="OPD Billing">
                      <SelectTrigger id="bil-scope">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPD Billing">OPD Billing</SelectItem>
                        <SelectItem value="IPD Billing">IPD Billing</SelectItem>
                        <SelectItem value="Insurance/TPA">Insurance / TPA</SelectItem>
                        <SelectItem value="Refund Desk">Refund Desk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Send invitation</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Toolbar searchValue={search} onSearchChange={setSearch} placeholder="Search billing staff" />

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState icon={UserCog} title="No billing staff found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Collections Today</TableHead>
                <TableHead>Pending Invoices</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={b.avatarUrl} alt={b.name} />
                        <AvatarFallback>{getInitials(b.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {b.scopes.map((s) => (
                        <Badge key={s} variant="muted">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{formatCurrency(b.collectionsToday)}</TableCell>
                  <TableCell className="text-sm">{b.pendingInvoices}</TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({ title: "Scope updated" })}>
                          Edit scope
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Discount limit updated" })}>
                          Set discount limit
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
