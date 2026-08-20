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
  Star,
  Stethoscope,
  TrendingUp,
  Truck,
  UserCog,
  Users,
  Webhook,
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
  // 1. OVERVIEW
  {
    title: "1. Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },

  // 2. PATIENT CARE
  {
    title: "2. Patient Care",
    items: [
      { label: "Patients", href: "/patients", icon: Users },
      { label: "Appointments", href: "/appointments", icon: CalendarClock },
      { label: "OPD Management", href: "/appointments/opd-queue", icon: Activity },
      { label: "IPD", href: "/ipd", icon: Bed },
      { label: "Emergency Management", href: "/emergency", icon: ShieldAlert },
      { label: "Follow-ups", href: "/follow-ups", icon: CalendarDays },
    ],
  },

  // 3. CLINICAL OPERATIONS
  {
    title: "3. Clinical Operations",
    items: [
      { label: "Doctors", href: "/doctors", icon: Stethoscope },
      { label: "Departments", href: "/departments", icon: Building2 },
      { label: "Nurse Stations", href: "/nurse-stations", icon: HeartPulse },
      { label: "Wards & Beds", href: "/wards-beds", icon: Bed },
      { label: "OT / Surgeries Management", href: "/surgical-cases", icon: Scissors },
      { label: "Lab", href: "/lab", icon: FlaskConical },
      { label: "Radiology", href: "/radiology", icon: Scan },
      { label: "Pharmacy", href: "/pharmacy", icon: Pill },
    ],
  },

  // 4. PEOPLE & STAFF
  {
    title: "4. People & Staff",
    items: [
      { label: "Reception", href: "/staff/receptionists", icon: ClipboardList },
      { label: "Nurses", href: "/nurses", icon: HeartPulse },
      { label: "Billing Staff", href: "/staff/billing-staff", icon: UserCog },
      { label: "Other Staff", href: "/support-staff", icon: Users },
      { label: "Duty & Shifts", href: "/roster", icon: CalendarClock },
      { label: "Attendance", href: "/attendance", icon: Clock },
    ],
  },

  // 5. CARE COORDINATION
  {
    title: "5. Care Coordination",
    items: [
      { label: "Patient Journey", href: "/care-coordination/patient-journey", icon: Milestone },
      { label: "Reports Awaiting Review", href: "/care-coordination/reports-review", icon: FileCheck },
      { label: "Communication", href: "/care-coordination/communication", icon: MessageSquare },
    ],
  },

  // 6. FINANCE
  {
    title: "6. Finance",
    items: [
      { label: "Billing & Invoices", href: "/billing", icon: Receipt },
      { label: "Payments", href: "/payments", icon: CreditCard },
      { label: "Insurance / TPA", href: "/insurance-tpa", icon: ShieldCheck },
      { label: "Financial Reports", href: "/financial-reports", icon: BadgeIndianRupee },
    ],
  },

  // 7. SUPPLY & ASSETS
  {
    title: "7. Supply & Assets",
    items: [
      { label: "Inventory", href: "/inventory", icon: Boxes },
      { label: "Procurement", href: "/procurement", icon: ShoppingCart },
      { label: "Vendors", href: "/procurement/vendors", icon: Truck },
      { label: "Assets", href: "/assets", icon: Cpu },
      { label: "Ambulance", href: "/ambulance", icon: Ambulance },
    ],
  },

  // 8. HOSPITAL GROWTH
  {
    title: "8. Hospital Growth",
    items: [
      { label: "Hospital Profile", href: "/hospital-profile", icon: Building2 },
      { label: "Content & Resources", href: "/content-resources", icon: BookOpen },
      { label: "Reviews", href: "/reviews", icon: Star },
      { label: "Analytics", href: "/analytics", icon: TrendingUp },
    ],
  },

  // 9. ADMINISTRATION
  {
    title: "9. Administration",
    items: [
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

export const currencyIcon = BadgeIndianRupee;
