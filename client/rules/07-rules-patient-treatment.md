# Module 7 Rules — Patient & Treatment Management

Source: PRD Section 7. Defines the exact boundary of Admin's access, actions, and
management scope for patients and their treatment.

## Governing Principle (Section 7)
Every patient has **one persistent Qlyno Patient ID**. The hospital's job is to
find and reuse it, then attach a hospital-specific treatment relationship — never
to create a second, disconnected identity.

## ✅ Admin CAN
1. Search for an existing Qlyno Patient ID before doing anything else
2. Reuse an existing Qlyno Patient ID for hospital treatment
3. Register a new patient — **only** if that patient does not already exist in Qlyno
4. Flag a potential duplicate patient record for review
5. Establish a hospital ↔ patient relationship
6. Access patient history — but only to the extent that permission/consent allows
7. Coordinate OPD registration
8. Coordinate OPD appointment scheduling
9. Coordinate OPD queue management
10. Coordinate OPD consultation logistics (scheduling/logistics — not clinical content)
11. Coordinate OPD follow-up scheduling
12. Manage IPD admission
13. Assign a room/bed for an IPD patient
14. Manage an IPD patient transfer
15. Track IPD treatment progress operationally (status tracking, not clinical decisions)
16. Manage the IPD discharge workflow
17. View the patient's operational timeline, scoped to current permissions
18. Manage hospital-generated documents attached to the patient
19. Manage the patient's consent records
20. Handle discharge summaries administratively (not clinical authorship)
21. Manage other relevant hospital-generated records
22. View the patient's billing status
23. Coordinate financial workflows tied to the patient (not execute full billing logic)
24. Enforce patient/provider data-sharing and access controls (consent)
25. Coordinate the discharge readiness checklist
26. Coordinate financial settlement at discharge
27. Coordinate discharge documents
28. Coordinate discharge follow-up scheduling

## ❌ Admin CANNOT
1. Create a second, hospital-only patient identity when a Qlyno Patient ID already exists
2. Access patient history beyond what current permission/consent allows
3. Share patient data in violation of consent rules
4. Bypass consent controls, even to establish or maintain the hospital relationship
5. Make a clinical decision about the patient's treatment (diagnosis, treatment
   plan, etc.) — remains with the licensed clinician per the module-wide boundary

## Source Reference Table (verbatim from PRD Section 7)
| Feature | Hospital Admin Capability |
|---|---|
| Unified Patient ID | Search and use the existing Qlyno Patient ID instead of creating a second hospital identity |
| Registration | Register patients who do not yet exist and flag potential duplicates |
| Patient connection | Establish hospital relationship and permitted access to relevant history |
| OPD | Registration, appointment, queue, consultation and follow-up coordination |
| IPD | Admission, room/bed assignment, transfer, treatment progress and discharge workflow |
| Patient timeline | View operational timeline according to permissions |
| Documents | Manage hospital-generated documents, consent, discharge summaries and relevant records |
| Billing | View billing status and coordinate financial workflows |
| Consent | Respect patient/provider sharing and access controls |
| Discharge | Coordinate discharge readiness, settlement, documents and follow-up |
