# Module 9 Rules — Ambulance Management

Source: PRD Section 9. Defines the exact boundary of Admin's access, actions, and
management scope for ambulance operations.

## ✅ Admin CAN
1. Register a new ambulance in the registry (vehicle ID, type, equipment
   capability, base location, status)
2. Edit/update an existing ambulance's registry details
3. Assign a driver to an ambulance
4. Assign a crew/team to an ambulance
5. Record and manage driver/crew contact details, per hospital policy
6. Set/update an ambulance's availability status: Available
7. Set/update an ambulance's availability status: Dispatched
8. Set/update an ambulance's availability status: En Route
9. Set/update an ambulance's availability status: At Scene
10. Set/update an ambulance's availability status: Transporting
11. Set/update an ambulance's availability status: At Hospital
12. Set/update an ambulance's availability status: Maintenance/Offline
13. Create a dispatch linked to an emergency case
14. Link a dispatch to a patient — **where permitted**
15. Track an ambulance's current/last-known location, where a tracking
    integration supports it
16. View estimated arrival time (ETA), where a reliable integration provides it
17. Set/confirm the ambulance's hospital destination (primary hospital, or a
    configured receiving hospital)
18. Escalate/re-route a dispatch if the assigned ambulance cannot accept it
19. Escalate/re-route a dispatch if the receiving facility cannot accept it
20. View/maintain the full dispatch history
21. View/maintain the full transport record history

## ❌ Admin CANNOT
1. Link a dispatch to a patient without the required permission
2. Display an ETA without a reliable location/dispatch integration backing it
   (no fabricated/estimated-without-data ETAs)
3. Dispatch an ambulance that isn't an eligible, configured, available resource
4. Assume an ambulance is available without checking its current status first

## Source Reference Table (verbatim from PRD Section 9)
| Feature | Requirement |
|---|---|
| Ambulance registry | Vehicle ID, type, equipment capability, base location and status |
| Driver/team | Assign driver/crew and contact details according to hospital policy |
| Availability | Available, dispatched, en route, at scene, transporting, at hospital, maintenance/offline |
| Dispatch | Create dispatch linked to emergency case and patient where permitted |
| Location | Track current/last-known location where the integration supports it |
| ETA | Display estimated arrival when a reliable location/dispatch integration provides it |
| Hospital destination | Primary hospital or configured receiving hospital |
| Fallback | Escalate/re-route if ambulance or receiving facility cannot accept |
| History | Maintain dispatch and transport records |
