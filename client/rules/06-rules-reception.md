# Module 6 Rules — Reception Management

Source: PRD Section 6 (+ Section 15 delegation rule). Defines the exact boundary
of Admin's access, actions, and management scope for reception.

## Governing Principle (Section 6)
> "Receptionists remain operational staff. They do not diagnose, interpret
> reports, alter clinical notes, change clinical orders or make clinical
> emergency decisions. They route/escalate clinical issues to the appropriate
> team."

This boundary applies equally to Admin whenever Admin is acting within the
Reception workflow.

## ✅ Admin CAN
1. Create multiple receptionist accounts/profiles
2. Assign a receptionist to a specific desk
3. Assign a receptionist to a specific branch
4. Assign a receptionist to a specific department
5. Assign a receptionist to a specific workflow
6. Monitor live patient registration activity
7. Monitor live appointment activity
8. Monitor check-in activity
9. Monitor token/queue status
10. Monitor patient routing status
11. Route/configure the OPD workflow
12. Route/configure the walk-in workflow
13. Route/configure the emergency workflow (routing only — no clinical decision)
14. Route/configure the admission workflow
15. Route/configure the diagnostics workflow
16. Route/configure the discharge workflow
17. Control receptionist access scoped by **organization**
18. Control receptionist access scoped by **location**
19. Control receptionist access scoped by **department**
20. Control receptionist access scoped by **action**
21. Control receptionist access scoped by **data**
22. Remove or suspend a receptionist
23. Assign a replacement receptionist **without changing patient ownership/history**
24. Monitor receptionist workload
25. Monitor average patient wait time
26. Monitor registration volume
27. Monitor front-desk exceptions/errors
28. Send hospital-wide announcements
29. Manage configured transactional communication/WhatsApp messaging
30. Directly perform registration, appointment, check-in, queue, and routing
    actions (acting in the receptionist's operational capacity — Section 15)

## ❌ Admin CANNOT
1. Diagnose a patient while acting within the Reception workflow
2. Interpret a medical/diagnostic report while acting within the Reception workflow
3. Alter a clinical note while acting within the Reception workflow
4. Change a clinical order while acting within the Reception workflow
5. Make a clinical emergency decision while acting within the Reception workflow
   — must route/escalate to the appropriate clinical team instead
6. Change patient ownership or history as a side effect of replacing a receptionist

## Delegation & Audit Requirement (Section 15)
> "Reception: Can perform registration, appointment, check-in, queue and routing
> actions."

Any reception-scope action Admin performs must be logged as:

> *"Performed by Hospital Admin • acting within Reception workflow"*

## Source Reference Table (verbatim from PRD Section 6)
| Capability | Hospital Admin Requirement |
|---|---|
| Multiple receptionists | Create multiple receptionists and assign them to desks, branches, departments or workflows |
| Front desk | Monitor registration, appointments, check-in, token/queue and patient routing |
| Hospital routing | Route OPD, walk-in, emergency, admission, diagnostics and discharge workflows |
| Permissions | Control access by organization + location + department + action + data scope |
| Replacement | Remove/suspend a receptionist and assign a replacement without changing patient ownership/history |
| Performance | Monitor workload, wait time, registration volume and exceptions |
| Communication | Hospital announcements and configured transactional communication/WhatsApp |
