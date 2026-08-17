"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreHorizontal, Plus, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { patients } from "@/lib/mock-data/patients";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.uhid.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchesStatus = status === "all" || p.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Patients"
        description="One Qlyno Patient ID across solo doctor, clinic, hospital and lab relationships."
        crumbs={[{ label: "Care Delivery" }, { label: "Patients" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Register Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  toast({ title: "Patient registered", description: "A new Qlyno Patient ID has been created." });
                }}
              >
                <DialogHeader>
                  <DialogTitle>Register a new patient</DialogTitle>
                  <DialogDescription>
                    Qlyno checks for an existing Patient ID first to prevent duplicate identities.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="pat-name">Full name</Label>
                    <Input id="pat-name" placeholder="Patient name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="pat-phone">Phone</Label>
                      <Input id="pat-phone" placeholder="+91 90000 00000" required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="pat-dob">Date of birth</Label>
                      <Input id="pat-dob" type="date" required />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="pat-doctor">Primary doctor</Label>
                    <Select>
                      <SelectTrigger id="pat-doctor">
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rao">Dr. Ananya Rao</SelectItem>
                        <SelectItem value="mehta">Dr. Rohan Mehta</SelectItem>
                        <SelectItem value="iyer">Dr. Kavya Iyer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Register patient</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Toolbar searchValue={search} onSearchChange={setSearch} placeholder="Search by name, UHID or phone">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No patients found" description="Adjust your search or filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>UHID</TableHead>
                <TableHead>Age / Gender</TableHead>
                <TableHead>Primary Doctor</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link href={`/patients/${p.id}`} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={p.avatarUrl} alt={p.name} />
                        <AvatarFallback>{getInitials(p.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground hover:text-primary">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.phone}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.uhid}</TableCell>
                  <TableCell className="text-sm">
                    {p.age} · {p.gender}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.primaryDoctor}</TableCell>
                  <TableCell className="text-sm">{formatDate(p.lastVisit)}</TableCell>
                  <TableCell className="text-sm">
                    {p.outstandingBalance > 0 ? (
                      <span className="font-medium text-destructive">{formatCurrency(p.outstandingBalance)}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/patients/${p.id}`}>View record</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/appointments">Book appointment</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Sharing permissions opened" })}>
                          Manage sharing/consent
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
      <p className="mt-3 text-xs text-muted-foreground">
        Showing {filtered.length} of {patients.length} patients
      </p>
    </div>
  );
}
