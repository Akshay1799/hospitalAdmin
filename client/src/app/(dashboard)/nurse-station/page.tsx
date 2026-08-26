"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NurseStationRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/nurse-stations");
  }, [router]);

  return (
    <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
      Redirecting to Nurse Stations console...
    </div>
  );
}
