import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function FinancialReportsPage() {
  return (
    <ModulePlaceholder
      title="Financial Analytics & Revenue Reports"
      section="Finance"
      description="Departmental revenue breakdowns, doctor payout calculations, outstanding AR aging, and GST summary ledgers."
      features={[
        "Departmental Revenue & Margin Analysis",
        "Physician Fee Share & Payout Calculations",
        "Accounts Receivable (AR) 30/60/90-Day Aging",
        "GST & Statutory Tax Return Export",
      ]}
    />
  );
}
