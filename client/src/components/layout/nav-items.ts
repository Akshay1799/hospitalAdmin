import {
  Activity,
  Ambulance,
  BadgeIndianRupee,
  Bed,
  Boxes,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileBox,
  FileText,
  FlaskConical,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  Microscope,
  Pill,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Siren,
  Stethoscope,
  Syringe,
  Truck,
  UserCog,
  Users,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Care Delivery",
    items: [
      { label: "Doctors", href: "/doctors", icon: Stethoscope },
      { label: "Surgeons", href: "/surgeons", icon: Stethoscope },
      { label: "Patients", href: "/patients", icon: Users },
      { label: "Appointments", href: "/appointments", icon: CalendarClock },
      { label: "Lab Orders", href: "/lab", icon: FlaskConical },
      { label: "Departments", href: "/departments", icon: Activity },
    ],
  },
  {
    title: "Hospital Operations",
    items: [
      { label: "Surgical Cases", href: "/surgical-cases", icon: Activity },
      { label: "OT Scheduling", href: "/ot-scheduling", icon: CalendarClock },
      { label: "Emergency Command", href: "/emergency", icon: ShieldCheck },
      { label: "Nurse Stations", href: "/nurse-stations", icon: HeartPulse },
      { label: "Support Staff", href: "/support-staff", icon: ClipboardList },
      { label: "Hospital Roster", href: "/roster", icon: CalendarClock },
      { label: "Shift Templates", href: "/shift-templates", icon: Activity },
      { label: "Ambulance Dispatch", href: "/ambulance", icon: Truck },
    ],
  },
  {
    title: "Clinic Staff",
    items: [
      { label: "Receptionists", href: "/staff/receptionists", icon: ClipboardList },
      { label: "Nurses", href: "/nurses", icon: HeartPulse },
      { label: "Billing Staff", href: "/staff/billing-staff", icon: UserCog },
      { label: "Lab Staff", href: "/staff/lab-staff", icon: Activity },
    ],
  },
  {
    title: "Network",
    items: [
      { label: "Procurement", href: "/procurement", icon: ShoppingCart },
      { label: "Vendors", href: "/procurement/vendors", icon: Truck },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Billing & Invoices", href: "/billing", icon: Receipt },
      { label: "Reports & Analytics", href: "/reports", icon: Gauge },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Roles & Permissions", href: "/roles", icon: ShieldCheck },
      { label: "Staff Permissions", href: "/staff-permissions", icon: ShieldCheck },
      { label: "Audit Logs", href: "/audit-logs", icon: ScrollText },
      { label: "Nursing Audit", href: "/nursing-audit-logs", icon: ScrollText },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const currencyIcon = BadgeIndianRupee;
