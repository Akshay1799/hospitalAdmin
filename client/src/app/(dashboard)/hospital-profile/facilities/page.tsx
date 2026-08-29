"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HospitalProfileHeader } from "@/components/hospital-profile/hospital-profile-header";
import { HospitalProfileNav } from "@/components/hospital-profile/hospital-profile-nav";
import { FacilitiesInfrastructureTab } from "@/components/hospital-profile/facilities-infrastructure-tab";

export default function FacilitiesPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <HospitalProfileHeader />
      <HospitalProfileNav
        activeTab="facilities"
        onTabChange={(tab) => router.push(`/hospital-profile/${tab}`)}
      />
      <div className="pt-1">
        <FacilitiesInfrastructureTab />
      </div>
    </div>
  );
}
