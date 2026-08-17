"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import {
  clinicQueue as clinicQueueSeed,
  doctorShifts as doctorShiftsSeed,
  doctorTasks as doctorTasksSeed,
  doctorWorkplaces,
  hospitalWorklist as hospitalWorklistSeed,
} from "./doctor-workflow-data";
import {
  ClinicQueueItem,
  DoctorShift,
  DoctorTaskItem,
  HospitalWorkItem,
  ShiftStatus,
  workplaceToContext,
} from "./doctor-workflow-types";
import { useMode } from "./mode-context";

interface DoctorWorkflowContextValue {
  workplaces: typeof doctorWorkplaces;
  shifts: DoctorShift[];
  clinicQueue: ClinicQueueItem[];
  hospitalWorklist: HospitalWorkItem[];
  doctorTasks: DoctorTaskItem[];
  activeShift?: DoctorShift;
  selectedShift?: DoctorShift;
  selectShift: (id?: string) => void;
  getWorkplace: (id: string) => (typeof doctorWorkplaces)[number] | undefined;
  startShift: (id: string) => void;
  completeShift: (id: string) => void;
  addShift: (shift: DoctorShift) => void;
  updateShiftStatus: (id: string, status: ShiftStatus) => void;
  startQueueConsultation: (id: string) => void;
  completeQueueConsultation: (id: string) => void;
  acceptHospitalRequest: (id: string) => void;
  completeHospitalItem: (id: string) => void;
  handoverHospitalItem: (id: string, doctorName: string) => void;
  completeTask: (id: string) => void;
  startTask: (id: string) => void;
}

const DoctorWorkflowContext = createContext<DoctorWorkflowContextValue | null>(null);

export function DoctorWorkflowProvider({ children }: { children: ReactNode }) {
  const { setSelectedWorkplaceId, setWorkContext } = useMode();
  const [shifts, setShifts] = useState(doctorShiftsSeed);
  const [clinicQueue, setClinicQueue] = useState(clinicQueueSeed);
  const [hospitalWorklist, setHospitalWorklist] = useState(hospitalWorklistSeed);
  const [doctorTasks, setDoctorTasks] = useState(doctorTasksSeed);
  const [selectedShiftId, setSelectedShiftId] = useState<string | undefined>();

  const activeShift = shifts.find((shift) => shift.status === "active");
  const selectedShift = shifts.find((shift) => shift.id === selectedShiftId);

  function getWorkplace(id: string) {
    return doctorWorkplaces.find((workplace) => workplace.id === id);
  }

  function startShift(id: string) {
    setShifts((prev) =>
      prev.map((shift) => ({
        ...shift,
        status: shift.id === id ? "active" : shift.status === "active" ? "upcoming" : shift.status,
      }))
    );
    const shift = shifts.find((item) => item.id === id);
    const workplace = shift ? getWorkplace(shift.workplaceId) : undefined;
    if (workplace) {
      setWorkContext(workplaceToContext(workplace.type));
      setSelectedWorkplaceId(workplace.id);
    }
  }

  function completeShift(id: string) {
    setShifts((prev) => prev.map((shift) => (shift.id === id ? { ...shift, status: "completed" } : shift)));
  }

  function updateShiftStatus(id: string, status: ShiftStatus) {
    setShifts((prev) => prev.map((shift) => (shift.id === id ? { ...shift, status } : shift)));
  }

  function addShift(shift: DoctorShift) {
    setShifts((prev) => [shift, ...prev]);
  }

  function startQueueConsultation(id: string) {
    setClinicQueue((prev) =>
      prev.map((item) => ({
        ...item,
        status: item.id === id ? "in_consultation" : item.status,
      }))
    );
  }

  function completeQueueConsultation(id: string) {
    setClinicQueue((prev) => prev.map((item) => (item.id === id ? { ...item, status: "completed" } : item)));
  }

  function acceptHospitalRequest(id: string) {
    setHospitalWorklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "assigned", reasonAssigned: "Accepted consult request" } : item
      )
    );
  }

  function completeHospitalItem(id: string) {
    setHospitalWorklist((prev) => prev.map((item) => (item.id === id ? { ...item, status: "completed" } : item)));
  }

  function handoverHospitalItem(id: string, doctorName: string) {
    setHospitalWorklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, handedOverTo: doctorName, reasonAssigned: `Handed over to ${doctorName}` }
          : item
      )
    );
  }

  function completeTask(id: string) {
    setDoctorTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status: "completed" } : task)));
  }

  function startTask(id: string) {
    setDoctorTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status: "today" } : task)));
  }

  const value = {
    workplaces: doctorWorkplaces,
    shifts,
    clinicQueue,
    hospitalWorklist,
    doctorTasks,
    activeShift,
    selectedShift,
    selectShift: setSelectedShiftId,
    getWorkplace,
    startShift,
    completeShift,
    addShift,
    updateShiftStatus,
    startQueueConsultation,
    completeQueueConsultation,
    acceptHospitalRequest,
    completeHospitalItem,
    handoverHospitalItem,
    completeTask,
    startTask,
  };

  return <DoctorWorkflowContext.Provider value={value}>{children}</DoctorWorkflowContext.Provider>;
}

export function useDoctorWorkflow() {
  const ctx = useContext(DoctorWorkflowContext);
  if (!ctx) throw new Error("useDoctorWorkflow must be used within DoctorWorkflowProvider");
  return ctx;
}
