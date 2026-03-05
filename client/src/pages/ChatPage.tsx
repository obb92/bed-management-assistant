
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { SCENARIOS } from "@/lib/data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function renderMarkdown(text: string): string {
  return text
    .split(/\n\n+/)
    .map((para) => {
      const html = para
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
      return `<p style="margin:0 0 0.5em 0">${html}</p>`;
    })
    .join("");
}

function buildSystemPrompt(scenario: string, persona: string, scenarioData: object, time: string): string {
  const personaLabel =
    persona === "coordinator"
      ? "Bed Coordinator (hospital-wide)"
      : persona === "nurse-3south"
      ? "Charge Nurse — 3 South (floor-scoped only)"
      : "Charge Nurse — 4 North (floor-scoped only)";

  return `You are CareFlow, an AI bed management assistant for ${personaLabel} at Memorial General Hospital.
You have full visibility into the current hospital state. Answer questions about bed management,
discharge planning, and patient flow only. Be specific — always reference actual room numbers,
patient names, and timing from the hospital state below. Never give generic answers.
Keep responses concise (3–5 sentences max unless a list is genuinely clearer).
Do not speculate beyond the data provided. Do not give clinical advice.

CURRENT HOSPITAL STATE:
${JSON.stringify(scenarioData, null, 2)}

Current time: ${time}
Active persona: ${personaLabel}`;
}

export function ChatPage() {
  const { scenario, persona } = useApp();
  const data = SCENARIOS[scenario];

  const getInitialInput = () => {
    if (scenario === "TC2") return data.chatPrefill ?? "";
    return "";
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(getInitialInput());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevScenario = useRef(scenario);

  useEffect(() => {
    if (prevScenario.current !== scenario) {
      setMessages([]);
      setInput(getInitialInput());
      setError(null);
      prevScenario.current = scenario;
    }
  }, [scenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    const systemPrompt = buildSystemPrompt(scenario, persona, data, data.time);
    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, systemPrompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "API error");
      }

      const result = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: result.text }]);
    } catch (err: any) {
      setError(err?.message && err.message !== "API error" ? err.message : "Unable to reach AI — check your VITE_ANTHROPIC_API_KEY in Replit Secrets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc]">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4" data-testid="chat-messages">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-12">
            <div className="w-12 h-12 rounded-full bg-[#00d4c8]/15 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#00d4c8]" />
            </div>
            <p className="text-[#0a0f1e] font-semibold">Ask CareFlow anything</p>
            <p className="text-[#0a0f1e]/40 text-sm max-w-xs leading-relaxed">
              Questions about bed availability, discharge predictions, patient flow — CareFlow knows the current hospital state.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="max-w-lg bg-[#0a0f1e] rounded-xl px-4 py-3" data-testid={`chat-message-user-${i}`}>
                <p className="text-white text-sm leading-relaxed">{msg.content}</p>
              </div>
            ) : (
              <div
                className="max-w-xl bg-white rounded-xl shadow-sm border-l-[3px] border-l-[#00d4c8] px-4 py-3"
                style={{ borderLeftWidth: "3px", borderLeftColor: "#00d4c8" }}
                data-testid={`chat-message-ai-${i}`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3 h-3 text-[#00d4c8]" />
                  <span className="text-[10px] font-bold text-[#00d4c8] uppercase tracking-wider">CareFlow AI</span>
                </div>
                <div
                  className="text-[#0a0f1e] text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-2" data-testid="typing-indicator">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d4c8] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d4c8] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d4c8] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-[#0a0f1e]/40 text-xs">CareFlow is thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-3 inline-block" data-testid="chat-error">
              {error}
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`Ask about bed management, discharges, or patient flow...`}
              rows={2}
              className="w-full bg-transparent text-sm text-[#0a0f1e] placeholder:text-[#0a0f1e]/30 resize-none focus:outline-none"
              data-testid="chat-input"
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-[#00d4c8] text-[#0a0f1e] font-bold shrink-0"
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-[#0a0f1e]/25 mt-2">
          CareFlow only has visibility into current hospital state data. Not a substitute for clinical judgment.
        </p>
      </div>
    </div>
  );
}
