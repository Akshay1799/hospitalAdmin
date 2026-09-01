"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Activity,
  Bed,
  Eye,
  EyeOff,
  HeartPulse,
  Lock,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { setCurrentRole } from "@/store/slices/nursingOperationsSlice";
import { AppUserRole } from "@/lib/types/nursing-module";

interface RoleOption {
  id: AppUserRole;
  title: string;
  subtitle: string;
  targetRoute: string;
  icon: any;
  defaultEmail: string;
  defaultName: string;
  defaultUserId: string;
}

const ROLES: RoleOption[] = [
  {
    id: "admin",
    title: "Hospital Admin",
    subtitle: "Enterprise management & global settings",
    targetRoute: "/dashboard",
    icon: ShieldCheck,
    defaultEmail: "admin@qlyno.health",
    defaultName: "Dr. Vikram Seth (Super Admin)",
    defaultUserId: "usr-admin-1",
  },
  {
    id: "nurse_lead",
    title: "Nurse Station Lead",
    subtitle: "ICU Station cockpit & roster coordination",
    targetRoute: "/nurse-station",
    icon: HeartPulse,
    defaultEmail: "anita.joseph@qlyno.health",
    defaultName: "Sister Anita Joseph (Station Lead)",
    defaultUserId: "nurse-1",
  },
  {
    id: "senior_nurse",
    title: "Senior Nurse",
    subtitle: "Restricted Station supervision & care",
    targetRoute: "/nurse-station",
    icon: UserCheck,
    defaultEmail: "sneha.kulkarni@qlyno.health",
    defaultName: "Sister Sneha Kulkarni (Senior Nurse)",
    defaultUserId: "nurse-2",
  },
  {
    id: "nurse",
    title: "Staff Nurse",
    subtitle: "Bedside patient care, MAR & vitals",
    targetRoute: "/nurse",
    icon: Bed,
    defaultEmail: "rahul.shinde@qlyno.health",
    defaultName: "Nurse Rahul Shinde",
    defaultUserId: "nurse-3",
  },
  {
    id: "support_staff",
    title: "Support Staff",
    subtitle: "Ward cleaning & patient escort tickets",
    targetRoute: "/support-staff",
    icon: Sparkles,
    defaultEmail: "ramesh.p@qlyno.health",
    defaultName: "Ramesh Pawar (Ward Attendant)",
    defaultUserId: "sup-1",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedRoleId, setSelectedRoleId] = useState<AppUserRole>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeRoleOption = ROLES.find((r) => r.id === selectedRoleId) || ROLES[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem("qlyno.nursing-operations.v1");
        const existingData = saved ? JSON.parse(saved) : {};
        window.localStorage.setItem(
          "qlyno.nursing-operations.v1",
          JSON.stringify({
            ...existingData,
            currentRole: activeRoleOption.id,
            currentUserId: activeRoleOption.defaultUserId,
            currentUserName: activeRoleOption.defaultName,
          })
        );
      } catch (err) {
        console.error("Failed to persist session to localStorage:", err);
      }
    }

    dispatch(
      setCurrentRole({
        role: activeRoleOption.id,
        userId: activeRoleOption.defaultUserId,
        userName: activeRoleOption.defaultName,
      })
    );

    setTimeout(() => {
      router.push(activeRoleOption.targetRoute);
    }, 450);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-8">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl shadow-panel lg:grid-cols-12 border border-sidebar-border">
        {/* Left Brand Panel */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-sidebar via-sidebar to-primary-700/30 p-8 text-sidebar-foreground lg:col-span-5 lg:flex">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-active/20 text-sidebar-active">
              <Activity className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-semibold">
              Qlyno <span className="text-sidebar-active">Health</span>
            </span>
          </div>

          <div className="space-y-3 my-auto py-8">
            <h1 className="font-display text-2xl font-bold leading-snug">
              Unified Healthcare Operating System
            </h1>
            <p className="text-xs text-sidebar-muted leading-relaxed">
              One unified platform connecting Hospital Administration, Operational Nurse Stations, Bedside Nurses, Support Staff, and Attending Doctors with role-based access control and live task synchronization.
            </p>

            <div className="pt-4 space-y-2 text-xs text-sidebar-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Multi-station operational coordination</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-primary" />
                <span>Bedside MAR &amp; SBAR Shift Handover</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Non-clinical restricted support workflows</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-sidebar-muted border-t border-sidebar-border pt-4">
            <ShieldCheck className="h-3.5 w-3.5 text-sidebar-active" />
            Full Audit Traceability · ISO 27001 &amp; NABH Ready
          </div>
        </div>

        {/* Right Sign-in Form */}
        <Card className="rounded-none border-0 lg:col-span-7">
          <CardContent className="flex h-full flex-col justify-center p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2.5 lg:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-semibold">
                Qlyno <span className="text-primary">Health</span>
              </span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">Sign in to Qlyno Portal</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select your authenticated operational role to enter your dedicated workspace.
              </p>
            </div>

            {/* Role Radio Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const IconComponent = r.icon;
                const isSelected = selectedRoleId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRoleId(r.id)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-xs"
                        : "border-border bg-card hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <IconComponent className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </div>
                    <span className="text-xs font-bold mt-1.5 leading-tight">{r.title}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate w-full">
                      {r.targetRoute}
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="login-email" className="text-xs font-semibold">
                  Work Email (Role: {activeRoleOption.title})
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  value={activeRoleOption.defaultEmail}
                  readOnly
                  className="text-xs font-mono bg-muted/30"
                />
              </div>

              <div className="grid gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-xs font-semibold">
                    Password
                  </Label>
                  <Link href="#" className="text-[11px] font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    icon={<Lock className="h-4 w-4" />}
                    defaultValue="demo@qlyno2026"
                    required
                    autoComplete="current-password"
                    className="text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" loading={loading} className="mt-2 text-xs font-bold h-9">
                Enter {activeRoleOption.title} Workspace &rarr;
              </Button>
            </form>

            <Separator className="my-4" />
            <p className="text-center text-[11px] text-muted-foreground">
              Directs to <strong>{activeRoleOption.targetRoute}</strong>. Enforcing strict role boundary invariant (Rule 23.1).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
