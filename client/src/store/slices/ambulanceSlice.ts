import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AmbulanceStatus = 'Available' | 'Dispatched' | 'En Route' | 'At Scene' | 'Transporting' | 'At Hospital' | 'Maintenance/Offline';

export interface Ambulance {
  id: string;
  vehicleNo: string;
  type: 'ALS' | 'BLS';
  equipment: string[];
  baseLocation: string;
  status: AmbulanceStatus;
  driverName?: string;
  crew?: string[];
  lastDispatchAt?: string;
  currentCaseId?: string;
}

export interface DispatchRecord {
  id: string;
  ambulanceId: string;
  caseId?: string;
  destinationHospital: string;
  status: 'In Progress' | 'Completed' | 'Cancelled' | 'Re-routed';
  timestamp: string;
}

interface AmbulanceState {
  fleet: Ambulance[];
  dispatchHistory: DispatchRecord[];
}

const initialState: AmbulanceState = {
  fleet: [
    {
      id: 'AMB-101',
      vehicleNo: 'MH-12-AB-1234',
      type: 'ALS',
      equipment: ['Defibrillator', 'Ventilator', 'O2'],
      baseLocation: 'Qlyno Main Campus',
      status: 'Available',
      driverName: 'Ramesh Patel',
      crew: ['Sunita (Paramedic)'],
    },
    {
      id: 'AMB-102',
      vehicleNo: 'MH-12-CD-5678',
      type: 'BLS',
      equipment: ['O2', 'First Aid'],
      baseLocation: 'Qlyno City Center',
      status: 'Maintenance/Offline',
      driverName: 'Suresh Kumar',
    },
    {
      id: 'AMB-103',
      vehicleNo: 'MH-12-EF-9012',
      type: 'ALS',
      equipment: ['Defibrillator', 'Ventilator', 'O2'],
      baseLocation: 'Qlyno Main Campus',
      status: 'Available',
    }
  ],
  dispatchHistory: [
    {
      id: 'DSP-001',
      ambulanceId: 'AMB-103',
      caseId: 'SOS-000',
      destinationHospital: 'Qlyno Main Campus',
      status: 'Completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    }
  ],
};

export const ambulanceSlice = createSlice({
  name: 'ambulance',
  initialState,
  reducers: {
    updateAmbulanceStatus: (state, action: PayloadAction<{ id: string, status: AmbulanceStatus }>) => {
      const amb = state.fleet.find(a => a.id === action.payload.id);
      if (amb) {
        amb.status = action.payload.status;
      }
    },
    dispatchAmbulance: (state, action: PayloadAction<{ ambulanceId: string, caseId?: string, destination: string }>) => {
      const amb = state.fleet.find(a => a.id === action.payload.ambulanceId);
      if (amb) {
        amb.status = 'Dispatched';
        amb.currentCaseId = action.payload.caseId;
        amb.lastDispatchAt = new Date().toISOString();
        
        state.dispatchHistory.push({
          id: `DSP-${Date.now()}`,
          ambulanceId: amb.id,
          caseId: action.payload.caseId,
          destinationHospital: action.payload.destination,
          status: 'In Progress',
          timestamp: new Date().toISOString(),
        });
      }
    },
    freeAmbulance: (state, action: PayloadAction<string>) => {
      const amb = state.fleet.find(a => a.id === action.payload);
      if (amb) {
        amb.status = 'Available';
        amb.currentCaseId = undefined;
        // mark active dispatch as completed
        const activeDispatch = state.dispatchHistory.find(d => d.ambulanceId === action.payload && (d.status === 'In Progress' || d.status === 'Re-routed'));
        if (activeDispatch) {
          activeDispatch.status = 'Completed';
        }
      }
    },
    updateDispatchDestination: (state, action: PayloadAction<{ ambulanceId: string, newDestination: string }>) => {
      const activeDispatch = state.dispatchHistory.find(d => d.ambulanceId === action.payload.ambulanceId && (d.status === 'In Progress' || d.status === 'Re-routed'));
      if (activeDispatch) {
        activeDispatch.destinationHospital = action.payload.newDestination;
        activeDispatch.status = 'Re-routed';
      }
    }
  },
});

export const { updateAmbulanceStatus, dispatchAmbulance, freeAmbulance, updateDispatchDestination } = ambulanceSlice.actions;
export default ambulanceSlice.reducer;
