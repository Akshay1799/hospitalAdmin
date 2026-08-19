# Module 10 Rules — OT & Surgical Operations

Source: PRD Section 10 (+ 10.1 Surgeon Request Workflow) + Section 15 delegation
rule. Defines the exact boundary of Admin's access, actions, and management scope
for OT and surgery.

## Governing Principle (Section 15)
> "OT: Can schedule/coordinate; clinical surgical decisions remain with
> surgeon/clinician."

## ✅ Admin CAN
1. Create a surgical case linked to a patient
2. Create a surgical case linked to a care case
3. Manage/update an existing surgical case
4. Track pre-op assessment status in the readiness checklist
5. Track investigations status in the readiness checklist
6. Track consent status in the readiness checklist
7. Track blood availability status in the readiness checklist
8. Track implant availability status in the readiness checklist
9. Track equipment availability status in the readiness checklist
10. Track any other configured dependency in the readiness checklist
11. Allocate an OT (operation theatre) room for a case
12. Allocate the date/time for an OT slot
13. Allocate the team for an OT slot
14. Allocate the resources for an OT slot
15. Assign an internal, hospital-affiliated surgeon to a case
16. Create an external/on-call surgeon request when no internal surgeon is available
17. Select the specialty/sub-specialty required for a surgeon request
18. Select the case type for a surgeon request
19. Select the required time for a surgeon request
20. Select the location for a surgeon request
21. Select the urgency for a surgeon request
22. Attach permitted case details to a surgeon request
23. Attach readiness information to a surgeon request
24. Send a surgeon request to eligible surgeons/the network
25. Receive a surgeon's accept / decline / clarification-request response
26. Maintain the full surgeon request history
27. Select/assign a surgeon — **subject to authorization and credential checks**
28. Link an assigned surgeon to the case with **limited, case-specific access only**
29. View case readiness and surgeon availability in the surgical control view
30. Let a surgeon's case access **auto-expire** after completion, per policy
31. View case blockers: missing dependency, owner, and deadline
32. Create a procurement/vendor request for implants, equipment, or consumables
    tied to a surgical case
33. Connect/track post-op recovery tasks
34. Connect/track post-op nursing tasks
35. Connect/track post-op documents
36. Connect/track post-op follow-up

## ❌ Admin CANNOT
1. Assign a surgeon (internal or external) without completing authorization and
   credential checks first
2. Allow a surgeon's case-specific access to persist beyond the policy-defined
   expiry after case completion
3. Make the clinical surgical decision itself — that stays with the surgeon/clinician
4. Mark a case "ready" while readiness checklist dependencies are still missing —
   blockers must be shown, not bypassed

## Delegation & Audit Requirement (Section 15)
Any OT/surgery-scope scheduling or coordination action Admin performs must be
logged as:

> *"Performed by Hospital Admin • acting within OT workflow"*

## Source Reference Table (verbatim from PRD Section 10)
| Feature | Hospital Admin Capability |
|---|---|
| Surgical case | Create/manage surgery case linked to patient and care case |
| Readiness checklist | Track pre-op assessment, investigations, consent, blood/implant/equipment and other configured dependencies |
| OT scheduling | Allocate OT, date/time, team and resources |
| Internal surgeon | Assign hospital-affiliated surgeon |
| External surgeon request | Request an external/on-call surgeon when an internal surgeon is unavailable |
| Surgeon response | Receive accept/decline/availability response and maintain request history |
| Case blockers | Show missing dependency, owner and deadline |
| Vendor dependency | Create procurement/vendor requests for implants, equipment, consumables or other requirements |
| Post-op | Connect recovery, nursing tasks, documents and follow-up |

## Source Reference — 10.1 Surgeon Request Workflow (verbatim steps 20–28)
1. Hospital Admin/authorized clinical coordinator creates surgeon request.
2. Select specialty/sub-specialty, case type, required time, location and urgency.
3. Attach permitted case details and readiness information.
4. Send request to eligible surgeons/network.
5. Surgeon accepts, declines or requests clarification.
6. Hospital selects/assigns surgeon subject to authorization and credential checks.
7. Qlyno links surgeon to the surgical case with limited case-specific access.
8. Case readiness and surgeon availability are visible in the surgical control view.
9. After completion, surgeon affiliation/case access expires according to policy.
