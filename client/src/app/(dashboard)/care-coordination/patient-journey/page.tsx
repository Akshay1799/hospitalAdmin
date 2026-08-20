import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function PatientJourneyPage() {
  return (
    <ModulePlaceholder
      title="Patient Journey & Care Pathways"
      section="Care Coordination"
      description="End-to-end clinical timeline visualization, multidisciplinary care team handoffs, and milestone checkpoints."
      features={[
        "Visual 360° Episode of Care Timeline",
        "Clinical Handoff & SBAR Documentation",
        "Multidisciplinary Team Task Boards",
        "Care Protocol Compliance Tracking",
      ]}
    />
  );
}
