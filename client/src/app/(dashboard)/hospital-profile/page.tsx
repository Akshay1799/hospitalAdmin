import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function HospitalProfilePage() {
  return (
    <ModulePlaceholder
      title="Hospital Public Profile & Branding"
      section="Hospital Growth"
      description="Facility accreditations (NABH/JCI), specialty descriptions, doctor roster listings, photos, and public portal SEO metadata."
      features={[
        "NABH / JCI Accreditation Display Badges",
        "Public Doctor Directory & Bio Management",
        "Clinical Specialties & Service Portfolios",
        "Hospital Facility Photo Gallery & Virtual Tour",
      ]}
    />
  );
}
