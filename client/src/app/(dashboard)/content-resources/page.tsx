import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function ContentResourcesPage() {
  return (
    <ModulePlaceholder
      title="Patient Education & Content Resources"
      section="Hospital Growth"
      description="Post-care health blogs, procedural preparation guides, patient leaflets, and clinical education brochures."
      features={[
        "Health & Wellness Blog Article Editor",
        "Pre-Op & Post-Op Preparation Guides",
        "Multilingual Patient Education Leaflets",
        "Clinical Research & Case Study Repository",
      ]}
    />
  );
}
