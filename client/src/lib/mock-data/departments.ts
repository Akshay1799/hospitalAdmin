export interface DepartmentData {
  id: string;
  name: string;
  type: "OPD" | "IPD" | "ICU" | "Emergency" | "OT" | "Radiology" | "Cardiology" | "Orthopedics" | "Laboratory";
  location: string;
  floor: string;
  headName: string;
  headTitle: string;
  activePatients: number;
  bedCapacity?: number;
  occupiedBeds?: number;
  status: "active" | "warning" | "critical";
  operatingHours: string;
  shiftModel: string;
  nurseStations: string[];
  scope: {
    clinicalProcedures: string[];
    bedAllocationRights: string;
    equipmentReady: string[];
    supervisionLevel: string;
    delegationLimits: string;
  };
  activePatientsList: Array<{
    id: string;
    name: string;
    qlynoId: string;
    age: number;
    gender: string;
    bedNumber: string;
    admittingDoctor: string;
    admissionDate: string;
    condition: string;
    status: "Stable" | "Critical" | "Under Observation" | "Pre-Op";
  }>;
  activeDoctorsList: Array<{
    id: string;
    name: string;
    specialty: string;
    qualification: string;
    experience: string;
    availability: "On-Duty" | "In-Surgery" | "On-Call" | "Consulting";
    rating: number;
  }>;
  activeNursesList: Array<{
    id: string;
    name: string;
    station: string;
    role: string;
    shift: string;
    status: "On-Duty" | "Break" | "Standby";
  }>;
  supportStaffList: Array<{
    id: string;
    name: string;
    role: string;
    taskScope: string;
    shift: string;
    status: "Active" | "On-Task";
  }>;
}

