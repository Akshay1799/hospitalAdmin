"use client";

import { useState } from "react";
import { Check, Plus, ShieldCheck, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { useToast } from "@/hooks/use-toast";
import { roles } from "@/lib/mock-data/operations";

export default function RolesPage() {
  const [selected, setSelected] = useState(roles[0].id);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const role = roles.find((r) => r.id === selected)!;

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Server-side enforced access: organization + role + resource scope + action permission."
        crumbs={[{ label: "Administration" }, { label: "Roles & Permissions" }]}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Create Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  toast({ title: "Custom role created" });
                }}
              >
                <DialogHeader>
                  <DialogTitle>Create a custom role</DialogTitle>
                  <DialogDescription>Define a new role with module-level permissions.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="role-name">Role name</Label>
                    <Input id="role-name" placeholder="e.g. Front Office Supervisor" required />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="role-desc">Description</Label>
                    <Textarea id="role-desc" placeholder="What this role is responsible for" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create role</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Roles</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 p-2">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  selected === r.id ? "bg-primary/10 text-primary-700 font-medium" : "hover:bg-secondary text-foreground"
                }`}
              >
                <span>{r.name}</span>
                <Badge variant="muted" className="ml-2">
                  {r.userCount}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> {role.name}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
            </div>
            <Badge variant={role.system ? "info" : "secondary"}>{role.system ? "System role" : "Custom role"}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead className="text-center">View</TableHead>
                  <TableHead className="text-center">Create</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                  <TableHead className="text-center">Approve</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {role.permissions.map((p) => (
                  <TableRow key={p.module}>
                    <TableCell className="text-sm font-medium">{p.module}</TableCell>
                    {(["view", "create", "edit", "delete", "approve"] as const).map((action) => (
                      <TableCell key={action} className="text-center">
                        {p[action] ? (
                          <Check className="mx-auto h-4 w-4 text-success" />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
