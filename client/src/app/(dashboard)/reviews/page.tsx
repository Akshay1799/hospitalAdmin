import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function ReviewsPage() {
  return (
    <ModulePlaceholder
      title="Patient Feedback & Reviews"
      section="Hospital Growth"
      description="Patient Net Promoter Score (NPS), Google Reviews integration, grievance redressal, and departmental rating analytics."
      features={[
        "Google Business Reviews Live Sync",
        "Inpatient Discharge CSAT & NPS Surveys",
        "Patient Grievance Resolution Workflow",
        "Doctor & Department Rating Scorecards",
      ]}
    />
  );
}
