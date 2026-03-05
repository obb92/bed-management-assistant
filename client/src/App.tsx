
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/TopBar";
import { DemoOverlay, ScenarioModal } from "@/components/DemoOverlay";
import { AppProvider, useApp } from "@/context/AppContext";
import { LoginPage } from "@/pages/LoginPage";
import { HomePage } from "@/pages/HomePage";
import { DischargePage } from "@/pages/DischargePage";
import { BedBoardPage } from "@/pages/BedBoardPage";
import { ChatPage } from "@/pages/ChatPage";

function MainApp() {
  const { screen, demoMode } = useApp();

  if (screen === "login") {
    return <LoginPage />;
  }

  const style = {
    "--sidebar-width": "220px",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <div className={`flex h-screen w-full ${demoMode ? "pt-9" : ""}`}>
      <SidebarProvider style={style as React.CSSProperties} defaultOpen>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-hidden">
              {screen === "home" && <HomePage />}
              {screen === "discharges" && <DischargePage />}
              {screen === "beds" && <BedBoardPage />}
              {screen === "chat" && <ChatPage />}
            </main>
          </div>
        </div>
      </SidebarProvider>
      <DemoOverlay />
      <ScenarioModal />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <MainApp />
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
