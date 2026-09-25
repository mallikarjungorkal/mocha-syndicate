"use client";

import Link from "next/link";
import { Shield, TrendingUp, Users, Award, ArrowUpRight, GraduationCap, Flame } from "lucide-react";
import { ShieldBadge } from "@/components/trade/ShieldBadge";

interface SyndicateCardProps {
  syndicate: {
    id: string;
    title: string;
    catalyst: string;
    assetSymbol?: string;
    ticker?: string;
    assetName?: string;
    direction?: string;
    leverage?: number;
    entryPrice?: number;
    targetReturnPct?: number;
    returnTarget?: number;
    circuitBreakerPct?: number;
    stopLoss?: number;
    minPledge?: number;
    poolCap?: number;
    currentPooled?: number;
    pooledAmount?: number;
    participants?: number;
    category?: string;
    leader?: {
      name: string;
      handle: string;
      campus: string;
      winRate: number | null;
      maxDrawdown: number | null;
      skinInGame: number | null;
      followers?: number;
      followersFormatted?: string;
      badge?: string;
    };
    lead?: {
      name: string;
      handle: string;
      campus: string;
      winRate: number | null;
      maxDrawdown: number | null;
      skinInGame: number | null;
      followers?: number;
      followersFormatted?: string;
      badge?: string;
    };
  };
  onQuickPledge?: (syndicate: any) => void;
}

export function SyndicateCard({ syndicate, onQuickPledge }: SyndicateCardProps) {
  const leader = syndicate.leader || syndicate.lead || {
    name: "Arjun Rao",
    handle: "arjun_alpha",
    campus: "IIT Bombay",
    winRate: 82,
    maxDrawdown: 5.4,
    skinInGame: 10000,
    followers: 1840,
    followersFormatted: "1.8k",
    badge: "Lead Quant",
  };

  const assetSymbol = syndicate.assetSymbol || syndicate.ticker || "NVDA";
  const assetName = syndicate.assetName || "Equity";
  const entryPrice = syndicate.entryPrice || 128.50;
  const leverage = syndicate.leverage || 10;
  const targetReturnPct = syndicate.targetReturnPct ?? syndicate.returnTarget ?? 35;
  const circuitBreakerPct = syndicate.circuitBreakerPct ?? syndicate.stopLoss ?? -10;
  const poolCap = syndicate.poolCap || 200000;
  const currentPooled = syndicate.currentPooled ?? syndicate.pooledAmount ?? 140000;
  const followersDisplay = leader.followersFormatted || (leader.followers ? `${leader.followers}` : "1.2k");

  const percentFilled = Math.min(
    100,
    Math.round((currentPooled / poolCap) * 100)
  );

  const formatLakhs = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 shadow-lg transition-all hover:border-[#67E5EE]/50 hover:shadow-xl hover:shadow-[#67E5EE]/5">
      {/* 1. Primary Highlight: Trader Identity, College & Followers */}
      <div>
        <div className="flex items-start justify-between gap-3 border-b border-[#1E293B] pb-3.5 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#67E5EE]/20 via-[#22D3EE]/10 to-[#FF914D]/20 border border-[#67E5EE]/40 text-sm font-black text-[#67E5EE] shadow-sm">
              {(leader.name || "TR").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white group-hover:text-[#67E5EE] transition-colors leading-tight">
                  {leader.name}
                </span>
                <span className="text-[10px] text-[#67E5EE] font-mono">@{leader.handle}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] text-[#A1AEC5] font-medium">
                  <GraduationCap className="h-3 w-3 text-[#FF914D]" />
                  {leader.campus}
                </span>
                <span className="text-[10px] text-[#64748B]">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#67E5EE] font-semibold">
                  <Users className="h-3 w-3 text-[#67E5EE]" />
                  {followersDisplay}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="rounded-full bg-[#48D297]/15 px-2.5 py-0.5 text-xs font-bold text-[#48D297] border border-[#48D297]/30 block font-mono">
              {leader.winRate}% Win
            </span>
            <span className="text-[9px] text-[#64748B] mt-0.5 block">Audited</span>
          </div>
        </div>

        {/* 2. Target Asset, Leverage, & Target Return Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#67E5EE]/10 border border-[#67E5EE]/30 font-mono text-[11px] font-black text-[#67E5EE]">
              {assetSymbol}
            </span>
            <span className="text-xs font-bold text-white leading-tight">
              {assetName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-[#FF914D]/15 px-2 py-0.5 text-[10px] font-bold text-[#FF914D] border border-[#FF914D]/30">
              {leverage}x Lev
            </span>
            <span className="rounded-md bg-[#48D297]/15 px-2 py-0.5 text-[10px] font-bold text-[#48D297] border border-[#48D297]/30 flex items-center gap-0.5">
              <TrendingUp className="h-2.5 w-2.5" /> +{targetReturnPct}%
            </span>
          </div>
        </div>

        {/* 3. Title & Catalyst Rationale */}
        <Link href={`/syndicate/${syndicate.id}`}>
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#67E5EE] transition-colors leading-snug line-clamp-1">
            {syndicate.title}
          </h3>
        </Link>
        <p className="mt-1 text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed">
          {syndicate.catalyst}
        </p>

        {/* 4. Skin in the game & Circuit Breaker */}
        <div className="mt-3.5 flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#070A11]/60 px-3 py-2 text-[10px]">
          <span className="text-[#94A3B8]">Lead Commitment:</span>
          <span className="font-semibold text-white font-mono">
            ₹{(leader.skinInGame || 5000).toLocaleString()} locked
          </span>
        </div>

        <div className="mt-2.5">
          <ShieldBadge threshold={circuitBreakerPct} showDetails />
        </div>
      </div>

      {/* 5. Pooled Capacity & Action Buttons */}
      <div className="mt-4 pt-3 border-t border-[#1E293B]">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-[#94A3B8]">Syndicate Pool</span>
          <span className="font-mono text-white font-medium">
            {formatLakhs(currentPooled)} / {formatLakhs(poolCap)} ({percentFilled}%)
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#070A11] rounded-full overflow-hidden border border-[#1E293B]">
          <div
            className="h-full bg-gradient-to-r from-[#67E5EE] to-[#FF914D] rounded-full transition-all duration-500"
            style={{ width: `${percentFilled}%` }}
          />
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <Link
            href={`/syndicate/${syndicate.id}`}
            className="flex-1 rounded-xl border border-[#1E293B] bg-[#070A11] py-2 px-3 text-center text-xs font-semibold text-white hover:border-[#67E5EE]/50 hover:bg-[#1E293B]/40 transition-colors"
          >
            View Thesis
          </Link>
          {onQuickPledge && (
            <button
              onClick={() => onQuickPledge(syndicate)}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#67E5EE] to-[#22D3EE] py-2 px-3 text-center text-xs font-bold text-black shadow-md shadow-[#67E5EE]/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
            >
              1-Tap Pledge <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
