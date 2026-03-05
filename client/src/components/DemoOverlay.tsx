
import { useEffect, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ArrowDown, ArrowUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

interface DemoStep {
  title: string;
  body: string;
  targetTestId?: string;
  navigateTo?: string;
  pointerDir?: "down" | "up" | "left";
}

const TC1_STEPS: DemoStep[] = [
  {
    title: "AI Situation Briefing",
    body: "It's 2:15am. The house is at 94% occupancy with 6 ED boarders — 3 waiting over 4 hours. The Bed Coordinator opens CareFlow and gets an instant plain-English briefing. No dashboard. No analyst needed.",
    targetTestId: "ai-briefing",
    navigateTo: "home",
    pointerDir: "down",
  },
  {
    title: "Priority Action Queue",
    body: "The AI has surfaced exactly 3 priority actions — ranked by urgency and impact. Deliberately capped at 3. This is a design choice: no alert fatigue. Each card tells you what to do, who owns it, and why.",
    targetTestId: "action-queue",
    navigateTo: "home",
    pointerDir: "down",
  },
  {
    title: "AI Reasoning",
    body: "Card 2 recommends initiating Mrs. Garcia's discharge on 3 South. The AI synthesized 4 data signals to reach this — labs back, family present, physician sign-off received, transport not yet arranged. Click the card to see the reasoning.",
    targetTestId: "action-card-tc1-coord-2",
    navigateTo: "home",
    pointerDir: "left",
  },
  {
    title: "The Charge Nurse View",
    body: "The same AI — completely different view. The Charge Nurse on 3 South only sees her floor, with one specific task waiting for her. Switch to her perspective using the persona switcher.",
    targetTestId: "persona-switcher",
    navigateTo: "home",
    pointerDir: "up",
  },
  {
    title: "Last-Mile Execution",
    body: "The Charge Nurse has one task: arrange transport for Mrs. Garcia and confirm discharge. This is the execution the Coordinator can't do from the hospital-wide view. She confirms it here.",
    targetTestId: "action-card-tc1-nurse-south-1",
    navigateTo: "home",
    pointerDir: "left",
  },
  {
    title: "The Feedback Loop",
    body: "Card 2 has updated automatically. The Coordinator now knows transport is arranged and Mr. Torres's assignment is on track — no phone call, no manual check. The AI closed the loop between Coordinator and Nurse.",
    targetTestId: "action-card-tc1-coord-2",
    navigateTo: "home",
    pointerDir: "left",
  },
];

const TC2_STEPS: DemoStep[] = [
  {
    title: "Predictive Briefing",
    body: "It's 7:45am. 8 elective surgical admits arrive in 90 minutes. The AI has already projected a 3-bed shortfall by 11am — not because the hospital is full now, but because discharge bottlenecks will compound. Navigate to the Discharge List to see why.",
    targetTestId: "nav-discharges",
    navigateTo: "home",
    pointerDir: "left",
  },
  {
    title: "Pattern Detection",
    body: "12 patients are flagged as potential discharges today. Three of the top 5 share the exact same blocker: physician sign-off. Not 3 separate problems — 1 systemic bottleneck. The AI has already identified it.",
    targetTestId: "discharge-table",
    navigateTo: "discharges",
    pointerDir: "down",
  },
  {
    title: "System-Level Action",
    body: "Back on Home, the AI has turned the pattern into a single action card: page Dr. Hendricks and Dr. Okafor directly. Not room-by-room. One intervention that unlocks 3 beds before 10am.",
    targetTestId: "action-card-tc2-coord-1",
    navigateTo: "home",
    pointerDir: "left",
  },
  {
    title: "The Charge Nurse View",
    body: "Meanwhile, the Charge Nurse on 4 North has her own situation. Mrs. Johnson in Room 412 is a high-confidence discharge — but something has just come up.",
    targetTestId: "persona-switcher",
    navigateTo: "home",
    pointerDir: "up",
  },
  {
    title: "Flagging a Blocker",
    body: "The Nurse's task is to confirm Mrs. Johnson's discharge. But the family has just requested a physician consult. She flags it — so the Coordinator can reroute the incoming admit before it becomes a crisis.",
    targetTestId: "action-card-tc2-nurse-north-1",
    navigateTo: "home",
    pointerDir: "left",
  },
  {
    title: "Live AI Reasoning",
    body: "The Coordinator's card has already updated with a rerouting recommendation. Now ask the AI directly — it will answer in context, referencing actual room numbers and timing from the current hospital state.",
    targetTestId: "nav-chat",
    navigateTo: "home",
    pointerDir: "left",
  },
];

function useHighlightRect(testId: string | undefined) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!testId) {
      setRect(null);
      return;
    }
    const update = () => {
      const el = document.querySelector(`[data-testid="${testId}"]`);
      if (el) setRect(el.getBoundingClientRect());
      else setRect(null);
    };
    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [testId]);

  return rect;
}

function PointerArrow({ rect, dir }: { rect: DOMRect; dir: "down" | "up" | "left" }) {
  let style: React.CSSProperties = {};
  let Icon = ArrowDown;

  if (dir === "down") {
    style = {
      top: rect.top - 44,
      left: rect.left + rect.width / 2 - 12,
    };
    Icon = ArrowDown;
  } else if (dir === "up") {
    style = {
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2 - 12,
    };
    Icon = ArrowUp;
  } else if (dir === "left") {
    style = {
      top: rect.top + rect.height / 2 - 12,
      left: rect.right + 10,
    };
    Icon = ArrowLeft;
  }

  return (
    <div
      className="fixed z-[162] pointer-events-none animate-bounce"
      style={style}
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#00d4c8] shadow-lg shadow-[#00d4c8]/40">
        <Icon className="w-4 h-4 text-[#0a0f1e]" />
      </div>
    </div>
  );
}

