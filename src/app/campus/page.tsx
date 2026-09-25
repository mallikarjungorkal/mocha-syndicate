"use client";

import Link from "next/link";
import { 
  Flame, 
  Award, 
  Users, 
  TrendingUp, 
  Shield, 
  Share2, 
  ArrowUpRight,
  Sparkles,
  GraduationCap
} from "lucide-react";

export default function CampusPage() {
  const colleges = [
    { name: "IIT Bombay FinTech Guild", members: 340, volume: "₹14,20,000", winRate: "82.4%", rank: 1 },
    { name: "BITS Pilani Quant Society", members: 285, volume: "₹11,80,000", winRate: "79.8%", rank: 2 },
    { name: "RVCE Bengaluru Trading Club", members: 210, volume: "₹8,45,000", winRate: "78.2%", rank: 3 },
    { name: "IIT Madras Algo League", members: 260, volume: "₹10,60,000", winRate: "81.0%", rank: "Elite" },
  ];

  const topLeads = [
    { name: "Arjun Rao", handle: "arjun_alpha", campus: "IIT Bombay", winRate: "82.0%", cut: "₹28,400 earned", badge: "Lead Quant" },
    { name: "Kavya Sharma", handle: "kavya_quant", campus: "BITS Pilani", winRate: "76.0%", cut: "₹19,100 earned", badge: "Momentum Lead" },
    { name: "Rohan Deshmukh", handle: "rohan_trades", campus: "RVCE Bengaluru", winRate: "79.0%", cut: "₹15,200 earned", badge: "Macro Specialist" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-gradient-to-r from-[#0E1424] via-[#070A11] to-[#070A11] p-6 sm:p-10 shadow-2xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF914D]/15 px-3 py-1 text-xs font-bold text-[#FF914D] border border-[#FF914D]/30">
            <Flame className="h-3.5 w-3.5" />
            <span>Campus Anchor Strategy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Inter-Collegiate Campus Syndicate League
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Turning peer accountability into an organic trust engine. Engineering students and finance clubs from India&apos;s leading institutions form micro-syndicates with audited win rates, eliminating predatory Telegram signals through campus reputation.
          </p>
        </div>
      </div>

      {/* Negative-CAC Growth Engine Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 space-y-2">
          <span className="text-[10px] text-[#67E5EE] font-bold uppercase tracking-wider block">Loop 01</span>
          <h3 className="text-sm font-bold text-white">Negative-CAC Distribution</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Syndicate leads earn a 5% performance cut on net profit, incentivizing organic sharing across student communities without paid ads.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 space-y-2">
          <span className="text-[10px] text-[#FF914D] font-bold uppercase tracking-wider block">Loop 02</span>
          <h3 className="text-sm font-bold text-white">Mandatory Skin-in-the-Game</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Leaders must commit personal capital into the smart escrow before opens, aligning lead incentives with follower capital preservation.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 space-y-2">
          <span className="text-[10px] text-[#48D297] font-bold uppercase tracking-wider block">Loop 03</span>
          <h3 className="text-sm font-bold text-white">Campus Leaderboards</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Gamified league tables track aggregate win rates and capital preserved, transforming investing into a social team sport across premier colleges.
          </p>
        </div>
      </div>

      {/* Campus Rankings Table */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-[#FF914D]" />
            National Campus Rankings
          </h3>
          <span className="text-xs text-[#94A3B8]">Season 1 Live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A11] text-[#94A3B8] border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">Rank / Campus Guild</th>
                <th className="py-3 px-4">Active Members</th>
                <th className="py-3 px-4">Pooled Volume</th>
                <th className="py-3 px-4">Audited Win Rate</th>
                <th className="py-3 px-4 text-right">Syndicates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-white">
              {colleges.map((h, i) => (
                <tr key={i} className="hover:bg-[#070A11]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1E293B] text-[10px] font-mono text-[#67E5EE]">
                      #{h.rank}
                    </span>
                    {h.name}
                  </td>
                  <td className="py-3.5 px-4 text-[#94A3B8] font-mono">{h.members} students</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">{h.volume}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#48D297]">{h.winRate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/"
                      className="rounded-lg bg-[#67E5EE]/10 border border-[#67E5EE]/30 text-[#67E5EE] hover:bg-[#67E5EE] hover:text-black py-1 px-2.5 text-[11px] font-semibold transition-colors"
                    >
                      View Trades
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Campus Syndicate Leaders */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="h-4 w-4 text-[#67E5EE]" />
          Verified Student Lead Traders
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topLeads.map((lead, i) => (
            <div key={i} className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-[#67E5EE]/20 px-2 py-0.5 text-[10px] font-bold text-[#67E5EE]">
                  {lead.badge}
                </span>
                <span className="text-xs font-bold text-[#48D297]">{lead.winRate} Win Rate</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{lead.name}</h4>
                <p className="text-xs text-[#94A3B8]">@{lead.handle} · {lead.campus}</p>
              </div>
              <div className="pt-2 border-t border-[#1E293B] flex justify-between text-[11px] text-[#94A3B8]">
                <span>5% Profit Share:</span>
                <span className="text-white font-mono font-semibold">{lead.cut}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
