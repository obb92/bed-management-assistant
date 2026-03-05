
export type Scenario = "TC1" | "TC2";
export type Persona = "coordinator" | "nurse-3south" | "nurse-4north";
export type CardStatus = "active" | "done" | "snoozed" | "dismissed";
export type BedStatus = "available" | "dirty" | "occupied-flagged" | "occupied" | "ed-boarder" | "housekeeping-enroute";

export interface ActionCard {
  id: string;
  urgency: "urgent" | "soon" | "informational";
  title: string;
  titleUpdated?: string;
  rationale: string;
  owner: string;
  timeLabel: string;
  reasoningItems: { text: string; positive: boolean }[];
  nurseCard?: boolean;
  triggersBedAnimation?: boolean;
  updatedByNurseConfirm?: boolean;
}

export interface DischargeRow {
  room: string;
  patient: string;
  floor: string;
  likelihood: "HIGH" | "MEDIUM" | "LOW" | null;
  blocker: string;
  los: string;
  patternHighlight?: boolean;
}

export interface BedTile {
  room: string;
  floor: string;
  status: BedStatus;
  patient?: string;
  expectedClear?: string;
  boarder?: string;
}

export interface ScenarioData {
  id: Scenario;
  name: string;
  time: string;
  occupancyPct: number;
  coordinatorBriefing: string;
  nurseBriefingBySouth: string;
  nurseBriefingByNorth: string;
  coordinatorStats: { label: string; value: string; status: "critical" | "elevated" | "normal" | "good" }[];
  nurseSouthStats: { label: string; value: string; status: "critical" | "elevated" | "normal" | "good" }[];
  nurseNorthStats: { label: string; value: string; status: "critical" | "elevated" | "normal" | "good" }[];
  coordinatorCards: ActionCard[];
  nurseSouthCards: ActionCard[];
  nurseNorthCards: ActionCard[];
  dischargeList: DischargeRow[];
  beds: BedTile[];
  chatPrefill?: string;
}

