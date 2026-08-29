"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HospitalProfileHeader } from "@/components/hospital-profile/hospital-profile-header";
import { HospitalProfileNav } from "@/components/hospital-profile/hospital-profile-nav";
import { BasicInformationTab } from "@/components/hospital-profile/basic-information-tab";

export default function BasicInformationPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <HospitalProfileHeader />
      <HospitalProfileNav
        activeTab="basic-information"
        onTabChange={(tab) => router.push(`/hospital-profile/${tab}`)}
      />
      <div className="pt-1">
        <BasicInformationTab />
      </div>
    </div>
  );
}
