"use client";

import { useState } from "react";
import { ClipboardList, MoreHorizontal, Plus } from "lucide-react";

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
import { receptionists } from "@/lib/mock-data/staff";
import { getInitials } from "@/lib/utils";

export default function ReceptionistsPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filtered = receptionists.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Receptionists"
        description="Front-desk staff scoped to a solo doctor, clinic or hospital — never a cross-organization role."
        crumbs={[{ label: "Clinic Staff" }, { label: "Receptionists" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Add Receptionist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  toast({ title: "Receptionist invited" });
                }}
              >
                <DialogHeader>
                  <DialogTitle>Invite a receptionist</DialogTitle>
                  <DialogDescription>Assigned to exactly one context — this clinic.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="rec-name">Full name</Label>
                    <Input id="rec-name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="rec-email">Email</Label>
                      <Input id="rec-email" type="email" required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="rec-phone">Phone</Label>
                      <Input id="rec-phone" required />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="rec-location">Assigned hospital location</Label>
                    <Select defaultValue="main-campus">
                      <SelectTrigger id="rec-location">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-campus">Qlyno Multispecialty Hospital - Front Desk</SelectItem>
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

      <Toolbar searchValue={search} onSearchChange={setSearch} placeholder="Search receptionists" />

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No receptionists found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Appointments Handled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={r.avatarUrl} alt={r.name} />
                        <AvatarFallback>{getInitials(r.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.location}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {r.scope.map((s) => (
                        <Badge key={s} variant="muted">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{r.appointmentsHandled.toLocaleString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({ title: "Permissions opened" })}>
                          Manage permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Location reassigned" })}>
                          Reassign location
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => toast({ title: "Access removed", description: r.name })}
                        >
                          Remove assignment
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
