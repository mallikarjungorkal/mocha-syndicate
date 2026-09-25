"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Shield, 
  ArrowLeft, 
  Award, 
  TrendingUp, 
  Lock, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { ShieldBadge } from "@/components/trade/ShieldBadge";
import { UpiModal } from "@/components/payment/UpiModal";

export default function SyndicateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [syndicate, setSyndicate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [resolvedParams.id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/syndicates/${resolvedParams.id}`);
      const data = await res.json();
      if (data.success) {
        setSyndicate(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 animate-pulse space-y-6">
        <div className="h-8 w-32 bg-[#0E1424] rounded-lg" />
        <div className="h-48 bg-[#0E1424] rounded-2xl" />
        <div className="h-64 bg-[#0E1424] rounded-2xl" />
      </div>
    );
  }

  if (!syndicate) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <p className="text-sm text-red-400">Syndicate not found.</p>
        <Link href="/" className="inline-block text-xs font-semibold text-[#67E5EE]">
          ← Back to Discovery Feed
        </Link>
      </div>
    );
  }

  const percentFilled = Math.min(
    100,
    Math.round((syndicate.currentPooled / syndicate.poolCap) * 100)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Syndicate Feed
        </Link>
      </div>

      {/* Header Card */}
      <div className="rounded-3xl border border-[#1E293B] bg-gradient-to-b from-[#0E1424] to-[#070A11] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#67E5EE]/10 border border-[#67E5EE]/30 font-mono text-base font-black text-[#67E5EE]">
              {syndicate.assetSymbol}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {syndicate.title}
                </h1>
                <span className="rounded bg-[#FF914D]/20 px-2 py-0.5 text-xs font-bold text-[#FF914D]">
                  {syndicate.leverage}x Leverage
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">{syndicate.assetName} · Entry Price ${syndicate.entryPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#67E5EE] to-[#22D3EE] py-3 px-6 text-xs font-bold text-black shadow-lg shadow-[#67E5EE]/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5" />
              1-Tap Pledge ₹100
            </button>
          </div>
        </div>

        {/* Catalyst Description */}
        <div className="mt-6 rounded-2xl border border-[#1E293B] bg-[#070A11]/60 p-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
            Trade Catalyst & Rationale
          </h4>
          <p className="text-xs text-[#A1AEC5] leading-relaxed">
            {syndicate.catalyst}. Position is mirror-executed with an unbreachable -10% circuit breaker stop loss.
            If the market rallies towards the profit target of +{syndicate.targetReturnPct}%, profit is automatically locked.
          </p>
        </div>
      </div>

      {/* 2-Column Section: Leader Trust Metrics vs Risk Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Leader Trust & Audited Record */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-[#67E5EE]" />
              Audited Lead Credentials
            </h3>
            <span className="rounded-full bg-[#48D297]/15 px-2 py-0.5 text-[10px] font-bold text-[#48D297] border border-[#48D297]/30">
              Dr. AIT Verified
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#67E5EE]/20 border border-[#67E5EE]/50 font-bold text-[#67E5EE] text-sm">
              {syndicate.leader.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-white">@{syndicate.leader.handle}</p>
              <p className="text-xs text-[#94A3B8]">{syndicate.leader.name} ({syndicate.leader.campus})</p>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-[#1E293B] bg-[#070A11] p-3">
              <span className="text-[10px] text-[#64748B] block">Audited Win Rate</span>
              <span className="text-lg font-black text-[#48D297]">{syndicate.leader.winRate}%</span>
              <span className="text-[9px] text-[#94A3B8] block">Across 42 past trades</span>
            </div>
            <div className="rounded-xl border border-[#1E293B] bg-[#070A11] p-3">
              <span className="text-[10px] text-[#64748B] block">Historical Max Drawdown</span>
              <span className="text-lg font-black text-[#FF914D]">{syndicate.leader.maxDrawdown}%</span>
              <span className="text-[9px] text-[#94A3B8] block">Strict intraday discipline</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#1E293B] bg-[#070A11] p-3 flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Leader Skin-in-the-Game:</span>
            <span className="font-bold text-white font-mono">
              ₹{syndicate.leader.skinInGame?.toLocaleString()} Locked
            </span>
          </div>

          <p className="text-[11px] text-[#64748B] italic">
            *Leaders must pledge personal capital alongside followers before syndicates can be opened.
          </p>
        </div>

        {/* Right Column: Risk Architecture & Fee Structure */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#48D297]" />
              Protective Guardrails & Fees
            </h3>
            <ShieldBadge threshold={syndicate.circuitBreakerPct} />
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-[#48D297]/30 bg-[#48D297]/5 p-3">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>-10% Circuit Breaker Guarantee</span>
                <span className="text-[#48D297]">90% Capital Return</span>
              </div>
              <p className="text-[11px] text-[#A1AEC5] mt-1 leading-relaxed">
                If the asset declines by 1% (-10% on 10x leverage), the smart contract triggers an automated square-off.
                ₹90 of every ₹100 is instantly credited back to your UPI VPA in under 4.2 seconds.
              </p>
            </div>

            <div className="rounded-xl border border-[#1E293B] bg-[#070A11] p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Leader Performance Cut</span>
                <span className="font-semibold text-white">5% (Only on Net Profit)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">MochaTrade Platform Fee</span>
                <span className="font-semibold text-white">0.05% on Notional</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Fee on Negative Trades</span>
                <span className="font-semibold text-[#48D297]">₹0.00 (Zero Fee)</span>
              </div>
            </div>
          </div>

          {/* CTA Ingress inside card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full rounded-xl bg-gradient-to-r from-[#67E5EE] to-[#22D3EE] py-3 text-xs font-bold text-black shadow-lg shadow-[#67E5EE]/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Lock className="h-3.5 w-3.5" />
            Pledge ₹50 / ₹100 via 1-Tap UPI
          </button>
        </div>
      </div>

      {/* Pool Funding Progress */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-6 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Users className="h-4 w-4 text-[#67E5EE]" />
            Syndicate Pool Capacity
          </span>
          <span className="font-mono text-[#67E5EE] font-semibold">
            ₹{syndicate.currentPooled.toLocaleString()} / ₹{syndicate.poolCap.toLocaleString()} ({percentFilled}%)
          </span>
        </div>
        <div className="w-full h-2 bg-[#070A11] rounded-full overflow-hidden border border-[#1E293B]">
          <div
            className="h-full bg-gradient-to-r from-[#67E5EE] to-[#FF914D] rounded-full"
            style={{ width: `${percentFilled}%` }}
          />
        </div>
        <p className="text-[11px] text-[#64748B]">
          Once the pool cap is reached, capital is locked and the collective position is routed directly to the exchange liquidity pool.
        </p>
      </div>

      {/* 1-Tap UPI Ingress Modal */}
      {isModalOpen && (
        <UpiModal
          syndicate={syndicate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(positionId) => {
            setIsModalOpen(false);
            router.push(`/position/${positionId}`);
          }}
        />
      )}
    </div>
  );
}
