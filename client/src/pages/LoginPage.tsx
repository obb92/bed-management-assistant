
import { useState } from "react";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";

export function LoginPage() {
  const { setScreen, setShowScenarioModal } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    setScreen("home");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#00d4c8]/20 border border-[#00d4c8]/30">
              <Activity className="w-6 h-6 text-[#00d4c8]" />
            </div>
            <span className="text-white font-bold text-3xl tracking-tight">CareFlow</span>
          </div>
          <p className="text-white/40 text-sm font-medium">Memorial General Hospital</p>
        </div>

        <div className="bg-white/4 border border-white/10 rounded-xl p-6 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block">Username</label>
              <Input
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                data-testid="input-username"
                className="bg-white/6 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-[#00d4c8]/50"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block">Password</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                data-testid="input-password"
                className="bg-white/6 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-[#00d4c8]/50"
              />
            </div>
          </div>

          <Button
            className="w-full bg-[#00d4c8] text-[#0a0f1e] font-bold mt-2"
            onClick={handleLogin}
            data-testid="button-signin"
          >
            Sign In
          </Button>
        </div>

        <div className="text-center">
          <button
            onClick={() => { setShowScenarioModal(true); setScreen("home"); }}
            data-testid="link-demo-mode"
            className="text-[#00d4c8]/60 text-xs font-medium underline-offset-2 hover:text-[#00d4c8] transition-colors"
          >
            Demo Mode
          </button>
        </div>

        <div className="text-center">
          <p className="text-white/20 text-[10px]">Powered by Qualified Health</p>
        </div>
      </div>
    </div>
  );
}
