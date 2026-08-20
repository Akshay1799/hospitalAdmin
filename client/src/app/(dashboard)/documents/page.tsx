import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function DocumentsPage() {
  return (
    <ModulePlaceholder
      title="Hospital Document Management System (DMS)"
      section="Administration"
      description="Standard Operating Procedures (SOPs), clinical policy guidelines, doctor licensing certificates, and regulatory compliance documents."
      features={[
        "NABH / ISO Standard Operating Procedures (SOP)",
        "Staff Medical Licensing & Credential Vault",
        "Clinical Consent & Legal Form Templates",
        "Document Versioning & Expiry Tracker",
      ]}
    />
  );
}
