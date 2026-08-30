"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Activity, Building2, Eye, EyeOff, HeartPulse, Lock, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "nurse">("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Role-based demo flow — redirect to appropriate console
    setTimeout(() => {
      if (role === "nurse") {
        router.push("/nurses");
      } else {
        router.push("/dashboard");
      }
    }, 600);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-10">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl shadow-panel lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-sidebar via-sidebar to-primary-700/40 p-10 text-sidebar-foreground lg:flex">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-active/20 text-sidebar-active">
              <Activity className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-semibold">
              Qlyno <span className="text-sidebar-active">Admin</span>
            </span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold leading-snug">
              One control center for every doctor, staff role, vendor and patient relationship.
            </h1>
            <p className="mt-3 text-sm text-sidebar-muted">
              Manage clinical operations, front desk, billing, nursing, lab and vendor procurement — with
              role-based access enforced at every layer.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-sidebar-muted">
            <ShieldCheck className="h-4 w-4 text-sidebar-active" />
            Server-side enforced permissions · Full audit trail
          </div>
        </div>

        <Card className="rounded-none border-0 lg:rounded-r-2xl">
          <CardContent className="flex h-full flex-col justify-center p-8 sm:p-10">
            <div className="mb-6 flex items-center gap-2.5 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-semibold">
                Qlyno <span className="text-primary">Admin</span>
              </span>
            </div>

            <h2 className="font-display text-xl font-semibold">Sign in to Portal</h2>
            <p className="mt-1 text-sm text-muted-foreground">Select your role and enter credentials to continue.</p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              {/* Role Selection */}
              <div className="grid gap-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    htmlFor="role-admin"
                    className={`relative flex cursor-pointer flex-col rounded-xl border p-3 transition-all ${
                      role === "admin"
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                        : "border-border bg-card hover:bg-accent/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className={`h-4 w-4 ${role === "admin" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-semibold">Hospital Admin</span>
                      </div>
                      <input
                        id="role-admin"
                        type="radio"
                        name="portalRole"
                        value="admin"
                        checked={role === "admin"}
                        onChange={() => setRole("admin")}
                        className="h-4 w-4 accent-primary"
                      />
                    </div>
                    <span className="mt-1 text-[11px] text-muted-foreground leading-snug">
                      Full management & operations
                    </span>
                  </label>

                  <label
                    htmlFor="role-nurse"
                    className={`relative flex cursor-pointer flex-col rounded-xl border p-3 transition-all ${
                      role === "nurse"
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                        : "border-border bg-card hover:bg-accent/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HeartPulse className={`h-4 w-4 ${role === "nurse" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-semibold">Nurse Panel</span>
                      </div>
                      <input
                        id="role-nurse"
                        type="radio"
                        name="portalRole"
                        value="nurse"
                        checked={role === "nurse"}
                        onChange={() => setRole("nurse")}
                        className="h-4 w-4 accent-primary"
                      />
                    </div>
                    <span className="mt-1 text-[11px] text-muted-foreground leading-snug">
                      Stations, roster & ward care
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="login-email">Work email</Label>
                <Input
                  id="login-email"
                  type="email"
                  icon={<Mail />}
                  placeholder={role === "nurse" ? "nurse@qlyno.health" : "admin@qlyno.health"}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Link href="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    icon={<Lock />}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
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

              <Button type="submit" loading={loading} className="mt-2">
                Sign in to {role === "nurse" ? "Nurse Panel" : "Hospital Admin"}
              </Button>
            </form>

            <Separator className="my-6" />
            <p className="text-center text-xs text-muted-foreground">
              Protected by role-based access control and audit logging. Contact your Qlyno organization owner if
              you need access.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