export function ScenarioModal() {
  const { showScenarioModal, setShowScenarioModal, setScenario, setDemoMode, setDemoStep, setScreen } = useApp();
  if (!showScenarioModal) return null;

  const select = (sc: "TC1" | "TC2") => {
    setScenario(sc);
    setDemoMode(true);
    setDemoStep(1);
    setScreen("home");
    setShowScenarioModal(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#0f1629] border border-white/12 rounded-xl shadow-2xl w-full max-w-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-xl">Demo Mode</h2>
            <p className="text-white/40 text-sm mt-0.5">Choose a scenario to begin the guided walkthrough</p>
          </div>
          <button onClick={() => setShowScenarioModal(false)} className="text-white/30">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => select("TC1")}
            data-testid="scenario-tc1"
            className="text-left p-5 rounded-xl bg-white/4 border border-white/10 space-y-3 transition-all hover:border-[#00d4c8]/50 hover:bg-[#00d4c8]/5"
          >
            <div className="text-2xl">🌙</div>
            <div>
              <p className="text-white font-bold text-base">The 2am Crunch</p>
              <p className="text-[#00d4c8]/70 text-xs font-medium mt-0.5">ED Boarding Crisis · ~5 min</p>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Show reactive AI: clearing an ED backlog in real time
            </p>
          </button>

          <button
            onClick={() => select("TC2")}
            data-testid="scenario-tc2"
            className="text-left p-5 rounded-xl bg-white/4 border border-white/10 space-y-3 transition-all hover:border-[#00d4c8]/50 hover:bg-[#00d4c8]/5"
          >
            <div className="text-2xl">☀️</div>
            <div>
              <p className="text-white font-bold text-base">The Morning Surge</p>
              <p className="text-[#00d4c8]/70 text-xs font-medium mt-0.5">Elective Admissions · ~5 min</p>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Show predictive AI: preventing a bed crisis before it hits
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export function DemoOverlay() {
  const { demoMode, demoStep, setDemoStep, exitDemo, scenario, setScreen } = useApp();
  const steps = scenario === "TC1" ? TC1_STEPS : TC2_STEPS;
  const step = steps[demoStep - 1];
  const totalSteps = steps.length;
  const highlightRect = useHighlightRect(step?.targetTestId);

  useEffect(() => {
    if (step?.navigateTo) {
      setScreen(step.navigateTo as any);
    }
  }, [demoStep, scenario]);

  if (!demoMode || !step) return null;

  const progress = (demoStep / totalSteps) * 100;
  const scenarioName = scenario === "TC1" ? "The 2am Crunch" : "The Morning Surge";

  const next = () => {
    if (demoStep < totalSteps) setDemoStep(demoStep + 1);
    else exitDemo();
  };

  const prev = () => {
    if (demoStep > 1) setDemoStep(demoStep - 1);
  };

  return (
    <>
      {/* Top banner */}
      <div className="fixed top-0 left-0 right-0 z-10 h-9 bg-[#0a0f1e] border-b border-white/10 flex items-center gap-4 px-4">
        <div className="w-2 h-2 rounded-full bg-[#00d4c8] animate-pulse shrink-0" />
        <span className="text-white/70 text-xs font-medium shrink-0">Demo: {scenarioName}</span>
        <span className="text-white/40 text-xs shrink-0">Step {demoStep} of {totalSteps}</span>
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00d4c8] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={exitDemo}
          data-testid="button-exit-demo"
          className="text-white/40 text-xs font-medium shrink-0"
        >
          Exit Demo
        </button>
      </div>

      {/* Highlight ring */}
      {highlightRect && (
        <div
          className="fixed z-[140] pointer-events-none"
          style={{
            top: highlightRect.top - 4,
            left: highlightRect.left - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8,
          }}
        >
          <div className="w-full h-full rounded-md border-2 border-[#00d4c8] animate-demo-ring" />
        </div>
      )}

      {/* Pointer arrow */}
      {highlightRect && step.pointerDir && (
        <PointerArrow rect={highlightRect} dir={step.pointerDir} />
      )}

      {/* Callout card */}
      <div
        className="fixed z-[160] w-[320px] bg-[#0f1629] border border-white/15 rounded-xl shadow-2xl p-5"
        style={{ bottom: "2rem", right: "2rem" }}
        data-testid="demo-callout"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#00d4c8] text-[10px] font-bold uppercase tracking-widest">
            Step {demoStep} of {totalSteps}
          </span>
          <button onClick={exitDemo} className="text-white/20">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3 className="text-white font-bold text-sm mb-2">{step.title}</h3>
        <p className="text-white/60 text-xs leading-relaxed mb-5">{step.body}</p>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={prev}
            disabled={demoStep === 1}
            className="text-white/50 border-white/15 bg-transparent h-7 px-2"
          >
            <ChevronLeft className="w-3 h-3" />
            Back
          </Button>
          <Button
            size="sm"
            onClick={next}
            className="flex-1 bg-[#00d4c8] text-[#0a0f1e] font-bold h-7 text-xs"
            data-testid="button-demo-next"
          >
            {demoStep === totalSteps ? "End Demo" : "Next"}
            {demoStep < totalSteps && <ChevronRight className="w-3 h-3 ml-1" />}
          </Button>
        </div>
      </div>
    </>
  );
}
