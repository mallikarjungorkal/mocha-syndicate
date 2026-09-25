"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Sliders, 
  TrendingUp, 
  Shield, 
  Users, 
  Sparkles, 
  DollarSign, 
  Award, 
  ArrowRight, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  Layers, 
  PieChart, 
  BarChart3, 
  RefreshCw, 
  Lock,
  ArrowUpRight,
  Flame,
  Scale
} from "lucide-react";

export default function GrowthSimulatorPage() {
  // 1. Pricing & Take-Rate Inputs
  const [feeRatePct, setFeeRatePct] = useState(0.05); // 0.05%
  const [leaderCutPct, setLeaderCutPct] = useState(5.0); // 5%
  const [proTierSubUsd, setProTierSubUsd] = useState(29);
  const [proTierAdoptionPct, setProTierAdoptionPct] = useState(8);

  // 2. Non-Paid Campus Growth
  const [organicBaseline, setOrganicBaseline] = useState(3500);
  const [kFactor, setKFactor] = useState(0.28); // Viral loop
  const [contentMomGrowthPct, setContentMomGrowthPct] = useState(8); // 8%

  // 3. Trust Architecture Toggles
  const [tEscrow, setTEscrow] = useState(true);
  const [tCircuit, setTCircuit] = useState(true);
  const [tAudit, setTAudit] = useState(true);
  const [tUpi, setTUpi] = useState(true);

  // Display Currency: INR (₹) or USD ($)
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const fxRate = currency === "INR" ? 83.0 : 1.0;
  const currencySymbol = currency === "INR" ? "₹" : "$";

  // Selected chart metric: "Revenue" | "Volume" | "Traders"
  const [activeMetric, setActiveMetric] = useState<"Revenue" | "Volume" | "Traders">("Revenue");

  // -------------------------------------------------------------
  // COMPUTATION CORE (Growth, Trust Elasticity & Scenarios)
  // -------------------------------------------------------------
  const { dfSim, totals, trustScore, trustMultiplier, churnRate, funnel } = useMemo(() => {
    let score = 50;
    if (tEscrow) score += 20;
    if (tCircuit) score += 20;
    if (tAudit) score += 12;
    if (tUpi) score += 8;

    const multiplier = score / 50.0;
    const baseConv = 0.024 * Math.pow(multiplier, 0.85);
    const baseTradeSize = 1850 * fxRate * Math.pow(multiplier, 0.65);
    const monthlyChurn = Math.max(0.02, 0.075 / Math.pow(multiplier, 0.5));

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    let currentTraders = 250;

    const data = months.map((m) => {
      const organicTraffic = organicBaseline * Math.pow(1 + contentMomGrowthPct / 100, m - 1);
      const newTraders = organicTraffic * baseConv + currentTraders * kFactor;
      currentTraders = currentTraders * (1 - monthlyChurn) + newTraders;

      // 4.4 trades per user/month velocity
      const vol = currentTraders * baseTradeSize * 4.4;
      const rev =
        vol * (feeRatePct / 100) +
        currentTraders * (proTierAdoptionPct / 100) * (proTierSubUsd * fxRate);
      
      const leaderCut = (vol * 0.6 * 0.15) * (leaderCutPct / 100);

      // Baseline Scenario A (without trust architecture or viral loops)
      const baseVol = vol * 0.42;
      const baseRev = rev * 0.51;
      const baseTraders = Math.round(currentTraders * 0.45);

      return {
        month: `M${m}`,
        monthNum: m,
        traders: Math.round(currentTraders),
        volume: vol,
        revenue: rev,
        leaderCut,
        baseVol,
        baseRev,
        baseTraders,
      };
    });

    const totalRev = data.reduce((acc, d) => acc + d.revenue, 0);
    const totalVol = data.reduce((acc, d) => acc + d.volume, 0);
    const totalBaseRev = data.reduce((acc, d) => acc + d.baseRev, 0);
    const totalBaseVol = data.reduce((acc, d) => acc + d.baseVol, 0);
    const finalTraders = data[data.length - 1].traders;
    const totalLeaderCuts = data.reduce((acc, d) => acc + d.leaderCut, 0);

    const deltaRevPct = ((totalRev - totalBaseRev) / totalBaseRev) * 100;

    // Funnel calculations
    const hesitationReduction = Math.round((multiplier - 1) * 35 + 20);
    const tradeSizeBoost = Math.round((Math.pow(multiplier, 0.65) - 1) * 100);
    const churnPct = (monthlyChurn * 100).toFixed(1);

    return {
      dfSim: data,
      totals: {
        totalRev,
        totalVol,
        totalBaseRev,
        totalBaseVol,
        finalTraders,
        totalLeaderCuts,
        deltaRevPct,
      },
      trustScore: score,
      trustMultiplier: multiplier,
      churnRate: monthlyChurn,
      funnel: {
        hesitationReduction,
        tradeSizeBoost,
        churnPct,
      },
    };
  }, [
    feeRatePct,
    leaderCutPct,
    proTierSubUsd,
    proTierAdoptionPct,
    organicBaseline,
    kFactor,
    contentMomGrowthPct,
    tEscrow,
    tCircuit,
    tAudit,
    tUpi,
    fxRate,
  ]);

  // Helper for SVG chart maximum scale
  const maxChartValue = useMemo(() => {
    if (activeMetric === "Revenue") {
      return Math.max(...dfSim.map((d) => Math.max(d.revenue, d.baseRev))) * 1.15;
    }
    if (activeMetric === "Volume") {
      return Math.max(...dfSim.map((d) => Math.max(d.volume, d.baseVol))) * 1.15;
    }
    return Math.max(...dfSim.map((d) => Math.max(d.traders, d.baseTraders))) * 1.15;
  }, [dfSim, activeMetric]);

  const formatCompact = (val: number) => {
    if (currency === "INR") {
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
      return `₹${Math.round(val).toLocaleString()}`;
    } else {
      if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
      if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
      return `$${Math.round(val).toLocaleString()}`;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-gradient-to-r from-[#0E1424] via-[#070A11] to-[#070A11] p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#67E5EE]/10 px-3.5 py-1 text-xs font-semibold text-[#67E5EE] border border-[#67E5EE]/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>MochaTrade Macroeconomic Growth Model</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              TradeX Labs · Macro Simulator
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Parametric growth & pricing engine modeling how campus micro-syndicates compound retail trading volume via negative-CAC campus loops, automated -10% circuit breakers, and institutional-grade trust.
            </p>
          </div>

          {/* Quick Currency Toggle */}
          <div className="flex items-center gap-2 rounded-2xl border border-[#1E293B] bg-[#0E1424] p-2 self-start md:self-auto">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currency === "INR"
                  ? "bg-[#67E5EE] text-black shadow-md shadow-[#67E5EE]/20"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currency === "USD"
                  ? "bg-[#67E5EE] text-black shadow-md shadow-[#67E5EE]/20"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 shadow-lg">
          <span className="text-[10px] text-[#64748B] block font-medium uppercase">12M Net Revenue</span>
          <span className="text-xl sm:text-2xl font-black text-[#48D297] font-mono mt-1 block">
            {formatCompact(totals.totalRev)}
          </span>
          <span className="text-[10px] text-[#48D297] flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> High-margin take rate ({feeRatePct.toFixed(2)}%)
          </span>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 shadow-lg">
          <span className="text-[10px] text-[#64748B] block font-medium uppercase">12M Trading Volume (GMV)</span>
          <span className="text-xl sm:text-2xl font-black text-[#67E5EE] font-mono mt-1 block">
            {formatCompact(totals.totalVol)}
          </span>
          <span className="text-[10px] text-[#94A3B8] block mt-1">Compounding Liquidity</span>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 shadow-lg">
          <span className="text-[10px] text-[#64748B] block font-medium uppercase">Trust Index Rating</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
            {trustScore}
            <span className="text-sm text-[#64748B]">/100</span>
          </span>
          <span className="text-[10px] text-[#67E5EE] bg-[#67E5EE]/10 px-2 py-0.5 rounded-full border border-[#67E5EE]/30 inline-block mt-1">
            {trustMultiplier.toFixed(2)}x Conversion Multiplier
          </span>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 shadow-lg">
          <span className="text-[10px] text-[#64748B] block font-medium uppercase">Retained Campus Traders (M12)</span>
          <span className="text-xl sm:text-2xl font-black text-[#FF914D] font-mono mt-1 block">
            {totals.finalTraders.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#FF914D] block mt-1">Active Market Makers</span>
        </div>
      </div>

      {/* Main 2-Column: Sidebar Parameter Controls (Left) vs Interactive Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Parametric Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-[#1E293B] bg-[#0E1424] p-6 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
              <Sliders className="h-4 w-4 text-[#67E5EE]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Parametric Simulation Engine
              </h3>
            </div>

            {/* 1. Pricing & Take-Rate */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#67E5EE] uppercase tracking-wide block">
                1. Pricing & Take-Rate
              </span>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Trading Fee Take-Rate:</span>
                  <span className="font-mono text-white font-bold">{feeRatePct.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.50"
                  step="0.01"
                  value={feeRatePct}
                  onChange={(e) => setFeeRatePct(Number(e.target.value))}
                  className="w-full accent-[#67E5EE]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Lead Performance Cut:</span>
                  <span className="font-mono text-[#FF914D] font-bold">{leaderCutPct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="15.0"
                  step="0.5"
                  value={leaderCutPct}
                  onChange={(e) => setLeaderCutPct(Number(e.target.value))}
                  className="w-full accent-[#FF914D]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Pro Tier Adoption:</span>
                  <span className="font-mono text-white font-bold">{proTierAdoptionPct}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="1"
                  value={proTierAdoptionPct}
                  onChange={(e) => setProTierAdoptionPct(Number(e.target.value))}
                  className="w-full accent-[#67E5EE]"
                />
              </div>
            </div>

            {/* 2. Non-Paid Campus Growth */}
            <div className="pt-4 border-t border-[#1E293B] space-y-4">
              <span className="text-xs font-bold text-[#FF914D] uppercase tracking-wide block">
                2. Non-Paid Campus Loops
              </span>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Campus Viral Loop (K-Factor):</span>
                  <span className="font-mono text-[#48D297] font-bold">{kFactor.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.60"
                  step="0.02"
                  value={kFactor}
                  onChange={(e) => setKFactor(Number(e.target.value))}
                  className="w-full accent-[#48D297]"
                />
                <span className="text-[10px] text-[#64748B]">Active referrals per student trader</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Content MoM Traffic Growth:</span>
                  <span className="font-mono text-white font-bold">{contentMomGrowthPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={contentMomGrowthPct}
                  onChange={(e) => setContentMomGrowthPct(Number(e.target.value))}
                  className="w-full accent-[#67E5EE]"
                />
              </div>
            </div>

            {/* 3. Trust Architecture Toggles */}
            <div className="pt-4 border-t border-[#1E293B] space-y-3">
              <span className="text-xs font-bold text-[#48D297] uppercase tracking-wide block">
                3. Trust Architecture Toggles
              </span>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-[#1E293B] bg-[#070A11] cursor-pointer hover:border-[#67E5EE]/40 transition-colors">
                <span className="text-xs text-[#CBD5E1]">Non-Custodial Smart Escrow</span>
                <input
                  type="checkbox"
                  checked={tEscrow}
                  onChange={(e) => setTEscrow(e.target.checked)}
                  className="h-4 w-4 accent-[#67E5EE] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-[#1E293B] bg-[#070A11] cursor-pointer hover:border-[#48D297]/40 transition-colors">
                <span className="text-xs text-[#CBD5E1]">-10% Hard Circuit Breaker</span>
                <input
                  type="checkbox"
                  checked={tCircuit}
                  onChange={(e) => setTCircuit(e.target.checked)}
                  className="h-4 w-4 accent-[#48D297] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-[#1E293B] bg-[#070A11] cursor-pointer hover:border-[#67E5EE]/40 transition-colors">
                <span className="text-xs text-[#CBD5E1]">Verifiable On-Chain Track Record</span>
                <input
                  type="checkbox"
                  checked={tAudit}
                  onChange={(e) => setTAudit(e.target.checked)}
                  className="h-4 w-4 accent-[#67E5EE] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-[#1E293B] bg-[#070A11] cursor-pointer hover:border-[#FF914D]/40 transition-colors">
                <span className="text-xs text-[#CBD5E1]">1-Tap Instant UPI Settlement (&lt;4.2s)</span>
                <input
                  type="checkbox"
                  checked={tUpi}
                  onChange={(e) => setTUpi(e.target.checked)}
                  className="h-4 w-4 accent-[#FF914D] rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Dual-Scenario Trajectory & Visual Charts (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chart Card */}
          <div className="rounded-3xl border border-[#1E293B] bg-[#0E1424] p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#67E5EE]" />
                  12-Month Dual Scenario Trajectory
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Scenario B (MochaTrade Syndicate) vs Scenario A (Legacy Baseline Broker)
                </p>
              </div>

              {/* Metric Selector Tabs */}
              <div className="flex items-center gap-1.5 rounded-xl bg-[#070A11] p-1 border border-[#1E293B]">
                {(["Revenue", "Volume", "Traders"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMetric(m)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeMetric === m
                        ? "bg-[#67E5EE] text-black shadow-sm shadow-[#67E5EE]/20"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    {m === "Revenue" ? "Net Revenue" : m === "Volume" ? "Trading GMV" : "Active Traders"}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="h-72 w-full pt-4">
              <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="scenBGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#48D297" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#48D297" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="scenAGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                  <line
                    key={i}
                    x1="40"
                    y1={200 - ratio * 180}
                    x2="680"
                    y2={200 - ratio * 180}
                    stroke="#1E293B"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Scenario B Path (Green Line & Area) */}
                <path
                  d={dfSim.reduce((acc, d, i) => {
                    const x = 50 + i * 54;
                    const val =
                      activeMetric === "Revenue"
                        ? d.revenue
                        : activeMetric === "Volume"
                        ? d.volume
                        : d.traders;
                    const y = 200 - (val / maxChartValue) * 180;
                    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                  }, "")}
                  fill="none"
                  stroke="#48D297"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Scenario A Path (Red Dashed Line) */}
                <path
                  d={dfSim.reduce((acc, d, i) => {
                    const x = 50 + i * 54;
                    const val =
                      activeMetric === "Revenue"
                        ? d.baseRev
                        : activeMetric === "Volume"
                        ? d.baseVol
                        : d.baseTraders;
                    const y = 200 - (val / maxChartValue) * 180;
                    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                  }, "")}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />

                {/* Data points for Scenario B */}
                {dfSim.map((d, i) => {
                  const x = 50 + i * 54;
                  const val =
                    activeMetric === "Revenue"
                      ? d.revenue
                      : activeMetric === "Volume"
                      ? d.volume
                      : d.traders;
                  const y = 200 - (val / maxChartValue) * 180;
                  return (
                    <g key={i} className="group cursor-pointer">
                      <circle cx={x} cy={y} r="4" fill="#070A11" stroke="#48D297" strokeWidth="2.5" />
                      <text
                        x={x}
                        y="225"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#64748B"
                        className="font-mono"
                      >
                        {d.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend & Summary Delta */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#1E293B] text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-6 rounded-full bg-[#48D297]" />
                  <span className="font-bold text-white">Scenario B: Mocha Syndicate (Organic + Shield)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-6 rounded-full bg-red-400 border border-dashed border-red-500" />
                  <span className="text-[#94A3B8]">Scenario A: Legacy Baseline Broker</span>
                </div>
              </div>

              <span className="font-mono font-bold text-[#48D297] bg-[#48D297]/10 px-2.5 py-1 rounded-lg border border-[#48D297]/30">
                +{totals.deltaRevPct.toFixed(1)}% Revenue Delta
              </span>
            </div>
          </div>

          {/* Dynamic Trust Architecture Funnel Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 space-y-2">
              <span className="text-[10px] font-bold text-[#67E5EE] uppercase tracking-wider block">
                Stage 1: Discovery
              </span>
              <h4 className="text-sm font-bold text-white">Deposit Hesitation</h4>
              <p className="text-xs text-[#94A3B8]">
                Audited win rates and transparent smart contract verification reduce initial user skepticism.
              </p>
              <div className="pt-2">
                <span className="text-lg font-black font-mono text-[#48D297]">
                  -{funnel.hesitationReduction}%
                </span>
                <span className="text-[10px] text-[#64748B] block">Drop in deposit drop-off</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 space-y-2">
              <span className="text-[10px] font-bold text-[#FF914D] uppercase tracking-wider block">
                Stage 2: Capital Deployment
              </span>
              <h4 className="text-sm font-bold text-white">Average Trade Size</h4>
              <p className="text-xs text-[#94A3B8]">
                Protected by the -10% hard stop-loss, first-time users confidently pledge higher initial tickets.
              </p>
              <div className="pt-2">
                <span className="text-lg font-black font-mono text-[#FF914D]">
                  +{funnel.tradeSizeBoost}%
                </span>
                <span className="text-[10px] text-[#64748B] block">Expansion in average ticket</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 space-y-2">
              <span className="text-[10px] font-bold text-[#48D297] uppercase tracking-wider block">
                Stage 3: Downside Retention
              </span>
              <h4 className="text-sm font-bold text-white">Monthly Churn</h4>
              <p className="text-xs text-[#94A3B8]">
                Instead of 100% liquidation wipeouts that drive users away, the circuit breaker preserves 90% capital.
              </p>
              <div className="pt-2">
                <span className="text-lg font-black font-mono text-[#48D297]">
                  {funnel.churnPct}%
                </span>
                <span className="text-[10px] text-[#64748B] block">vs 9.5% legacy baseline churn</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions & Mathematical Methodology Drawer */}
      <div className="rounded-3xl border border-[#1E293B] bg-[#070A11] p-6 sm:p-8 space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#67E5EE]" />
          Model Methodology & Protocol Parameters
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#94A3B8]">
          <div className="rounded-xl border border-[#1E293B] bg-[#0E1424] p-3.5 space-y-1">
            <span className="font-bold text-white block">Trading Velocity</span>
            <p>4.4 trades per user / month benchmarked from high-beta evening US trading sessions (7:00 PM – 11:30 PM IST).</p>
          </div>
          <div className="rounded-xl border border-[#1E293B] bg-[#0E1424] p-3.5 space-y-1">
            <span className="font-bold text-white block">Viral K-Factor (0.28)</span>
            <p>Each active student trader in the campus network brings 0.28 peer traders via negative-CAC verified trade share receipts.</p>
          </div>
          <div className="rounded-xl border border-[#1E293B] bg-[#0E1424] p-3.5 space-y-1">
            <span className="font-bold text-white block">Fee Capture Mechanism</span>
            <p>0.05% exchange fee captured on leveraged notional trading volume, multiplying platform revenue 10x per rupee pledged.</p>
          </div>
          <div className="rounded-xl border border-[#1E293B] bg-[#0E1424] p-3.5 space-y-1">
            <span className="font-bold text-white block">Circuit Breaker Retention</span>
            <p>Churn drops from 9.5% (legacy wipeout rate) to 2.0% as 90% capital preservation builds enduring user trust.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
