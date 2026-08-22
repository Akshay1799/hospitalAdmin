"use client";

import * as React from "react";
import {
  Patient,
  Appointment,
  QueueEntry,
  Visitor,
  Admission,
  initialPatients,
  initialAppointments,
  initialQueue,
  initialVisitors,
  initialAdmissions,
  generateUHID,
  generateToken,
} from "./mock-data";

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  channel: "SMS" | "Email" | "System" | "Call";
}

interface ReceptionistData {
  patients: Patient[];
  appointments: Appointment[];
  queue: QueueEntry[];
  visitors: Visitor[];
  admissions: Admission[];
  notifications: NotificationItem[];
  addPatient: (p: Omit<Patient, "uhid">) => Patient;
  addAppointment: (a: Omit<Appointment, "id">) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  checkIn: (q: Omit<QueueEntry, "token">) => QueueEntry;
  advanceQueueStatus: (token: string, status: QueueEntry["status"]) => void;
  addVisitor: (v: Omit<Visitor, "id" | "passIssued" | "status">) => Visitor;
  checkOutVisitor: (id: string) => void;
  addAdmission: (a: Omit<Admission, "id">) => Admission;
  pushNotification: (n: Omit<NotificationItem, "id" | "time">) => void;
}

const ReceptionistDataContext = React.createContext<ReceptionistData | null>(null);

export function ReceptionistDataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = React.useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);
  const [queue, setQueue] = React.useState<QueueEntry[]>(initialQueue);
  const [visitors, setVisitors] = React.useState<Visitor[]>(initialVisitors);
  const [admissions, setAdmissions] = React.useState<Admission[]>(initialAdmissions);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    { id: "N-1", title: "Appointment confirmed", detail: "Sent to Ramesh Chandra Verma for 11:30 AM with Dr. Sanjay Kapoor", time: "9:02 AM", channel: "SMS" },
    { id: "N-2", title: "Bed allotted", detail: "ICU-04 assigned for Ramesh Chandra Verma", time: "Yesterday", channel: "System" },
  ]);

  const nowTime = () =>
    new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const addPatient: ReceptionistData["addPatient"] = (p) => {
    const patient: Patient = { ...p, uhid: generateUHID(patients) };
    setPatients((prev) => [patient, ...prev]);
    pushNotification({
      title: "Patient registered",
      detail: `${patient.name} registered with ${patient.uhid}`,
      channel: "System",
    });
    return patient;
  };

  const addAppointment: ReceptionistData["addAppointment"] = (a) => {
    const appt: Appointment = { ...a, id: `APT-${1043 + appointments.length}` };
    setAppointments((prev) => [appt, ...prev]);
    pushNotification({
      title: "Appointment booked",
      detail: `${appt.patient} scheduled with ${appt.doctor} on ${appt.date}, ${appt.time}`,
      channel: "SMS",
    });
    return appt;
  };

  const updateAppointmentStatus: ReceptionistData["updateAppointmentStatus"] = (id, status) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const checkIn: ReceptionistData["checkIn"] = (q) => {
    const entry: QueueEntry = { ...q, token: generateToken(queue) };
    setQueue((prev) => [entry, ...prev]);
    pushNotification({
      title: "Patient checked in",
      detail: `${entry.patient} issued token ${entry.token} for ${entry.doctor}`,
      channel: "System",
    });
    return entry;
  };

  const advanceQueueStatus: ReceptionistData["advanceQueueStatus"] = (token, status) => {
    setQueue((prev) => prev.map((q) => (q.token === token ? { ...q, status } : q)));
  };

  const addVisitor: ReceptionistData["addVisitor"] = (v) => {
    const visitor: Visitor = {
      ...v,
      id: `VIS-${3302 + visitors.length}`,
      passIssued: nowTime(),
      status: "Checked In",
    };
    setVisitors((prev) => [visitor, ...prev]);
    return visitor;
  };

  const checkOutVisitor: ReceptionistData["checkOutVisitor"] = (id) => {
    setVisitors((prev) => prev.map((v) => (v.id === id ? { ...v, status: "Checked Out" } : v)));
  };

  const addAdmission: ReceptionistData["addAdmission"] = (a) => {
    const admission: Admission = { ...a, id: `IPD-${2232 + admissions.length}` };
    setAdmissions((prev) => [admission, ...prev]);
    pushNotification({
      title: "Patient admitted",
      detail: `${admission.patient} admitted to ${admission.ward} (${admission.bed})`,
      channel: "System",
    });
    return admission;
  };

  const pushNotification: ReceptionistData["pushNotification"] = (n) => {
    setNotifications((prev) => [
      { ...n, id: `N-${prev.length + 1}`, time: "Just now" },
      ...prev,
    ]);
  };

  const value: ReceptionistData = {
    patients,
    appointments,
    queue,
    visitors,
    admissions,
    notifications,
    addPatient,
    addAppointment,
    updateAppointmentStatus,
    checkIn,
    advanceQueueStatus,
    addVisitor,
    checkOutVisitor,
    addAdmission,
    pushNotification,
  };

  return (
    <ReceptionistDataContext.Provider value={value}>
      {children}
    </ReceptionistDataContext.Provider>
  );
}

export function useReceptionistData() {
  const ctx = React.useContext(ReceptionistDataContext);
  if (!ctx) {
    throw new Error("useReceptionistData must be used within ReceptionistDataProvider");
  }
  return ctx;
}
