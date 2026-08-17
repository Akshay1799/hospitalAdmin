import {
  Activity,
  BadgeIndianRupee,
  Boxes,
  CalendarClock,
  ClipboardList,
  FlaskConical,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Stethoscope,
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
      { label: "Emergency Command", href: "/emergency", icon: ShieldCheck },
      { label: "Nurse Stations", href: "/staff/nurse-stations", icon: HeartPulse },
      { label: "Ambulance Dispatch", href: "/ambulance", icon: Truck },
      { label: "Support Staff", href: "/staff/support-staff", icon: ClipboardList },
    ],
  },
  {
    title: "Clinic Staff",
    items: [
      { label: "Receptionists", href: "/staff/receptionists", icon: ClipboardList },
      { label: "Nurses", href: "/staff/nurses", icon: HeartPulse },
      { label: "Billing Staff", href: "/staff/billing-staff", icon: UserCog },
      { label: "Lab Staff", href: "/staff/lab-staff", icon: Activity },
    ],
  },
  {
    title: "Network",
    items: [
      { label: "Vendors", href: "/vendors", icon: Truck },
      { label: "Procurement", href: "/vendors/procurement", icon: Boxes },
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
      { label: "Audit Logs", href: "/audit-logs", icon: ScrollText },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const currencyIcon = BadgeIndianRupee;
