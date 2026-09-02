"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { AppUserRole } from "@/lib/types/nursing-module";

const STORAGE_KEY = "qlyno.nursing-operations.v1";

const HOME_ROUTES: Record<AppUserRole, string> = {
  admin: "/dashboard",
  nurse_lead: "/nurse-station",
  senior_nurse: "/nurse-station",
  nurse: "/nurse",
  support_staff: "/support-staff",
  doctor: "/dashboard",
};

const ADMIN_ONLY_ROUTES = [
  "/dashboard",
  "/command-center",
  "/patients",
  "/appointments",
  "/ipd",
  "/follow-ups",
  "/doctors",
  "/departments",
  "/surgical-cases",
  "/lab",
  "/radiology",
  "/pharmacy",
  "/staff/receptionists",
  "/nurses",
  "/staff/billing-staff",
  "/care-coordination",
  "/billing",
  "/payments",
  "/insurance-tpa",
  "/financial-reports",
  "/inventory",
  "/procurement",
  "/assets",
  "/ambulance",
  "/content-resources",
  "/reviews",
  "/analytics",
  "/verification",
  "/admin-delegation",
  "/incidents",
  "/roles",
  "/audit-logs",
  "/documents",
  "/notifications",
  "/integrations",
  "/settings",
];

function isAdminOnlyRoute(pathname: string) {
  return ADMIN_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function RouteRoleGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const reduxRole = useSelector(
    (state: RootState) => state.nursingOperations.currentRole
  );

  const [resolvedRole, setResolvedRole] = useState<AppUserRole | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed &&
          typeof parsed.currentRole === "string" &&
          [
            "admin",
            "nurse_lead",
            "senior_nurse",
            "nurse",
            "support_staff",
            "doctor",
          ].includes(parsed.currentRole)
        ) {
          setResolvedRole(parsed.currentRole as AppUserRole);
          return;
        }
      }
    } catch {
      // Fall back to the current Redux role.
    }

    setResolvedRole(reduxRole);
  }, [reduxRole]);

  useEffect(() => {
    if (!resolvedRole || !pathname) return;

    if (isAdminOnlyRoute(pathname) && resolvedRole !== "admin") {
      router.replace(HOME_ROUTES[resolvedRole]);
    }
  }, [pathname, resolvedRole, router]);

  if (!resolvedRole) return null;

  if (isAdminOnlyRoute(pathname) && resolvedRole !== "admin") {
    return null;
  }

  return <>{children}</>;
}
