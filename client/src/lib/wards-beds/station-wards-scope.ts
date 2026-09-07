import { Ward, Bed } from "@/lib/types";
import { NurseStationEntity, AppUserRole } from "@/lib/types/nursing-module";

/**
 * Explicit station-to-ward ID mapping based on hospital structure & PRD Section 2:
 * - st-1: ICU & Critical Care Station -> ward_icu_01 (Intensive Care Unit)
 * - st-2: General Medical Ward Station -> ward_gen_01 (General Medical Ward A)
 * - st-3: Emergency & Trauma Resuscitation Station -> Emergency care units
 */
export const STATION_WARD_MAP: Record<string, string[]> = {
  "st-1": ["ward_icu_01"],
  "st-2": ["ward_gen_01"],
  "st-3": [],
};

/**
 * Determines whether a given ward belongs to the specified Nurse Station's scope.
 */
export function isWardInStationScope(
  ward: Ward,
  station: NurseStationEntity | undefined
): boolean {
  if (!station) return true;

  // 1. Check explicit station mapping first
  const mappedWards = STATION_WARD_MAP[station.station_id];
  if (mappedWards && mappedWards.length > 0) {
    return mappedWards.includes(ward.id);
  }

  // 2. Dynamic matching against station name and department
  const stationDept = (station.department_name || "").toLowerCase();
  const stationName = (station.name || "").toLowerCase();
  const wardDept = (ward.department || "").toLowerCase();
  const wardName = (ward.name || "").toLowerCase();

  // ICU / Critical Care station matching
  if (
    station.station_id === "st-1" ||
    stationName.includes("critical care") ||
    stationName.includes("icu") ||
    stationDept.includes("intensive care") ||
    stationDept.includes("critical care")
  ) {
    return (
      ward.id === "ward_icu_01" ||
      ward.type === "ICU" ||
      wardDept.includes("critical") ||
      wardName.includes("icu")
    );
  }

  // General Medical Ward station matching
  if (
    station.station_id === "st-2" ||
    stationName.includes("general medical") ||
    stationDept.includes("general medicine")
  ) {
    return (
      ward.id === "ward_gen_01" ||
      wardDept.includes("general medicine") ||
      wardName.includes("general medical")
    );
  }

  // Fallback substring department match
  if (stationDept && wardDept && (stationDept.includes(wardDept) || wardDept.includes(stationDept))) {
    return true;
  }

  return false;
}

/**
 * Filters wards and beds based on the current user's role and active nurse station.
 * For Hospital Admin: returns all wards and beds hospital-wide.
 * For Nurse Station Lead & Senior Nurse: strictly scopes to the assigned station's department/wards.
 */
export function filterWardsAndBedsByRole(
  wards: Ward[],
  beds: Bed[],
  currentRole?: AppUserRole,
  activeStation?: NurseStationEntity
): {
  isStationScoped: boolean;
  scopedWards: Ward[];
  scopedBeds: Bed[];
  activeStation: NurseStationEntity | undefined;
} {
  const isStationScoped = currentRole === "nurse_lead" || currentRole === "senior_nurse";

  if (!isStationScoped) {
    return {
      isStationScoped: false,
      scopedWards: wards,
      scopedBeds: beds,
      activeStation,
    };
  }

  const scopedWards = wards.filter((w) => isWardInStationScope(w, activeStation));
  const scopedWardIds = new Set(scopedWards.map((w) => w.id));
  const scopedBeds = beds.filter((b) => scopedWardIds.has(b.wardId));

  return {
    isStationScoped: true,
    scopedWards,
    scopedBeds,
    activeStation,
  };
}