export const detailedDepartments: DepartmentData[] = [
  {
    id: "dep_001",
    name: "OPD (Outpatient Department)",
    type: "OPD",
    location: "Qlyno Multispecialty Hospital - Main Campus",
    floor: "Ground Floor · Wing A",
    headName: "Dr. Simran Kaur",
    headTitle: "Chief of Outpatient Medicine",
    activePatients: 168,
    status: "active",
    operatingHours: "08:00 AM – 08:00 PM (Mon–Sat)",
    shiftModel: "2-Shift General Outpatient",
    nurseStations: ["Station P1 (OPD Triage)", "Station P2 (Specialty Consult)"],
    scope: {
      clinicalProcedures: [
        "General Medical Consultation",
        "Routine Clinical Follow-ups",
        "Minor Dressing & Suture Removal",
        "Vaccination & Preventive Screening",
        "Diagnostic Referrals",
      ],
      bedAllocationRights: "Day-care observation bays only (Max 4-hour stay)",
      equipmentReady: ["ECG Machines", "Vital Sign Monitors", "Nebulization Stations", "Automated BP Cuffs"],
      supervisionLevel: "Attending Consultant Level Supervision",
      delegationLimits: "Administrative staff coordinates token queues and scheduling; medical prescriptions strictly restricted to doctors.",
    },
    activePatientsList: [
      { id: "pat_101", name: "Aarav Shah", qlynoId: "QLY-PAT-2024-00841", age: 34, gender: "Male", bedNumber: "OPD Bay 02", admittingDoctor: "Dr. Simran Kaur", admissionDate: "2026-08-19", condition: "Routine Hypertension Check", status: "Stable" },
      { id: "pat_102", name: "Meera Nambiar", qlynoId: "QLY-PAT-2023-00412", age: 28, gender: "Female", bedNumber: "OPD Bay 05", admittingDoctor: "Dr. Ananya Rao", admissionDate: "2026-08-19", condition: "Prenatal Follow-up", status: "Stable" },
      { id: "pat_103", name: "Pooja Hegde", qlynoId: "QLY-PAT-2022-00109", age: 41, gender: "Female", bedNumber: "Consultation Rm 3", admittingDoctor: "Dr. Sunita Deshmukh", admissionDate: "2026-08-19", condition: "Dermatological Review", status: "Stable" },
    ],
    activeDoctorsList: [
      { id: "doc_101", name: "Dr. Simran Kaur", specialty: "General Medicine", qualification: "MBBS, MD", experience: "12 yrs", availability: "Consulting", rating: 4.9 },
      { id: "doc_102", name: "Dr. Sunita Deshmukh", specialty: "Dermatology", qualification: "MBBS, DVD", experience: "15 yrs", availability: "Consulting", rating: 4.8 },
      { id: "doc_103", name: "Dr. Vikram Patel", specialty: "Orthopedics (OPD)", qualification: "MBBS, MS", experience: "10 yrs", availability: "On-Duty", rating: 4.7 },
    ],
    activeNursesList: [
      { id: "nur_101", name: "Zoya Ansari", station: "Station P1", role: "Triage Lead Nurse", shift: "Morning (07:00–15:30)", status: "On-Duty" },
      { id: "nur_102", name: "Pooja Nair", station: "Station P2", role: "Staff Nurse", shift: "Morning (07:00–15:30)", status: "On-Duty" },
    ],
    supportStaffList: [
      { id: "sup_101", name: "Suresh Patil", role: "Queue Coordinator", taskScope: "Patient token management & reception routing", shift: "General Shift", status: "Active" },
      { id: "sup_102", name: "Sunil Gawde", role: "Clinic Assistant", taskScope: "Sanitization & patient escort", shift: "Morning", status: "On-Task" },
    ],
  },
  {
    id: "dep_002",
    name: "ICU (Intensive Care Unit)",
    type: "ICU",
    location: "Qlyno Multispecialty Hospital - Main Campus",
    floor: "3rd Floor · Critical Care Wing",
    headName: "Dr. Aditya Verma",
    headTitle: "Director of Critical Care & Intensivism",
    activePatients: 19,
    bedCapacity: 28,
    occupiedBeds: 19,
    status: "warning",
    operatingHours: "24x7 Continuous Critical Care",
    shiftModel: "3-Shift Continuous 1:1 Nursing",
    nurseStations: ["Station ICU-1 (North)", "Station ICU-2 (South)"],
    scope: {
      clinicalProcedures: [
        "Invasive Mechanical Ventilation",
        "Central Venous & Arterial Line Placement",
        "Continuous Renal Replacement Therapy (CRRT)",
        "Advanced Hemodynamic Monitoring",
        "Post-Surgical Critical Stabilization",
      ],
      bedAllocationRights: "Critical care bed assignments and isolation cubicles",
      equipmentReady: ["Servo Ventilators", "Multipara Monitors", "Defibrillators", "Infusion Pumps", "Dialysis Unit"],
      supervisionLevel: "Intensivist 24x7 Physical Presence Required",
      delegationLimits: "Emergency bed admission coordinated by Admin with mandatory Intensivist sign-off.",
    },
    activePatientsList: [
      { id: "pat_201", name: "Rohan Verma", qlynoId: "QLY-PAT-2024-00918", age: 52, gender: "Male", bedNumber: "ICU Bed 04", admittingDoctor: "Dr. Aditya Verma", admissionDate: "2026-08-17", condition: "Acute Respiratory Distress (ARDS)", status: "Critical" },
      { id: "pat_202", name: "Aditya Kulkarni", qlynoId: "QLY-PAT-2024-00342", age: 48, gender: "Male", bedNumber: "ICU Bed 08", admittingDoctor: "Dr. Rajesh Sharma", admissionDate: "2026-08-18", condition: "Post-Trauma Resuscitation", status: "Critical" },
      { id: "pat_203", name: "Kavita Nair", qlynoId: "QLY-PAT-2024-00511", age: 29, gender: "Female", bedNumber: "ICU Bed 11", admittingDoctor: "Dr. Aditya Verma", admissionDate: "2026-08-18", condition: "Neurological Monitoring", status: "Under Observation" },
    ],
    activeDoctorsList: [
      { id: "doc_201", name: "Dr. Aditya Verma", specialty: "Critical Care / Intensivist", qualification: "MBBS, MD, EDIC", experience: "16 yrs", availability: "On-Duty", rating: 4.9 },
      { id: "doc_202", name: "Dr. Kavita Verma", specialty: "Neuro-Critical Care", qualification: "MBBS, DM (Neuro)", experience: "14 yrs", availability: "On-Duty", rating: 4.9 },
    ],
    activeNursesList: [
      { id: "nur_201", name: "Ritu Sharma", station: "Station ICU-1", role: "ICU In-Charge Nurse", shift: "Morning (07:00–15:30)", status: "On-Duty" },
      { id: "nur_202", name: "Deepika Joshi", station: "Station ICU-1", role: "Critical Care Specialist", shift: "Morning (07:00–15:30)", status: "On-Duty" },
      { id: "nur_203", name: "Sneha Jadhav", station: "Station ICU-2", role: "Ventilator Specialist", shift: "Morning (07:00–15:30)", status: "On-Duty" },
    ],
    supportStaffList: [
      { id: "sup_201", name: "Dinesh Verma", role: "Biomedical Assistant", taskScope: "Gas cylinder & monitor calibration", shift: "Morning", status: "Active" },
      { id: "sup_202", name: "Ramesh Shinde", role: "ICU Orderly", taskScope: "Patient repositioning & sterile supplies", shift: "Morning", status: "Active" },
    ],
  },
  {
    id: "dep_003",
    name: "Emergency & Trauma Center",
    type: "Emergency",
    location: "Qlyno Multispecialty Hospital - Main Campus",
    floor: "Ground Floor · Emergency Driveway",
    headName: "Dr. Farhan Sheikh",
    headTitle: "Head of Emergency Medicine & Trauma",
    activePatients: 31,
    bedCapacity: 12,
    occupiedBeds: 11,
    status: "critical",
    operatingHours: "24x7 Non-Stop Emergency Response",
    shiftModel: "3-Shift High-Turnover Triage",
    nurseStations: ["Station ER-1 (Triage)", "Station ER-2 (Resuscitation Bay)"],
    scope: {
      clinicalProcedures: [
        "Advanced Trauma Life Support (ATLS)",
        "Cardiac Resuscitation (ACLS)",
        "Emergency Intubation & Chest Tube Placement",
        "Acute Stroke Thrombolysis Protocol",
        "Emergency Triage & Pre-Op Stabilization",
      ],
      bedAllocationRights: "Emergency intake bays, triage assessment beds, code blue resuscitation slots",
      equipmentReady: ["Defibrillators", "Crash Carts", "Portable Ultrasound", "Rapid Blood Infusers", "Portable X-Ray"],
      supervisionLevel: "Emergency Physician 24x7 Immediate Response",
      delegationLimits: "Admin operates live SOS board and transport coordination; medical triage decisions remain strictly with emergency physicians.",
    },
    activePatientsList: [
      { id: "pat_301", name: "Priya Desai", qlynoId: "QLY-PAT-2024-00101", age: 34, gender: "Female", bedNumber: "ER Bay 01 (Resus)", admittingDoctor: "Dr. Farhan Sheikh", admissionDate: "2026-08-19", condition: "Acute Chest Pain / STEMI Alert", status: "Critical" },
      { id: "pat_302", name: "Suresh Menon (Emergency)", qlynoId: "QLY-PAT-2024-00108", age: 60, gender: "Male", bedNumber: "ER Bay 04", admittingDoctor: "Dr. Farhan Sheikh", admissionDate: "2026-08-19", condition: "Acute Shortness of Breath", status: "Under Observation" },
    ],
    activeDoctorsList: [
      { id: "doc_301", name: "Dr. Farhan Sheikh", specialty: "Emergency Medicine", qualification: "MBBS, MD (Emergency)", experience: "13 yrs", availability: "On-Duty", rating: 4.8 },
      { id: "doc_302", name: "Dr. Rajesh Sharma", specialty: "Trauma Surgery", qualification: "MBBS, MS (Ortho), Fellow Trauma", experience: "18 yrs", availability: "On-Call", rating: 4.9 },
    ],
    activeNursesList: [
      { id: "nur_301", name: "Nikita Sen", station: "Station ER-2", role: "Trauma Nurse Coordinator", shift: "Morning (07:00–15:30)", status: "On-Duty" },
      { id: "nur_302", name: "Kavita Salve", station: "Station ER-1", role: "Triage Assessment Nurse", shift: "Morning (07:00–15:30)", status: "On-Duty" },
    ],
    supportStaffList: [
      { id: "sup_301", name: "Sanjay Pawar", role: "Emergency Driver / Lead", taskScope: "Ambulance fleet dispatch & intake escort", shift: "24x7 Shift", status: "Active" },
      { id: "sup_302", name: "Vikas Naik", role: "ER Porter", taskScope: "Rapid gurney movement & radiology transit", shift: "Morning", status: "Active" },
    ],
  },
  {
    id: "dep_004",
    name: "OT Complex (Operation Theatres)",
    type: "OT",
    location: "Qlyno Multispecialty Hospital - Main Campus",
    floor: "2nd Floor · Sterile Surgical Complex",
    headName: "Dr. Kavya Iyer",
    headTitle: "Chief of Surgery & OT Operations",
    activePatients: 7,
    status: "active",
    operatingHours: "24x7 Elective & Emergency Surgical Coverage",
    shiftModel: "Scheduled Surgical Blocks + On-Call Emergency",
    nurseStations: ["Station OT-Central (Sterile Core)", "Station PACU (Post-Anesthesia)"],
    scope: {
      clinicalProcedures: [
        "Major Orthopedic & Joint Replacements",
        "Cardiothoracic & Vascular Surgeries",
        "Neurosurgical & Spine Interventions",
        "General & Laparoscopic Surgeries",
        "Emergency Trauma Damage Control Surgery",
      ],
      bedAllocationRights: "OT Suites 1–4, PACU Recovery Bays, Pre-Op Holding Beds",
      equipmentReady: ["C-Arm Fluoroscopy", "Laparoscopy Towers", "Anesthesia Workstations", "Cautery & Suction Units", "Surgical Robots"],
      supervisionLevel: "Chief Surgeon & Consultant Anesthesiologist Supervision",
      delegationLimits: "Admin manages OT room time allocations and procurement readiness checklists; surgical decisions reserved for Surgeons.",
    },
    activePatientsList: [
      { id: "pat_401", name: "Arjun Gupta", qlynoId: "QLY-PAT-2024-00409", age: 58, gender: "Male", bedNumber: "OT-101 (Main OR)", admittingDoctor: "Dr. Ramesh Sharma", admissionDate: "2026-08-19", condition: "Total Knee Replacement", status: "Pre-Op" },
      { id: "pat_402", name: "Deepak Chawla", qlynoId: "QLY-PAT-2024-00221", age: 46, gender: "Male", bedNumber: "PACU Bay 02", admittingDoctor: "Dr. Kavya Iyer", admissionDate: "2026-08-19", condition: "Post-Laparoscopic Cholecystectomy", status: "Under Observation" },
    ],
    activeDoctorsList: [
      { id: "doc_401", name: "Dr. Kavya Iyer", specialty: "General & Laparoscopic Surgery", qualification: "MBBS, MS, FRCS", experience: "17 yrs", availability: "In-Surgery", rating: 4.9 },
      { id: "doc_402", name: "Dr. Ramesh Sharma", specialty: "Orthopedic Surgery", qualification: "MBBS, MS (Ortho)", experience: "20 yrs", availability: "In-Surgery", rating: 4.9 },
      { id: "doc_403", name: "Dr. Anand Iyer", specialty: "Cardiac Surgery", qualification: "MBBS, MCh (CTVS)", experience: "15 yrs", availability: "On-Call", rating: 4.8 },
    ],
    activeNursesList: [
      { id: "nur_401", name: "Anjali Bhosale", station: "Station OT-Central", role: "OT Scrub Lead Nurse", shift: "Morning (07:00–15:30)", status: "On-Duty" },
      { id: "nur_402", name: "Pooja Deshmukh", station: "Station PACU", role: "Recovery Specialist Nurse", shift: "Morning (07:00–15:30)", status: "On-Duty" },
    ],
    supportStaffList: [
      { id: "sup_401", name: "Mahesh Kadam", role: "OT Technician", taskScope: "Autoclave, sterile packs & laparoscopy tower setup", shift: "Morning", status: "Active" },
    ],
  },
  {
    id: "dep_005",
    name: "Radiology & Diagnostic Imaging",
    type: "Radiology",
    location: "Qlyno Multispecialty Hospital - Powai Center",
    floor: "Basement 1 · Diagnostic Suite",
    headName: "Dr. Aarav Sharma",
    headTitle: "Head of Radiology & Nuclear Imaging",
    activePatients: 22,
    status: "active",
    operatingHours: "24x7 CT/X-Ray Emergency + 08:00–20:00 MRI",
    shiftModel: "Rotational Diagnostic Coverage",
    nurseStations: ["Station Rad-1 (Imaging Reception)"],
    scope: {
      clinicalProcedures: [
        "128-Slice Contrast CT Scans",
        "3T High-Resolution MRI",
        "Ultrasound & Color Doppler",
        "Digital X-Ray & Fluoroscopy",
        "Image-Guided Biopsies & Drainage",
      ],
      bedAllocationRights: "Radiology holding bays & contrast observation recovery",
      equipmentReady: ["3T MRI Scanner", "128-Slice CT", "Ultrasound Doppler", "Digital Flat-Panel X-Ray", "PACS Workstation"],
      supervisionLevel: "Consultant Radiologist Sign-off Required for All Reports",
      delegationLimits: "Administrative staff coordinates scan appointments and report releases; imaging interpretation reserved for Radiologists.",
    },
    activePatientsList: [
      { id: "pat_501", name: "Vikram Malhotra", qlynoId: "QLY-PAT-2024-00620", age: 39, gender: "Male", bedNumber: "Rad Holding 01", admittingDoctor: "Dr. Aarav Sharma", admissionDate: "2026-08-19", condition: "Abdominal CT with Contrast", status: "Under Observation" },
      { id: "pat_502", name: "Shalini Saxena", qlynoId: "QLY-PAT-2024-00712", age: 62, gender: "Female", bedNumber: "MRI Prep Room", admittingDoctor: "Dr. Aarav Sharma", admissionDate: "2026-08-19", condition: "Spine MRI Protocol", status: "Stable" },
    ],
    activeDoctorsList: [
      { id: "doc_501", name: "Dr. Aarav Sharma", specialty: "Radiology & Imaging", qualification: "MBBS, MD (Radio-diagnosis)", experience: "15 yrs", availability: "Consulting", rating: 4.8 },
      { id: "doc_502", name: "Dr. Ananya Patel", specialty: "Interventional Radiology", qualification: "MBBS, MD, DNB", experience: "11 yrs", availability: "On-Duty", rating: 4.8 },
    ],
    activeNursesList: [
      { id: "nur_501", name: "Manisha Kulkarni", station: "Station Rad-1", role: "Contrast Safety Nurse", shift: "Morning (08:00–16:30)", status: "On-Duty" },
    ],
    supportStaffList: [
      { id: "sup_501", name: "Girish Sawant", role: "Radiology Technologist", taskScope: "MRI & CT positioning & PACS upload", shift: "Morning", status: "Active" },
    ],
  },
  {
    id: "dep_006",
    name: "Cardiology & Cath Lab",
    type: "Cardiology",
    location: "Qlyno Multispecialty Hospital - Main Campus",
    floor: "1st Floor · Heart Institute",
    headName: "Dr. Ananya Rao",
    headTitle: "Director of Interventional Cardiology",
    activePatients: 26,
    bedCapacity: 16,
    occupiedBeds: 14,
    status: "active",
    operatingHours: "24x7 Emergency Primary PCI + Daily Clinics",
    shiftModel: "Dedicated Cardiac Care Nursing",
    nurseStations: ["Station Cardio-1 (Cath Lab Prep)", "Station CCU (Cardiac Care Unit)"],
    scope: {
      clinicalProcedures: [
        "Coronary Angiography & Angioplasty (PCI)",
        "Pacemaker & ICD Implantation",
        "2D & 3D Echocardiography",
        "TMT & Stress Testing",
        "Cardiac Electrophysiology",
      ],
      bedAllocationRights: "CCU Step-down beds, post-PCI recovery bays, telemetric monitoring beds",
      equipmentReady: ["Cath Lab Angio Suite", "3D Echo Machine", "Intra-Aortic Balloon Pump (IABP)", "Telemetry Monitors"],
      supervisionLevel: "Interventional Cardiologist Physical Presence",
      delegationLimits: "Emergency cath lab activations coordinated with cardiology on-call team.",
    },
    activePatientsList: [
      { id: "pat_601", name: "Aarav Shah", qlynoId: "QLY-PAT-2024-00841", age: 34, gender: "Male", bedNumber: "CCU Bed 02", admittingDoctor: "Dr. Ananya Rao", admissionDate: "2026-08-18", condition: "Post-Angioplasty Monitoring", status: "Stable" },
      { id: "pat_602", name: "Priya Desai", qlynoId: "QLY-PAT-2024-00101", age: 34, gender: "Female", bedNumber: "CCU Bed 05", admittingDoctor: "Dr. Ananya Rao", admissionDate: "2026-08-19", condition: "STEMI Post-Primary PCI", status: "Under Observation" },
    ],
    activeDoctorsList: [
      { id: "doc_601", name: "Dr. Ananya Rao", specialty: "Interventional Cardiology", qualification: "MBBS, MD, DM (Cardiology)", experience: "14 yrs", availability: "Consulting", rating: 4.9 },
    ],
    activeNursesList: [
      { id: "nur_601", name: "Priya Deshmukh", station: "Station CCU", role: "Cardiac Specialist Nurse", shift: "Morning", status: "On-Duty" },
    ],
    supportStaffList: [
      { id: "sup_601", name: "Dinesh Verma", role: "Cath Lab Assistant", taskScope: "Lead apron & contrast preparation", shift: "Morning", status: "Active" },
    ],
  },
];
