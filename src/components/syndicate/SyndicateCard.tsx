"use client";

import Link from "next/link";
import { Shield, TrendingUp, Users, Award, ArrowUpRight, Flame } from "lucide-react";
import { ShieldBadge } from "@/components/trade/ShieldBadge";

interface SyndicateCardProps {
  syndicate: {
    id: string;
    title: string;
    catalyst: string;
    assetSymbol: string;
    assetName: string;
    direction: string;
    leverage: number;
    entryPrice: number;
    targetReturnPct: number;
    circuitBreakerPct: number;
    minPledge: number;
    poolCap: number;
    currentPooled: number;
    leader: {
      name: string;
      handle: string;
      campus: string;
      winRate: number | null;
      maxDrawdown: number | null;
      skinInGame: number | null;
    };
  };
  onQuickPledge?: (syndicate: any) => void;
}

export function SyndicateCard({ syndicate, onQuickPledge }: SyndicateCardProps) {
  const percentFilled = Math.min(
    100,
    Math.round((syndicate.currentPooled / syndicate.poolCap) * 100)
  );

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 shadow-lg transition-all hover:border-[#67E5EE]/50 hover:shadow-xl hover:shadow-[#67E5EE]/5">
      {/* Top row: Symbol, Leverage & Target */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#67E5EE]/10 border border-[#67E5EE]/30 font-mono text-xs font-black text-[#67E5EE]">
              {syndicate.assetSymbol}
            </span>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">
                {syndicate.assetName}
              </span>
              <span className="text-[10px] text-[#94A3B8]">Entry ${syndicate.entryPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-[#FF914D]/15 px-2 py-0.5 text-[10px] font-bold text-[#FF914D] border border-[#FF914D]/30">
              {syndicate.leverage}x Lev
            </span>
            <span className="rounded-md bg-[#48D297]/15 px-2 py-0.5 text-[10px] font-bold text-[#48D297] border border-[#48D297]/30 flex items-center gap-0.5">
              <TrendingUp className="h-2.5 w-2.5" /> +{syndicate.targetReturnPct}% Target
            </span>
          </div>
        </div>

        {/* Title & Catalyst */}
        <Link href={`/syndicate/${syndicate.id}`}>
          <h3 className="text-sm font-bold text-white group-hover:text-[#67E5EE] transition-colors leading-snug">
            {syndicate.title}
          </h3>
        </Link>
        <p className="mt-1 text-[11px] text-[#94A3B8] line-clamp-2">
          {syndicate.catalyst}
        </p>

        {/* Leader Profile & Trust Metrics */}
        <div className="mt-4 rounded-xl border border-[#1E293B] bg-[#070A11]/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#67E5EE]/20 text-[10px] font-bold text-[#67E5EE] border border-[#67E5EE]/40">
                {syndicate.leader.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-white flex items-center gap-1">
                  @{syndicate.leader.handle}
                  <span className="rounded-full bg-[#67E5EE]/20 p-0.5 text-[#67E5EE]">
                    <Award className="h-2.5 w-2.5" />
                  </span>
                </p>
                <p className="text-[10px] text-[#64748B]">{syndicate.leader.campus}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#94A3B8] block">Audited Win Rate</span>
              <span className="text-xs font-bold text-[#48D297]">
                {syndicate.leader.winRate}%
              </span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[10px] text-[#94A3B8]">
            <span>Lead Commitment (Skin-in-game):</span>
            <span className="font-semibold text-white">₹{syndicate.leader.skinInGame?.toLocaleString()}</span>
          </div>
        </div>

        {/* Downside Protection Indicator */}
        <div className="mt-3">
          <ShieldBadge threshold={syndicate.circuitBreakerPct} showDetails />
        </div>
      </div>

      {/* Bottom: Pooled volume & CTA */}
      <div className="mt-5 pt-3 border-t border-[#1E293B]">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-[#94A3B8]">Pooled Capital</span>
          <span className="font-mono text-white font-medium">
            ₹{syndicate.currentPooled.toLocaleString()} / ₹{syndicate.poolCap.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#070A11] rounded-full overflow-hidden border border-[#1E293B]">
          <div
            className="h-full bg-gradient-to-r from-[#67E5EE] to-[#FF914D] rounded-full transition-all duration-500"
            style={{ width: `${percentFilled}%` }}
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/syndicate/${syndicate.id}`}
            className="flex-1 rounded-xl border border-[#1E293B] bg-[#070A11] py-2 px-3 text-center text-xs font-semibold text-white hover:border-[#67E5EE]/50 hover:bg-[#1E293B]/40 transition-colors"
          >
            View Thesis
          </Link>
          {onQuickPledge && (
            <button
              onClick={() => onQuickPledge(syndicate)}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#67E5EE] to-[#22D3EE] py-2 px-3 text-center text-xs font-bold text-black shadow-md shadow-[#67E5EE]/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1"
            >
              1-Tap Pledge <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
