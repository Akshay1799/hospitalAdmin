"use client";

import { notFound, useParams } from "next/navigation";
import {
  Droplet,
  FileText,
  Mail,
  MapPin,
  Phone,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Tag,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { appointments } from "@/lib/mock-data/appointments";
import { invoices } from "@/lib/mock-data/invoices";
import { patients } from "@/lib/mock-data/patients";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>();
  const patient = patients.find((p) => p.id === params.id);
  if (!patient) notFound();

  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
  const patientInvoices = invoices.filter((i) => i.patientId === patient.id);

  return (
    <div>
      <PageHeader
        title={patient.name}
        crumbs={[{ label: "Patients", href: "/patients" }, { label: patient.name }]}
        actions={
          <Button variant="outline">
            <FileText /> View documents
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} />
              <AvatarFallback className="text-lg">{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-display text-lg font-semibold">{patient.name}</h2>
              <p className="font-mono text-xs text-muted-foreground">{patient.uhid}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={patient.status} />
              <Badge variant="info" dot>
                <ShieldCheck className="h-3 w-3" /> Verified ID
              </Badge>
            </div>
            <Separator />
            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{patient.address}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Droplet className="h-4 w-4 text-muted-foreground" />
                <span>Blood Group: {patient.bloodGroup}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span>{patient.primaryDoctor}</span>
              </div>
            </div>
            <Separator />
            <div className="flex w-full flex-wrap gap-1.5">
              {patient.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  <Tag className="h-3 w-3" /> {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Age / Gender</p>
                <p className="font-display text-xl font-semibold">
                  {patient.age} · {patient.gender}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="font-display text-xl font-semibold">{formatCurrency(patient.totalSpent)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Outstanding</p>
                <p className="font-display text-xl font-semibold text-destructive">
                  {formatCurrency(patient.outstandingBalance)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="timeline">
            <TabsList>
              <TabsTrigger value="timeline">Appointments</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="sharing">Consent & Sharing</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <Card>
                <CardContent className="p-0">
                  {patientAppointments.length === 0 ? (
                    <p className="p-6 text-center text-sm text-muted-foreground">No appointments recorded yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientAppointments.map((a) => (
                          <TableRow key={a.id}>
                            <TableCell className="font-medium">{a.doctorName}</TableCell>
                            <TableCell>
                              {formatDate(a.date)} · {a.time}
                            </TableCell>
                            <TableCell>{a.type}</TableCell>
                            <TableCell className="text-muted-foreground">{a.reason}</TableCell>
                            <TableCell>
                              <StatusBadge status={a.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="billing">
              <Card>
                <CardContent className="p-0">
                  {patientInvoices.length === 0 ? (
                    <p className="p-6 text-center text-sm text-muted-foreground">No invoices for this patient.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientInvoices.map((inv) => (
                          <TableRow key={inv.id}>
                            <TableCell className="font-mono text-xs">{inv.invoiceNo}</TableCell>
                            <TableCell>{inv.service}</TableCell>
                            <TableCell>{formatCurrency(inv.amount)}</TableCell>
                            <TableCell>
                              <StatusBadge status={inv.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sharing">
              <Card>
                <CardContent className="flex items-start gap-3 p-5">
                  <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    This patient owns and controls access to their connected health information. Providers see
                    only what&apos;s required for their authorized care relationship — sharing across
                    organizations happens only with explicit, revocable patient consent.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
