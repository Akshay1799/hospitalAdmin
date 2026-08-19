# 09 — Ambulance Management

## Purpose
Manages the hospital's transport resources and links them into the Emergency
module's dispatch workflow (module 08). Every ambulance is a resource with a
lifecycle of statuses that the UI must track in near real time.

## Pages / Screens to Build
1. **Ambulance Registry — List View**
   - Table: Vehicle ID, Type, Equipment capability, Base location, Status
   - Filters: Type, Status, Base location
2. **Create / Edit Ambulance**
   - Fields: Vehicle ID, Type, Equipment capability list, Base location
3. **Driver/Crew Assignment**
   - Assign driver + crew members + contact details to a vehicle
4. **Availability Status Board**
   - Kanban-style or grid: Available / Dispatched / En Route / At Scene /
     Transporting / At Hospital / Maintenance-Offline
   - Drag-and-drop or dropdown to update status manually if no auto-tracking integration
5. **Dispatch Creation Form**
   - Fields: Linked emergency case, Patient (if permitted), Ambulance, Destination hospital
   - Usually triggered *from* the Emergency Case Detail view (module 08), but also
     needs a standalone entry point for manual dispatch
6. **Live Tracking View** (only if location integration exists)
   - Map with ambulance markers + ETA if a reliable integration provides it
   - Design this as an optional/enhanced panel — don't block the core flow on it
7. **Dispatch History / Log**
   - Table: Dispatch ID, Ambulance, Case, Origin, Destination, Status, Timestamps

## Core Admin Actions Checklist
- [ ] Register a new ambulance (vehicle info, equipment, base location)
- [ ] Assign/update driver and crew per hospital policy
- [ ] View live availability of all ambulances
- [ ] Create a dispatch linked to an emergency case and patient
- [ ] Track dispatch through its full status lifecycle
- [ ] View live location/ETA where integration supports it
- [ ] Escalate/re-route if ambulance or receiving facility can't accept
- [ ] View dispatch and transport history

## States / Statuses to Handle in UI
- Ambulance: `Available`, `Dispatched`, `En Route`, `At Scene`, `Transporting`,
  `At Hospital`, `Maintenance/Offline`
- Dispatch: `Created`, `Assigned`, `In Progress`, `Completed`, `Re-routed`, `Cancelled`

## Notifications Relevant to This Module
- Ambulance dispatch → Emergency team + dispatch/driver + patient/family (if configured)

## Edge Cases to Design For
- Dispatching an ambulance that's already "Dispatched" → must be blocked in UI
- Receiving hospital can't accept → fallback/re-route action needs to update both
  the ambulance status *and* the linked emergency case timeline
- No location integration available → gracefully fall back to manual status updates
  instead of showing a broken/empty map
- Ambulance marked "Maintenance/Offline" should disappear from dispatch-eligible
  lists but stay visible in the registry
