
import { useState } from "react";
import { Check, Clock, ChevronDown, ChevronUp, X, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { SCENARIOS, type ActionCard } from "@/lib/data";

function StatBadge({ status }: { status: string }) {
  if (status === "critical") return <span className="text-[10px] font-semibold text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded-sm">Critical</span>;
  if (status === "elevated") return <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-sm">Elevated</span>;
  if (status === "good") return <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-sm">Good</span>;
  return <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-sm">Normal</span>;
}

function ActionCardComponent({ card, isNurseCard }: { card: ActionCard; isNurseCard: boolean }) {
  const { cardStatuses, markCardDone, markCardSnoozed, markCardDismissed, nurseConfirm, nurseFlag, nurseConfirmed, nurseFlagged, nurseFlagText, scenario } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [flagInput, setFlagInput] = useState(() => {
    if (scenario === "TC2" && card.nurseCard) return "Family requesting physician consult before discharge.";
    return "";
  });

  const status = cardStatuses[card.id] ?? "active";
  const isDone = status === "done";
  const isSnoozed = status === "snoozed";

  const urgencyBar: Record<string, string> = {
    urgent: "bg-red-500",
    soon: "bg-amber-500",
    informational: "bg-emerald-500",
  };

  const urgencyLabel: Record<string, string> = {
    urgent: "Urgent",
    soon: "Soon",
    informational: "Info",
  };

  const urgencyBadge: Record<string, string> = {
    urgent: "text-red-600 bg-red-50",
    soon: "text-amber-600 bg-amber-50",
    informational: "text-emerald-600 bg-emerald-50",
  };

  let displayTitle = card.title;
  const shouldShowUpdated = card.updatedByNurseConfirm && (
    (scenario === "TC1" && nurseConfirmed) ||
    (scenario === "TC2" && nurseFlagged)
  );
  if (shouldShowUpdated && card.titleUpdated) {
    displayTitle = card.titleUpdated;
  }

  if (isDone) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-md opacity-70">
        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="text-sm text-[#0a0f1e]/50 line-through">{displayTitle}</span>
      </div>
    );
  }

  if (isSnoozed) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-md opacity-60">
        <Clock className="w-4 h-4 text-[#0a0f1e]/30 shrink-0" />
        <span className="text-sm text-[#0a0f1e]/40 italic">{displayTitle} (snoozed)</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-md border overflow-hidden transition-all ${
        shouldShowUpdated
          ? "border-[#00d4c8]/40 bg-[#00d4c8]/5"
          : "border-gray-100 bg-white"
      }`}
      data-testid={`action-card-${card.id}`}
    >
      <div className="flex">
        <div className={`w-1 shrink-0 ${urgencyBar[card.urgency]}`} />
        <div className="flex-1 min-w-0">
          <button
            className="w-full text-left px-4 pt-3 pb-2"
            onClick={() => setExpanded((v) => !v)}
          >
            <div className="flex items-start gap-2 justify-between">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold leading-snug ${shouldShowUpdated ? "text-[#00d4c8]" : "text-[#0a0f1e]"}`}>
                  {displayTitle}
                </p>
                <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">{card.rationale}</p>
              </div>
              <div className="shrink-0 ml-2 mt-0.5">
                {expanded ? (
                  <ChevronUp className="w-4 h-4 text-[#0a0f1e]/30" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0a0f1e]/30" />
                )}
              </div>
            </div>
          </button>

          {expanded && (
            <div className="px-4 pb-3">
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                {card.reasoningItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className={`shrink-0 mt-0.5 font-bold ${item.positive ? "text-emerald-500" : "text-red-500"}`}>
                      {item.positive ? "✓" : "✗"}
                    </span>
                    <span className="text-[#0a0f1e]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {flagMode && (
            <div className="px-4 pb-3">
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-[#6b7280] mb-2">Describe the blocker:</p>
                <textarea
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm text-[#0a0f1e] placeholder:text-gray-400 resize-none focus:outline-none focus:border-[#00d4c8]/50"
                  data-testid="input-flag-blocker"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    className="bg-amber-500/20 text-amber-600 border border-amber-500/30 bg-transparent"
                    onClick={() => {
                      nurseFlag(flagInput);
                      setFlagMode(false);
                    }}
                    data-testid="button-submit-flag"
                  >
                    Submit Flag
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setFlagMode(false)}
                    className="text-[#0a0f1e]/40"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 pb-3 flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${urgencyBadge[card.urgency]}`}>
              {urgencyLabel[card.urgency]}
            </span>
            <span className="text-[10px] text-[#0a0f1e] bg-gray-100 px-1.5 py-0.5 rounded-sm">{card.owner}</span>
            <span className="text-[10px] text-[#6b7280] flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {card.timeLabel}
            </span>

            <div className="ml-auto flex items-center gap-1.5">
              {isNurseCard ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={nurseConfirm}
                    disabled={nurseConfirmed}
                    data-testid={`button-confirm-${card.id}`}
                    className="text-emerald-400 border-emerald-500/40 bg-transparent text-xs h-7 px-2.5"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Confirm
                  </Button>
                  {!nurseFlagged && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFlagMode(true)}
                      data-testid={`button-flag-${card.id}`}
                      className="text-amber-400 border-amber-500/40 bg-transparent text-xs h-7 px-2.5"
                    >
                      <Bell className="w-3 h-3 mr-1" />
                      Flag Blocker
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markCardDone(card.id)}
                    data-testid={`button-done-${card.id}`}
                    className="text-emerald-400 border-emerald-500/40 bg-transparent text-xs h-7 px-2.5"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Done
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markCardSnoozed(card.id)}
                    data-testid={`button-snooze-${card.id}`}
                    className="text-amber-400 border-amber-500/40 bg-transparent text-xs h-7 px-2.5"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Snooze
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markCardDismissed(card.id)}
                    data-testid={`button-dismiss-${card.id}`}
                    className="text-white/30 border-white/15 bg-transparent text-xs h-7 px-2.5"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Dismiss
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { scenario, persona } = useApp();
  const data = SCENARIOS[scenario];

  let briefing = data.coordinatorBriefing;
  let stats = data.coordinatorStats;
  let cards = data.coordinatorCards;
  let isNurseView = false;

  if (persona === "nurse-3south") {
    briefing = data.nurseBriefingBySouth;
    stats = data.nurseSouthStats;
    cards = data.nurseSouthCards;
    isNurseView = true;
  } else if (persona === "nurse-4north") {
    briefing = data.nurseBriefingByNorth;
    stats = data.nurseNorthStats;
    cards = data.nurseNorthCards;
    isNurseView = true;
  }

  const activeCount = cards.filter((c) => !["done", "dismissed"].includes("active")).length;

  return (
    <div className="h-full overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <div
          className="relative bg-white rounded-md border border-[#00d4c8]/30 shadow-sm"
          data-testid="ai-briefing"
          style={{ borderLeftWidth: "4px", borderLeftColor: "#00d4c8" }}
        >
          <div className="p-5">
            <div className="flex items-start gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00d4c8]" />
                <span className="text-[10px] font-bold text-[#00d4c8] uppercase tracking-widest">AI Situation Briefing</span>
              </div>
              <div className="ml-auto shrink-0">
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-[#00d4c8]/10 text-[#00d4c8]">AI</span>
              </div>
            </div>
            <p className="text-[#0a0f1e] text-sm leading-relaxed font-medium">{briefing}</p>
            <p className="text-[#0a0f1e]/40 text-[11px] mt-3">
              Last updated {data.time === "2:15am" ? "2:17am" : "7:46am"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3" data-testid="stats-bar">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-md border border-gray-100 shadow-sm p-4 text-center space-y-2">
              <p className="text-[#0a0f1e]/50 text-xs font-medium">{stat.label}</p>
              <p className="text-[#0a0f1e] text-2xl font-bold leading-none">{stat.value}</p>
              <StatBadge status={stat.status} />
            </div>
          ))}
        </div>

        <div data-testid="action-queue">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-[#0a0f1e] font-bold text-base">Priority Actions</h2>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#0a0f1e]/10 text-[#0a0f1e]/60">
              {cards.length}
            </span>
          </div>
          <div className="space-y-2.5">
            {cards.map((card) => (
              <ActionCardComponent key={card.id} card={card} isNurseCard={isNurseView && !!card.nurseCard} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
