export interface TestDetailResult {
  parameter: string;
  observedValue: string;
  unit: string;
  referenceRange: string;
  status: "Normal" | "High" | "Low" | "Critical";
}

export interface LabReportDetail {
  orderNo: string;
  patientName: string;
  age: number;
  gender: string;
  uhid: string;
  test: string;
  orderingDoctor: string;
  source: string;
  status: "released" | "processing" | "awaiting-validation" | "scheduled" | "sample-pending" | "rejected";
  critical?: boolean;
  sampleId: string;
  sampleType: string;
  collectedAt: string;
  authorizedAt: string;
  pathologist: string;
  findingsSummary: string;
  clinicalImpression: string;
  results: TestDetailResult[];
}

export const mockLabReports: Record<string, LabReportDetail> = {
  "lo_001": {
    orderNo: "LAB-88213",
    patientName: "Ibrahim Sheikh",
    age: 54,
    gender: "Male",
    uhid: "QLY-PAT-2024-00192",
    test: "HbA1c + Fasting Glucose",
    orderingDoctor: "Dr. Simran Kaur",
    source: "Doctor Order",
    status: "released",
    critical: false,
    sampleId: "SMP-2026-8810",
    sampleType: "Fluoride Plasma & Whole Blood (EDTA)",
    collectedAt: "2026-08-12 07:30 AM",
    authorizedAt: "2026-08-12 01:45 PM",
    pathologist: "Dr. Arvind Kulkarni, MD (Pathology)",
    findingsSummary: "Elevated glycated hemoglobin and fasting plasma glucose indicating sub-optimal glycemic control.",
    clinicalImpression: "Consistent with Type-2 Diabetes Mellitus with fair-to-poor glycemic control over the preceding 90 days. Clinical correlation with renal profile recommended.",
    results: [
      { parameter: "Fasting Blood Glucose (Hexokinase)", observedValue: "142", unit: "mg/dL", referenceRange: "70 – 99", status: "High" },
      { parameter: "HbA1c (HPLC Method)", observedValue: "7.8", unit: "%", referenceRange: "4.0 – 5.6", status: "High" },
      { parameter: "Estimated Average Glucose (eAG)", observedValue: "177", unit: "mg/dL", referenceRange: "70 – 126", status: "High" },
      { parameter: "Serum Creatinine", observedValue: "0.95", unit: "mg/dL", referenceRange: "0.70 – 1.20", status: "Normal" },
    ],
  },
  "lo_002": {
    orderNo: "LAB-88214",
    patientName: "Aarav Shah",
    age: 34,
    gender: "Male",
    uhid: "QLY-PAT-2024-00841",
    test: "Lipid Profile",
    orderingDoctor: "Dr. Ananya Rao",
    source: "Doctor Order",
    status: "processing",
    critical: false,
    sampleId: "SMP-2026-8811",
    sampleType: "Serum (Gel Separator Tube)",
    collectedAt: "2026-08-13 08:00 AM",
    authorizedAt: "2026-08-13 06:15 PM",
    pathologist: "Dr. Meera Kapoor, MD (Biochemistry)",
    findingsSummary: "Moderate mixed dyslipidemia with elevated LDL and hypertriglyceridemia.",
    clinicalImpression: "Atherogenic lipid profile. Dietary modification, exercise and physician consult advised.",
    results: [
      { parameter: "Total Cholesterol", observedValue: "218", unit: "mg/dL", referenceRange: "125 – 200", status: "High" },
      { parameter: "Triglycerides", observedValue: "185", unit: "mg/dL", referenceRange: "< 150", status: "High" },
      { parameter: "HDL Cholesterol", observedValue: "42", unit: "mg/dL", referenceRange: "> 40", status: "Normal" },
      { parameter: "LDL Cholesterol (Calculated)", observedValue: "139", unit: "mg/dL", referenceRange: "< 100", status: "High" },
      { parameter: "VLDL Cholesterol", observedValue: "37", unit: "mg/dL", referenceRange: "5 – 30", status: "High" },
      { parameter: "Total / HDL Ratio", observedValue: "5.19", unit: "ratio", referenceRange: "< 4.5", status: "High" },
    ],
  },
  "lo_003": {
    orderNo: "LAB-88215",
    patientName: "Fatima Ansari",
    age: 46,
    gender: "Female",
    uhid: "QLY-PAT-2024-00318",
    test: "MRI Brain",
    orderingDoctor: "Dr. Vikram Nair",
    source: "Doctor Order",
    status: "awaiting-validation",
    critical: true,
    sampleId: "RAD-2026-9041",
    sampleType: "MRI 3T Neuro Imaging Suite",
    collectedAt: "2026-08-01 09:15 AM",
    authorizedAt: "2026-08-01 11:30 AM",
    pathologist: "Dr. Aarav Sharma, MD (Radio-diagnosis)",
    findingsSummary: "CRITICAL ALERT: Acute non-hemorrhagic ischemic infarct in the territory of the left Middle Cerebral Artery (MCA).",
    clinicalImpression: "Acute Left MCA territory infarct measuring approx 2.8 x 1.9 cm with mild cytotoxic edema. Immediate neurology and stroke team evaluation required.",
    results: [
      { parameter: "Diffusion Weighted Imaging (DWI)", observedValue: "Hyperintense Signal", unit: "Neuro Sequence", referenceRange: "Isointense / Normal", status: "Critical" },
      { parameter: "ADC Mapping", observedValue: "Severe Diffusion Restriction", unit: "Signal Map", referenceRange: "Normal Diffusivity", status: "Critical" },
      { parameter: "T2 / FLAIR Signal", observedValue: "Hyperintensity in Left Frontotemporoparietal", unit: "Morphology", referenceRange: "Unremarkable", status: "High" },
      { parameter: "Intracranial Hemorrhage", observedValue: "Not Detected", unit: "GRE / SWI", referenceRange: "Absent", status: "Normal" },
    ],
  },
  "lo_004": {
    orderNo: "LAB-88216",
    patientName: "Devansh Pandey",
    age: 58,
    gender: "Male",
    uhid: "QLY-PAT-2024-00650",
    test: "X-Ray Knee (Left)",
    orderingDoctor: "Dr. Rohan Mehta",
    source: "Doctor Order",
    status: "scheduled",
    critical: false,
    sampleId: "RAD-2026-9042",
    sampleType: "Digital Radiography Flat Panel",
    collectedAt: "2026-08-13 10:00 AM",
    authorizedAt: "2026-08-13 11:15 AM",
    pathologist: "Dr. Aarav Sharma, MD (Radio-diagnosis)",
    findingsSummary: "Mild to moderate degenerative osteoarthritic changes of the left knee joint.",
    clinicalImpression: "Grade 2 Kellegren-Lawrence Osteoarthritis with medial compartment joint space narrowing. No fracture seen.",
    results: [
      { parameter: "Medial Joint Space", observedValue: "Mild Narrowing (3.1 mm)", unit: "mm", referenceRange: "> 4.5 mm", status: "Low" },
      { parameter: "Lateral Joint Space", observedValue: "Preserved (5.2 mm)", unit: "mm", referenceRange: "> 4.5 mm", status: "Normal" },
      { parameter: "Tibial / Femoral Osteophytes", observedValue: "Marginal Spurring Present", unit: "Visual", referenceRange: "Smooth Cortical Margins", status: "High" },
      { parameter: "Soft Tissue Swelling", observedValue: "Minimal Suprapatellar", unit: "Visual", referenceRange: "Normal", status: "Normal" },
    ],
  },
  "lo_005": {
    orderNo: "LAB-88217",
    patientName: "Rekha Joshi (Walk-in)",
    age: 39,
    gender: "Female",
    uhid: "QLY-PAT-2024-00910",
    test: "Complete Blood Count",
    orderingDoctor: "Dr. Simran Kaur",
    source: "Direct",
    status: "sample-pending",
    critical: false,
    sampleId: "SMP-2026-8814",
    sampleType: "Whole Blood (K2-EDTA)",
    collectedAt: "2026-08-14 08:45 AM",
    authorizedAt: "Pending Laboratory Validation",
    pathologist: "Dr. Arvind Kulkarni, MD (Pathology)",
    findingsSummary: "Routine complete hemogram analysis in progress.",
    clinicalImpression: "Automated analyzer results within normal physiological thresholds.",
    results: [
      { parameter: "Hemoglobin (Cyanmethemoglobin)", observedValue: "13.4", unit: "g/dL", referenceRange: "13.0 – 17.0", status: "Normal" },
      { parameter: "Total Leukocyte Count (TLC)", observedValue: "8,400", unit: "/cumm", referenceRange: "4,000 – 11,000", status: "Normal" },
      { parameter: "Platelet Count (Automated)", observedValue: "245,000", unit: "/cumm", referenceRange: "150,000 – 450,000", status: "Normal" },
      { parameter: "Packed Cell Volume (PCV)", observedValue: "41.2", unit: "%", referenceRange: "40 – 50", status: "Normal" },
      { parameter: "Neutrophils", observedValue: "64", unit: "%", referenceRange: "40 – 70", status: "Normal" },
      { parameter: "Lymphocytes", observedValue: "28", unit: "%", referenceRange: "20 – 40", status: "Normal" },
    ],
  },
  "lo_006": {
    orderNo: "LAB-88190",
    patientName: "Sunita Reddy",
    age: 42,
    gender: "Female",
    uhid: "QLY-PAT-2024-00277",
    test: "Allergy Panel",
    orderingDoctor: "Dr. Aditya Verma",
    source: "Clinic Referral",
    status: "rejected",
    critical: false,
    sampleId: "SMP-2026-8815",
    sampleType: "Serum (Hemolyzed)",
    collectedAt: "2026-08-05 11:20 AM",
    authorizedAt: "Rejected / Sample Recollection Required",
    pathologist: "Dr. Meera Kapoor, MD (Biochemistry)",
    findingsSummary: "Sample rejected due to significant hemolysis during phlebotomy transit.",
    clinicalImpression: "Recollection requested. Specific IgE allergen values cannot be reliably analyzed on hemolyzed specimen.",
    results: [
      { parameter: "Sample Quality Index", observedValue: "Gross Hemolysis (Index > 300)", unit: "Visual Index", referenceRange: "Clear / Non-Hemolyzed", status: "Critical" },
      { parameter: "Total Serum IgE", observedValue: "Inconclusive", unit: "IU/mL", referenceRange: "< 100", status: "Low" },
    ],
  },
};
