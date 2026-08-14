import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Stethoscope,
  Activity,
  FilePlus2,
  BookOpenCheck,
  FlaskConical,
  ScanLine,
  CalendarClock,
  BellRing,
  BarChart3,
  MessageSquare,
  Settings,
  Building2,
  UserCog,
  Users2,
  CalendarRange,
  ListChecks,
  MapPin,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  moduleNumber: string;
}

export const doctorWorkspaceNav: NavItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard, moduleNumber: "01" },
  { label: "My Patients", href: "/doctor/patients", icon: Users, moduleNumber: "02" },
  { label: "Appointments", href: "/doctor/appointments", icon: CalendarDays, moduleNumber: "03" },
  { label: "Medical Records", href: "/doctor/emr", icon: FileText, moduleNumber: "04" },
  { label: "Consultation", href: "/doctor/consultation", icon: Stethoscope, moduleNumber: "05" },
  { label: "Vitals Management", href: "/doctor/vitals", icon: Activity, moduleNumber: "06" },
  { label: "E-Prescription", href: "/doctor/prescriptions", icon: FilePlus2, moduleNumber: "07" },
  { label: "Diagnosis & ICD", href: "/doctor/diagnosis", icon: BookOpenCheck, moduleNumber: "08" },
  { label: "Laboratory Orders", href: "/doctor/lab-orders", icon: FlaskConical, moduleNumber: "09" },
  { label: "Radiology Orders", href: "/doctor/radiology-orders", icon: ScanLine, moduleNumber: "10" },
  { label: "Follow-up", href: "/doctor/follow-up", icon: CalendarClock, moduleNumber: "11" },
  { label: "Clinical Alerts", href: "/doctor/alerts", icon: BellRing, moduleNumber: "12" },
  { label: "Reports", href: "/doctor/reports", icon: BarChart3, moduleNumber: "13" },
  { label: "Communication", href: "/doctor/communication", icon: MessageSquare, moduleNumber: "14" },
  { label: "Settings", href: "/doctor/settings", icon: Settings, moduleNumber: "15" },
];

export const clinicOperationsNav: NavItem[] = [
  { label: "Clinic Dashboard", href: "/clinic/dashboard", icon: Building2, moduleNumber: "C1" },
  { label: "Doctor Management", href: "/clinic/doctors", icon: UserCog, moduleNumber: "C2" },
  { label: "Staff Management", href: "/clinic/staff", icon: Users2, moduleNumber: "C3" },
  { label: "Schedules", href: "/clinic/schedules", icon: CalendarRange, moduleNumber: "C4" },
  { label: "Services", href: "/clinic/services", icon: ListChecks, moduleNumber: "C5" },
  { label: "Locations", href: "/clinic/locations", icon: MapPin, moduleNumber: "C6" },
];

export const allNavItems: NavItem[] = [...doctorWorkspaceNav, ...clinicOperationsNav];
