import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function FollowUpsPage() {
  return (
    <ModulePlaceholder
      title="Patient Follow-ups"
      section="Patient Care"
      description="Post-discharge care coordination, automated reminder calls/SMS, and specialist recall scheduling."
      features={[
        "Automated WhatsApp / SMS Reminders",
        "Post-Op Recovery Milestone Tracking",
        "Chronic Disease Recalls",
        "Patient Satisfaction Pulse Surveys",
      ]}
    />
  );
}
