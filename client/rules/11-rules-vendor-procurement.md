# Module 11 Rules — Vendor Request & Procurement Management

Source: PRD Section 11 (+ Section 15 delegation rule). Defines the exact boundary
of Admin's access, actions, and management scope for vendor/procurement.

## Governing Principle (Section 11)
> "Vendor requests should be structured workflow objects, not informal chat. The
> Qlyno product model already defines Procurement Request as a core object and
> expects hospital requirements, quotes, orders and delivery status to be
> traceable."

## ✅ Admin CAN
1. Create a procurement request for equipment
2. Create a procurement request for an implant
3. Create a procurement request for a consumable
4. Create a procurement request for medicine
5. Create a procurement request for a service
6. Create a procurement request for any other configured product
7. Link a procurement request to a patient, when appropriate
8. Link a procurement request to a surgical case, when appropriate
9. Discover vendors through the approved vendor network
10. Manually select a vendor outside the approved network
11. Receive quotes submitted by vendors
12. Compare quotes across vendors (price, availability, delivery timeline)
13. Review a vendor's response
14. Review a vendor's submitted documents
15. Review a vendor's commercial details
16. Approve a purchase/selection — per the hospital's configured approval workflow
17. Reject a purchase/selection — per the hospital's configured approval workflow
18. Generate a purchase order for an approved item/service
19. Track delivery status: Dispatched
20. Track delivery status: Delivered
21. Track delivery status: Rejected
22. Track delivery status: Delayed
23. Track delivery status: Received
24. Record a receiving/inspection (quality check) outcome, where required
25. Maintain the complete audit trail: request → quote → selection → order → delivery

## ❌ Admin CANNOT
1. Handle a vendor requirement as informal/unstructured communication — it must
   always be a structured, traceable workflow object
2. Approve a purchase/selection outside the hospital's configured approval workflow
3. Skip the quality check step where it is required, before marking an item "Received"
4. Break the request → quote → selection → order → delivery audit chain at any point

## Delegation & Audit Requirement (Section 15)
> "Vendor: Can create/review/approve procurement requests according to approval rules."

Any vendor/procurement action Admin performs must be logged as:

> *"Performed by Hospital Admin • acting within Vendor workflow"*

## Source Reference Table (verbatim from PRD Section 11)
| Feature | Requirement |
|---|---|
| Create request | Hospital can request equipment, implant, consumable, medicine, service or other configured product |
| Case-linked request | Link procurement requirement to patient/surgical case when appropriate |
| Vendor discovery | Use approved vendor network or manually selected vendor |
| Quote collection | Receive and compare quotes, availability and delivery timelines |
| Vendor review | Hospital Admin reviews vendor response, documents and commercial details |
| Approval | Configured approval workflow for purchase/selection |
| Purchase order | Generate/order approved item or service |
| Delivery tracking | Track dispatched, delivered, rejected, delayed and received status |
| Quality check | Record receiving/inspection outcome where required |
| Audit | Keep complete request → quote → selection → order → delivery trail |
