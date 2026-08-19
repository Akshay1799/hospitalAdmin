import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SurgicalCaseStatus = 'Planning' | 'Ready' | 'Blocked' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
export type ChecklistItemStatus = 'Pending' | 'Done' | 'Missing' | 'Overdue';
export type SurgeonRequestStatus = 'Sent' | 'Accepted' | 'Declined' | 'Clarification Requested' | 'Assigned' | 'Expired';

export interface ChecklistItem {
  id: string;
  category: 'pre-op assessment' | 'investigations' | 'consent' | 'blood/implant/equipment' | 'other configured dependencies';
  description: string;
  status: ChecklistItemStatus;
  owner: string;
  deadline: string;
}

export interface SurgeonResponse {
  surgeonId: string;
  surgeonName: string;
  status: SurgeonRequestStatus;
  responseNotes?: string;
  respondedAt?: string;
}

export interface SurgeonRequest {
  id: string;
  caseId: string;
  specialty: string;
  subSpecialty: string;
  caseType: string;
  requiredTime: string;
  location: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  permittedCaseDetails: string;
  readinessInfo: string;
  sentAt: string;
  status: SurgeonRequestStatus;
  responses: SurgeonResponse[];
}

export interface OTRoom {
  id: string;
  name: string;
  department: string;
  status: 'Available' | 'Maintenance' | 'Occupied';
}

export interface Surgeon {
  id: string;
  name: string;
  specialty: string;
  availability: 'Available' | 'In Surgery' | 'Off-duty';
  reliabilityScore: number;
  acceptedCases: number;
  avgResponseTimeMins: number;
  isInternal: boolean;
}

export interface SurgicalCase {
  id: string;
  patientId: string;
  patientName: string;
  procedureType: string;
  department: string;
  preferredDateTime: string;
  status: SurgicalCaseStatus;
  readinessPercent: number;
  checklist: ChecklistItem[];
  allocatedOT?: {
    roomId: string;
    startDateTime: string;
    endDateTime: string;
    team: string[];
    resources: string[];
  };
  assignedSurgeonId?: string;
  isExternalSurgeon?: boolean;
  surgeonAccessExpiresAt?: string;
  linkedProcurementIds: string[];
  postOpTasks: {
    id: string;
    task: string;
    status: 'Pending' | 'Completed';
  }[];
}

interface SurgicalState {
  cases: SurgicalCase[];
  otRooms: OTRoom[];
  surgeons: Surgeon[];
  surgeonRequests: SurgeonRequest[];
}

const mockSurgeons: Surgeon[] = [
  { id: 'SURG-01', name: 'Dr. Ramesh Sharma', specialty: 'Orthopedics', availability: 'Available', reliabilityScore: 98, acceptedCases: 45, avgResponseTimeMins: 12, isInternal: true },
  { id: 'SURG-02', name: 'Dr. Kavita Verma', specialty: 'Neurology', availability: 'In Surgery', reliabilityScore: 95, acceptedCases: 112, avgResponseTimeMins: 15, isInternal: true },
  { id: 'EXT-01', name: 'Dr. Anand Iyer', specialty: 'Cardiology', availability: 'Available', reliabilityScore: 89, acceptedCases: 22, avgResponseTimeMins: 45, isInternal: false },
  { id: 'EXT-02', name: 'Dr. Sunita Patel', specialty: 'Orthopedics', availability: 'Available', reliabilityScore: 92, acceptedCases: 34, avgResponseTimeMins: 30, isInternal: false },
];

const mockRooms: OTRoom[] = [
  { id: 'OT-101', name: 'Main OR 1 (Ortho)', department: 'Orthopedics', status: 'Available' },
  { id: 'OT-102', name: 'Main OR 2 (Neuro)', department: 'Neurology', status: 'Available' },
  { id: 'OT-201', name: 'General OR 1', department: 'General Surgery', status: 'Maintenance' },
];

