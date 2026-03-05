
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SCENARIOS, type BedTile, type BedStatus } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const STATUS_COLORS: Record<BedStatus, string> = {
  available: "bg-emerald-400",
  dirty: "bg-amber-400",
  "occupied-flagged": "bg-blue-400",
  occupied: "bg-gray-300",
  "ed-boarder": "bg-red-400",
  "housekeeping-enroute": "bg-amber-400 animate-pulse-hk",
};

const STATUS_LABELS: Record<BedStatus, string> = {
  available: "Available",
  dirty: "Dirty — awaiting HK",
  "occupied-flagged": "Occupied, AI-flagged ~clear",
  occupied: "Occupied",
  "ed-boarder": "ED Boarder assigned",
  "housekeeping-enroute": "Housekeeping en route",
};

const FLOORS = ["1 West", "2 East", "3 South", "4 North"];

function BedTileComponent({
  bed,
  effectiveStatus,
  room310Status,
  showAssignModal,
  setAssignRoom,
}: {
  bed: BedTile;
  effectiveStatus: BedStatus;
  room310Status: "flagged" | "green" | "red" | null;
  showAssignModal: boolean;
  setAssignRoom: (r: string | null) => void;
}) {
  const [hover, setHover] = useState(false);

  let displayStatus = effectiveStatus;
  if (bed.room === "310") {
    if (room310Status === "green") displayStatus = "available";
    else if (room310Status === "red") displayStatus = "ed-boarder";
  }

  const colorClass = STATUS_COLORS[displayStatus];
  const isClickable = bed.room === "401" && effectiveStatus === "available";

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => isClickable && setAssignRoom(bed.room)}
        className={`w-[76px] h-[76px] rounded-md flex flex-col items-center justify-center gap-0.5 transition-all border-2 ${colorClass} ${
          isClickable ? "cursor-pointer border-[#00d4c8] ring-2 ring-[#00d4c8]/40" : "cursor-default border-transparent"
        }`}
        data-testid={`bed-tile-${bed.room}`}
      >
        <span className="text-white font-bold text-sm drop-shadow-sm">{bed.room}</span>
        {(displayStatus === "ed-boarder" || displayStatus === "housekeeping-enroute") && (
          <span className="text-white/80 text-[9px] font-medium">
            {displayStatus === "ed-boarder" ? "ED" : "HK"}
          </span>
        )}
        {displayStatus === "occupied-flagged" && (
          <span className="text-white/80 text-[9px] font-medium">AI</span>
        )}
      </button>
      {hover && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#0a0f1e] text-white text-xs rounded-md px-3 py-2 whitespace-nowrap shadow-lg border border-white/10 pointer-events-none">
          <p className="font-semibold">Room {bed.room}</p>
          <p className="text-white/60 mt-0.5">{STATUS_LABELS[displayStatus]}</p>
          {bed.patient && <p className="text-white/60">{bed.patient}</p>}
          {bed.expectedClear && <p className="text-[#00d4c8]">Clear by {bed.expectedClear}</p>}
          {bed.boarder && <p className="text-red-300">{bed.boarder}</p>}
        </div>
      )}
    </div>
  );
}

export function BedBoardPage() {
  const { scenario, housekeepingDispatched, room310Status } = useApp();
  const data = SCENARIOS[scenario];
  const [assignRoom, setAssignRoom] = useState<string | null>(null);
  const [assigned, setAssigned] = useState(false);

  const getEffectiveStatus = (bed: BedTile): BedStatus => {
    if (scenario === "TC1" && housekeepingDispatched) {
      if (bed.room === "401" || bed.room === "403") {
        return assigned && bed.room === "401" ? "ed-boarder" : "housekeeping-enroute";
      }
    }
    return bed.status;
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center gap-6 mb-6 flex-wrap gap-y-2">
          {[
            { status: "available" as BedStatus, label: "Available" },
            { status: "dirty" as BedStatus, label: "Dirty / HK" },
            { status: "occupied-flagged" as BedStatus, label: "AI-flagged clear" },
            { status: "occupied" as BedStatus, label: "Occupied" },
            { status: "ed-boarder" as BedStatus, label: "ED Boarder" },
          ].map(({ status, label }) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${STATUS_COLORS[status]}`} />
              <span className="text-[#0a0f1e]/60 text-xs">{label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {FLOORS.map((floor) => {
            const floorBeds = data.beds.filter((b) => b.floor === floor);
            return (
              <div key={floor} className="bg-white rounded-md border border-gray-100 shadow-sm p-5">
                <h3 className="text-[#0a0f1e] font-bold text-sm mb-4">{floor}</h3>
                <div className="flex flex-wrap gap-2">
                  {floorBeds.map((bed) => (
                    <BedTileComponent
                      key={bed.room}
                      bed={bed}
                      effectiveStatus={getEffectiveStatus(bed)}
                      room310Status={room310Status}
                      showAssignModal={assignRoom === bed.room}
                      setAssignRoom={setAssignRoom}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {assignRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[#0a0f1e] font-bold text-base">Assign Patient</h3>
                <button onClick={() => setAssignRoom(null)} className="text-[#0a0f1e]/30">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[#0a0f1e]/60 text-sm">Room {assignRoom} is ready for assignment.</p>
              <div className="bg-[#f8fafc] border border-gray-100 rounded-md px-3 py-2.5">
                <p className="text-xs text-[#0a0f1e]/50 mb-1">Selected patient</p>
                <p className="text-[#0a0f1e] font-semibold text-sm">Mr. Torres — ED Boarder (4.1hr wait, telemetry)</p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[#00d4c8] text-[#0a0f1e] font-bold"
                  onClick={() => {
                    setAssigned(true);
                    setAssignRoom(null);
                  }}
                  data-testid="button-confirm-assignment"
                >
                  Confirm Assignment
                </Button>
                <Button variant="outline" onClick={() => setAssignRoom(null)} className="text-[#0a0f1e]/50">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
