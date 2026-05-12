import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import EntryScreen from "@/components/StrategicBriefing/EntryScreen";
import StudioProfile from "@/components/BranchC/StudioProfile";
import RiskScan from "@/components/BranchC/RiskScan";
import type { BudgetBreakdown } from "@/components/BranchC/RiskScan";
import ROIModel from "@/components/BranchC/ROIModel";
import ExecutiveSummary from "@/components/BranchC/ExecutiveSummary";

// Screen 0 = Entry, 1 = StudioProfile, 2 = RiskScan, 3 = ROIModel, 4 = ExecutiveSummary
const SIDEBAR_ITEMS = [
  { id: 0, label: "Select a path" },
  { id: 1, label: "Studio Profile" },
  { id: 2, label: "Risk Scan" },
  { id: 3, label: "ROI Model" },
  { id: 4, label: "Executive Summary" },
];

const DEFAULT_BREAKDOWN: BudgetBreakdown = {
  artPct: 35,
  engPct: 25,
  qaPct: 12,
  reworkCycles: "4",
  deliveryTime: "12",
  aiUsage: "experimental",
};

export default function PipelineLabPage() {
  // Always start on the Entry screen (may be overridden by ?screen= param)
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const screen = params.get("screen");
    if (screen === "studioProfile") {
      setCurrentScreen(1);
    }
  }, []);

  // Studio Profile state
  const [studioScale, setStudioScale] = useState("");
  const [outputType, setOutputType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [outsourcePct, setOutsourcePct] = useState("0.20");
  const [rdBudget, setRdBudget] = useState("none");

  // Risk Scan state
  const [breakdown, setBreakdown] = useState<BudgetBreakdown>(DEFAULT_BREAKDOWN);

  const goTo = (n: number) => setCurrentScreen(n);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 flex min-h-[calc(100vh-80px)]">
        {/* ── Sidebar ── */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border/30 bg-card/30 px-5 py-10">
          <div className="mb-8">
            <p className="text-[9px] tracking-[0.2em] uppercase font-body font-semibold text-primary mb-1">
              Strategic Briefing
            </p>
            <p className="text-xs font-body text-white/40">Branch C — Executive Summary</p>
          </div>

          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const done = item.id > 0 && item.id < currentScreen;
              const active = item.id === currentScreen;
              const clickable = done || (item.id === 0 && currentScreen > 0);
              return (
                <button
                  key={item.id}
                  onClick={() => clickable ? goTo(item.id) : undefined}
                  disabled={!active && !clickable}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-body transition-all ${
                    active
                      ? "font-semibold text-white"
                      : clickable
                      ? "text-white/60 hover:text-white cursor-pointer"
                      : "text-white/25 cursor-default"
                  }`}
                  style={active ? {
                    background:
                      "linear-gradient(hsl(0 0% 8%), hsl(0 0% 8%)) padding-box, " +
                      "linear-gradient(to right, #a78bfa, #c4b5fd, #e9d5ff) border-box",
                    border: "1px solid transparent",
                    borderRadius: "12px",
                    color: "#e9d5ff",
                  } : undefined}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                    style={
                      done
                        ? { background: "#22c55e20", color: "#22c55e", border: "1px solid #22c55e40" }
                        : active
                        ? { background: "linear-gradient(135deg, #a78bfa, #e9d5ff)", color: "#0a0a0a" }
                        : { background: "transparent", color: "#555", border: "1px solid #333" }
                    }
                  >
                    {done ? "✓" : item.id === 0 ? "·" : item.id}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-border/20">
            <a
              href="/"
              className="flex items-center gap-1.5 text-xs font-body text-white/40 hover:text-white transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Home
            </a>
            <p className="text-[10px] font-body text-white/20 leading-relaxed mt-3">
              Demo session. No data stored.
            </p>
          </div>
        </aside>

        {/* ── Mobile stepper (hidden on entry screen) ── */}
        {currentScreen > 0 && (
          <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-background/95 backdrop-blur border-b border-border/20 px-4 py-3 flex items-center gap-2 overflow-x-auto">
            {SIDEBAR_ITEMS.filter((i) => i.id > 0).map((item, idx, arr) => {
              const done = item.id < currentScreen;
              const active = item.id === currentScreen;
              return (
                <div key={item.id} className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                    style={
                      done
                        ? { background: "#22c55e20", color: "#22c55e", border: "1px solid #22c55e40" }
                        : active
                        ? { background: "linear-gradient(135deg, #a78bfa, #e9d5ff)", color: "#0a0a0a" }
                        : { background: "transparent", color: "#555", border: "1px solid #333" }
                    }
                  >
                    {done ? "✓" : item.id}
                  </span>
                  <span className={`text-[10px] font-body whitespace-nowrap ${active ? "text-white font-semibold" : done ? "text-white/50" : "text-white/25"}`}>
                    {item.label}
                  </span>
                  {idx < arr.length - 1 && (
                    <span className="text-white/20 text-[10px] ml-1">›</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Main content ── */}
        <section className="flex-1 px-6 md:px-12 py-10 md:py-12 md:mt-0 mt-10 overflow-y-auto">
          {currentScreen === 0 && (
            <EntryScreen onNext={() => goTo(1)} />
          )}
          {currentScreen === 1 && (
            <StudioProfile
              studioScale={studioScale}
              outputType={outputType}
              budgetRange={budgetRange}
              outsourcePct={outsourcePct}
              rdBudget={rdBudget}
              onStudioScaleChange={setStudioScale}
              onOutputTypeChange={setOutputType}
              onBudgetRangeChange={setBudgetRange}
              onOutsourcePctChange={setOutsourcePct}
              onRdBudgetChange={setRdBudget}
              onNext={() => goTo(2)}
            />
          )}
          {currentScreen === 2 && (
            <RiskScan
              studioScale={studioScale}
              outputType={outputType}
              breakdown={breakdown}
              onBreakdownChange={setBreakdown}
              onNext={() => goTo(3)}
              onBack={() => goTo(1)}
            />
          )}
          {currentScreen === 3 && (
            <ROIModel
              studioScale={studioScale}
              outputType={outputType}
              budgetRange={budgetRange}
              outsourcePct={outsourcePct}
              rdBudget={rdBudget}
              breakdown={breakdown}
              onNext={() => goTo(4)}
              onBack={() => goTo(2)}
            />
          )}
          {currentScreen === 4 && (
            <ExecutiveSummary
              studioScale={studioScale}
              outputType={outputType}
              budgetRange={budgetRange}
              onBack={() => goTo(3)}
            />
          )}
        </section>
      </div>
    </main>
  );
}
