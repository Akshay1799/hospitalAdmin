"use client";

import { useState } from "react";
import { HeartPulse, MoreHorizontal, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { nurses } from "@/lib/mock-data/staff";
import { getInitials } from "@/lib/utils";

export default function NursesPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filtered = nurses.filter((n) => n.name.toLowerCase().includes(search.toLowerCase()));
  const overdueTotal = nurses.reduce((sum, n) => sum + n.tasksOverdue, 0);

  return (
    <div>
      <PageHeader
        title="Nurses"
        description="Nurse Station coordination layer for multi-doctor clinics and hospitals."
        crumbs={[{ label: "Clinic Staff" }, { label: "Nurses" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Add Nurse
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  toast({ title: "Nurse invited" });
                }}
              >
                <DialogHeader>
                  <DialogTitle>Add a nurse</DialogTitle>
                  <DialogDescription>Assign to a station, department and shift pattern.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="nur-name">Full name</Label>
                    <Input id="nur-name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="nur-dept">Department</Label>
                      <Select defaultValue="General Ward">
                        <SelectTrigger id="nur-dept">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Ward">General Ward</SelectItem>
                          <SelectItem value="ICU">ICU</SelectItem>
                          <SelectItem value="OPD">OPD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="nur-shift">Shift</Label>
                      <Select defaultValue="Morning">
                        <SelectTrigger id="nur-shift">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
                          <SelectItem value="Night">Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add nurse</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {overdueTotal > 0 && (
        <Card className="mb-4 border-warning/40 bg-warning/5">
          <CardContent className="flex items-center gap-3 p-4">
            <HeartPulse className="h-5 w-5 text-warning" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">{overdueTotal} overdue nursing task(s)</span> across active stations — review the Nurse Station exceptions queue.
            </p>
          </CardContent>
        </Card>
      )}

      <Toolbar searchValue={search} onSearchChange={setSearch} placeholder="Search nurses" />

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState icon={HeartPulse} title="No nurses found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nurse</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Department / Station</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={n.avatarUrl} alt={n.name} />
                        <AvatarFallback>{getInitials(n.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{n.name}</p>
                        <p className="text-xs text-muted-foreground">{n.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{n.level}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {n.department} · {n.station}
                  </TableCell>
                  <TableCell className="text-sm">{n.shift}</TableCell>
                  <TableCell className="text-sm">{n.assignedPatients}</TableCell>
                  <TableCell className="text-sm">
                    {n.tasksPending} pending
                    {n.tasksOverdue > 0 && <span className="ml-1.5 text-destructive">· {n.tasksOverdue} overdue</span>}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={n.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({ title: "Roster opened" })}>
                          View roster
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Task assigned" })}>Assign task</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Shift changed" })}>Change shift</DropdownMenuItem>
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
