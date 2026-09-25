"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Shield, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Receipt,
  Sparkles,
  TrendingUp,
  RotateCcw
} from "lucide-react";

export default function PortfolioPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/portfolio");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 animate-pulse space-y-6">
        <div className="h-32 bg-[#0E1424] rounded-2xl" />
        <div className="h-64 bg-[#0E1424] rounded-2xl" />
      </div>
    );
  }

  const { metrics, settlements, user } = data || {};

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            User Portfolio & Protection Ledger
          </h1>
          <p className="text-xs text-[#94A3B8]">
            {user?.name} · {user?.campus} · UPI: {user?.upiId}
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl bg-[#67E5EE]/15 border border-[#67E5EE] px-4 py-2 text-xs font-bold text-[#67E5EE] hover:bg-[#67E5EE]/25 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          Explore Syndicates <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5">
          <span className="text-[10px] text-[#64748B] block font-medium">Total Capital Pledged</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono">
            ₹{metrics?.totalPledged.toFixed(2) || "0.00"}
          </span>
          <span className="text-[10px] text-[#94A3B8] block mt-1">Across {metrics?.tradesCount || 0} trades</span>
        </div>

        <div className="rounded-2xl border border-[#48D297]/30 bg-[#48D297]/5 p-5">
          <span className="text-[10px] text-[#48D297] block font-medium">Capital Saved by Shield</span>
          <span className="text-xl sm:text-2xl font-black text-[#48D297] font-mono">
            ₹{metrics?.capitalSaved.toFixed(2) || "0.00"}
          </span>
          <span className="text-[10px] text-[#A1AEC5] block mt-1">From -10% circuit breakers</span>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5">
          <span className="text-[10px] text-[#64748B] block font-medium">Net Realized P&L</span>
          <span className={`text-xl sm:text-2xl font-black font-mono ${
            (metrics?.netPnl || 0) >= 0 ? "text-[#48D297]" : "text-red-400"
          }`}>
            {(metrics?.netPnl || 0) >= 0 ? "+" : ""}₹{metrics?.netPnl.toFixed(2) || "0.00"}
          </span>
          <span className="text-[10px] text-[#94A3B8] block mt-1">After 5% fee deductions</span>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5">
          <span className="text-[10px] text-[#64748B] block font-medium">Simulated UPI Wallet</span>
          <span className="text-xl sm:text-2xl font-black text-[#67E5EE] font-mono">
            ₹1,500.00
          </span>
          <span className="text-[10px] text-[#94A3B8] block mt-1">Instant withdrawal available</span>
        </div>
      </div>

      {/* Historical Settlements Ledger */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] overflow-hidden shadow-xl">
        <div className="border-b border-[#1E293B] p-5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Receipt className="h-4 w-4 text-[#67E5EE]" />
            Completed Syndicate Settlements
          </h3>
          <span className="text-xs text-[#94A3B8]">{settlements?.length || 0} Records</span>
        </div>

        {settlements?.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1E293B] text-[#94A3B8]">
              <Receipt className="h-6 w-6" />
            </div>
            <p className="text-xs text-[#94A3B8]">No settled syndicates yet.</p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-[#67E5EE] py-2 px-4 text-xs font-bold text-black"
            >
              Pledge in a Syndicate Now
            </Link>
          </div>
        ) : (
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
                  const isCB = s.position.exitReason === "CIRCUIT_BREAKER";
                  const isProfit = s.netPayout > s.initialPledge;

                  return (
                    <tr key={s.id} className="hover:bg-[#070A11]/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold">{s.position.syndicate.title}</div>
                        <div className="text-[10px] text-[#94A3B8]">
                          {s.position.syndicate.assetSymbol} ({s.position.syndicate.leverage}x) · @{s.position.syndicate.leader.handle}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isCB 
                            ? "bg-[#48D297]/15 text-[#48D297] border-[#48D297]/30" 
                            : "bg-[#67E5EE]/15 text-[#67E5EE] border-[#67E5EE]/30"
                        }`}>
                          {isCB ? "-10% Circuit Breaker" : "Target Exit"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">₹{s.initialPledge.toFixed(2)}</td>
                      <td className={`py-3.5 px-4 font-mono font-bold ${
                        isProfit ? "text-[#48D297]" : "text-white"
                      }`}>
                        ₹{s.netPayout.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#94A3B8]">
                        {s.upiRefundUtr}
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
        )}
      </div>
    </div>
  );
}
