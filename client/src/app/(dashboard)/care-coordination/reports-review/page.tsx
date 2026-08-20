import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function ReportsReviewPage() {
  return (
    <ModulePlaceholder
      title="Reports Awaiting Review"
      section="Care Coordination"
      description="Centralized doctor review inbox for critical diagnostic results, abnormal lab alerts, and pending sign-offs."
      features={[
        "Abnormal / Critical Value Flagging",
        "Physician One-Click Digital Sign-off",
        "Escalation Timer for Unreviewed Criticals",
        "Addendum & Clinical Clarification Flow",
      ]}
    />
  );
}
