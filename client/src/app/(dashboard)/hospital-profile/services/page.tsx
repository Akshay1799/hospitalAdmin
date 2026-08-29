"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HospitalProfileHeader } from "@/components/hospital-profile/hospital-profile-header";
import { HospitalProfileNav } from "@/components/hospital-profile/hospital-profile-nav";
import { ServicesPortfolioTab } from "@/components/hospital-profile/services-portfolio-tab";

export default function ServicesPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <HospitalProfileHeader />
      <HospitalProfileNav
        activeTab="services"
        onTabChange={(tab) => router.push(`/hospital-profile/${tab}`)}
      />
      <div className="pt-1">
        <ServicesPortfolioTab />
      </div>
    </div>
  );
}
