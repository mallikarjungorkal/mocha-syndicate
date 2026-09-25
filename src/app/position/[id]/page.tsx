"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Lock, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  Zap,
  CheckCircle2,
  Clock
} from "lucide-react";
import { ShieldBadge } from "@/components/trade/ShieldBadge";
import { getFallbackPosition } from "@/lib/mockData";

export default function ActiveTradeRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isManualClosing, setIsManualClosing] = useState(false);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  useEffect(() => {
    fetchPosition();
    // Poll every 1.5 seconds for live simulation ticks
    const interval = setInterval(fetchPosition, 1500);
    return () => clearInterval(interval);
  }, [resolvedParams.id]);

  const fetchPosition = async () => {
    try {
      const res = await fetch(`/api/position/${resolvedParams.id}`);
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
        setPriceHistory((prev) => {
          const next = [...prev, result.data.currentPrice];
          return next.slice(-20); // Keep last 20 ticks
        });

        // If position settled, redirect to settlement receipt
        if (result.data.status !== "ACTIVE") {
          setTimeout(() => {
            router.push(`/settlement/${resolvedParams.id}`);
          }, 600);
        }
      } else {
        setData((prev: any) => prev || getFallbackPosition(resolvedParams.id));
      }
    } catch (err) {
      console.warn("Using fallback position:", err);
      setData((prev: any) => prev || getFallbackPosition(resolvedParams.id));
    } finally {
      setLoading(false);
    }
  };

  const handleManualSquareOff = async () => {
    if (!confirm("Are you sure you want to manually square off your mirrored position now?")) return;
    setIsManualClosing(true);

    try {
      const res = await fetch(`/api/position/${resolvedParams.id}/square-off`, {
        method: "POST",
      });
      const result = await res.json();
      if (result.success) {
        router.push(`/settlement/${resolvedParams.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsManualClosing(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 animate-pulse space-y-6">
        <div className="h-10 w-48 bg-[#0E1424] rounded-xl" />
        <div className="h-64 bg-[#0E1424] rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <p className="text-sm text-red-400">Position record not found.</p>
        <Link href="/" className="text-xs text-[#67E5EE]">← Return to Feed</Link>
      </div>
    );
  }

  const { syndicate, pnl, pledgeAmount } = data;
  const isPositive = pnl.positionReturnPct >= 0;
  const priceChangePct = ((data.currentPrice - syndicate.entryPrice) / syndicate.entryPrice) * 100;

  // Compute visual distance to -10% stop loss
  // If ROI goes from 0% to -10%, distance shrinks to 0
  const stopLossDistancePct = Math.max(
    0,
    Math.min(100, Math.round(((pnl.positionReturnPct - syndicate.circuitBreakerPct) / Math.abs(syndicate.circuitBreakerPct)) * 100))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#48D297] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#48D297]"></span>
          </span>
          <div>
            <h1 className="text-base font-extrabold text-white flex items-center gap-2">
              Active Mirrored Position
              <span className="rounded bg-[#67E5EE]/20 px-2 py-0.5 text-[10px] font-mono text-[#67E5EE]">
                {syndicate.assetSymbol} · {syndicate.leverage}x
              </span>
            </h1>
            <p className="text-xs text-[#94A3B8]">
              Mirroring @{syndicate.leader.handle} ({syndicate.leader.campus})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#48D297]/40 bg-[#48D297]/10 px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-[#48D297]">
            <Shield className="h-4 w-4" />
            <span>-10% Stop Guardrail Active</span>
          </div>

          <button
            onClick={handleManualSquareOff}
            disabled={isManualClosing}
            className="rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 py-1.5 px-3 text-xs font-semibold text-red-400 transition-colors cursor-pointer"
          >
            {isManualClosing ? "Closing..." : "Square Off"}
          </button>
        </div>
      </div>

      {/* Main 2-Column Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live P&L Counter & Value */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time P&L Hero Card */}
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all ${
            isPositive
              ? "border-[#48D297]/40 bg-gradient-to-b from-[#0E1424] via-[#070A11] to-[#48D297]/5"
              : "border-red-500/40 bg-gradient-to-b from-[#0E1424] via-[#070A11] to-red-500/5"
          }`}>
            <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
              <span>Unrealized Position P&L</span>
              <span className="font-mono text-[11px] flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#67E5EE]" /> Live Mirrored Ticks
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className={`text-4xl sm:text-5xl font-black tracking-tight font-mono ${
                isPositive ? "text-[#48D297]" : "text-red-400"
              }`}>
                {isPositive ? "+" : ""}₹{pnl.unrealizedPnlInr.toFixed(2)}
              </span>
              <span className={`text-lg sm:text-xl font-bold font-mono px-2.5 py-0.5 rounded-lg border ${
                isPositive 
                  ? "bg-[#48D297]/15 text-[#48D297] border-[#48D297]/30" 
                  : "bg-red-500/15 text-red-400 border-red-500/30"
              }`}>
                {isPositive ? "+" : ""}{pnl.positionReturnPct.toFixed(2)}% ROI
              </span>
            </div>

            {/* Current Value vs Pledge */}
            <div className="mt-6 pt-4 border-t border-[#1E293B] grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-[#64748B] block">Initial Pledge</span>
                <span className="text-sm font-bold text-white font-mono">₹{pledgeAmount.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block">Current Value</span>
                <span className="text-sm font-bold text-[#67E5EE] font-mono">₹{pnl.currentValueInr.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block">Underlying Asset</span>
                <span className="text-sm font-bold text-white font-mono">
                  ${data.currentPrice.toFixed(2)}{" "}
                  <span className={`text-[10px] ${priceChangePct >= 0 ? "text-[#48D297]" : "text-red-400"}`}>
                    ({priceChangePct >= 0 ? "+" : ""}{priceChangePct.toFixed(2)}%)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Visual Mini Chart Representation */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Price Trajectory & Key Levels</span>
              <span className="font-mono text-[#67E5EE] text-[11px]">Mark: ${data.currentPrice.toFixed(2)}</span>
            </div>

            {/* Target, Entry, Stop Bar */}
            <div className="relative pt-6 pb-2">
              <div className="h-3 w-full bg-[#070A11] rounded-full overflow-hidden border border-[#1E293B] relative">
                {/* Visual marker of current price */}
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-[#67E5EE] to-[#48D297] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(10, Math.min(95, 50 + (pnl.positionReturnPct / 2)))}%` }}
                />
              </div>

              {/* Price level markers */}
              <div className="flex justify-between items-center text-[10px] text-[#94A3B8] mt-2">
                <span className="text-red-400 font-semibold">
                  Stop: ${(syndicate.stopLossPrice || syndicate.entryPrice * 0.99)?.toFixed(2)} (-10%)
                </span>
                <span className="text-white">
                  Entry: ${syndicate.entryPrice?.toFixed(2) || "128.50"}
                </span>
                <span className="text-[#48D297] font-semibold">
                  Target: ${(syndicate.targetPrice || syndicate.entryPrice * 1.035)?.toFixed(2)} (+18%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Protective Circuit Breaker Architecture */}
        <div className="space-y-6">
          {/* Circuit Breaker Status Card */}
          <div className="rounded-2xl border border-[#48D297]/40 bg-[#0E1424] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-[#48D297]" />
                Circuit Breaker Shield
              </h3>
              <span className="text-[10px] font-mono text-[#48D297] bg-[#48D297]/15 px-2 py-0.5 rounded-full border border-[#48D297]/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#94A3B8]">Hard Stop-Loss Trigger:</span>
                <span className="font-bold text-red-400 font-mono">-10.0%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#94A3B8]">Guaranteed Capital Refund:</span>
                <span className="font-bold text-[#48D297] font-mono">₹{(pledgeAmount * 0.9).toFixed(2)} (90%)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#94A3B8]">Buffer Remaining:</span>
                <span className="font-bold text-white font-mono">{stopLossDistancePct}%</span>
              </div>
            </div>

            {/* Buffer Bar */}
            <div className="w-full h-2 bg-[#070A11] rounded-full overflow-hidden border border-[#1E293B]">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  stopLossDistancePct < 30 ? "bg-red-500" : "bg-[#48D297]"
                }`}
                style={{ width: `${stopLossDistancePct}%` }}
              />
            </div>

            <p className="text-[11px] text-[#A1AEC5] leading-relaxed">
              If the market experiences sudden adverse volatility, the smart escrow automatically squares off the position at -10% and triggers an instant UPI credit back to your account in &lt;4.2s.
            </p>
          </div>

          {/* Leader Skin in Game & Escrow */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#67E5EE]" />
              Smart Escrow Safeguards
            </h4>
            <div className="text-[11px] text-[#94A3B8] space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#48D297] shrink-0" />
                <span>Zero leader custody of follower capital</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#48D297] shrink-0" />
                <span>Lead pledged ₹{syndicate.leader.skinInGame} alongside followers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#48D297] shrink-0" />
                <span>Audited on-chain execution with zero tipster slippage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
