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

/* ----------------------------- Wards & Beds ----------------------------- */

export type WardType = "General" | "ICU" | "CCU" | "HDU" | "Isolation" | "Maternity" | "NICU" | "Private" | "Deluxe";
export type BedTier = "General" | "Semi-Private" | "Private Suite" | "ICU" | "CCU" | "HDU" | "Isolation" | "NICU" | "Daycare";
export type BedStatus = "Available" | "Occupied" | "Reserved" | "Cleaning" | "Maintenance" | "Decommissioned";
export type IsolationType = "Droplet" | "Airborne" | "Contact" | "None";

export interface Ward {
  id: string;
  name: string;
  type: WardType;
  floor: string;
  department: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  status: "Active" | "Inactive";
}

export interface Bed {
  id: string;
  wardId: string;
  wardName: string;
  bedNumber: string;
  tier: BedTier;
  status: BedStatus;
  floor: string;
  currentPatientId?: string;
  currentPatientName?: string;
  admittingDoctor?: string;
  admissionDate?: string;
  lengthOfStayDays?: number;
  isolationFlags?: IsolationType;
  negativePressure?: boolean;
  attachedEquipment?: string[];
  nurseToPatientRatio?: string;
  turnoverETA?: string;
  reservedForPatientName?: string;
  reservedExpiry?: string;
}

export interface BedAllocation {
  id: string;
  bedId: string;
  bedNumber: string;
  wardName: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  admissionType: "Emergency" | "Elective IPD" | "OT Post-Op" | "Direct Transfer";
  allocatedAt: string;
  releasedAt?: string;
  isolationPrecautions?: IsolationType;
  notes?: string;
}

export interface BedTransferRequest {
  id: string;
  patientId: string;
  patientName: string;
  fromBedId: string;
  fromBedNumber: string;
  fromWard: string;
  toBedId: string;
  toBedNumber: string;
  toWard: string;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected";
  requestedAt: string;
}

export interface BedCleaningTask {
  id: string;
  bedId: string;
  bedNumber: string;
  wardName: string;
  triggeredAt: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  status: "Pending" | "In Progress" | "Done";
  completedAt?: string;
  protocol: "Standard" | "Terminal-Isolation";
  turnaroundMinutes?: number;
  notes?: string;
}

export interface BedHistoryEntry {
  id: string;
  bedId: string;
  bedNumber: string;
  wardName: string;
  eventType: "Allocation" | "Transfer Out" | "Transfer In" | "Discharge" | "Cleaning Started" | "Cleaning Completed" | "Maintenance" | "Reservation";
  patientName?: string;
  staffName: string;
  timestamp: string;
  details: string;
}

/* ----------------------------- Section 12 Modules ----------------------------- */

// 12.2 Radiology & Imaging
export type RadiologyModality = "X-Ray" | "CT Scan" | "MRI" | "Ultrasound" | "PET-CT" | "Mammography";
export type RadiologyStatus = "Requested" | "Scheduled" | "In Progress" | "Report Pending" | "Report Ready";

export interface RadiologyOrder {
  id: string;
  orderNo: string;
  patientId: string;
  patientName: string;
  modality: RadiologyModality;
  bodyPart: string;
  orderingDoctor: string;
  scheduledAt: string;
  status: RadiologyStatus;
  priority: "Routine" | "Urgent" | "Stat Emergency";
  criticalFinding?: boolean;
  criticalDetails?: string;
  roomName: string;
  radiologistName?: string;
  reportNotes?: string;
  dicomViewerUrl?: string;
}

// 12.3 Pharmacy & Medicine Inventory
export type MedicineStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Expiring Soon" | "Expired";

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  category: "Antibiotics" | "Cardiovascular" | "Analgesics" | "Critical Emergency" | "Anesthetics" | "Gastrointestinal" | "Fluids & Electrolytes";
  dosageForm: "Tablet" | "Capsule" | "Injection / Vial" | "IV Infusion" | "Syrup" | "Ointment";
  stockLevel: number;
  unit: string;
  minThreshold: number;
  expiryDate: string;
  batchNumber: string;
  rackLocation: string;
  status: MedicineStatus;
  unitPrice: number;
  scheduleH1?: boolean;
}

export interface DispensingRecord {
  id: string;
  prescriptionNo: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  dispensedAt: string;
  pharmacistName: string;
  items: { medicineName: string; quantity: number; dosage: string }[];
  totalAmount: number;
  status: "Completed" | "Pending Collection" | "Substituted";
}

