import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function IPDPage() {
  return (
    <ModulePlaceholder
      title="Inpatient Department (IPD)"
      section="Patient Care"
      description="Inpatient admissions, bed allocations, daily clinical rounding, nursing notes, and discharge summaries."
      features={[
        "Bed & Ward Allocation Matrix",
        "Daily Clinical Progress Notes",
        "Medication Administration Records",
        "Discharge Planning & Summaries",
      ]}
    />
  );
}
