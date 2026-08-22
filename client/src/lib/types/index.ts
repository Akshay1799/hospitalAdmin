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
  | "on-call"
  | "replaced"
  | "waiting"
  | "called"
  | "in-progress"
  | "completed"
  | "no-show"
  | "pending-route"
  | "routed"
  | "escalated"
  | "registered"
  | "in-consultation"
  | "follow-up-scheduled"
  | "under-treatment"
  | "transfer-requested"
  | "discharge-pending"
  | "discharged"
  | "admitted"
  | "new"
  | "duplicate-flagged"
  | "granted"
  | "restricted"
  | "revoked";

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
  branch: string;
  desk: string;
  department: string;
  workflowScope: string[];
  scope: string[];
  appointmentsHandled: number;
  isReplacementActive?: boolean;
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
  councilRegistrationId?: string;
  qualifications?: string[];
  employmentHistory?: { period: string; role: string; hospital: string }[];
  vitalsCompletionRate?: number;
  medicationComplianceRate?: number;
  avgOrderFulfillmentMins?: number;
  punctualityScore?: number;
  incidentCount?: number;
}

export interface BillingCounter {
  id: string;
  name: string;
  type: "OPD Billing" | "IPD Billing" | "Insurance/TPA Desk" | "Refund Desk";
  status: "Open" | "Closed" | "On Break";
  assignedStaffId?: string;
  assignedStaffName?: string;
  location: string;
  shift: "Morning" | "Evening" | "Night";
}

export interface BillingPermissions {
  maxRefundLimit: number;
  maxDiscountLimit: number;
  permittedCategories: string[];
  supervisorOverride: boolean;
}

export interface BillingTransaction {
  id: string;
  timestamp: string;
  patientName: string;
  patientId: string;
  type: "Invoice" | "Payment" | "Refund" | "TPA Settlement";
  amount: number;
  paymentMode: "Cash" | "Card" | "UPI" | "Insurance";
  status: "Created" | "Paid" | "Reconciled" | "Refunded";
  counterId: string;
  billingOfficerName: string;
  notes?: string;
}

export interface BillingStaff extends BaseStaff {
  role: "Billing Staff";
  scopes: string[];
  assignedCounterId?: string;
  assignedCounterName?: string;
  permissions?: BillingPermissions;
  shift?: "Morning" | "Evening" | "Night";
  collectionsToday: number;
  pendingInvoices: number;
  collectionsByMode?: {
    cash: number;
    card: number;
    upi: number;
    insurance: number;
  };
  discrepancyAmount?: number;
}

export type OtherStaffCategory =
  | "Technician"
  | "Housekeeping"
  | "Security"
  | "Driver"
  | "Support Staff"
  | "Other Hospital Staff";

export interface SupportStaff extends BaseStaff {
  role: "Support Staff" | "Attendant" | "Housekeeping" | "Assistant" | "Technician" | "Security" | "Driver" | "Other Hospital Staff";
  category?: OtherStaffCategory;
  department: string;
  taskScope: string[];
  assignment: string;
  availability: "available" | "assigned" | "off-duty";
  driverLicenseNumber?: string;
  assignedVehicleId?: string;
  assignedStationId?: string;
}

export interface LabStaff extends BaseStaff {
  role: "Lab Technician" | "Pathologist" | "Lab Front Desk" | "Collection Agent";
  labLocation: string;
  ordersHandled: number;
}

/* ----------------------------- Duty, Shifts & Attendance ----------------------------- */

export interface DoctorOnCall {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  phone: string;
  date: string;
  shiftWindow: string;
  status: "On Call" | "Consulting" | "Standby";
  activeEmergencyCases: number;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  department: string;
  leaveType: "Sick Leave" | "Casual Leave" | "Earned Leave" | "Compensatory Off";
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  coverageGapDetected: boolean;
  assignedBackupStaffId?: string;
  assignedBackupStaffName?: string;
  appliedOn: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  department: string;
  date: string;
  scheduledShift: string;
  punchIn?: string;
  punchOut?: string;
  status: "Present" | "Late" | "Early Departure" | "On Leave" | "Absent";
  lateMinutes?: number;
  earlyMinutes?: number;
  overtimeMinutes?: number;
  editedReason?: string;
  editedBy?: string;
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

export type PatientRelationshipStatus = "new" | "active" | "inactive" | "duplicate-flagged";
export type OPDStatus = "registered" | "waiting" | "in-consultation" | "follow-up-scheduled" | "completed";
export type IPDStatus = "admitted" | "under-treatment" | "transfer-requested" | "discharge-pending" | "discharged";
export type ConsentStatus = "granted" | "restricted" | "revoked";

export interface PatientConsent {
  status: ConsentStatus;
  dataSharing: string[];
  restrictions: string[];
  recordedOn: string;
  expiresOn?: string;
}

export interface OPDRecord {
  id: string;
  registrationDate: string;
  doctor: string;
  department: string;
  status: OPDStatus;
  visitReason: string;
  queueToken?: string;
  consultationNotes?: string;
  followUpDate?: string;
  prescriptions: string[];
}

export interface IPDRecord {
  id: string;
  admissionDate: string;
  dischargeDate?: string;
  department: string;
  bedAssignment: string;
  doctor: string;
  diagnosis: string;
  status: IPDStatus;
  treatmentPlan: string;
  dischargeSummary?: string;
  transferRequests: string[];
}

export interface PatientDocument {
  id: string;
  type: string;
  name: string;
  uploadedOn: string;
  generatedBy: string;
  url: string;
}

export interface HospitalRelationship {
  hospitalId: string;
  hospitalName: string;
  status: PatientRelationshipStatus;
  relationshipEstablishedOn: string;
  consent: PatientConsent;
  opdHistory: OPDRecord[];
  ipdHistory: IPDRecord[];
  documents: PatientDocument[];
  billingStatus: {
    totalOutstanding: number;
    totalSpent: number;
    lastBillingDate?: string;
  };
}

export interface Patient {
  id: string;
  qlynoPatientId: string;
  uhid?: string;
  name: string;
  avatarUrl?: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  bloodGroup: string;
  address: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  identifiers: {
    aadhar?: string;
    pan?: string;
    idNo?: string;
  };
  globalStatus: "active" | "inactive";
  createdOn: string;
  lastModified: string;
  hospitalRelationships: HospitalRelationship[];
  primaryHospitalId: string;
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
  | "rescheduled"
  | "registered";

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  qlynoPatientId: string;
  doctorName: string;
  doctorId: string;
  clinic: string;
  date: string;
  time: string;
  type: "In-person" | "Follow-up" | "Video";
  status: AppointmentStatus;
  reason: string;
  queueToken?: string;
  waitTime?: number;
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
