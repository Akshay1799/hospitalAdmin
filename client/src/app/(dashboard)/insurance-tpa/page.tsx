import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function InsuranceTPAPage() {
  return (
    <ModulePlaceholder
      title="Insurance & TPA Claims Desk"
      section="Finance"
      description="Cashless pre-authorization requests, TPA claims submission, query management, deductions, and settlement reconciliations."
      features={[
        "Pre-Authorization Portal & Approval Tracking",
        "TPA Document Packet Auto-Bundler",
        "Claim Query & Dispute Resolution",
        "Corporate & Government Scheme (PM-JAY/CGHS) Panels",
      ]}
    />
  );
}
