"use client";

import Link from "next/link";
import { 
  ShieldAlert, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Award
} from "lucide-react";

export default function BenchmarkComparisonPage() {
  const comparisonData = [
    {
      metric: "Customer Acquisition Cost (CAC)",
      scenarioA: "₹1,500 – ₹2,500 (Paid Google/Meta ads & influencer sponsorships)",
      scenarioB: "₹0.00 (Negative-CAC campus referral loops & 5% profit share)",
      winner: "Scenario B (-100% Acquisition Cost)",
    },
    {
      metric: "Entry Friction & Capital Barrier",
      scenarioA: "$500 account minimum, 20% LRS tax, manual wire forms",
      scenarioB: "₹50 / ₹100 via 1-Tap domestic UPI (PhonePe / GPay)",
      winner: "Scenario B (99% Friction Reduction)",
    },
    {
      metric: "Downside Risk & Liquidation",
      scenarioA: "Unmitigated leverage $\\to$ 100% wipeout on first intraday dip",
      scenarioB: "Automated -10% Circuit Breaker $\\to$ 90% capital safely refunded",
      winner: "Scenario B (90% Principal Safeguarded)",
    },
    {
      metric: "30-Day User Churn Rate",
      scenarioA: "65% Churn within 30 days due to liquidation trauma",
      scenarioB: "22% Churn (78% retention; users learn from teardowns)",
      winner: "Scenario B (3.5x Higher Retention)",
    },
    {
      metric: "Social Proof & Signal Quality",
      scenarioA: "Predatory Telegram tipsters, fake screenshots, upfront cash drain",
      scenarioB: "Audited on-chain win rates, mandatory leader skin-in-game (₹5,000)",
      winner: "Scenario B (Verifiable Trust Anchor)",
    },
    {
      metric: "Settlement Velocity",
      scenarioA: "T+2 to T+5 days international wire turnaround",
      scenarioB: "< 4.2 seconds automated domestic UPI webhook credit",
      winner: "Scenario B (Instant Liquidity)",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-gradient-to-r from-[#0E1424] via-[#070A11] to-[#070A11] p-6 sm:p-10 shadow-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#67E5EE]/10 px-3.5 py-1 text-xs font-semibold text-[#67E5EE] border border-[#67E5EE]/30 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Strategic Evaluation · Business Model Benchmark</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Scenario Comparison: Incumbent vs. Mocha Syndicate
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
          Comparing the economics, customer journey, and risk profile of traditional retail derivatives brokers versus MochaTrade's trust-anchored micro-syndicates.
        </p>
      </div>

      {/* Side-by-Side Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario A: The Incumbent Model */}
        <div className="rounded-3xl border border-red-500/30 bg-[#0E1424] p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div>
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                Scenario A · The Incumbent Approach
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Paid Acquisition & Unmitigated Leverage
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-3.5 space-y-1">
              <span className="font-bold text-red-400 block">Predatory Acquisition Loop:</span>
              <p className="text-[#A1AEC5]">
                Heavy spending on Google/Meta ads (₹1,500 CAC) to acquire speculative users. Channels rely on anonymous Telegram "gurus" charging upfront fees for unverifiable calls.
              </p>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-3.5 space-y-1">
              <span className="font-bold text-red-400 block">Total Liquidation Wipeout:</span>
              <p className="text-[#A1AEC5]">
                Novices enter 10x positions without stop-loss discipline. A single 1.5% adverse intraday move triggers 100% liquidation. Follower balance is entirely wiped out.
              </p>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-3.5 space-y-1">
              <span className="font-bold text-red-400 block">65% 30-Day Churn:</span>
              <p className="text-[#A1AEC5]">
                Traumatized first-time users churn permanently within 30 days. The platform must continuously spend more on paid ads to replenish a leaking funnel.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Unit Economics Viability:</span>
            <span className="font-bold text-red-400">Fragile (High CAC / High Churn)</span>
          </div>
        </div>

        {/* Scenario B: The Mocha Syndicate Model */}
        <div className="rounded-3xl border border-[#48D297]/40 bg-[#0E1424] p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div>
              <span className="text-[10px] text-[#48D297] font-bold uppercase tracking-wider block">
                Scenario B · TradeX Labs Solution
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Trust-Anchored Mocha Syndicate
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#48D297]/15 border border-[#48D297]/40 text-[#48D297]">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-[#48D297]/20 bg-[#48D297]/5 p-3.5 space-y-1">
              <span className="font-bold text-[#48D297] block">Negative-CAC Campus Engine:</span>
              <p className="text-[#A1AEC5]">
                Verified campus leads earn a 5% net profit cut, driving viral distribution across hostel WhatsApp groups at ₹0 CAC. Leads must commit ₹5,000 skin-in-the-game.
              </p>
            </div>

            <div className="rounded-xl border border-[#48D297]/20 bg-[#48D297]/5 p-3.5 space-y-1">
              <span className="font-bold text-[#48D297] block">Algorithmic -10% Circuit Breaker:</span>
              <p className="text-[#A1AEC5]">
                Automated smart escrow stops drawdowns at -10%, immediately returning 90% of user capital via instant UPI refund in &lt; 4.2 seconds.
              </p>
            </div>

            <div className="rounded-xl border border-[#48D297]/20 bg-[#48D297]/5 p-3.5 space-y-1">
              <span className="font-bold text-[#48D297] block">High Retention & Educational Teardown:</span>
              <p className="text-[#A1AEC5]">
                Post-trade analytics explain the market catalyst, fostering long-term confidence. Over 78% of users remain active and transition into educated traders.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Unit Economics Viability:</span>
            <span className="font-bold text-[#48D297]">Extremely Scalable (Zero CAC / Infinite LTV/CAC)</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Matrix */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-[#67E5EE]" />
            Side-by-Side Rubric Benchmark Matrix
          </h3>
          <span className="text-xs text-[#67E5EE] font-mono">Strategic Deliverable</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A11] text-[#94A3B8] border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4 w-1/4">Evaluation Vector</th>
                <th className="py-3 px-4 w-1/3">Scenario A (Incumbent Model)</th>
                <th className="py-3 px-4 w-1/3">Scenario B (Mocha Syndicate)</th>
                <th className="py-3 px-4 text-right">Strategic Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-white">
              {comparisonData.map((row, i) => (
                <tr key={i} className="hover:bg-[#070A11]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{row.metric}</td>
                  <td className="py-3.5 px-4 text-red-400/90">{row.scenarioA}</td>
                  <td className="py-3.5 px-4 text-[#48D297] font-semibold">{row.scenarioB}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#67E5EE]">
                    {row.winner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA to Test Prototype */}
      <div className="flex justify-between items-center p-6 rounded-2xl border border-[#1E293B] bg-[#070A11]">
        <div>
          <h4 className="text-sm font-bold text-white">Ready to test the live trade flow?</h4>
          <p className="text-xs text-[#94A3B8]">Experience 1-Tap UPI pledge, the -10% circuit breaker, and &lt;4.2s refund in real-time.</p>
        </div>
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-[#67E5EE] to-[#22D3EE] py-2.5 px-5 text-xs font-bold text-black shadow-lg shadow-[#67E5EE]/20 hover:opacity-95 transition-opacity inline-flex items-center gap-1.5"
        >
          Launch Interactive Demo <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
