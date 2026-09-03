"use client";

import * as React from "react";
import { Bell, Mail, MessageSquare, Phone, Send } from "lucide-react";
import { Badge, Button, Card, Field, Modal, SectionHeader, Select, Table, Textarea } from "./ui";
import { useReceptionistData } from "./data-context";

const channelIcon: Record<string, React.ReactNode> = {
  SMS: <MessageSquare size={14} />,
  Email: <Mail size={14} />,
  System: <Bell size={14} />,
  Call: <Phone size={14} />,
};

export function Communication() {
  const { notifications, patients, pushNotification } = useReceptionistData();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    uhid: patients[0]?.uhid ?? "",
    channel: "SMS" as "SMS" | "Email" | "Call" | "System",
    message: "",
  });

  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const patient = patients.find((item) => item.uhid === form.uhid);
    if (!patient || !form.message) return;

    pushNotification({
      title: `${form.channel} sent to ${patient.name}`,
      detail: form.message,
      channel: form.channel,
    });
    setForm((current) => ({ ...current, message: "" }));
    setModalOpen(false);
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Front desk - Communication"
        title="Communication & notifications"
        description="Send appointment confirmations, reminders, internal notifications and important updates to patients and hospital staff."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Send size={16} /> New Message
          </Button>
        }
      />

      <Modal open={modalOpen} title="Send Message" eyebrow="Communication" onClose={() => setModalOpen(false)} size="lg">
        <form onSubmit={handleSend} className="space-y-4">
          <Field label="Patient" required>
            <Select value={form.uhid} onChange={(event) => setForm((current) => ({ ...current, uhid: event.target.value }))}>
              {patients.map((patient) => (
                <option key={patient.uhid} value={patient.uhid}>{patient.name} - {patient.uhid}</option>
              ))}
            </Select>
          </Field>
          <Field label="Channel" required>
            <Select value={form.channel} onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value as any }))}>
              <option>SMS</option>
              <option>Email</option>
              <option>Call</option>
              <option>System</option>
            </Select>
          </Field>
          <Field label="Message" required>
            <Textarea rows={4} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder="e.g. Your appointment with Dr. Kapoor is confirmed for 11:30 AM today." required />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button type="submit">
              <Send size={16} /> Send notification
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <div className="rp-grid-2-wide">
        <Card>
          <h2 className="rp-h2">Quick templates</h2>
          <ul className="rp-steps">
            <li>Appointment confirmed for {"{time}"} with {"{doctor}"}.</li>
            <li>Reminder: your appointment is tomorrow at {"{time}"}.</li>
            <li>Your reports are ready for collection at the front desk.</li>
            <li>Bed {"{bed}"} has been allotted in {"{ward}"}.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="rp-h2">Channels</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(channelIcon).map((channel) => (
              <Badge key={channel} tone="slate">
                <span className="inline-flex items-center gap-1">{channelIcon[channel]} {channel}</span>
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <h2 className="rp-h2">Notification log</h2>
        <Table columns={["Channel", "Notification", "Detail", "Time"]}>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td><Badge tone="slate"><span className="inline-flex items-center gap-1">{channelIcon[notification.channel]} {notification.channel}</span></Badge></td>
              <td className="font-medium text-ink">{notification.title}</td>
              <td>{notification.detail}</td>
              <td>{notification.time}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
