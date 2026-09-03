"use client";

import { useEffect, useState } from "react";
import { Send, Circle } from "lucide-react";
import { SectionHeading, Card, Avatar, Pill, EmptyState } from "@/components/ui";
import { conversations as seedConversations } from "@/lib/mock-data";
import { useMode } from "@/lib/mode-context";
import { Conversation } from "@/lib/types";
import { BackendConversationRow, getBackendConversations, sendBackendMessage } from "@/lib/api-client";

interface ChatMessage {
  id?: string;
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
  const { selectedWorkplaceId } = useMode();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({});
  const [activeId, setActiveId] = useState("");
  const [draft, setDraft] = useState("");
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    getBackendConversations(selectedWorkplaceId)
      .then((rows) => {
        if (cancelled) return;
        setConversations(rows);
        setThreads(
          rows.reduce<Record<string, ChatMessage[]>>((acc, row: BackendConversationRow) => {
            acc[row.id] = row.messages;
            return acc;
          }, {})
        );
        setActiveId(rows[0]?.id ?? "");
      })
      .catch(() => {
        if (!cancelled) {
          setConversations(seedConversations);
          setThreads(seedThread);
          setActiveId(seedConversations[0]?.id ?? "");
          setSyncMessage("Backend unavailable; using local demo conversations.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedWorkplaceId]);

  const active = conversations.find((c) => c.id === activeId);
  const messages = threads[activeId] ?? [];

  async function send() {
    if (!active || !draft.trim()) return;
    const outgoingText = draft;
    let nextActiveId = activeId;
    let nextMessage: ChatMessage = { from: "me", text: outgoingText, time: "Now" };

    setDraft("");
    try {
      const saved = await sendBackendMessage({
        conversationId: activeId,
        workplaceId: selectedWorkplaceId,
        title: active.withName,
        body: outgoingText,
      });
      nextActiveId = saved.conversationId;
      nextMessage = saved.message;
      setSyncMessage("Message synced to backend.");
    } catch {
      setSyncMessage("Backend sync failed; local message kept.");
    }

    setThreads((prev) => ({
      ...prev,
      [nextActiveId]: [...(prev[activeId] ?? []), nextMessage],
    }));
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, id: nextActiveId, lastMessage: outgoingText, time: "Now", unread: 0 } : c))
    );
    setActiveId(nextActiveId);
  }

  return (
    <div>
      <SectionHeading
        eyebrow="14 · Communication"
        title="Communication"
        description="Collaborate with nurses, laboratory staff, pharmacists and hospital departments."
      />
      {syncMessage && <p className="mb-3 text-xs text-ink-muted">{syncMessage}</p>}

      <Card padded={false} className="overflow-hidden">
        {!active ? (
          <EmptyState title="No conversations" description="Messages will appear here when a conversation starts." />
        ) : (
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
        )}
      </Card>
    </div>
  );
}
