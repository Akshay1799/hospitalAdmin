import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function CommunicationPage() {
  return (
    <ModulePlaceholder
      title="Staff & Patient Communication Hub"
      section="Care Coordination"
      description="Secure internal clinical messaging, on-call physician broadcasts, patient SMS/WhatsApp alerts, and teleconsultation."
      features={[
        "HIPAA / NDHM Compliant Clinical Chat",
        "Hospital-Wide Code Blue / Mass Broadcasts",
        "Patient SMS & WhatsApp Gateway",
        "Integrated WebRTC Telehealth Video Room",
      ]}
    />
  );
}
