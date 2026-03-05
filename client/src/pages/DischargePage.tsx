
import { Fragment, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { SCENARIOS } from "@/lib/data";

function LikelihoodBadge({ val }: { val: string | null }) {
  if (!val) return <span className="text-white/20 text-xs">—</span>;
  const styles: Record<string, string> = {
    HIGH: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    MEDIUM: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    LOW: "bg-gray-400/15 text-gray-400 border border-gray-400/20",
  };
  return (
    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${styles[val] ?? ""}`}>
      {val}
    </span>
  );
}

export function DischargePage() {
  const { scenario, persona, nurseFlag } = useApp();
  const data = SCENARIOS[scenario];
  const [flagRow, setFlagRow] = useState<string | null>(null);
  const [flagText, setFlagText] = useState("");
  const [flaggedRows, setFlaggedRows] = useState<Set<string>>(new Set());
  const [confirmedRows, setConfirmedRows] = useState<Set<string>>(new Set());

  const isCoordinator = persona === "coordinator";
  const nurseFloor = persona === "nurse-3south" ? "3 South" : persona === "nurse-4north" ? "4 North" : null;

  const patternRows = data.dischargeList.filter((r) => r.patternHighlight);
  const hasPattern = patternRows.length >= 3;

  const visibleRows = isCoordinator
    ? data.dischargeList
    : data.dischargeList.filter((r) => r.floor === nurseFloor);

  return (
    <div className="h-full overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-6 py-6">

        {scenario === "TC2" && hasPattern && (
          <div className="mb-4 flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/25 rounded-md" data-testid="pattern-banner">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium leading-snug">
              Pattern detected: 3 of your top 5 likely discharges share the same blocker — physician sign-off. See Action Queue.
            </p>
          </div>
        )}

        <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm" data-testid="discharge-table">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-[#0a0f1e]/50 uppercase tracking-wide px-5 py-3">Room</th>
                <th className="text-left text-xs font-semibold text-[#0a0f1e]/50 uppercase tracking-wide px-4 py-3">Patient</th>
                {isCoordinator && (
                  <th className="text-left text-xs font-semibold text-[#0a0f1e]/50 uppercase tracking-wide px-4 py-3">Floor</th>
                )}
                <th className="text-left text-xs font-semibold text-[#0a0f1e]/50 uppercase tracking-wide px-4 py-3">Likelihood</th>
                <th className="text-left text-xs font-semibold text-[#0a0f1e]/50 uppercase tracking-wide px-4 py-3">Primary Blocker</th>
                <th className="text-left text-xs font-semibold text-[#0a0f1e]/50 uppercase tracking-wide px-4 py-3">LOS</th>
                {!isCoordinator && (
                  <th className="text-left text-xs font-semibold text-[#0a0f1e]/50 uppercase tracking-wide px-4 py-3">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, i) => {
                const isPattern = row.patternHighlight && scenario === "TC2";
                const isConfirmed = confirmedRows.has(row.room);
                const isFlagged = flaggedRows.has(row.room);
                return (
                  <Fragment key={row.room}>
                    <tr
                      className={`border-b border-gray-50 transition-colors ${
                        isPattern ? "border-l-2 border-l-amber-400 bg-amber-50/50" : ""
                      } ${isConfirmed ? "bg-emerald-50/50" : ""}`}
                      data-testid={`discharge-row-${row.room}`}
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-[#0a0f1e] text-sm">{row.room}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[#0a0f1e] font-medium">{row.patient}</span>
                      </td>
                      {isCoordinator && (
                        <td className="px-4 py-3.5">
                          <span className="text-[#0a0f1e]/60 text-xs">{row.floor}</span>
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <LikelihoodBadge val={row.likelihood} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[#0a0f1e]/60 text-xs">{row.blocker}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[#0a0f1e]/60 text-xs">{row.los}</span>
                      </td>
                      {!isCoordinator && (
                        <td className="px-4 py-3.5">
                          {row.likelihood && !isConfirmed && !isFlagged ? (
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setConfirmedRows((s) => new Set(Array.from(s).concat(row.room)));
                                }}
                                data-testid={`button-confirm-discharge-${row.room}`}
                                className="text-emerald-600 border-emerald-300 bg-transparent text-xs h-7 px-2"
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setFlagRow(row.room);
                                  setFlagText("");
                                }}
                                data-testid={`button-flag-discharge-${row.room}`}
                                className="text-amber-600 border-amber-300 bg-transparent text-xs h-7 px-2"
                              >
                                Flag
                              </Button>
                            </div>
                          ) : isConfirmed ? (
                            <span className="text-xs text-emerald-600 font-medium">Confirmed</span>
                          ) : isFlagged ? (
                            <span className="text-xs text-amber-600 font-medium">Flagged</span>
                          ) : null}
                        </td>
                      )}
                    </tr>
                    {flagRow === row.room && (
                      <tr key={`${row.room}-flag`} className="bg-amber-50/80">
                        <td colSpan={isCoordinator ? 6 : 7} className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <input
                              autoFocus
                              type="text"
                              placeholder="Describe the blocker..."
                              value={flagText}
                              onChange={(e) => setFlagText(e.target.value)}
                              className="flex-1 bg-white border border-amber-300 rounded-md px-3 py-1.5 text-sm text-[#0a0f1e] focus:outline-none focus:border-amber-500"
                              data-testid={`input-flag-text-${row.room}`}
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                nurseFlag(flagText);
                                setFlaggedRows((s) => new Set(Array.from(s).concat(row.room)));
                                setFlagRow(null);
                              }}
                              className="bg-amber-500 text-white text-xs h-7"
                            >
                              Submit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setFlagRow(null)}
                              className="text-[#0a0f1e]/40 text-xs h-7"
                            >
                              Cancel
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
