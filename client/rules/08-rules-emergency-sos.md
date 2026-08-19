# Module 8 Rules — Emergency / SOS Management

Source: PRD Section 8 (8.1, 8.2, 8.3) + Section 15 delegation rule. Defines the
exact boundary of Admin's access, actions, and management scope for emergencies.

## Governing Principle (Section 8)
> "The system must optimize for fast routing and accountable human response, not
> autonomous clinical decision-making. Every alert needs a delivery state, an
> owner, an escalation path and an audit trail."

Admin's entire role in this module is **coordination, not clinical judgment.**

## ✅ Admin CAN
1. View the live emergency board listing all active SOS cases
2. View each case's current status
3. View each case's location
4. View each case's destination hospital
5. View each case's acknowledgement state
6. View each case's assigned owner
7. Acknowledge administrative receipt of an incoming emergency alert
8. Route an acknowledged alert to the clinical emergency team
9. Configure the hospital's available emergency beds/resources
10. Report current emergency capacity
11. View ambulance availability status (available/busy/offline)
12. View all active ambulance dispatches
13. Escalate an alert that hasn't been acknowledged, to configured roles
14. Configure and manage the hospital's fallback/transfer routing rules
15. Trigger an emergency family notification — only where it's an **approved** notification
16. Monitor the delivery/status of a triggered family alert
17. Close an emergency event — **only once the responsible workflow is complete
    or handed off**
18. Review the complete audit trail for any emergency case
19. Review response-time metrics per case
20. Coordinate/route an emergency case through its lifecycle
21. Escalate an emergency case through the configured chain

## ❌ Admin CANNOT
1. Make the clinical triage decision for a case — that stays with the emergency
   clinical team
2. Close an emergency event before the responsible workflow is complete/handed off
3. Trigger a family alert that isn't pre-approved/configured
4. Act as an autonomous decision-maker anywhere in the SOS flow — every action
   must produce a delivery state, an owner, and an audit entry
5. Silently skip a step in the logged sequence (SOS created → hospital notified
   → acknowledgement → ambulance status → fallback → arrival → closure) — every
   step must be logged

## Delegation & Audit Requirement (Section 15)
> "Emergency: Can coordinate/route/acknowledge/escalate; clinical triage remains
> with emergency clinical team."

Any emergency-scope action Admin performs must be logged as:

> *"Performed by Hospital Admin • acting within Emergency workflow"*

## Source Reference — 8.3 Emergency Admin Control Panel (verbatim from PRD)
| Panel | What Admin can do |
|---|---|
| Live emergency board | See active SOS cases, status, location, destination, acknowledgement and owner |
| Accept / acknowledge | Acknowledge administrative receipt and route to clinical emergency team |
| Emergency capacity | Configure/report available emergency beds/resources where supported |
| Ambulance | See available/busy/offline ambulances and active dispatches |
| Escalation | Escalate unanswered alerts to configured roles |
| Hospital fallback | Manage configured fallback/transfer routing rules |
| Family alert | Trigger/monitor approved emergency family notifications |
| Closure | Close emergency event only when the responsible workflow is complete/handed off |
| Audit | Review the complete event trail and response times |

## Source Reference — Logged Event Sequence (8.1, step 11)
> "Every step is logged: SOS created, hospital notified, acknowledgement,
> ambulance status, fallback, arrival and closure."
