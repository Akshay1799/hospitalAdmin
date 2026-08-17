"use client";

import { Building2, Globe, KeyRound, Save, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  function handleSave(section: string) {
    return (e: React.FormEvent) => {
      e.preventDefault();
      toast({ title: `${section} saved`, description: "Your changes have been saved." });
    };
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Organization profile, locations, notification rules and security."
        crumbs={[{ label: "Administration" }, { label: "Settings" }]}
      />

      <Tabs defaultValue="organization">
        <TabsList className="flex-wrap">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Organization profile
              </CardTitle>
              <CardDescription>Name, logo, contact and public profile information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave("Organization profile")} className="grid gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="org-name">Organization name</Label>
                    <Input id="org-name" defaultValue="Qlyno Multispecialty Hospital" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="org-type">Operating model</Label>
                    <Select defaultValue="hospital">
                      <SelectTrigger id="org-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solo">Solo Doctor</SelectItem>
                        <SelectItem value="multi-doctor">Multi-Doctor Clinic</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="org-email">Contact email</Label>
                    <Input id="org-email" type="email" defaultValue="admin@qlyno.health" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="org-phone">Contact phone</Label>
                    <Input id="org-phone" defaultValue="+91 22 4000 1200" />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="org-about">About / description</Label>
                  <Textarea id="org-about" rows={3} defaultValue="A modern multispecialty hospital offering cardiology, orthopedics, pediatrics, gynecology and general medicine services." />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save /> Save changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Hospital locations
              </CardTitle>
              <CardDescription>Manage hospital facilities, timings and services.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[
                { name: "Qlyno Multispecialty Hospital - Main Campus", hours: "Mon–Sat, 9:00 AM – 8:00 PM" },
              ].map((loc) => (
                <div key={loc.name} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="text-sm font-medium">{loc.name}</p>
                    <p className="text-xs text-muted-foreground">{loc.hours}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Location editor opened" })}>
                    Edit
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-fit" onClick={() => toast({ title: "New location added" })}>
                Add location
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification rules</CardTitle>
              <CardDescription>Control which events trigger in-app and WhatsApp notifications.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              {[
                { label: "Appointment confirmations & reminders", desc: "Sent to patient and assigned doctor" },
                { label: "Report ready / doctor reviewed", desc: "Sent to patient and ordering doctor" },
                { label: "Outstanding payment reminders", desc: "Sent to patient per configured policy" },
                { label: "Staffing gap & overdue task alerts", desc: "Sent to Nurse Station Lead / Admin" },
                { label: "Emergency escalation alerts", desc: "Sent to responsible doctor + clinical team" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => toast({ title: "Notification rule updated" })} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" /> Authentication
                </CardTitle>
                <CardDescription>Session and password policy for admin accounts.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col divide-y divide-border">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">Require multi-factor authentication</p>
                    <p className="text-xs text-muted-foreground">Recommended for all admin and privileged roles</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">Auto sign-out after inactivity</p>
                    <p className="text-xs text-muted-foreground">30 minutes of inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">Restrict access by IP allowlist</p>
                    <p className="text-xs text-muted-foreground">Applies to billing and admin roles only</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
            <Card className="border-warning/30 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-warning" /> Data & audit
                </CardTitle>
                <CardDescription>Every sensitive action is logged and cannot be silently altered.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Financial records are never hard-deleted — cancellations, refunds and discounts use controlled,
                  auditable workflows. Clinical notes remain outside billing/reception authority. Access follows
                  organization + role + resource scope, enforced server-side rather than only in the UI.
                </p>
                <Separator />
                <p>Full audit trail available under Administration → Audit Logs.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
