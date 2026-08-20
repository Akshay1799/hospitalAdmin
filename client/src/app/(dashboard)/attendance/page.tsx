import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function AttendancePage() {
  return (
    <ModulePlaceholder
      title="Staff Attendance & Clock-In"
      section="People & Staff"
      description="Biometric punch logs, facial recognition time-tracking, shift check-ins, and leave/overtime approval queues."
      features={[
        "Biometric & RFID Hardware Sync",
        "Geofenced Mobile Clock-in / Clock-out",
        "Shift Lateness & Overtime Calculations",
        "Leave & Compensatory Off Approvals",
      ]}
    />
  );
}