export const TC1: ScenarioData = {
  id: "TC1",
  name: "The 2am Crunch",
  time: "2:15am",
  occupancyPct: 94,
  coordinatorBriefing:
    "As of 2:15am, the house is at 94% occupancy. You have 6 patients boarding in the ED — 3 have waited over 4 hours. One discharge on 3 South is ready to initiate right now: Room 310 (Mrs. Garcia) has labs back, family is present, and transport is the only outstanding item. Clearing her unlocks 2 ED placements within 90 minutes. Two beds on 4 North are dirty and need housekeeping before they're usable. Action queue has 3 items.",
  nurseBriefingBySouth:
    "As of 2:15am, 3 South is at 91% occupancy. Room 310 (Mrs. Garcia) is ready to discharge — labs returned 40 minutes ago, family is present, but transport has not been arranged. This is the only blocker. The Bed Coordinator has flagged this as the hospital's top priority right now. An ED patient is tentatively assigned to Room 310 once it clears.",
  nurseBriefingByNorth:
    "As of 2:15am, 4 North is at 88% occupancy. Rooms 401 and 403 are dirty and awaiting housekeeping. The Bed Coordinator has dispatched housekeeping — beds should be clear within 30–45 minutes. Two ED boarders are tentatively assigned once the rooms turn over.",
  coordinatorStats: [
    { label: "Occupancy", value: "94%", status: "critical" },
    { label: "ED Boarders", value: "6 (avg 3.2hr)", status: "critical" },
    { label: "Avg Turnaround", value: "110 min", status: "elevated" },
    { label: "Discharges (2hr)", value: "1 expected", status: "elevated" },
  ],
  nurseSouthStats: [
    { label: "Occupancy", value: "91%", status: "critical" },
    { label: "Pending Discharges", value: "1", status: "elevated" },
    { label: "Avg Turnaround", value: "105 min", status: "elevated" },
    { label: "Discharges (2hr)", value: "1 expected", status: "elevated" },
  ],
  nurseNorthStats: [
    { label: "Occupancy", value: "88%", status: "elevated" },
    { label: "Dirty Beds", value: "2", status: "elevated" },
    { label: "Avg Turnaround", value: "112 min", status: "elevated" },
    { label: "Discharges (2hr)", value: "0 expected", status: "critical" },
  ],
  coordinatorCards: [
    {
      id: "tc1-coord-1",
      urgency: "urgent",
      title: "Dispatch housekeeping to Rooms 401 and 403, 4 North — both ready for turnover",
      rationale: "These two beds have been dirty for 47 and 52 minutes respectively. Clearing them opens capacity for 2 of the 6 ED boarders.",
      owner: "Bed Coordinator",
      timeLabel: "Act within 20 min",
      triggersBedAnimation: true,
      reasoningItems: [
        { text: "Room 401: patient discharged 12:28am", positive: true },
        { text: "Room 401: Housekeeping not notified", positive: false },
        { text: "Room 403: patient discharged 12:23am", positive: true },
        { text: "Room 403: Housekeeping not notified", positive: false },
      ],
    },
    {
      id: "tc1-coord-2",
      urgency: "urgent",
      title: "Notify 3 South Charge Nurse to initiate Mrs. Garcia discharge — Room 310",
      titleUpdated: "3 South confirmed: transport arranged for Room 310. Discharge initiated. Room ETA 35 min. Mr. Torres assignment on track.",
      rationale: "All discharge criteria met except transport. Clearing this room unlocks 2 ED placements within 90 minutes.",
      owner: "Bed Coordinator → 3 South Nurse",
      timeLabel: "Act within 30 min",
      updatedByNurseConfirm: true,
      reasoningItems: [
        { text: "Labs returned 1:35am", positive: true },
        { text: "Family confirmed present 1:52am", positive: true },
        { text: "Physician sign-off received 1:44am", positive: true },
        { text: "Transport: not yet arranged", positive: false },
      ],
    },
    {
      id: "tc1-coord-3",
      urgency: "soon",
      title: "Tentatively assign Mr. Torres (ED, 4.1hr wait, telemetry) to Room 401, 4 North — pending bed clearance",
      rationale: "Room 401 is the best match for his telemetry requirement. ETA clear: 30–40 minutes based on housekeeping queue.",
      owner: "Bed Coordinator",
      timeLabel: "Confirm within 45 min",
      reasoningItems: [
        { text: "Mr. Torres wait time: 4.1 hrs (longest wait)", positive: true },
        { text: "Telemetry requirement: Room 401 equipped", positive: true },
        { text: "Room 401 ETA: 30–40 min post-housekeeping", positive: true },
      ],
    },
  ],
  nurseSouthCards: [
    {
      id: "tc1-nurse-south-1",
      urgency: "urgent",
      title: "Arrange transport for Mrs. Garcia, Room 310. Confirm discharge initiated.",
      rationale: "Transport is the only outstanding item. Coordinator has flagged this as the hospital's top priority. An incoming ED admit is waiting on this room.",
      owner: "Charge Nurse — 3 South",
      timeLabel: "Act now",
      nurseCard: true,
      reasoningItems: [
        { text: "Labs returned 1:35am", positive: true },
        { text: "Family confirmed present 1:52am", positive: true },
        { text: "Physician sign-off received 1:44am", positive: true },
        { text: "Transport: not yet arranged", positive: false },
      ],
    },
  ],
  nurseNorthCards: [
    {
      id: "tc1-nurse-north-1",
      urgency: "soon",
      title: "Rooms 401 and 403 are in turnover — housekeeping en route. Monitor for completion.",
      rationale: "Both rooms targeted for ED boarder placement once clean. Expected clear time: 30–45 minutes.",
      owner: "Charge Nurse — 4 North",
      timeLabel: "Monitor next 45 min",
      reasoningItems: [
        { text: "Housekeeping dispatched by Coordinator", positive: true },
        { text: "Room 401: estimated clear by 2:50am", positive: true },
        { text: "Room 403: estimated clear by 2:55am", positive: true },
      ],
    },
  ],
  dischargeList: [
    { room: "310", patient: "Mrs. Garcia", floor: "3 South", likelihood: "HIGH", blocker: "Transport not arranged", los: "Day 4" },
    { room: "214", patient: "Mr. Hoffman", floor: "2 East", likelihood: "MEDIUM", blocker: "Awaiting physician sign-off", los: "Day 6" },
    { room: "318", patient: "Mrs. Obi", floor: "3 South", likelihood: "MEDIUM", blocker: "Family not yet present", los: "Day 3" },
    { room: "401", patient: "—", floor: "4 North", likelihood: null, blocker: "Dirty (housekeeping)", los: "—" },
    { room: "403", patient: "—", floor: "4 North", likelihood: null, blocker: "Dirty (housekeeping)", los: "—" },
    { room: "112", patient: "Mr. Nguyen", floor: "1 West", likelihood: "LOW", blocker: "Labs pending", los: "Day 2" },
  ],
  beds: [
    // 1 West
    { room: "101", floor: "1 West", status: "occupied" },
    { room: "102", floor: "1 West", status: "occupied" },
    { room: "103", floor: "1 West", status: "available" },
    { room: "104", floor: "1 West", status: "occupied" },
    { room: "105", floor: "1 West", status: "occupied" },
    { room: "106", floor: "1 West", status: "occupied" },
    { room: "107", floor: "1 West", status: "occupied" },
    { room: "108", floor: "1 West", status: "available" },
    { room: "109", floor: "1 West", status: "occupied" },
    { room: "110", floor: "1 West", status: "occupied" },
    { room: "111", floor: "1 West", status: "occupied" },
    { room: "112", floor: "1 West", status: "occupied", patient: "Mr. Nguyen" },
    // 2 East
    { room: "201", floor: "2 East", status: "occupied" },
    { room: "202", floor: "2 East", status: "occupied" },
    { room: "203", floor: "2 East", status: "occupied" },
    { room: "204", floor: "2 East", status: "occupied" },
    { room: "205", floor: "2 East", status: "occupied" },
    { room: "206", floor: "2 East", status: "occupied" },
    { room: "207", floor: "2 East", status: "available" },
    { room: "208", floor: "2 East", status: "occupied" },
    { room: "209", floor: "2 East", status: "occupied" },
    { room: "210", floor: "2 East", status: "occupied" },
    { room: "211", floor: "2 East", status: "occupied" },
    { room: "214", floor: "2 East", status: "occupied-flagged", patient: "Mr. Hoffman", expectedClear: "~6:00am" },
    // 3 South
    { room: "301", floor: "3 South", status: "occupied" },
    { room: "302", floor: "3 South", status: "occupied" },
    { room: "303", floor: "3 South", status: "occupied" },
    { room: "304", floor: "3 South", status: "occupied" },
    { room: "305", floor: "3 South", status: "occupied" },
    { room: "306", floor: "3 South", status: "occupied" },
    { room: "307", floor: "3 South", status: "occupied" },
    { room: "308", floor: "3 South", status: "occupied" },
    { room: "309", floor: "3 South", status: "occupied" },
    { room: "310", floor: "3 South", status: "occupied-flagged", patient: "Mrs. Garcia", expectedClear: "~2:45am" },
    { room: "311", floor: "3 South", status: "occupied" },
    { room: "318", floor: "3 South", status: "occupied", patient: "Mrs. Obi" },
    // 4 North
    { room: "401", floor: "4 North", status: "dirty" },
    { room: "402", floor: "4 North", status: "occupied" },
    { room: "403", floor: "4 North", status: "dirty" },
    { room: "404", floor: "4 North", status: "occupied" },
    { room: "405", floor: "4 North", status: "occupied" },
    { room: "406", floor: "4 North", status: "occupied" },
    { room: "407", floor: "4 North", status: "occupied" },
    { room: "408", floor: "4 North", status: "occupied" },
    { room: "409", floor: "4 North", status: "occupied" },
    { room: "410", floor: "4 North", status: "occupied" },
    { room: "411", floor: "4 North", status: "ed-boarder", boarder: "Mr. Kim (3.2hr)" },
    { room: "412", floor: "4 North", status: "ed-boarder", boarder: "Mrs. Lee (2.1hr)" },
  ],
};