export interface PharmacyAlert {
  id: string;
  medicineName: string;
  type: "Low Stock" | "Expiring Soon" | "Critical Zero Stock";
  severity: "High" | "Critical" | "Warning";
  currentStock: number;
  thresholdOrExpiry: string;
  actionRequired: string;
}

// 12.4 Payments & Daily Counter Collections
export type PaymentMethod = "Cash" | "Credit/Debit Card" | "UPI/QR" | "Bank Transfer" | "Insurance Direct";

export interface PaymentTransaction {
  id: string;
  receiptNo: string;
  patientId: string;
  patientName: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  counterNo: string;
  cashierName: string;
  timestamp: string;
  reconciliationStatus: "Reconciled" | "Pending Settlement" | "Variance";
}

export interface CashDrawerReport {
  counterId: string;
  counterName: string;
  cashierName: string;
  openingFloat: number;
  cashCollected: number;
  posCollected: number;
  upiCollected: number;
  refundsDeducted: number;
  closingBalance: number;
  variance: number;
  status: "Balanced" | "Variance Detected" | "Open";
}

// 12.4 Insurance & TPA Claims Desk
export type TpaProvider = "Star Health" | "HDFC ERGO" | "ICICI Lombard" | "Medi Assist" | "Vidal Health" | "Care Health" | "PM-JAY Scheme" | "CGHS Scheme";
export type ClaimStatus = "Submitted" | "Pre-authorized" | "Under Review" | "Approved" | "Rejected" | "Settled";

export interface InsuranceClaim {
  id: string;
  claimNo: string;
  patientId: string;
  patientName: string;
  tpaProvider: TpaProvider;
  policyNo: string;
  admissionDate: string;
  claimAmount: number;
  approvedAmount: number;
  copayAmount: number;
  status: ClaimStatus;
  submissionDate: string;
  settlementDate?: string;
  rejectionReason?: string;
  queryNotes?: string;
}

// Central Store Inventory & Stock
export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: "Surgical Consumables" | "PPE & Hygiene" | "Diagnostic Reagents" | "Linens & Bedding" | "Wound Care" | "General Medical Supplies";
  stockLevel: number;
  unit: string;
  reorderLevel: number;
  leadTimeDays: number;
  supplierName: string;
  unitCost: number;
  status: "Adequate" | "Low Stock" | "Reorder Placed";
}

export interface StockIndent {
  id: string;
  indentNo: string;
  department: string;
  requestedBy: string;
  items: { itemName: string; quantity: number }[];
  status: "Pending Approval" | "Dispatched" | "Received";
  requestedAt: string;
}

// Biomedical & Facility Assets Registry
export type AssetCategory = "Diagnostic & Imaging" | "Life Support" | "OT Equipment" | "Monitoring" | "Facility Infrastructure";
export type AssetMaintenanceStatus = "Operational" | "Under Maintenance" | "Calibration Due" | "Decommissioned";

