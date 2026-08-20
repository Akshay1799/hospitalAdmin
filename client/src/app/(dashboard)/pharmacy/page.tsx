import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function PharmacyPage() {
  return (
    <ModulePlaceholder
      title="Hospital Pharmacy & Dispensing"
      section="Clinical Operations"
      description="Inpatient and outpatient prescription fulfillment, medication stock batches, expiry tracking, and drug interaction alerts."
      features={[
        "e-Prescription Barcode Dispensation",
        "Batch Expiry & Near-Expiry Alerts",
        "High-Risk / Schedule H1 Drug Logbook",
        "Automated Reorder Thresholds",
      ]}
    />
  );
}
