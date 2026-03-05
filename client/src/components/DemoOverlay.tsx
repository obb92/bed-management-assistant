
import { useEffect, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { SCENARIOS } from "@/lib/data";

interface DemoStep {
  title: string;
  context: string;
  action: string;
  targetTestId?: string;
  navigateTo?: string;
}

const TC1_STEPS: DemoStep[] = [
  {
    title: "AI Situation Briefing",
    context: "It's 2:15am. 94% occupancy, 6 ED boarders. The AI has already written a plain-English briefing — no dashboard, no analyst.",
    action: "Read the briefing aloud. Then point to the stats bar.",
    targetTestId: "ai-briefing",
    navigateTo: "home",
  },
  {
    title: "Action Queue",
    context: "The AI surfaced exactly 3 priority actions — deliberately capped. No alert fatigue.",
    action: "Walk through all 3 cards briefly. Don't click yet.",
    targetTestId: "action-queue",
    navigateTo: "home",
  },
  {
    title: "Card 2 — Reasoning Drawer",
    context: "Card 2 synthesized 4 data signals to find the one gap — transport.",
    action: "Click Card 2 to expand the reasoning drawer. Point out: labs ✓, family ✓, transport ✗.",
    targetTestId: "action-card-tc1-coord-2",
    navigateTo: "home",
  },
  {
    title: "Persona Switcher",
    context: "Same AI, same data — completely different view for the Charge Nurse.",
    action: 'Click the persona switcher. Select "Charge Nurse — 3 South".',
    targetTestId: "persona-switcher",
    navigateTo: "home",
  },
  {
    title: "Nurse Card — One Task",
    context: "One task. Last-mile execution the Coordinator can't do from the hospital-wide view.",
    action: "Click Confirm. Then switch back to Bed Coordinator.",
    targetTestId: "action-card-tc1-nurse-south-1",
    navigateTo: "home",
  },
  {
    title: "The Feedback Loop",
    context: "Card 2 has updated automatically — no phone call, no manual check.",
    action: "Point to the updated card. This is the feedback loop. Pause for questions.",
    targetTestId: "action-card-tc1-coord-2",
    navigateTo: "home",
  },
];

const TC2_STEPS: DemoStep[] = [
  {
    title: "AI Situation Briefing",
    context: "7:45am. The AI has already projected a 3-bed shortfall by 11am — before it happens.",
    action: "Read the briefing. Emphasize '3 beds short by 11am.' Then navigate to Discharges.",
    targetTestId: "ai-briefing",
    navigateTo: "home",
  },
  {
    title: "Pattern Detection",
    context: "Three of the top 5 likely discharges share the same blocker. Not 3 problems — 1 systemic bottleneck.",
    action: "Point to the amber-highlighted rows. Ask: 'How would you spot this in Epic?' Then go back to Home.",
    targetTestId: "discharge-table",
    navigateTo: "discharges",
  },
  {
    title: "Card 1 — System Action",
    context: "The AI turned the pattern into one action card — page two doctors. System-level, not room-level.",
    action: "Read Card 1 aloud. Hit Done. Then walk through Card 2.",
    targetTestId: "action-card-tc2-coord-1",
    navigateTo: "home",
  },
  {
    title: "Persona Switcher",
    context: "Meanwhile, the 4 North Charge Nurse has her own situation.",
    action: 'Switch to "Charge Nurse — 4 North".',
    targetTestId: "persona-switcher",
    navigateTo: "home",
  },
  {
    title: "Flag Blocker",
    context: "She needs to flag a problem before it becomes a crisis for the Coordinator.",
    action: "Click Flag Blocker. Submit the pre-filled note. Switch back to Coordinator.",
    targetTestId: "action-card-tc2-nurse-north-1",
    navigateTo: "home",
  },
  {
    title: "Ask AI Directly",
    context: "The card updated — but let's go further. Ask the AI directly.",
    action: "Click Ask AI. Send the pre-filled question. Watch it reason in context.",
    targetTestId: "chat-input",
    navigateTo: "chat",
  },
];

function useHighlight(testId: string | undefined) {
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
  const { demoMode, demoStep, setDemoStep, exitDemo, scenario, setScreen, setPersona } = useApp();
  const steps = scenario === "TC1" ? TC1_STEPS : TC2_STEPS;
  const step = steps[demoStep - 1];
  const totalSteps = steps.length;
  const highlightRect = useHighlight(step?.targetTestId);

  useEffect(() => {
    if (step?.navigateTo) {
      setScreen(step.navigateTo as any);
    }
  }, [demoStep, scenario]);

  if (!demoMode || !step) return null;

  const progress = (demoStep / totalSteps) * 100;

  const next = () => {
    if (demoStep < totalSteps) setDemoStep(demoStep + 1);
    else exitDemo();
  };

  const prev = () => {
    if (demoStep > 1) setDemoStep(demoStep - 1);
  };

  const scenarioName = scenario === "TC1" ? "The 2am Crunch" : "The Morning Surge";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[150] h-9 bg-[#0a0f1e] border-b border-white/10 flex items-center gap-4 px-4">
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

      <div
        className="fixed z-[160] w-80 bg-[#0f1629] border border-white/15 rounded-xl shadow-2xl p-5"
        style={{
          bottom: "2rem",
          right: "2rem",
        }}
        data-testid="demo-callout"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#00d4c8] text-[10px] font-bold uppercase tracking-widest">Step {demoStep} of {totalSteps}</span>
        </div>
        <h3 className="text-white font-bold text-sm mb-1.5">{step.title}</h3>
        <p className="text-white/60 text-xs leading-relaxed mb-3">{step.context}</p>
        <p className="text-[#00d4c8] text-xs font-semibold leading-relaxed border-t border-white/8 pt-3 mb-4">
          {step.action}
        </p>
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
            {demoStep === totalSteps ? "Finish" : "Next"}
            {demoStep < totalSteps && <ChevronRight className="w-3 h-3 ml-1" />}
          </Button>
          <button onClick={exitDemo} className="text-white/20 text-xs">
            Skip
          </button>
        </div>
      </div>
    </>
  );
}
