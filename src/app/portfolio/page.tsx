"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Shield, 
  Wallet, 
  ArrowUpRight, 
  Receipt, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Activity,
  Flame,
  ChevronRight
} from "lucide-react";
import { DEFAULT_MOCK_PORTFOLIO } from "@/lib/mockData";

export default function PortfolioPage() {
  const [data, setData] = useState<any>(DEFAULT_MOCK_PORTFOLIO);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.warn("Using fallback mock portfolio due to fetch error:", err);
      setData(DEFAULT_MOCK_PORTFOLIO);
    } finally {
      setLoading(false);
    }
  };

  const user = data?.user || DEFAULT_MOCK_PORTFOLIO.user;
  const metrics = data?.metrics || DEFAULT_MOCK_PORTFOLIO.metrics;
  const activePledges = data?.activePledges && data.activePledges.length > 0 
    ? data.activePledges 
    : DEFAULT_MOCK_PORTFOLIO.activePledges;
  const settlements = data?.settlements && data.settlements.length > 0 
    ? data.settlements 
    : DEFAULT_MOCK_PORTFOLIO.settlements;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Page Title & User Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#67E5EE]/10 px-3 py-0.5 text-xs font-semibold text-[#67E5EE] border border-[#67E5EE]/30 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Verified Trader Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            User Portfolio & Protection Ledger
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            {user.name} · {user.campus} · UPI: <span className="font-mono text-white">{user.upiId}</span>
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl bg-[#67E5EE]/15 border border-[#67E5EE] px-4 py-2 text-xs font-bold text-[#67E5EE] hover:bg-[#67E5EE]/25 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          Explore Syndicates <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 shadow-lg">
          <span className="text-[10px] text-[#64748B] block font-medium uppercase tracking-wider">
            Total Capital Pledged
          </span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
            ₹{(metrics.totalPledged || 200).toFixed(2)}
          </span>
          <span className="text-[10px] text-[#94A3B8] block mt-1">
            Across {metrics.tradesCount || 2} trades
          </span>
        </div>

        <div className="rounded-2xl border border-[#48D297]/30 bg-[#48D297]/5 p-5 shadow-lg">
          <span className="text-[10px] text-[#48D297] block font-medium uppercase tracking-wider">
            Capital Saved by Shield
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#48D297] font-mono mt-1 block">
            ₹{(metrics.capitalSaved || 90).toFixed(2)}
          </span>
          <span className="text-[10px] text-[#A1AEC5] block mt-1">
            From -10% circuit breakers
          </span>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 shadow-lg">
          <span className="text-[10px] text-[#64748B] block font-medium uppercase tracking-wider">
            Net Realized P&L
          </span>
          <span className={`text-xl sm:text-2xl font-black font-mono mt-1 block ${
            (metrics.netPnl || 0) >= 0 ? "text-[#48D297]" : "text-red-400"
          }`}>
            {(metrics.netPnl || 0) >= 0 ? "+" : ""}₹{(metrics.netPnl || 8.4).toFixed(2)}
          </span>
          <span className="text-[10px] text-[#94A3B8] block mt-1">
            After 5% fee deductions
          </span>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 shadow-lg">
          <span className="text-[10px] text-[#64748B] block font-medium uppercase tracking-wider">
            Simulated UPI Wallet
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#67E5EE] font-mono mt-1 block">
            ₹{(user.balance || 1500).toFixed(2)}
          </span>
          <span className="text-[10px] text-[#94A3B8] block mt-1">
            Instant withdrawal available
          </span>
        </div>
      </div>

      {/* Active Mirrored Pledges */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#48D297] animate-pulse" />
            Active Mirrored Positions
          </h2>
          <span className="rounded-full bg-[#48D297]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#48D297] border border-[#48D297]/30">
            {activePledges.length} Active Trade
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {activePledges.map((pos: any) => (
            <div
              key={pos.id}
              className="rounded-xl border border-[#1E293B] bg-[#070A11]/80 p-4 hover:border-[#67E5EE]/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#67E5EE]/10 border border-[#67E5EE]/30 font-mono text-sm font-bold text-[#67E5EE]">
                    {pos.syndicate?.assetSymbol || "NVDA"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {pos.syndicate?.title || "NVDA Q3 Earnings Breakout"}
                      </h3>
                      <span className="rounded bg-[#FF914D]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#FF914D]">
                        {pos.leverage || 10}x Lev
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8]">
                      Pledge: <span className="font-mono text-white">₹{pos.pledgeAmount?.toFixed(2) || "100.00"}</span> · Notional: <span className="font-mono text-white">₹{pos.notionalAmount?.toFixed(2) || "1,000.00"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-[#94A3B8] block">Live Unrealized P&L</span>
                    <span className="text-sm font-black text-[#48D297] font-mono">
                      +₹{pos.pnl?.unrealizedPnlInr?.toFixed(2) || pos.pnl?.toFixed(2) || "18.40"} (+{pos.pnlPct || 18.4}%)
                    </span>
                  </div>

                  <Link
                    href={`/position/${pos.id}`}
                    className="rounded-lg bg-[#67E5EE] hover:bg-[#22D3EE] text-black font-bold text-xs px-3.5 py-2 inline-flex items-center gap-1 transition-all"
                  >
                    Trade Room <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Settlements Ledger */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] overflow-hidden shadow-xl">
        <div className="border-b border-[#1E293B] p-5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Receipt className="h-4 w-4 text-[#67E5EE]" />
            Completed Syndicate Settlements & Shield History
          </h3>
          <span className="text-xs text-[#94A3B8]">{settlements.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A11] text-[#94A3B8] border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">Syndicate / Asset</th>
                <th className="py-3 px-4">Exit Reason</th>
                <th className="py-3 px-4">Initial Pledge</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">UPI Settlement UTR</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-white">
              {settlements.map((s: any) => {
                const isCB = s.position?.exitReason === "CIRCUIT_BREAKER";
                const isProfit = (s.netPayout || 0) > (s.initialPledge || 0);

                return (
                  <tr key={s.id} className="hover:bg-[#070A11]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold">
                        {s.position?.syndicate?.title || "TSLA Robotaxi Milestone"}
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">
                        {s.position?.syndicate?.assetSymbol || "TSLA"} ({s.position?.syndicate?.leverage || 10}x) · @{s.position?.syndicate?.leader?.handle || "arjun_quant"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isCB 
                          ? "bg-[#48D297]/15 text-[#48D297] border-[#48D297]/30" 
                          : "bg-[#67E5EE]/15 text-[#67E5EE] border-[#67E5EE]/30"
                      }`}>
                        {isCB ? "-10% Circuit Breaker (90% Preserved)" : "Target Profit Exit"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      ₹{(s.initialPledge || 100).toFixed(2)}
                    </td>
                    <td className={`py-3.5 px-4 font-mono font-bold ${
                      isProfit ? "text-[#48D297]" : "text-white"
                    }`}>
                      ₹{(s.netPayout || 90).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#94A3B8]">
                      {s.upiRefundUtr || "UPI/MOCHA/789102/SHIELD"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/settlement/${s.id}`}
                        className="rounded-lg bg-[#1E293B] hover:bg-[#67E5EE] hover:text-black py-1 px-2.5 text-[11px] font-semibold transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
