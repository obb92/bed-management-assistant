
import { Home, LogOut, BedDouble, MessageSquare, ClipboardList, Activity } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useApp, type Screen } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { id: "home" as Screen, label: "Home", icon: Home },
  { id: "discharges" as Screen, label: "Discharges", icon: ClipboardList },
  { id: "beds" as Screen, label: "Beds", icon: BedDouble },
  { id: "chat" as Screen, label: "Ask AI", icon: MessageSquare },
];

export function AppSidebar() {
  const { screen, setScreen, setShowScenarioModal } = useApp();

  return (
    <Sidebar className="border-r-0" data-testid="sidebar">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#00d4c8]/20">
            <Activity className="w-4 h-4 text-[#00d4c8]" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">CareFlow</span>
        </div>
        <p className="text-[#00d4c8]/60 text-[11px] font-medium tracking-wide ml-0.5">
          Powered by Qualified Health
        </p>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = screen === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setScreen(item.id)}
                      isActive={isActive}
                      data-testid={`nav-${item.id}`}
                      className="relative text-sidebar-foreground/70 data-[active=true]:text-[#00d4c8] data-[active=true]:bg-[#00d4c8]/10 rounded-md"
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#00d4c8] rounded-r-full" />
                      )}
                      <item.icon className="shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4 space-y-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowScenarioModal(true)}
          data-testid="button-demo-mode"
          className="w-full border-[#00d4c8]/40 text-[#00d4c8] bg-transparent text-xs font-semibold tracking-wide"
        >
          Demo Mode
        </Button>

        <div className="rounded-md bg-white/5 border border-white/10 px-3 py-2.5 flex items-center justify-center">
          <span className="text-white/50 text-[11px] font-medium text-center leading-tight">
            Memorial General Hospital
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
