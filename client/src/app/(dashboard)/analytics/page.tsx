import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function AnalyticsPage() {
  return (
    <ModulePlaceholder
      title="Hospital Growth & Executive Analytics"
      section="Hospital Growth"
      description="Executive KPIs, bed occupancy rates, average length of stay (ALOS), patient acquisition cohorts, and strategic expansion metrics."
      features={[
        "Executive KPI Cockpit & Trends",
        "Bed Occupancy & Average Length of Stay (ALOS)",
        "Patient Acquisition & Specialty Demographics",
        "Clinical Quality & Infection Rate Benchmarks",
      ]}
    />
  );
}