const initialState: SurgicalState = {
  cases: [
    {
      id: 'CASE-409',
      patientId: 'P-8821',
      patientName: 'Arjun Gupta',
      procedureType: 'Knee Replacement',
      department: 'Orthopedics',
      preferredDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'Blocked',
      readinessPercent: 75,
      checklist: [
        { id: 'C1', category: 'pre-op assessment', description: 'Cardiology Clearance', status: 'Done', owner: 'Dr. Menon', deadline: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
        { id: 'C2', category: 'consent', description: 'Patient Surgical Consent', status: 'Done', owner: 'Nurse Kamala', deadline: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
        { id: 'C3', category: 'blood/implant/equipment', description: 'Titanium Knee Joint', status: 'Missing', owner: 'Procurement', deadline: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
        { id: 'C4', category: 'other configured dependencies', description: 'Anesthesia Review', status: 'Pending', owner: 'Dr. Reddy', deadline: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString() },
      ],
      linkedProcurementIds: ['PR-1002'],
      postOpTasks: [
        { id: 'PO-1', task: 'Recovery: Patient extubated and breathing spontaneously', status: 'Pending' },
        { id: 'PO-2', task: 'Nursing: Monitor vitals every 15 mins for 2 hours', status: 'Pending' },
        { id: 'PO-3', task: 'Documents: Surgical notes uploaded to EMR', status: 'Pending' },
        { id: 'PO-4', task: 'Follow-up: Schedule 1-week outpatient checkup', status: 'Pending' }
      ]
    }
  ],
  otRooms: mockRooms,
  surgeons: mockSurgeons,
  surgeonRequests: []
};

// Helper to compute readiness and update blockers
const evaluateCaseReadiness = (c: SurgicalCase) => {
  if (c.checklist.length === 0) {
    c.readinessPercent = 100;
    c.status = 'Ready';
    return;
  }
  const doneCount = c.checklist.filter(i => i.status === 'Done').length;
  c.readinessPercent = Math.round((doneCount / c.checklist.length) * 100);
  
  const hasMissingOrOverdue = c.checklist.some(i => i.status === 'Missing' || i.status === 'Overdue');
  
  if (c.readinessPercent === 100 && !hasMissingOrOverdue) {
    if (c.status === 'Blocked' || c.status === 'Planning') {
      c.status = 'Ready';
    }
  } else if (hasMissingOrOverdue) {
    c.status = 'Blocked';
  } else if (c.status === 'Ready') {
    c.status = 'Planning'; // Downgrade if something was unchecked
  }
};

const surgicalSlice = createSlice({
  name: 'surgical',
  initialState,
  reducers: {
    createCase: (state, action: PayloadAction<Partial<SurgicalCase>>) => {
      const newCase: SurgicalCase = {
        id: `CASE-${400 + state.cases.length + 10}`,
        patientId: action.payload.patientId || '',
        patientName: action.payload.patientName || 'Unknown Patient',
        procedureType: action.payload.procedureType || '',
        department: action.payload.department || '',
        preferredDateTime: action.payload.preferredDateTime || new Date().toISOString(),
        status: 'Planning',
        readinessPercent: 0,
        checklist: [
          { id: 'C1', category: 'pre-op assessment', description: 'Basic Vitals & Clearance', status: 'Pending', owner: 'Nurse Station', deadline: action.payload.preferredDateTime || new Date().toISOString() },
          { id: 'C2', category: 'consent', description: 'Standard Surgical Consent', status: 'Pending', owner: 'Admin', deadline: action.payload.preferredDateTime || new Date().toISOString() },
        ],
        linkedProcurementIds: [],
        postOpTasks: []
      };
      state.cases.unshift(newCase);
    },
    updateChecklistItem: (state, action: PayloadAction<{ caseId: string, itemId: string, status: ChecklistItemStatus }>) => {
      const c = state.cases.find(c => c.id === action.payload.caseId);
      if (c) {
        const item = c.checklist.find(i => i.id === action.payload.itemId);
        if (item) {
          item.status = action.payload.status;
          evaluateCaseReadiness(c);
        }
      }
    },
    assignInternalSurgeon: (state, action: PayloadAction<{ caseId: string, surgeonId: string }>) => {
      const c = state.cases.find(c => c.id === action.payload.caseId);
      if (c) {
        c.assignedSurgeonId = action.payload.surgeonId;
        c.isExternalSurgeon = false;
        c.surgeonAccessExpiresAt = undefined;
      }
    },
    allocateOT: (state, action: PayloadAction<{ caseId: string, roomId: string, startDateTime: string, endDateTime: string, team: string[], resources: string[] }>) => {
      const c = state.cases.find(c => c.id === action.payload.caseId);
      if (c) {
        c.allocatedOT = {
          roomId: action.payload.roomId,
          startDateTime: action.payload.startDateTime,
          endDateTime: action.payload.endDateTime,
          team: action.payload.team,
          resources: action.payload.resources
        };
        if (c.status === 'Ready') {
          c.status = 'Scheduled';
        }
      }
    },
    createSurgeonRequest: (state, action: PayloadAction<{ caseId: string, specialty: string, subSpecialty: string, caseType: string, requiredTime: string, location: string, urgency: 'Routine' | 'Urgent' | 'Emergency', eligibleSurgeonIds: string[] }>) => {
      const c = state.cases.find(c => c.id === action.payload.caseId);
      if (c) {
        const req: SurgeonRequest = {
          id: `SR-${1000 + state.surgeonRequests.length}`,
          caseId: action.payload.caseId,
          specialty: action.payload.specialty,
          subSpecialty: action.payload.subSpecialty,
          caseType: action.payload.caseType,
          requiredTime: action.payload.requiredTime,
          location: action.payload.location,
          urgency: action.payload.urgency,
          permittedCaseDetails: `Procedure: ${c.procedureType} for Patient ${c.patientName}`,
          readinessInfo: `Readiness: ${c.readinessPercent}%. Status: ${c.status}`,
          sentAt: new Date().toISOString(),
          status: 'Sent',
          responses: action.payload.eligibleSurgeonIds.map(sId => {
            const s = state.surgeons.find(s => s.id === sId);
            return {
              surgeonId: sId,
              surgeonName: s ? s.name : 'Unknown',
              status: 'Sent' as SurgeonRequestStatus
            };
          })
        };
        state.surgeonRequests.unshift(req);
      }
    },
    updateSurgeonResponse: (state, action: PayloadAction<{ reqId: string, surgeonId: string, status: SurgeonRequestStatus, notes?: string }>) => {
      const req = state.surgeonRequests.find(r => r.id === action.payload.reqId);
      if (req) {
        const resp = req.responses.find(r => r.surgeonId === action.payload.surgeonId);
        if (resp) {
          resp.status = action.payload.status;
          resp.responseNotes = action.payload.notes;
          resp.respondedAt = new Date().toISOString();
        }
      }
    },
    assignExternalSurgeonFromRequest: (state, action: PayloadAction<{ reqId: string, surgeonId: string }>) => {
      const req = state.surgeonRequests.find(r => r.id === action.payload.reqId);
      if (req) {
        req.status = 'Assigned';
        
        // Dedupe logic: mark all other responses as Declined/Expired
        req.responses.forEach(resp => {
          if (resp.surgeonId === action.payload.surgeonId) {
            resp.status = 'Assigned';
          } else {
            resp.status = 'Expired';
          }
        });

        // Link surgeon to case with auto-expiry
        const c = state.cases.find(c => c.id === req.caseId);
        if (c) {
          c.assignedSurgeonId = action.payload.surgeonId;
          c.isExternalSurgeon = true;
          // Set expiry to 24 hours after preferred dateTime for the case
          c.surgeonAccessExpiresAt = new Date(new Date(c.preferredDateTime).getTime() + 1000 * 60 * 60 * 24).toISOString();
        }
      }
    },
    togglePostOpTask: (state, action: PayloadAction<{ caseId: string, taskId: string }>) => {
      const c = state.cases.find(c => c.id === action.payload.caseId);
      if (c) {
        const task = c.postOpTasks.find(t => t.id === action.payload.taskId);
        if (task) {
          task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
        }
      }
    }
  }
});

export const { 
  createCase, updateChecklistItem, assignInternalSurgeon, allocateOT, 
  createSurgeonRequest, updateSurgeonResponse, assignExternalSurgeonFromRequest,
  togglePostOpTask
} = surgicalSlice.actions;

export default surgicalSlice.reducer;
