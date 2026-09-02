import {
  Activity,
  Ambulance,
  BadgeIndianRupee,
  BarChart3,
  Bed,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Clock,
  Cpu,
  CreditCard,
  FileCheck,
  FileText,
  FlaskConical,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  Milestone,
  Pill,
  Receipt,
  Scan,
  Scissors,
  ScrollText,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Stethoscope,
  TrendingUp,
  Truck,
  UserCheck,
  UserCog,
  Users,
  UsersRound,
  Webhook,
} from "lucide-react";
import { AppUserRole } from "@/lib/types/nursing-module";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// 1. HOSPITAL ADMIN NAVIGATION (Full Management)
export const navGroups: NavGroup[] = [
  // OVERVIEW
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Command Center", href: "/command-center", icon: Gauge, badge: "Proposed" },
    ],
  },

  // PATIENT CARE
  {
    title: "Patient Care",
    items: [
      { label: "Patients", href: "/patients", icon: Users },
      { label: "Appointments", href: "/appointments", icon: CalendarClock },
      { label: "OPD Management", href: "/appointments/opd-queue", icon: Activity },
      { label: "IPD", href: "/ipd", icon: Bed },
      { label: "Emergency Management", href: "/emergency", icon: ShieldAlert },
      { label: "Follow-ups", href: "/follow-ups", icon: CalendarDays },
    ],
  },

  // CLINICAL OPERATIONS
  {
    title: "Clinical Operations",
    items: [
      { label: "Doctors", href: "/doctors", icon: Stethoscope },
      { label: "Departments", href: "/departments", icon: Building2 },
      { label: "Nurse Stations (Admin)", href: "/nurse-stations", icon: ShieldCheck },
      { label: "Wards & Beds", href: "/wards-beds", icon: Bed },
      { label: "OT / Surgeries Management", href: "/surgical-cases", icon: Scissors },
      { label: "Lab", href: "/lab", icon: FlaskConical },
      { label: "Radiology", href: "/radiology", icon: Scan },
      { label: "Pharmacy", href: "/pharmacy", icon: Pill },
    ],
  },

  // PEOPLE & STAFF
  {
    title: "People & Staff",
    items: [
      { label: "Reception", href: "/staff/receptionists", icon: ClipboardList },
      { label: "Nurses", href: "/nurses", icon: HeartPulse },
      { label: "Billing Staff", href: "/staff/billing-staff", icon: UserCog },
      { label: "Other Staff", href: "/support-staff", icon: Users },
      { label: "Duty & Shifts", href: "/roster", icon: CalendarClock },
      { label: "Attendance", href: "/attendance", icon: Clock },
    ],
  },

  // CARE COORDINATION
  {
    title: "Care Coordination",
    items: [
      { label: "Patient Journey", href: "/care-coordination/patient-journey", icon: Milestone },
      { label: "Reports Awaiting Review", href: "/care-coordination/reports-review", icon: FileCheck },
      { label: "Communication", href: "/care-coordination/communication", icon: MessageSquare },
    ],
  },

  // FINANCE
  {
    title: "Finance",
    items: [
      { label: "Billing & Invoices", href: "/billing", icon: Receipt },
      { label: "Payments", href: "/payments", icon: CreditCard },
      { label: "Insurance / TPA", href: "/insurance-tpa", icon: ShieldCheck },
      { label: "Financial Reports", href: "/financial-reports", icon: BadgeIndianRupee },
    ],
  },

  // SUPPLY & ASSETS
  {
    title: "Supply & Assets",
    items: [
      { label: "Inventory", href: "/inventory", icon: Boxes },
      { label: "Procurement", href: "/procurement", icon: ShoppingCart },
      { label: "Vendors", href: "/procurement/vendors", icon: Truck },
      { label: "Assets", href: "/assets", icon: Cpu },
      { label: "Ambulance", href: "/ambulance", icon: Ambulance },
    ],
  },

  // HOSPITAL GROWTH
  {
    title: "Hospital Growth",
    items: [
      { label: "Hospital Profile", href: "/hospital-profile", icon: Building2 },
      { label: "Content & Resources", href: "/content-resources", icon: BookOpen },
      { label: "Reviews", href: "/reviews", icon: Star },
      { label: "Analytics", href: "/analytics", icon: TrendingUp },
    ],
  },

  // ADMINISTRATION
  {
    title: "Administration",
    items: [
      { label: "Verifications", href: "/verification", icon: ShieldCheck },
      { label: "Hospital Admin", href: "/admin-delegation", icon: UsersRound },
      { label: "Incidents", href: "/incidents", icon: ShieldAlert, badge: "Proposed" },
      { label: "Reports", href: "/reports", icon: Gauge },
      { label: "Roles & Permissions", href: "/roles", icon: ShieldCheck },
      { label: "Audit Logs", href: "/audit-logs", icon: ScrollText },
      { label: "Documents", href: "/documents", icon: FileText },
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Integrations", href: "/integrations", icon: Webhook },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

// 2. NURSE STATION LEAD NAVIGATION
export const nurseStationLeadNavGroups: NavGroup[] = [
  {
    title: "Station Operations",
    items: [
      { label: "Station Dashboard", href: "/nurse-station", icon: LayoutDashboard },
      { label: "Patients & Bed Map", href: "/wards-beds", icon: Bed },
      { label: "Shifts & Roster", href: "/roster", icon: CalendarClock },
      { label: "Emergency & Trauma", href: "/emergency", icon: ShieldAlert },
    ],
  },
  {
    title: "Workforce & Reports",
    items: [
      { label: "Nurses Directory", href: "/nurses", icon: HeartPulse },
      { label: "Support Staff", href: "/support-staff", icon: Sparkles },
      { label: "Station Reports", href: "/reports", icon: Gauge },
      { label: "Nursing Audit Logs", href: "/nursing-audit-logs", icon: ScrollText },
      { label: "Station Settings", href: "/nurse-stations", icon: Settings },
    ],
  },
];

// 3. SENIOR NURSE NAVIGATION (Restricted Administration)
export const seniorNurseNavGroups: NavGroup[] = [
  {
    title: "Care Coordination",
    items: [
      { label: "Station Dashboard", href: "/nurse-station", icon: LayoutDashboard },
      { label: "Bedside Patients", href: "/nurse", icon: Bed },
      { label: "Wards & Bed Map", href: "/wards-beds", icon: Building2 },
      { label: "Station Roster", href: "/roster", icon: CalendarClock },
      { label: "Nursing Audit Logs", href: "/nursing-audit-logs", icon: ScrollText },
    ],
  },
];

// 4. STAFF NURSE NAVIGATION (Individual Bedside Workspace)
export const nurseNavGroups: NavGroup[] = [
  {
    title: "My Bedside Workspace",
    items: [
      { label: "My Assigned Patients", href: "/nurse", icon: Bed },
      { label: "My Shift Schedule", href: "/roster", icon: CalendarClock },
    ],
  },
];

// 5. SUPPORT STAFF NAVIGATION (Non-Clinical Operational Queue)
export const supportStaffNavGroups: NavGroup[] = [
  {
    title: "Operational Service Queue",
    items: [
      { label: "My Task Queue", href: "/support-staff", icon: FileCheck },
      { label: "Duty & Shift Roster", href: "/roster", icon: Clock },
    ],
  },
];

export function getNavigationForRole(role?: AppUserRole): NavGroup[] {
  switch (role) {
    case "nurse_lead":
      return nurseStationLeadNavGroups;
    case "senior_nurse":
      return seniorNurseNavGroups;
    case "nurse":
      return nurseNavGroups;
    case "support_staff":
      return supportStaffNavGroups;
    case "admin":
    default:
      return navGroups;
  }
}

export interface WorkspaceMeta {
  appName: string;
  appSubname: string;
  tagline: string;
  profileName: string;
  profileRole: string;
  profileEmail: string;
  profileInitials: string;
}

export function getWorkspaceMetaForRole(role?: AppUserRole): WorkspaceMeta {
  switch (role) {
    case "nurse_lead":
      return {
        appName: "Qlyno",
        appSubname: "Nurse Station",
        tagline: "ICU & Critical Care Station",
        profileName: "Sister Anita Joseph",
        profileRole: "Nurse Station Lead",
        profileEmail: "anita.joseph@qlyno.health",
        profileInitials: "AJ",
      };
    case "senior_nurse":
      return {
        appName: "Qlyno",
        appSubname: "Nurse Station",
        tagline: "Care Coordination (Senior Nurse)",
        profileName: "Sister Sneha Kulkarni",
        profileRole: "Senior Nurse",
        profileEmail: "sneha.kulkarni@qlyno.health",
        profileInitials: "SK",
      };
    case "nurse":
      return {
        appName: "Qlyno",
        appSubname: "Nurse Portal",
        tagline: "Bedside Clinical Workspace",
        profileName: "Nurse Rahul Shinde",
        profileRole: "Staff Nurse",
        profileEmail: "rahul.shinde@qlyno.health",
        profileInitials: "RS",
      };
    case "support_staff":
      return {
        appName: "Qlyno",
        appSubname: "Support Staff",
        tagline: "Operational Service Queue",
        profileName: "Ramesh Pawar / Sunita G.",
        profileRole: "Ward Attendant / Housekeeping",
        profileEmail: "ramesh.p@qlyno.health",
        profileInitials: "SP",
      };
    case "admin":
    default:
      return {
        appName: "Qlyno",
        appSubname: "Admin",
        tagline: "Hospital Command Center",
        profileName: "Hospital Admin",
        profileRole: "Super Admin",
        profileEmail: "admin@qlyno.health",
        profileInitials: "HA",
      };
  }
}

export const currencyIcon = BadgeIndianRupee;
