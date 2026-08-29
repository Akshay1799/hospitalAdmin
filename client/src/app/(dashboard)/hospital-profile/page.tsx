"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HospitalProfileHeader } from "@/components/hospital-profile/hospital-profile-header";
import { HospitalProfileNav } from "@/components/hospital-profile/hospital-profile-nav";
import { BasicInformationTab } from "@/components/hospital-profile/basic-information-tab";
import { DepartmentsCurationTab } from "@/components/hospital-profile/departments-curation-tab";
import { ServicesPortfolioTab } from "@/components/hospital-profile/services-portfolio-tab";
import { DoctorsCurationTab } from "@/components/hospital-profile/doctors-curation-tab";
import { FacilitiesInfrastructureTab } from "@/components/hospital-profile/facilities-infrastructure-tab";
import { PhotosGalleryTab } from "@/components/hospital-profile/photos-gallery-tab";
import { ContactInformationTab } from "@/components/hospital-profile/contact-information-tab";
import { QlynoProfileTab } from "@/components/hospital-profile/qlyno-profile-tab";

function HospitalProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "basic-information";

  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/hospital-profile?tab=${tab}`);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "basic-information":
        return <BasicInformationTab />;
      case "departments":
        return <DepartmentsCurationTab />;
      case "services":
        return <ServicesPortfolioTab />;
      case "doctors":
        return <DoctorsCurationTab />;
      case "facilities":
        return <FacilitiesInfrastructureTab />;
      case "photos":
        return <PhotosGalleryTab />;
      case "contact":
        return <ContactInformationTab />;
      case "qlyno-profile":
        return <QlynoProfileTab />;
      default:
        return <BasicInformationTab />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <HospitalProfileHeader />
      <HospitalProfileNav activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="pt-1">{renderActiveTab()}</div>
    </div>
  );
}

export default function HospitalProfilePage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-muted-foreground">Loading Hospital Profile Workstation...</div>}>
      <HospitalProfileContent />
    </Suspense>
  );
}
