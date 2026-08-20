import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function RadiologyPage() {
  return (
    <ModulePlaceholder
      title="Radiology & Imaging (PACS/RIS)"
      section="Clinical Operations"
      description="MRI, CT Scan, X-Ray, and Ultrasound order management with integrated DICOM imaging viewer."
      features={[
        "DICOM Web Viewer Integration",
        "Modality Worklist (MWL) Sync",
        "Radiologist Workstation & Reporting",
        "Critical Findings Instant Alert System",
      ]}
    />
  );
}
