"use client";

import { useState } from "react";
import { Send, Circle } from "lucide-react";
import { SectionHeading, Card, Avatar, Pill } from "@/components/ui";
import { conversations as seedConversations } from "@/lib/mock-data";

interface ChatMessage {
  from: "me" | "them";
  text: string;
  time: string;
}

const seedThread: Record<string, ChatMessage[]> = {
  "conv-1": [
    { from: "them", text: "Should I take the BP medicine before or after food?", time: "10:02 AM" },
  ],
  "conv-2": [{ from: "them", text: "Vitals updated for room 3, ready for you.", time: "9:48 AM" }],
  "conv-3": [{ from: "them", text: "Troponin-I report uploaded for Thomas Varghese.", time: "8:40 AM" }],
  "conv-4": [{ from: "them", text: "Can you review Aarav Shah's inhaler technique next visit?", time: "6:15 AM" }],
  "conv-5": [{ from: "them", text: "Confirmed stock for Atorvastatin 20mg.", time: "Yesterday" }],
};

const roleTone: Record<string, "brand" | "clay" | "sage" | "neutral"> = {
  Patient: "brand",
  Nurse: "sage",
  Pharmacist: "clay",
  Lab: "clay",
  Doctor: "brand",
  "Clinic Admin": "neutral",
};

export default function CommunicationPage() {
  const [conversations, setConversations] = useState(seedConversations);
  const [threads, setThreads] = useState(seedThread);
  const [activeId, setActiveId] = useState(seedConversations[0].id);
  const [draft, setDraft] = useState("");

  const active = conversations.find((c) => c.id === activeId)!;
  const messages = threads[activeId] ?? [];

  function send() {
    if (!draft.trim()) return;
    setThreads((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), { from: "me", text: draft, time: "Now" }],
    }));
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, lastMessage: draft, time: "Now", unread: 0 } : c))
    );
    setDraft("");
  }

  return (
    <div>
      <SectionHeading
        eyebrow="14 · Communication"
        title="Communication"
        description="Collaborate with nurses, laboratory staff, pharmacists and hospital departments."
      />

      <Card padded={false} className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          <div className="border-r border-line overflow-y-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveId(c.id);
                  setConversations((prev) => prev.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x)));
                }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-line/70 transition-colors ${
                  activeId === c.id ? "bg-brand-50" : "hover:bg-paper"
                }`}
              >
                <Avatar initials={c.withName.split(" ").map((w) => w[0]).slice(0, 2).join("")} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-ink truncate">{c.withName}</p>
                    {c.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted truncate">{c.lastMessage}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Pill tone={roleTone[c.withRole]}>{c.withRole}</Pill>
                    <span className="text-[10px] text-ink-faint">{c.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-2 flex flex-col">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-line">
              <Avatar initials={active.withName.split(" ").map((w) => w[0]).slice(0, 2).join("")} size={32} />
              <div>
                <p className="text-sm font-medium text-ink">{active.withName}</p>
                <p className="text-[11px] text-ink-muted flex items-center gap-1">
                  <Circle size={7} className="fill-sage-400 text-sage-400" /> {active.withRole}
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                      m.from === "me" ? "bg-brand-500 text-white rounded-br-sm" : "bg-paper text-ink-soft rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                    <span className={`block text-[10px] mt-1 ${m.from === "me" ? "text-white/70" : "text-ink-faint"}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 py-3 border-t border-line">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Write a message…"
                className="input-field"
              />
              <button onClick={send} className="btn-primary shrink-0">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