export interface BiomedicalAsset {
  id: string;
  assetCode: string;
  name: string;
  category: AssetCategory;
  model: string;
  serialNo: string;
  department: string;
  floor: string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyExpiry: string;
  amcCmcContract: "Active" | "Expired" | "Under Renewal";
  vendorName: string;
  nextPPMDate: string;
  maintenanceStatus: AssetMaintenanceStatus;
  lastCalibrationDate?: string;
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
export type EncounterType = "OPD" | "IPD" | "Daycare" | "Emergency";
export type ServiceCategory = "Consultation" | "Surgery" | "Diagnostics" | "Pharmacy" | "Bed Charges" | "Package";

export interface InvoiceLineItem {
  id: string;
  name: string;
  category: ServiceCategory;
  sacCode?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // percentage e.g. 5, 12, 18
  total: number;
  procurementItemId?: string;
  labOrderId?: string;
  prescriptionId?: string;
}

export interface InterimDeposit {
  id: string;
  amount: number;
  date: string;
  mode: "Cash" | "Card" | "UPI" | "Insurance" | "Online";
  receiptNo: string;
  cashierName: string;
  notes?: string;
}

export interface DiscountApplication {
  typeId: string;
  typeName: string;
  percentage?: number;
  flatAmount: number;
  appliedBy: string;
  approvedBy?: string;
  status: "Applied" | "Pending Approval" | "Rejected";
  reason?: string;
  appliedAt: string;
}

export interface DiscountType {
  id: string;
  name: string;
  category: "Senior Citizen" | "Staff Discount" | "Corporate / Insurance Rate" | "Promotional Camp" | "Compassionate Waiver";
  defaultPercentage?: number;
  defaultFlatAmount?: number;
  eligibilityCriteria: string;
  requiresSupervisorApproval: boolean;
  isActive: boolean;
}

export interface RefundRecord {
  id: string;
  invoiceId: string;
  invoiceNo: string;
  patientName: string;
  amount: number;
  reason: string;
  reasonCategory: "Clinical Cancellation" | "Billing Dispute" | "Service Dissatisfaction" | "Duplicate Payment";
  requestedBy: string;
  approvedBy?: string;
  status: "Requested" | "Approved" | "Processed" | "Rejected";
  timestamp: string;
  paymentMode: "Cash" | "Bank Transfer" | "Original Mode";
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  patientName: string;
  patientId: string;
  service: string;
  encounterType?: EncounterType;
  serviceCategory?: ServiceCategory;
  department?: string;
  doctorName?: string;
  amount: number; // Gross amount
  subtotal?: number;
  taxAmount?: number;
  paid: number;
  outstanding: number;
  status: InvoiceStatus;
  issuedOn: string;
  method?: "Cash" | "Card" | "UPI" | "Insurance" | "Online";
  lineItems?: InvoiceLineItem[];
  interimDeposits?: InterimDeposit[];
  discount?: DiscountApplication;
  refunds?: RefundRecord[];
  linkedCaseId?: string;
  linkedProcurementItemIds?: string[];
  dischargeCleared?: boolean;
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
  patientId?: string;
  patientName: string;
  uhid?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  test: string;
  department?: string;
  orderingDoctor: string;
  source: "Direct" | "Doctor Order" | "Clinic Referral" | "Hospital Order" | "OPD" | "IPD" | "Emergency" | "OT";
  priority?: "Routine" | "Stat";
  sampleType?: string;
  sampleId?: string;
  patientLocation?: string;
  status: LabOrderStatus;
  orderedOn: string;
  tat: string;
  critical?: boolean;
  criticalDetails?: string;
  assignedCollector?: string;
  collectedAt?: string;
  assignedAnalyzer?: string;
  expectedCompletionTime?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  clinicianNotified?: boolean;
  tariffId?: string;
  price?: number;
  isExternal?: boolean;
  referenceLabName?: string;
  reportUrl?: string;
}

export interface SampleCollectionTask {
  taskId: string;
  orderId: string;
  patientName: string;
  uhid: string;
  patientLocation: string;
  testName: string;
  sampleType: string;
  barcodeId: string;
  priority: "Routine" | "Stat";
  scheduledAt: string;
  status: "Pending" | "Collected" | "Rejected";
  assignedCollector?: string;
  collectedAt?: string;
  rejectionReason?: string;
}

export interface ExternalLabReport {
  id: string;
  orderId?: string;
  patientId: string;
  patientName: string;
  uhid: string;
  referenceLabName: string;
  testName: string;
  sampleType: string;
  receivedAt: string;
  reportFileUrl: string;
  verifyingPathologist?: string;
  verificationStatus: "Pending Verification" | "Verified" | "Rejected";
  verificationNotes?: string;
  verifiedAt?: string;
}

export interface LabTestCatalogItem {
  id: string;
  testCode: string;
  testName: string;
  department: string;
  sampleType: string;
  referenceRange: string;
  unit: string;
  turnaroundHours: number;
  tariffId: string;
  price: number;
  criticalLow?: number;
  criticalHigh?: number;
}

export interface AnalyzerRegistryItem {
  id: string;
  analyzerId: string;
  name: string;
  model: string;
  department: string;
  status: "Operational" | "Maintenance" | "Calibration Due";
  dailyTestVolume: number;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
}

export interface CriticalThresholdItem {
  id: string;
  testCode: string;
  testName: string;
  lowPanic: number;
  highPanic: number;
  unit: string;
  appliesTo: "All" | "Adults" | "Pediatric" | "Neonates" | "Female Only" | "Male Only";
  lastAuditedAt: string;
  auditedBy: string;
}

export interface RejectionReasonItem {
  id: string;
  code: string;
  reason: string;
  category: "Specimen Quality" | "Identification" | "Volume" | "Transport";
  standardAction: string;
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
