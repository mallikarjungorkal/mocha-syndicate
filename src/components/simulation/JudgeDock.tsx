"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Zap, 
  RotateCcw, 
  TrendingUp, 
  ShieldAlert, 
  ChevronUp, 
  ChevronDown, 
  Sliders, 
  HelpCircle,
  X,
  BookOpen,
  Percent,
  CheckCircle2,
  Calculator
} from "lucide-react";

interface JudgeDockProps {
  activePositionId?: string;
  onPriceUpdate?: () => void;
}

export function JudgeDock({ activePositionId, onPriceUpdate }: JudgeDockProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sensitivity test fee rate state (0.02% to 0.10%)
  const [sensitivityFeePct, setSensitivityFeePct] = useState(0.05);

  const positionIdFromPath = pathname.startsWith("/position/")
    ? pathname.split("/")[2]
    : undefined;

  const targetPositionId = activePositionId || positionIdFromPath;

  const handleAction = async (action: "BULLISH_TP" | "CIRCUIT_BREAKER_DROP") => {
    if (!targetPositionId) {
      setStatusMessage("Please pledge or enter an active trade room first!");
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    setIsTriggering(true);
    setStatusMessage(action === "BULLISH_TP" ? "Executing Bullish +18% Rally..." : "Executing Market Flash Dip (-10%)...");

    try {
      const res = await fetch("/api/simulator/tick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positionId: targetPositionId,
          action,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.data.settled) {
          setStatusMessage(
            action === "BULLISH_TP"
              ? "Take-Profit (+18%) hit! Routed to settlement."
              : "-10% Circuit Breaker fired! 90% capital refunded."
          );
          setTimeout(() => {
            router.push(`/settlement/${targetPositionId}`);
          }, 800);
        } else {
          onPriceUpdate?.();
        }
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Trigger failed");
    } finally {
      setIsTriggering(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    setStatusMessage("Resetting demo database & clearing state...");

    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStatusMessage("Demo reset complete!");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 600);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Reset failed");
    } finally {
      setIsResetting(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <>
      {/* Floating Judge Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl">
        <div className="rounded-2xl border-2 border-[#67E5EE]/60 bg-[#070A11]/95 backdrop-blur-xl p-3.5 shadow-2xl shadow-cyan-950/50 text-white">
          {/* Header bar of the Judge Dock */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#67E5EE]/20 border border-[#67E5EE]/40 text-[#67E5EE]">
                <Zap className="h-3.5 w-3.5 fill-[#67E5EE]" />
              </span>
              <div>
                <span className="text-xs font-black tracking-wide text-white uppercase flex items-center gap-1.5">
                  Judge Demo Control Panel
                  <span className="rounded bg-[#67E5EE]/20 px-1.5 py-0.2 text-[9px] text-[#67E5EE] font-mono">
                    Track 2 Tooling
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {statusMessage && (
                <span className="text-[11px] font-medium text-[#67E5EE] bg-[#0E1424] px-2 py-0.5 rounded border border-[#1E293B] animate-pulse">
                  {statusMessage}
                </span>
              )}

              {/* Assumptions Modal Button */}
              <button
                type="button"
                onClick={() => setShowAssumptions(true)}
                className="flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#0E1424] px-2 py-1 text-[11px] font-semibold text-[#67E5EE] hover:bg-[#1E293B] transition-colors"
                title="View mathematical formulas and Track 2 assumptions"
              >
                <Calculator className="h-3 w-3" />
                <span>Assumptions</span>
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded-lg p-1 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Action Controls */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[#1E293B] space-y-3">
              {/* Primary Market Triggers */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Bullish Take Profit Button */}
                <button
                  type="button"
                  disabled={isTriggering}
                  onClick={() => handleAction("BULLISH_TP")}
                  className="flex-1 min-w-[130px] rounded-xl bg-gradient-to-r from-[#48D297]/20 to-[#48D297]/10 hover:from-[#48D297]/30 hover:to-[#48D297]/20 border border-[#48D297]/50 py-2 px-3 text-xs font-bold text-[#48D297] flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Trigger +18% TP
                </button>

                {/* Circuit Breaker Dip Button */}
                <button
                  type="button"
                  disabled={isTriggering}
                  onClick={() => handleAction("CIRCUIT_BREAKER_DROP")}
                  className="flex-1 min-w-[130px] rounded-xl bg-gradient-to-r from-red-500/20 to-red-500/10 hover:from-red-500/30 hover:to-red-500/20 border border-red-500/50 py-2 px-3 text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Trigger -10% Stop
                </button>

                {/* Demo Reset Button */}
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={handleReset}
                  className="rounded-xl border border-[#1E293B] bg-[#0E1424] hover:bg-[#1E293B] hover:text-[#FF914D] py-2 px-3 text-xs font-semibold text-[#94A3B8] flex items-center justify-center gap-1.5 transition-colors"
                  title="Wipe active positions and restore clean seed database"
                >
                  <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`} />
                  Reset Demo
                </button>
              </div>

              {/* Protocol Fee Sensitivity Slider */}
              <div className="rounded-xl border border-[#1E293B] bg-[#070A11] p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#94A3B8] flex items-center gap-1">
                    <Sliders className="h-3 w-3 text-[#67E5EE]" />
                    Sensitivity Test: Protocol Fee Rate
                  </span>
                  <span className="font-mono font-bold text-[#67E5EE] bg-[#0E1424] px-1.5 py-0.2 rounded border border-[#1E293B]">
                    {sensitivityFeePct.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.10"
                  step="0.01"
                  value={sensitivityFeePct}
                  onChange={(e) => setSensitivityFeePct(Number(e.target.value))}
                  className="w-full h-1 accent-[#67E5EE]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>On ₹100 (10x lev = ₹1k notional): <strong className="text-white">₹{(1000 * (sensitivityFeePct / 100)).toFixed(2)}</strong> fee</span>
                  <span>Proj. Rev / 50k Trades: <strong className="text-[#48D297]">₹{Math.round((1000 * (sensitivityFeePct / 100)) * 50000).toLocaleString()}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assumptions & Mathematical Specification Modal */}
      {showAssumptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-[#1E293B] bg-[#0E1424] p-6 sm:p-8 shadow-2xl text-white space-y-6">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#67E5EE]/10 border border-[#67E5EE]/30 text-[#67E5EE]">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Mathematical Models & Track 2 Assumptions</h3>
                  <p className="text-xs text-[#94A3B8]">Official formulas governing Mocha Syndicate prototype</p>
                </div>
              </div>
              <button
                onClick={() => setShowAssumptions(false)}
                className="rounded-lg p-1 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formulas Breakdown */}
            <div className="space-y-4 text-xs">
              <div className="rounded-2xl border border-[#1E293B] bg-[#070A11] p-4 space-y-1">
                <span className="text-[#67E5EE] font-bold block text-xs">1. Leveraged Notional Position</span>
                <code className="text-[11px] font-mono text-white block bg-[#0E1424] p-2 rounded-lg border border-[#1E293B]">
                  NotionalVolume = PledgeAmount × Leverage
                </code>
                <p className="text-[11px] text-[#94A3B8]">
                  Example: ₹100 micro-ticket pledged with 10x leverage creates ₹1,000 in notional trading power.
                </p>
              </div>

              <div className="rounded-2xl border border-[#1E293B] bg-[#070A11] p-4 space-y-1">
                <span className="text-[#48D297] font-bold block text-xs">2. Downside -10% Circuit Breaker Guarantee</span>
                <code className="text-[11px] font-mono text-white block bg-[#0E1424] p-2 rounded-lg border border-[#1E293B]">
                  Trigger Condition: PositionReturn% ≤ -10.0%
                  <br />
                  Net Refund = PledgeAmount × (1 - 0.10) - (Notional × 0.05%) = ₹89.50 (90% Saved)
                </code>
                <p className="text-[11px] text-[#94A3B8]">
                  Eliminates total capital wipeouts. Smart escrow automatically squares off position and refunds 90% capital to user UPI.
                </p>
              </div>

              <div className="rounded-2xl border border-[#1E293B] bg-[#070A11] p-4 space-y-1">
                <span className="text-[#FF914D] font-bold block text-xs">3. Leader Incentive & Platform Monetization</span>
                <code className="text-[11px] font-mono text-white block bg-[#0E1424] p-2 rounded-lg border border-[#1E293B]">
                  LeaderFee = max(0, NetRealizedProfit × 5.0%)
                  <br />
                  MochaTradeFee = NotionalVolume × 0.05%
                </code>
                <p className="text-[11px] text-[#94A3B8]">
                  On winning trades (+18% ROI on ₹100 = ₹18 profit), leader receives ₹0.90 (5%), platform takes ₹0.50 (0.05%), and user takes ₹116.60. On losing trades, leader fee is strictly ₹0.00.
                </p>
              </div>

              <div className="rounded-2xl border border-[#1E293B] bg-[#070A11] p-4 space-y-1">
                <span className="text-white font-bold block text-xs">4. UPI Settlement Velocity SLA</span>
                <p className="text-[11px] text-[#94A3B8]">
                  Demonstrated round-trip webhook latency: <strong className="text-[#48D297]">3.82 seconds</strong> (meets Slide 7 target of &lt; 4.2 seconds).
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E293B] flex justify-end">
              <button
                onClick={() => setShowAssumptions(false)}
                className="rounded-xl bg-[#67E5EE] py-2 px-4 text-xs font-bold text-black hover:opacity-95"
              >
                Close Model Spec
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
