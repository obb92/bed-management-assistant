
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Scenario, Persona, CardStatus } from "@/lib/data";

export type Screen = "login" | "home" | "discharges" | "beds" | "chat";

interface AppState {
  screen: Screen;
  scenario: Scenario;
  persona: Persona;
  cardStatuses: Record<string, CardStatus>;
  nurseConfirmed: boolean;
  nurseFlagText: string;
  nurseFlagged: boolean;
  housekeepingDispatched: boolean;
  room310Confirmed: boolean;
  room310Status: "flagged" | "green" | "red" | null;
  demoMode: boolean;
  demoStep: number;
  showScenarioModal: boolean;
}

interface AppContextType extends AppState {
  setScreen: (s: Screen) => void;
  setScenario: (s: Scenario) => void;
  setPersona: (p: Persona) => void;
  markCardDone: (id: string) => void;
  markCardSnoozed: (id: string) => void;
  markCardDismissed: (id: string) => void;
  nurseConfirm: () => void;
  nurseFlag: (text: string) => void;
  setDemoMode: (v: boolean) => void;
  setDemoStep: (v: number) => void;
  setShowScenarioModal: (v: boolean) => void;
  exitDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    screen: "login",
    scenario: "TC1",
    persona: "coordinator",
    cardStatuses: {},
    nurseConfirmed: false,
    nurseFlagText: "",
    nurseFlagged: false,
    housekeepingDispatched: false,
    room310Confirmed: false,
    room310Status: null,
    demoMode: false,
    demoStep: 1,
    showScenarioModal: false,
  });

  const setScreen = useCallback((screen: Screen) => setState((s) => ({ ...s, screen })), []);

  const setScenario = useCallback((scenario: Scenario) => {
    setState((s) => ({
      ...s,
      scenario,
      cardStatuses: {},
      nurseConfirmed: false,
      nurseFlagText: "",
      nurseFlagged: false,
      housekeepingDispatched: false,
      room310Confirmed: false,
      room310Status: null,
      showScenarioModal: false,
      demoStep: 1,
    }));
  }, []);

  const setPersona = useCallback((persona: Persona) => setState((s) => ({ ...s, persona })), []);

  const markCardDone = useCallback((id: string) => {
    setState((s) => {
      const newStatuses = { ...s.cardStatuses, [id]: "done" as CardStatus };
      const newState: AppState = { ...s, cardStatuses: newStatuses };
      if (id === "tc1-coord-1") {
        newState.housekeepingDispatched = true;
      }
      return newState;
    });
  }, []);

  const markCardSnoozed = useCallback((id: string) => {
    setState((s) => ({ ...s, cardStatuses: { ...s.cardStatuses, [id]: "snoozed" } }));
  }, []);

  const markCardDismissed = useCallback((id: string) => {
    setState((s) => ({ ...s, cardStatuses: { ...s.cardStatuses, [id]: "dismissed" } }));
  }, []);

  const nurseConfirm = useCallback(() => {
    setState((s) => ({
      ...s,
      nurseConfirmed: true,
      room310Confirmed: true,
      room310Status: "green",
    }));
    setTimeout(() => {
      setState((s) => ({ ...s, room310Status: "red" }));
    }, 2000);
  }, []);

  const nurseFlag = useCallback((text: string) => {
    setState((s) => ({ ...s, nurseFlagged: true, nurseFlagText: text }));
  }, []);

  const setDemoMode = useCallback((v: boolean) => setState((s) => ({ ...s, demoMode: v })), []);
  const setDemoStep = useCallback((v: number) => setState((s) => ({ ...s, demoStep: v })), []);
  const setShowScenarioModal = useCallback((v: boolean) => setState((s) => ({ ...s, showScenarioModal: v })), []);

  const exitDemo = useCallback(() => {
    setState((s) => ({ ...s, demoMode: false, demoStep: 1, showScenarioModal: false }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setScreen,
        setScenario,
        setPersona,
        markCardDone,
        markCardSnoozed,
        markCardDismissed,
        nurseConfirm,
        nurseFlag,
        setDemoMode,
        setDemoStep,
        setShowScenarioModal,
        exitDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
