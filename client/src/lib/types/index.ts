/**
 * Shared domain types for the Qlyno Hospital Admin Panel.
 * These mirror the entities defined across the Doctor, Receptionist, Nurse,
 * Lab, Vendor, Billing and Patient module PRDs so the UI layer has a single
 * source of truth ready to be wired to real API responses later.
 */

export type Status =
  | "active"
  | "inactive"
  | "pending"
  | "invited"
  | "suspended"
  | "removed"
  | "archived"
  | "on-leave"
  | "available"
  | "assigned"
  | "on-call";

export interface BaseStaff {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  status: Status;
  createdAt: string;
  location?: string;
}

/* ---------------------------------- Doctor --------------------------------- */

export type DoctorAvailability = "available" | "busy" | "off" | "on-leave";

export interface Doctor extends BaseStaff {
  specialty: string;
  subSpecialty: string;
  qualification: string;
  experienceYears: number;
  registrationNo: string;
  availability: DoctorAvailability;
  clinics: string[];
  department: string;
  privileges: string[];
  languages: string[];
  services: string[];
  consultationSettings: {
    visitMode: "In-person" | "Teleconsult" | "Hybrid";
    slotsPerDay: number;
    emergencyOnCall: boolean;
    maxPatientsPerDay: number;
  };
  verification: {
    status: "pending" | "in-review" | "verified" | "rejected";
    hospitalVerified: boolean;
    platformVerified: boolean;
    documents: string[];
    pendingDocuments: string[];
  };
  schedule: {
    dutyHours: string;
    leaveWindow?: string;
    emergencyOnCall: boolean;
    availability: string;
  };
  publicProfile: {
    published: boolean;
    searchable: boolean;
  };
  todayAppointments: number;
  totalPatients: number;
  rating: number;
  consultationFee: number;
  verified: boolean;
  role: "Doctor";
}

/* -------------------------------- Clinic Staff ------------------------------ */

export interface Receptionist extends BaseStaff {
  role: "Receptionist";
  assignedContext: "Solo Doctor" | "Clinic" | "Hospital";
  scope: string[];
  appointmentsHandled: number;
}

export interface Nurse extends BaseStaff {
  role: "Nurse";
  level: "Nurse" | "Senior Nurse" | "Nurse Lead";
  department: string;
  station: string;
  shift: "Morning" | "Evening" | "Night";
  assignedPatients: number;
  tasksPending: number;
  tasksOverdue: number;
}

export interface BillingStaff extends BaseStaff {
  role: "Billing Staff";
  scopes: string[];
  collectionsToday: number;
  pendingInvoices: number;
}

export interface SupportStaff extends BaseStaff {
  role: "Support Staff" | "Attendant" | "Housekeeping" | "Assistant";
  department: string;
  taskScope: string[];
  assignment: string;
  availability: "available" | "assigned" | "off-duty";
}

export interface LabStaff extends BaseStaff {
  role: "Lab Technician" | "Pathologist" | "Lab Front Desk" | "Collection Agent";
  labLocation: string;
  ordersHandled: number;
}

export type DepartmentType = "OPD" | "IPD" | "ICU" | "Emergency" | "OT" | "Radiology" | "Laboratory";

export interface Department {
  id: string;
  name: string;
  type: DepartmentType;
  location: string;
  headName: string;
  activePatients: number;
  bedCapacity?: number;
  status: "active" | "warning" | "critical";
}

export interface NurseStation {
  id: string;
  name: string;
  department: string;
  location: string;
  leadName: string;
  capacity: number;
  occupancy: number;
  status: "stable" | "watch" | "critical";
  shiftCoverage: string;
}

export interface Surgeon extends BaseStaff {
  role: "Surgeon";
  specialty: string;
  qualification: string;
  caseAccess: "Internal" | "Requested" | "External";
  nextAvailable: string;
}

export interface Ambulance {
  id: string;
  vehicleNo: string;
  baseLocation: string;
  driverName: string;
  status: "available" | "en-route" | "on-call" | "maintenance";
  capacity: number;
  lastDispatchAt?: string;
}

/* ---------------------------------- Patient --------------------------------- */

export interface Patient {
  id: string;
  uhid: string;
  name: string;
  avatarUrl?: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  bloodGroup: string;
  address: string;
  registeredOn: string;
  lastVisit: string;
  primaryDoctor: string;
  status: "active" | "inactive";
  outstandingBalance: number;
  totalSpent: number;
  tags: string[];
}

/* -------------------------------- Appointment -------------------------------- */

export type AppointmentStatus =
  | "confirmed"
  | "waiting"
  | "in-consultation"
  | "completed"
  | "cancelled"
  | "no-show"
  | "rescheduled";

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  clinic: string;
  date: string;
  time: string;
  type: "In-person" | "Follow-up" | "Video";
  status: AppointmentStatus;
  reason: string;
}

/* ---------------------------------- Vendor ----------------------------------- */

export type VendorStatus = "pending" | "under-review" | "verified" | "needs-info" | "rejected" | "suspended";

export interface Vendor {
  id: string;
  name: string;
  logoUrl?: string;
  categories: string[];
  contactPerson: string;
  email: string;
  phone: string;
  serviceAreas: string[];
  status: VendorStatus;
  rating: number;
  activeOrders: number;
  onTimeDeliveryRate: number;
  outstandingPayable: number;
  joinedOn: string;
}

export type ProcurementRequestStatus =
  | "draft"
  | "open"
  | "closing-soon"
  | "closed"
  | "awarded"
  | "cancelled";

export interface ProcurementRequest {
  id: string;
  title: string;
  category: string;
  quantity: number;
  requiredBy: string;
  urgency: "normal" | "urgent" | "critical";
  status: ProcurementRequestStatus;
  quotesReceived: number;
  linkedCase?: string;
}

/* ----------------------------------- Billing ---------------------------------- */

export type InvoiceStatus = "draft" | "issued" | "partially-paid" | "paid" | "cancelled" | "refunded";

export interface Invoice {
  id: string;
  invoiceNo: string;
  patientName: string;
  patientId: string;
  service: string;
  amount: number;
  paid: number;
  outstanding: number;
  status: InvoiceStatus;
  issuedOn: string;
  method?: "Cash" | "Card" | "UPI" | "Insurance" | "Online";
}

/* ------------------------------------- Lab ------------------------------------ */

export type LabOrderStatus =
  | "created"
  | "verified"
  | "scheduled"
  | "sample-pending"
  | "collected"
  | "processing"
  | "awaiting-validation"
  | "validated"
  | "released"
  | "amended"
  | "cancelled"
  | "rejected";

export interface LabOrder {
  id: string;
  orderNo: string;
  patientName: string;
  test: string;
  orderingDoctor: string;
  source: "Direct" | "Doctor Order" | "Clinic Referral" | "Hospital Order";
  status: LabOrderStatus;
  orderedOn: string;
  tat: string;
  critical?: boolean;
}

/* --------------------------------- Notifications -------------------------------- */

export type NotificationCategory =
  | "appointment"
  | "billing"
  | "lab"
  | "staff"
  | "vendor"
  | "emergency"
  | "system";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: "info" | "success" | "warning" | "critical";
}

/* ----------------------------------- Audit Log ----------------------------------- */

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  ipAddress: string;
  status: "success" | "failed";
}

/* --------------------------------- Roles & Permissions ---------------------------- */

export interface PermissionModule {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: PermissionModule[];
  system: boolean;
}

/* ----------------------------------- Nav / Misc ------------------------------------ */

export interface StatTrend {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon?: string;
}