export const TC2: ScenarioData = {
  id: "TC2",
  name: "The Morning Surge",
  time: "7:45am",
  occupancyPct: 89,
  coordinatorBriefing:
    "As of 7:45am, the house is at 89% occupancy — but you're projected 3 beds short by 11am based on current discharge trajectory. The bottleneck is physician sign-off: 3 of your 5 most likely discharges are waiting on Dr. Hendricks and Dr. Okafor across different floors. You have 90 minutes to act before your first elective surgical admits begin arriving. See action queue.",
  nurseBriefingBySouth:
    "As of 7:45am, 3 South has 2 patients flagged for likely discharge before 10am. Room 305 (Mr. Reyes) is pending Dr. Hendricks' sign-off — this is the primary blocker. The Coordinator has been notified. Room 322 (Mr. Grant) is medium confidence; family is not yet present. Report any changes to the Coordinator immediately.",
  nurseBriefingByNorth:
    "As of 7:45am, 4 North has 2 patients flagged for likely discharge before 10am. Room 412 (Mrs. Johnson) is your highest-confidence discharge — labs back, family present — but the family has just requested a physician consult before leaving. Room 408 (Mr. Patel) is pending Dr. Hendricks' sign-off. The Coordinator has a tentative elective surgical admit assigned to Room 412 for 10:30am. Confirm discharge is on track or flag a blocker.",
  coordinatorStats: [
    { label: "Occupancy", value: "89%", status: "elevated" },
    { label: "ED Boarders", value: "2 (avg 1.4hr)", status: "normal" },
    { label: "Avg Turnaround", value: "98 min", status: "elevated" },
    { label: "Discharges (2hr)", value: "5 expected", status: "good" },
  ],
  nurseSouthStats: [
    { label: "Occupancy", value: "87%", status: "elevated" },
    { label: "Pending Discharges", value: "2", status: "normal" },
    { label: "Avg Turnaround", value: "94 min", status: "elevated" },
    { label: "Discharges (2hr)", value: "2 expected", status: "good" },
  ],
  nurseNorthStats: [
    { label: "Occupancy", value: "87%", status: "elevated" },
    { label: "Pending Discharges", value: "2", status: "normal" },
    { label: "Avg Turnaround", value: "94 min", status: "elevated" },
    { label: "Incoming Admits", value: "1 tentative", status: "elevated" },
  ],
  coordinatorCards: [
    {
      id: "tc2-coord-1",
      urgency: "urgent",
      title: "3 of your top 5 discharges are blocked by physician sign-off — page Dr. Hendricks and Dr. Okafor now",
      titleUpdated:
        "Room 412 discharge delayed — family requesting physician consult. 10:30am admit assignment at risk. Recommend reassigning to Room 418, 3 North (confirmed clear by 9:45am).",
      rationale: "Dr. Hendricks: Rooms 412 and 305. Dr. Okafor: Room 218. Clearing all 3 unlocks 3 beds before 10am — critical for the 9am surgical wave.",
      owner: "Bed Coordinator",
      timeLabel: "Act within 30 min",
      updatedByNurseConfirm: true,
      reasoningItems: [
        { text: "Room 412 (Mrs. Johnson): labs ✓ family ✓ sign-off pending", positive: false },
        { text: "Room 305 (Mr. Reyes): labs ✓ transport ✓ sign-off pending", positive: false },
        { text: "Room 218 (Ms. Nakamura): labs ✓ family ✓ sign-off pending", positive: false },
        { text: "Pattern: same bottleneck across 3 floors", positive: true },
      ],
    },
    {
      id: "tc2-coord-2",
      urgency: "soon",
      title: "Stage Mr. Alvarez (elective surgical, 9:15am) to Overflow Unit B — insufficient bed confidence for original assignment",
      rationale: "Room 412 (original assignment) discharge timeline is uncertain. Overflow Unit B is available and appropriate for his procedure type.",
      owner: "Bed Coordinator",
      timeLabel: "Decide within 20 min",
      reasoningItems: [
        { text: "Mr. Alvarez admit time: 9:15am", positive: true },
        { text: "Original assignment Room 412: discharge confidence LOW given sign-off pending", positive: false },
        { text: "Overflow Unit B: available, procedure-appropriate", positive: true },
      ],
    },
    {
      id: "tc2-coord-3",
      urgency: "informational",
      title: "Post-op placements (3 patients, ETA 1pm): Rooms 214, 318, and 116 are your best matches",
      rationale: "All three are projected clear before noon based on current discharge trajectory.",
      owner: "Bed Coordinator",
      timeLabel: "Confirm by 11am",
      reasoningItems: [
        { text: "Room 214 (Mr. Hoffman): discharge HIGH confidence, ETA 10:30am", positive: true },
        { text: "Room 318 (Mrs. Obi): discharge HIGH confidence, ETA 11am", positive: true },
        { text: "Room 116 (Mr. Grant): discharge MEDIUM confidence, ETA 11:30am", positive: true },
      ],
    },
  ],
  nurseSouthCards: [
    {
      id: "tc2-nurse-south-1",
      urgency: "urgent",
      title: "Confirm Mr. Reyes discharge on track — Room 305. Pending Dr. Hendricks' sign-off.",
      rationale: "Coordinator has paged Dr. Hendricks. Confirm sign-off received when it comes through and initiate discharge process.",
      owner: "Charge Nurse — 3 South",
      timeLabel: "Monitor next 30 min",
      nurseCard: true,
      reasoningItems: [
        { text: "Labs returned: 6:45am", positive: true },
        { text: "Transport arranged", positive: true },
        { text: "Physician sign-off: pending Dr. Hendricks", positive: false },
      ],
    },
  ],
  nurseNorthCards: [
    {
      id: "tc2-nurse-north-1",
      urgency: "urgent",
      title: "Confirm Mrs. Johnson discharge on track — Room 412. Coordinator's 10:30am admit depends on this room.",
      rationale: "Labs back, family present, transport not yet arranged. Physician sign-off is the only remaining item. Flag any blocker immediately.",
      owner: "Charge Nurse — 4 North",
      timeLabel: "Confirm within 15 min",
      nurseCard: true,
      reasoningItems: [
        { text: "Labs returned: 7:02am", positive: true },
        { text: "Family present since 7:30am", positive: true },
        { text: "Transport: not yet arranged", positive: false },
        { text: "Physician sign-off: pending Dr. Hendricks", positive: false },
      ],
    },
  ],
  dischargeList: [
    { room: "412", patient: "Mrs. Johnson", floor: "4 North", likelihood: "HIGH", blocker: "Physician sign-off (Dr. Hendricks)", los: "Day 5", patternHighlight: true },
    { room: "305", patient: "Mr. Reyes", floor: "3 South", likelihood: "HIGH", blocker: "Physician sign-off (Dr. Hendricks)", los: "Day 3", patternHighlight: true },
    { room: "218", patient: "Ms. Nakamura", floor: "2 East", likelihood: "HIGH", blocker: "Physician sign-off (Dr. Okafor)", los: "Day 4", patternHighlight: true },
    { room: "114", patient: "Mrs. Flores", floor: "1 West", likelihood: "MEDIUM", blocker: "Transport not arranged", los: "Day 6" },
    { room: "322", patient: "Mr. Grant", floor: "3 South", likelihood: "MEDIUM", blocker: "Family not present", los: "Day 2" },
    { room: "408", patient: "Mr. Patel", floor: "4 North", likelihood: "LOW", blocker: "Labs pending", los: "Day 3" },
    { room: "215", patient: "Ms. Wong", floor: "2 East", likelihood: "LOW", blocker: "Awaiting PT clearance", los: "Day 7" },
  ],
  beds: [
    // 1 West
    { room: "101", floor: "1 West", status: "occupied" },
    { room: "102", floor: "1 West", status: "occupied" },
    { room: "103", floor: "1 West", status: "available" },
    { room: "104", floor: "1 West", status: "occupied" },
    { room: "105", floor: "1 West", status: "occupied" },
    { room: "106", floor: "1 West", status: "occupied" },
    { room: "107", floor: "1 West", status: "occupied" },
    { room: "108", floor: "1 West", status: "occupied" },
    { room: "109", floor: "1 West", status: "available" },
    { room: "110", floor: "1 West", status: "occupied" },
    { room: "114", floor: "1 West", status: "occupied-flagged", patient: "Mrs. Flores", expectedClear: "~10:00am" },
    { room: "116", floor: "1 West", status: "occupied-flagged", patient: "Mr. Grant", expectedClear: "~11:30am" },
    // 2 East
    { room: "201", floor: "2 East", status: "occupied" },
    { room: "202", floor: "2 East", status: "occupied" },
    { room: "203", floor: "2 East", status: "occupied" },
    { room: "204", floor: "2 East", status: "occupied" },
    { room: "205", floor: "2 East", status: "occupied" },
    { room: "206", floor: "2 East", status: "occupied" },
    { room: "207", floor: "2 East", status: "available" },
    { room: "215", floor: "2 East", status: "occupied", patient: "Ms. Wong" },
    { room: "218", floor: "2 East", status: "occupied-flagged", patient: "Ms. Nakamura", expectedClear: "~9:45am" },
    // 3 South
    { room: "301", floor: "3 South", status: "occupied" },
    { room: "302", floor: "3 South", status: "occupied" },
    { room: "303", floor: "3 South", status: "occupied" },
    { room: "304", floor: "3 South", status: "occupied" },
    { room: "305", floor: "3 South", status: "occupied-flagged", patient: "Mr. Reyes", expectedClear: "~9:30am" },
    { room: "306", floor: "3 South", status: "occupied" },
    { room: "307", floor: "3 South", status: "occupied" },
    { room: "308", floor: "3 South", status: "occupied" },
    { room: "309", floor: "3 South", status: "occupied" },
    { room: "322", floor: "3 South", status: "occupied", patient: "Mr. Grant" },
    // 4 North
    { room: "401", floor: "4 North", status: "occupied" },
    { room: "402", floor: "4 North", status: "occupied" },
    { room: "403", floor: "4 North", status: "occupied" },
    { room: "404", floor: "4 North", status: "occupied" },
    { room: "405", floor: "4 North", status: "occupied" },
    { room: "406", floor: "4 North", status: "occupied" },
    { room: "407", floor: "4 North", status: "available" },
    { room: "408", floor: "4 North", status: "occupied", patient: "Mr. Patel" },
    { room: "409", floor: "4 North", status: "occupied" },
    { room: "410", floor: "4 North", status: "occupied" },
    { room: "411", floor: "4 North", status: "ed-boarder", boarder: "Mr. Walsh (1.6hr)" },
    { room: "412", floor: "4 North", status: "occupied-flagged", patient: "Mrs. Johnson", expectedClear: "~10:00am" },
  ],
  chatPrefill: "If 412 doesn't clear by 10:30, what are my options for the surgical admit?",
};

export const SCENARIOS: Record<Scenario, ScenarioData> = { TC1, TC2 };
