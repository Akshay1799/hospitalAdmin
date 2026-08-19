# 11 — Vendor Request & Procurement Management

## Purpose
Turns hospital procurement (equipment, implants, medicine, services) into a
**structured, traceable workflow object** — not informal chat/email. Every request
must be followed end-to-end: request → quotes → selection → approval → order →
delivery → quality check, all logged.

## Pages / Screens to Build
1. **Procurement Requests — List View**
   - Table: Request ID, Item/Service, Linked case (if any), Status, Vendor, Created date
   - Filters: Status, Category (equipment/implant/consumable/medicine/service), Department
2. **Create Procurement Request**
   - Fields: Item/service type, Quantity/spec, Optional case link (surgical case,
     patient), Urgency, Preferred vendor (optional)
3. **Request Detail Page** (tabs)
   - Overview: item, requester, linked case, current status
   - **Vendor Discovery tab**: browse approved vendor network OR manually add a vendor
   - **Quotes tab**: comparison table — Vendor, Price, Availability, Delivery timeline, Documents
   - **Approval tab**: configured approval steps, approver, decision, timestamp
   - **Order tab**: generated purchase order details
   - **Delivery tab**: status tracker — Dispatched / Delivered / Rejected / Delayed / Received
   - **Quality Check tab**: inspection outcome form (pass/fail/notes) where required
   - **Audit tab**: full request → quote → selection → order → delivery trail
4. **Quote Comparison View**
   - Side-by-side comparison of all received quotes for a request (reusable component)
5. **Purchase Order Generator**
   - Form/preview → generate PO from an approved quote
6. **Delivery Tracking Board**
   - Kanban or table across all requests: Dispatched / Delivered / Rejected / Delayed / Received
7. **Vendor Reliability View** (optional/proposed feature)
   - Delivery timeliness, rejection rate, fulfillment history per vendor (internal use)

## Core Admin Actions Checklist
- [ ] Create a procurement request (optionally linked to a patient/surgical case)
- [ ] Discover vendors via approved network or add manually
- [ ] Collect and compare quotes (price, availability, delivery timeline)
- [ ] Review vendor response, documents, commercial terms
- [ ] Approve/reject per configured approval workflow
- [ ] Generate a purchase order from an approved quote
- [ ] Track delivery status through its full lifecycle
- [ ] Record receiving/inspection (quality check) outcome
- [ ] View full audit trail per request

## States / Statuses to Handle in UI
- Request: `Draft`, `Submitted`, `Quotes Collecting`, `Under Review`, `Approved`,
  `Rejected`, `Ordered`, `Fulfilled`, `Closed`
- Delivery: `Dispatched`, `Delivered`, `Rejected`, `Delayed`, `Received`
- Quote: `Received`, `Shortlisted`, `Selected`, `Declined`

## Notifications Relevant to This Module
- Vendor quote received → Procurement/Admin reviewer
- Vendor delivery delay → Request owner + department/case owner

## Edge Cases to Design For
- Request linked to a surgical case (module 10) should show that link both ways —
  the case's "Vendor Dependencies" tab and this request's "Overview" tab
- No quotes received within a configured time → surface as a stalled-request alert
- Rejected delivery must be able to trigger a **new** request/quote round, not just
  dead-end the original one — design the status flow to support looping back
- Approval step config may vary per hospital policy — build the approval UI as a
  generic ordered-steps renderer, not hardcoded to one approver
