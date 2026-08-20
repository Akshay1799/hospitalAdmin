import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function AssetsPage() {
  return (
    <ModulePlaceholder
      title="Biomedical & Facility Asset Management"
      section="Supply & Assets"
      description="Biomedical equipment lifecycle, AMC/CMC maintenance contracts, calibration logs, and breakdown ticket tracking."
      features={[
        "Biomedical Equipment Register & QR Tagging",
        "Preventive Maintenance (PPM) Schedules",
        "AMC / CMC Vendor Warranty Tracking",
        "Equipment Breakdown & Repair Work Orders",
      ]}
    />
  );
}
