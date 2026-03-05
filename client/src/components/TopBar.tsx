
import { ChevronDown, Clock } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import type { Persona } from "@/lib/data";
import { SCENARIOS } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const SCREEN_TITLES: Record<string, string> = {
  home: "Home",
  discharges: "Discharges",
  beds: "Bed Status Board",
  chat: "Ask AI",
};

const PERSONA_LABELS: Record<Persona, string> = {
  coordinator: "Bed Coordinator",
  "nurse-3south": "Charge Nurse — 3 South",
  "nurse-4north": "Charge Nurse — 4 North",
};

export function TopBar() {
  const { screen, persona, setPersona, scenario } = useApp();
  const [open, setOpen] = useState(false);
  const data = SCENARIOS[scenario];

  const statusColors: Record<number, string> = {
    94: "bg-red-500/20 text-red-400 border-red-500/30",
    89: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };
  const occColor = statusColors[data.occupancyPct] ?? "bg-amber-500/20 text-amber-400 border-amber-500/30";

  return (
    <header className="flex items-center justify-between gap-4 px-5 h-12 border-b border-white/8 bg-[#0a0f1e] shrink-0" data-testid="topbar">
      <h1 className="text-white/90 font-semibold text-sm">{SCREEN_TITLES[screen] ?? ""}</h1>

      <div className="flex items-center gap-3">
        <div className="relative" data-testid="persona-switcher">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/8 border border-white/12 text-white/80 text-xs font-medium"
          >
            <span>{PERSONA_LABELS[persona]}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-[#0f1629] border border-white/12 rounded-md shadow-lg overflow-hidden min-w-[200px]">
              {(["coordinator", "nurse-3south", "nurse-4north"] as Persona[]).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPersona(p); setOpen(false); }}
                  data-testid={`persona-option-${p}`}
                  className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                    persona === p
                      ? "text-[#00d4c8] bg-[#00d4c8]/10"
                      : "text-white/70"
                  }`}
                >
                  {PERSONA_LABELS[p]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <Clock className="w-3 h-3" />
          <span>{data.time}</span>
        </div>

        <Badge className={`text-[10px] font-semibold border ${occColor} bg-transparent`} data-testid="occupancy-badge">
          {data.occupancyPct}% occupied
        </Badge>
      </div>
    </header>
  );
}
