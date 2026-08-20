import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function WardsBedsPage() {
  return (
    <ModulePlaceholder
      title="Wards & Beds Management"
      section="Clinical Operations"
      description="Real-time occupancy maps, ICU/HDU bed reservations, sanitization status, and ward transfer workflows."
      features={[
        "Interactive Floor Bed Map & Visual Grid",
        "ICU, CCU, HDU & General Ward Tiers",
        "Bed Cleaning & Disinfection Turnaround",
        "Inter-Ward Transfer Requests",
      ]}
    />
  );
}
