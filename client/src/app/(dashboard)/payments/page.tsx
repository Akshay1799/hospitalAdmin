import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function PaymentsPage() {
  return (
    <ModulePlaceholder
      title="Payments & Daily Collections"
      section="Finance"
      description="Daily cash counter balancing, POS/card settlement reconciliation, UPI payment gateway sync, and payment receipts."
      features={[
        "Cash Drawer Day-End Reconciliation",
        "POS Terminal & Bank Batch Settlements",
        "Digital UPI & QR Transaction Ledger",
        "Automated Payment Receipts & Vouchers",
      ]}
    />
  );
}
