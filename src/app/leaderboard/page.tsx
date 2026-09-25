"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  Shield,
  TrendingUp,
  Users,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  Filter,
  BarChart3,
  Flame,
} from "lucide-react";

type Timeframe = "1M" | "3M" | "6M" | "1Y" | "ALL";

interface Leader {
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  campus: string;
  pnlMultipliers: Record<Timeframe, { pnl: number; volume: string; winRate: number }>;
  followers: string;
  cbTrack: string;
  cbSafetyPct: number;
  highlightStrategy: string;
}

const LEADERS: Leader[] = [
  {
    rank: 1,
    name: "Arjun Rao",
    handle: "arjun_quant",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    campus: "IIT Bombay",
    highlightStrategy: "Nvidia Earnings Momentum & Volatility Breakout",
    followers: "4.8k",
    cbTrack: "1 triggered · 90% capital safeguarded",
    cbSafetyPct: 91.2,
    pnlMultipliers: {
      "1M": { pnl: 28.4, volume: "₹6.8L", winRate: 85.0 },
      "3M": { pnl: 64.2, volume: "₹14.2L", winRate: 84.5 },
      "6M": { pnl: 104.5, volume: "₹21.0L", winRate: 84.8 },
      "1Y": { pnl: 142.8, volume: "₹28.4L", winRate: 84.8 },
      "ALL": { pnl: 212.6, volume: "₹38.2L", winRate: 85.2 },
    },
  },
  {
    rank: 2,
    name: "Kavya Sharma",
    handle: "kavya_macro",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    campus: "BITS Pilani",
    highlightStrategy: "Tesla EV & US Tech Macro Catalysts",
    followers: "3.9k",
    cbTrack: "0 triggered · 100% spotless execution",
    cbSafetyPct: 100.0,
    pnlMultipliers: {
      "1M": { pnl: 22.1, volume: "₹5.4L", winRate: 82.0 },
      "3M": { pnl: 51.8, volume: "₹11.8L", winRate: 81.5 },
      "6M": { pnl: 84.0, volume: "₹17.5L", winRate: 81.2 },
      "1Y": { pnl: 118.4, volume: "₹22.1L", winRate: 81.2 },
      "ALL": { pnl: 176.2, volume: "₹31.0L", winRate: 81.8 },
    },
  },
  {
    rank: 3,
    name: "Rohan Deshmukh",
    handle: "rohan_alpha",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    campus: "RVCE Bengaluru",
    highlightStrategy: "Apple Ecosystem & Big Tech Buybacks",
    followers: "3.4k",
    cbTrack: "1 triggered · 90% capital safeguarded",
    cbSafetyPct: 90.0,
    pnlMultipliers: {
      "1M": { pnl: 19.5, volume: "₹4.6L", winRate: 80.0 },
      "3M": { pnl: 44.8, volume: "₹9.8L", winRate: 79.2 },
      "6M": { pnl: 72.1, volume: "₹14.2L", winRate: 79.5 },
      "1Y": { pnl: 98.4, volume: "₹18.6L", winRate: 79.5 },
      "ALL": { pnl: 148.0, volume: "₹25.8L", winRate: 79.9 },
    },
  },
  {
    rank: 4,
    name: "Aditya Verma",
    handle: "aditya_deriv",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    campus: "IIT Madras",
    highlightStrategy: "Defense, Semi-Con & Space Arbitrage",
    followers: "2.9k",
    cbTrack: "2 triggered · 90% capital safeguarded",
    cbSafetyPct: 90.5,
    pnlMultipliers: {
      "1M": { pnl: 18.2, volume: "₹4.1L", winRate: 78.5 },
      "3M": { pnl: 39.5, volume: "₹8.9L", winRate: 78.0 },
      "6M": { pnl: 65.4, volume: "₹12.6L", winRate: 78.4 },
      "1Y": { pnl: 88.6, volume: "₹16.2L", winRate: 78.4 },
      "ALL": { pnl: 132.5, volume: "₹22.4L", winRate: 78.8 },
    },
  },
  {
    rank: 5,
    name: "Sneha Patil",
    handle: "sneha_trades",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    campus: "PES University",
    highlightStrategy: "GenAI Infrastructure & Open Source Stacks",
    followers: "2.6k",
    cbTrack: "0 triggered · 100% spotless execution",
    cbSafetyPct: 100.0,
    pnlMultipliers: {
      "1M": { pnl: 16.8, volume: "₹3.8L", winRate: 78.0 },
      "3M": { pnl: 37.2, volume: "₹7.9L", winRate: 77.8 },
      "6M": { pnl: 59.8, volume: "₹11.2L", winRate: 77.9 },
      "1Y": { pnl: 82.5, volume: "₹14.8L", winRate: 77.9 },
      "ALL": { pnl: 121.0, volume: "₹20.1L", winRate: 78.2 },
    },
  },
  {
    rank: 6,
    name: "Vikramaditya Sen",
    handle: "vikram_crypto",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80",
    campus: "IIT Delhi",
    highlightStrategy: "BTC & ETH High-Beta Derivatives",
    followers: "3.1k",
    cbTrack: "1 triggered · 90% capital safeguarded",
    cbSafetyPct: 90.0,
    pnlMultipliers: {
      "1M": { pnl: 17.5, volume: "₹3.5L", winRate: 77.0 },
      "3M": { pnl: 36.0, volume: "₹7.4L", winRate: 76.5 },
      "6M": { pnl: 56.4, volume: "₹10.5L", winRate: 76.5 },
      "1Y": { pnl: 77.8, volume: "₹13.9L", winRate: 76.5 },
      "ALL": { pnl: 115.4, volume: "₹18.8L", winRate: 76.9 },
    },
  },
  {
    rank: 7,
    name: "Tanya Singhania",
    handle: "tanya_quant",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    campus: "BITS Pilani",
    highlightStrategy: "Cross-DEX Arbitrage & Liquidity Squeezes",
    followers: "2.3k",
    cbTrack: "1 triggered · 90% capital safeguarded",
    cbSafetyPct: 90.0,
    pnlMultipliers: {
      "1M": { pnl: 15.2, volume: "₹3.1L", winRate: 76.5 },
      "3M": { pnl: 33.4, volume: "₹6.8L", winRate: 76.0 },
      "6M": { pnl: 52.1, volume: "₹9.6L", winRate: 76.0 },
      "1Y": { pnl: 73.5, volume: "₹12.5L", winRate: 76.0 },
      "ALL": { pnl: 108.2, volume: "₹17.0L", winRate: 76.4 },
    },
  },
  {
    rank: 8,
    name: "Neha Kulkarni",
    handle: "neha_catalyst",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    campus: "RVCE Bengaluru",
    highlightStrategy: "Custom Silicon & Foundry Turnarounds",
    followers: "2.1k",
    cbTrack: "0 triggered · 100% spotless execution",
    cbSafetyPct: 100.0,
    pnlMultipliers: {
      "1M": { pnl: 14.8, volume: "₹2.9L", winRate: 76.0 },
      "3M": { pnl: 31.5, volume: "₹6.3L", winRate: 75.8 },
      "6M": { pnl: 49.6, volume: "₹9.0L", winRate: 75.8 },
      "1Y": { pnl: 69.2, volume: "₹11.9L", winRate: 75.8 },
      "ALL": { pnl: 102.0, volume: "₹16.2L", winRate: 76.1 },
    },
  },
  {
    rank: 9,
    name: "Pranav Nair",
    handle: "pranav_scalp",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
    campus: "NIT Surathkal",
    highlightStrategy: "High-Beta Perps & Gamma Squeezes",
    followers: "1.9k",
    cbTrack: "2 triggered · 90% capital safeguarded",
    cbSafetyPct: 90.0,
    pnlMultipliers: {
      "1M": { pnl: 13.9, volume: "₹2.6L", winRate: 75.5 },
      "3M": { pnl: 29.8, volume: "₹5.7L", winRate: 75.2 },
      "6M": { pnl: 46.5, volume: "₹8.2L", winRate: 75.2 },
      "1Y": { pnl: 65.4, volume: "₹10.8L", winRate: 75.2 },
      "ALL": { pnl: 96.5, volume: "₹14.8L", winRate: 75.6 },
    },
  },
  {
    rank: 10,
    name: "Ananya Roy",
    handle: "ananya_macro",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80",
    campus: "Delhi University",
    highlightStrategy: "Fed Rate Probabilities & Dollar Index Trends",
    followers: "2.4k",
    cbTrack: "1 triggered · 90% capital safeguarded",
    cbSafetyPct: 90.0,
    pnlMultipliers: {
      "1M": { pnl: 13.2, volume: "₹2.4L", winRate: 75.0 },
      "3M": { pnl: 28.1, volume: "₹5.1L", winRate: 74.6 },
      "6M": { pnl: 43.8, volume: "₹7.4L", winRate: 74.6 },
      "1Y": { pnl: 61.2, volume: "₹9.7L", winRate: 74.6 },
      "ALL": { pnl: 90.4, volume: "₹13.5L", winRate: 74.9 },
    },
  },
  {
    rank: 11,
    name: "Karthik Subramanian",
    handle: "karthik_hft",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
    campus: "IIIT Hyderabad",
    highlightStrategy: "Low-Latency Order Flow & Statistical Arbitrage",
    followers: "1.8k",
    cbTrack: "0 triggered · 100% spotless execution",
    cbSafetyPct: 100.0,
    pnlMultipliers: {
      "1M": { pnl: 12.5, volume: "₹2.2L", winRate: 74.2 },
      "3M": { pnl: 26.5, volume: "₹4.8L", winRate: 74.0 },
      "6M": { pnl: 41.2, volume: "₹7.0L", winRate: 74.0 },
      "1Y": { pnl: 58.0, volume: "₹9.2L", winRate: 74.0 },
      "ALL": { pnl: 85.0, volume: "₹12.6L", winRate: 74.3 },
    },
  },
  {
    rank: 12,
    name: "Meera Iyer",
    handle: "meera_options",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80",
    campus: "IIT Madras",
    highlightStrategy: "Delta-Neutral Options & Earnings Spreads",
    followers: "1.6k",
    cbTrack: "1 triggered · 90% capital safeguarded",
    cbSafetyPct: 90.0,
    pnlMultipliers: {
      "1M": { pnl: 11.8, volume: "₹2.0L", winRate: 73.8 },
      "3M": { pnl: 25.0, volume: "₹4.4L", winRate: 73.5 },
      "6M": { pnl: 38.6, volume: "₹6.5L", winRate: 73.5 },
      "1Y": { pnl: 54.2, volume: "₹8.6L", winRate: 73.5 },
      "ALL": { pnl: 79.8, volume: "₹11.8L", winRate: 73.9 },
    },
  },
  {
    rank: 13,
    name: "Varun Joshi",
    handle: "varun_alpha",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80",
    campus: "IIT Bombay",
    highlightStrategy: "Cloud Infrastructure Capex & Hyperscaler Earnings",
    followers: "1.7k",
    cbTrack: "0 triggered · 100% spotless execution",
    cbSafetyPct: 100.0,
    pnlMultipliers: {
      "1M": { pnl: 11.2, volume: "₹1.9L", winRate: 73.4 },
      "3M": { pnl: 23.8, volume: "₹4.1L", winRate: 73.1 },
      "6M": { pnl: 36.5, volume: "₹6.1L", winRate: 73.1 },
      "1Y": { pnl: 51.5, volume: "₹8.1L", winRate: 73.1 },
      "ALL": { pnl: 75.2, volume: "₹11.1L", winRate: 73.5 },
    },
  },
  {
    rank: 14,
    name: "Divya Menon",
    handle: "divya_growth",
    avatar: "https://images.unsplash.com/photo-1534751516642-a171edd25215?w=120&auto=format&fit=crop&q=80",
    campus: "PES University",
    highlightStrategy: "Consumer Tech Upgrade Cycles & Ad Growth",
    followers: "1.4k",
    cbTrack: "1 triggered · 90% capital safeguarded",
    cbSafetyPct: 90.0,
    pnlMultipliers: {
      "1M": { pnl: 10.5, volume: "₹1.8L", winRate: 73.0 },
      "3M": { pnl: 22.4, volume: "₹3.8L", winRate: 72.8 },
      "6M": { pnl: 34.2, volume: "₹5.7L", winRate: 72.8 },
      "1Y": { pnl: 48.0, volume: "₹7.5L", winRate: 72.8 },
      "ALL": { pnl: 70.5, volume: "₹10.3L", winRate: 73.1 },
    },
  },
  {
    rank: 15,
    name: "Siddharth Gupta",
    handle: "sid_perps",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop&q=80",
    campus: "BITS Pilani",
    highlightStrategy: "Crypto Layer-1 Rotations & Token Releases",
    followers: "1.5k",
    cbTrack: "2 triggered · 90% capital safeguarded",
    cbSafetyPct: 90.0,
    pnlMultipliers: {
      "1M": { pnl: 9.8, volume: "₹1.6L", winRate: 72.8 },
      "3M": { pnl: 21.0, volume: "₹3.5L", winRate: 72.4 },
      "6M": { pnl: 32.0, volume: "₹5.3L", winRate: 72.4 },
      "1Y": { pnl: 45.2, volume: "₹7.0L", winRate: 72.4 },
      "ALL": { pnl: 66.8, volume: "₹9.6L", winRate: 72.7 },
    },
  },
];

interface ArchivedSyndicate {
  id: string;
  ticker: string;
  assetName: string;
  title: string;
  catalyst: string;
  leader: string;
  campus: string;
  leverage: number;
  outcomeBadge: string;
  outcomeType: "PROFIT" | "CIRCUIT_BREAKER" | "TAKE_PROFIT";
  pnlDisplay: string;
  payoutAmount: string;
  settlementSpeed: string;
  utr: string;
  concludedDate: string;
}

const ARCHIVED_SYNDICATES: ArchivedSyndicate[] = [
  {
    id: "arch-1",
    ticker: "NVDA",
    assetName: "NVIDIA Corporation",
    title: "Nvidia Q2 Earnings Momentum Run",
    catalyst: "Data Center Revenue +140% YoY vs consensus",
    leader: "@arjun_quant",
    campus: "IIT Bombay",
    leverage: 10,
    outcomeBadge: "Target Hit (+18.2%)",
    outcomeType: "PROFIT",
    pnlDisplay: "+18.2%",
    payoutAmount: "₹1,18,200",
    settlementSpeed: "3.2s via UPI Webhook",
    utr: "UPI/928410/HDFC",
    concludedDate: "Sept 18, 2026",
  },
  {
    id: "arch-2",
    ticker: "TSLA",
    assetName: "Tesla, Inc.",
    title: "Robotaxi Cybercab Autonomous Event",
    catalyst: "FSD V13 regulatory approval catalyst",
    leader: "@kavya_macro",
    campus: "BITS Pilani",
    leverage: 10,
    outcomeBadge: "Circuit Breaker Protected (-10.0%)",
    outcomeType: "CIRCUIT_BREAKER",
    pnlDisplay: "-10.0% (90% Preserved)",
    payoutAmount: "₹4,50,000 Preserved",
    settlementSpeed: "3.8s via UPI Auto-Refund",
    utr: "UPI/MOCHA/789102/SHIELD",
    concludedDate: "Sept 14, 2026",
  },
  {
    id: "arch-3",
    ticker: "AAPL",
    assetName: "Apple Inc.",
    title: "Apple WWDC Siri-GenAI Integration Unveil",
    catalyst: "Apple Intelligence rollout & iPhone 16 cycle",
    leader: "@rohan_alpha",
    campus: "RVCE Bengaluru",
    leverage: 10,
    outcomeBadge: "Target Hit (+18.0%)",
    outcomeType: "PROFIT",
    pnlDisplay: "+18.0%",
    payoutAmount: "₹2,36,000",
    settlementSpeed: "4.1s via UPI Webhook",
    utr: "UPI/481923/ICICI",
    concludedDate: "Sept 09, 2026",
  },
  {
    id: "arch-4",
    ticker: "BABA",
    assetName: "Alibaba Group",
    title: "ISRO Semi-Con Catalyst & Cloud Spin-Off",
    catalyst: "Alibaba Cloud revenue surge & chip partnership",
    leader: "@aditya_deriv",
    campus: "IIT Madras",
    leverage: 10,
    outcomeBadge: "Take-Profit Auto-Closed (+24.0%)",
    outcomeType: "TAKE_PROFIT",
    pnlDisplay: "+24.0%",
    payoutAmount: "₹3,10,000",
    settlementSpeed: "2.9s via UPI Webhook",
    utr: "UPI/839102/AXIS",
    concludedDate: "Sept 02, 2026",
  },
  {
    id: "arch-5",
    ticker: "META",
    assetName: "Meta Platforms",
    title: "Meta Llama 3 Open Weights Wave",
    catalyst: "Llama 3 enterprise monetization guidance",
    leader: "@sneha_trades",
    campus: "PES University",
    leverage: 10,
    outcomeBadge: "Target Hit (+18.5%)",
    outcomeType: "PROFIT",
    pnlDisplay: "+18.5%",
    payoutAmount: "₹1,95,000",
    settlementSpeed: "3.5s via UPI Webhook",
    utr: "UPI/719283/KOTAK",
    concludedDate: "Aug 28, 2026",
  },
  {
    id: "arch-6",
    ticker: "BTC",
    assetName: "Bitcoin / USD Perp",
    title: "Bitcoin Post-Halving Momentum Perp",
    catalyst: "Institutional ETF inflows hit $1B weekly net",
    leader: "@vikram_crypto",
    campus: "IIT Delhi",
    leverage: 10,
    outcomeBadge: "Take-Profit Auto-Closed (+32.5%)",
    outcomeType: "TAKE_PROFIT",
    pnlDisplay: "+32.5%",
    payoutAmount: "₹5,40,000",
    settlementSpeed: "3.7s via UPI Webhook",
    utr: "UPI/392019/SBI",
    concludedDate: "Aug 20, 2026",
  },
  {
    id: "arch-7",
    ticker: "ETH",
    assetName: "Ethereum / USD Perp",
    title: "Ethereum Dencun Blob Squeeze Catalyst",
    catalyst: "Layer-2 gas fee reduction network milestone",
    leader: "@tanya_quant",
    campus: "BITS Pilani",
    leverage: 10,
    outcomeBadge: "Circuit Breaker Protected (-10.0%)",
    outcomeType: "CIRCUIT_BREAKER",
    pnlDisplay: "-10.0% (90% Preserved)",
    payoutAmount: "₹2,70,000 Preserved",
    settlementSpeed: "3.9s via UPI Auto-Refund",
    utr: "UPI/628103/CANARA",
    concludedDate: "Aug 12, 2026",
  },
  {
    id: "arch-8",
    ticker: "AMD",
    assetName: "Advanced Micro Devices",
    title: "AMD MI300X Benchmark Disruption Surprise",
    catalyst: "Inference benchmark beating H100 by 1.2x",
    leader: "@neha_catalyst",
    campus: "RVCE Bengaluru",
    leverage: 10,
    outcomeBadge: "Target Hit (+18.4%)",
    outcomeType: "PROFIT",
    pnlDisplay: "+18.4%",
    payoutAmount: "₹1,48,000",
    settlementSpeed: "3.3s via UPI Webhook",
    utr: "UPI/519382/INDUS",
    concludedDate: "Aug 04, 2026",
  },
];

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("1Y");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const timeframes: { key: Timeframe; label: string }[] = [
    { key: "1M", label: "1 Month" },
    { key: "3M", label: "3 Months" },
    { key: "6M", label: "6 Months" },
    { key: "1Y", label: "1 Year" },
    { key: "ALL", label: "All-Time" },
  ];

  const filteredLeaders = LEADERS.filter(
    (l) =>
      l.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.handle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.campus.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-gradient-to-r from-[#0E1424] via-[#070A11] to-[#070A11] p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF914D]/10 px-3.5 py-1 text-xs font-semibold text-[#FF914D] border border-[#FF914D]/30">
              <Trophy className="h-3.5 w-3.5" />
              <span>Collegiate Alpha & Performance Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Syndicate Leaderboard & Historical Archive
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Audited performance metrics for verified campus syndicate leads across premier technical institutions.
              All trades are backed by mandatory leader skin-in-the-game and an algorithmic <strong>-10% circuit breaker</strong> preserving 90% capital.
            </p>
          </div>

          {/* Quick Platform Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            <div className="rounded-2xl border border-[#1E293B] bg-[#070A11] p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-[#67E5EE] tracking-wider block">Total Volume</span>
              <span className="font-mono text-lg font-black text-white">₹1.48 Cr</span>
            </div>
            <div className="rounded-2xl border border-[#1E293B] bg-[#070A11] p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-[#48D297] tracking-wider block">Capital Shielded</span>
              <span className="font-mono text-lg font-black text-[#48D297]">91.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Timeframe Toggle & Quick Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Timeframe Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-[#1E293B] bg-[#0E1424] p-1.5 overflow-x-auto">
          {timeframes.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeframe(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                timeframe === key
                  ? "bg-[#67E5EE] text-black shadow-md shadow-[#67E5EE]/20"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search leader, campus, handle..."
            className="w-full rounded-2xl border border-[#1E293B] bg-[#0E1424] py-2 px-3.5 text-xs text-white placeholder-[#64748B] focus:border-[#67E5EE] focus:outline-none"
          />
        </div>
      </div>

      {/* SECTION 1: TOP SYNDICATE LEADERS RANKING TABLE */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#0E1424] to-[#070A11]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-[#FF914D]" />
              Top 15 Verified Syndicate Leaders
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Ranked by realized return over the <strong className="text-white">{timeframe}</strong> window.
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-[#48D297]/15 border border-[#48D297]/30 px-3 py-1 text-[11px] font-bold text-[#48D297]">
            Non-Custodial Skin-in-Game Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A11] text-[#94A3B8] border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4 font-bold text-center w-14">Rank</th>
                <th className="py-3.5 px-4 font-bold">Trader & Campus</th>
                <th className="py-3.5 px-4 font-bold text-right">Realized Return</th>
                <th className="py-3.5 px-4 font-bold text-center">Audited Win Rate</th>
                <th className="py-3.5 px-4 font-bold text-right">Volume Routed</th>
                <th className="py-3.5 px-4 font-bold text-center">Backers</th>
                <th className="py-3.5 px-4 font-bold">Circuit Breaker History</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/70">
              {filteredLeaders.map((leader) => {
                const metrics = leader.pnlMultipliers[timeframe];
                const isMedal1 = leader.rank === 1;
                const isMedal2 = leader.rank === 2;
                const isMedal3 = leader.rank === 3;

                return (
                  <tr
                    key={leader.handle}
                    className="hover:bg-[#141C30]/50 transition-colors group"
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 text-center">
                      {isMedal1 && <span className="text-xl" title="Rank 1 Gold">🥇</span>}
                      {isMedal2 && <span className="text-xl" title="Rank 2 Silver">🥈</span>}
                      {isMedal3 && <span className="text-xl" title="Rank 3 Bronze">🥉</span>}
                      {!isMedal1 && !isMedal2 && !isMedal3 && (
                        <span className="font-mono font-bold text-xs text-[#94A3B8]">
                          #{leader.rank}
                        </span>
                      )}
                    </td>

                    {/* Trader Identity & Campus */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={leader.avatar}
                          alt={leader.name}
                          className="h-9 w-9 rounded-full object-cover border border-[#1E293B] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm group-hover:text-[#67E5EE] transition-colors">
                              {leader.name}
                            </span>
                            <span className="text-[11px] font-mono text-[#67E5EE]">
                              @{leader.handle}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="inline-flex items-center gap-1 rounded bg-[#1E293B] px-1.5 py-0.5 text-[10px] text-[#94A3B8]">
                              <GraduationCap className="h-3 w-3 text-[#FF914D]" />
                              {leader.campus}
                            </span>
                            <span className="text-[10px] text-[#64748B] hidden md:inline">
                              · {leader.highlightStrategy}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Realized PnL */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-mono font-black text-sm text-[#48D297]">
                        +{metrics.pnl.toFixed(1)}%
                      </span>
                      <span className="block text-[10px] text-[#64748B]">
                        Net of 5% lead cut
                      </span>
                    </td>

                    {/* Audited Win Rate */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block rounded-full bg-[#48D297]/10 border border-[#48D297]/30 px-2.5 py-0.5 font-mono text-xs font-bold text-[#48D297]">
                        {metrics.winRate.toFixed(1)}%
                      </span>
                    </td>

                    {/* Volume Routed */}
                    <td className="py-4 px-4 text-right font-mono font-bold text-white">
                      {metrics.volume}
                    </td>

                    {/* Followers / Backers */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1 text-[#94A3B8] font-mono text-xs">
                        <Users className="h-3 w-3 text-[#67E5EE]" />
                        {leader.followers}
                      </div>
                    </td>

                    {/* Circuit Breaker Track */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                        <Shield className="h-3.5 w-3.5 text-[#48D297] shrink-0" />
                        <span className="text-[11px]">{leader.cbTrack}</span>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 text-right">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-1 rounded-xl bg-[#1E293B] hover:bg-[#67E5EE] hover:text-black py-1.5 px-3 text-[11px] font-bold text-white transition-colors"
                      >
                        <span>Inspect Vault</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: HISTORICAL SYNDICATES PERFORMANCE ARCHIVE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="h-5 w-5 text-[#67E5EE]" />
              Historical Concluded Syndicates Archive
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Immutable ledger of concluded catalyst syndicates, automated circuit breaker triggers, and webhook payout speeds.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <CheckCircle2 className="h-4 w-4 text-[#48D297]" />
            <span>100% On-Chain & UPI Webhook Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARCHIVED_SYNDICATES.map((syn) => {
            const isProfit = syn.outcomeType === "PROFIT" || syn.outcomeType === "TAKE_PROFIT";
            const isCB = syn.outcomeType === "CIRCUIT_BREAKER";

            return (
              <div
                key={syn.id}
                className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-5 space-y-4 hover:border-[#334155] transition-colors relative overflow-hidden"
              >
                {/* Top Row: Asset & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#070A11] border border-[#1E293B] font-mono font-black text-sm text-[#67E5EE]">
                      {syn.ticker}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {syn.title}
                      </h3>
                      <p className="text-[11px] text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
                        <span>{syn.assetName}</span>
                        <span>·</span>
                        <span className="font-mono text-[#67E5EE] font-bold">{syn.leverage}x Leverage</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold border shrink-0 ${
                      isProfit
                        ? "bg-[#48D297]/15 text-[#48D297] border-[#48D297]/30"
                        : "bg-[#67E5EE]/15 text-[#67E5EE] border-[#67E5EE]/30"
                    }`}
                  >
                    {syn.outcomeBadge}
                  </span>
                </div>

                {/* Catalyst Description */}
                <div className="rounded-xl bg-[#070A11] p-3 text-xs text-[#CBD5E1] border border-[#1E293B]/70">
                  <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block font-semibold mb-0.5">
                    Catalyst Execution Note
                  </span>
                  {syn.catalyst}
                </div>

                {/* Performance & Settlement Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-[#1E293B] text-xs">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Lead Trader</span>
                    <span className="font-semibold text-white">{syn.leader}</span>
                    <span className="text-[10px] text-[#64748B] block">{syn.campus}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">
                      {isCB ? "Preserved Capital" : "Total Net Payout"}
                    </span>
                    <span className="font-mono font-bold text-white">{syn.payoutAmount}</span>
                    <span className="text-[10px] text-[#48D297] block font-mono">
                      {syn.pnlDisplay}
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#94A3B8] block">Settlement Webhook</span>
                    <span className="font-mono text-[10px] text-[#67E5EE]">{syn.utr}</span>
                    <span className="text-[10px] text-[#94A3B8] block">{syn.settlementSpeed}</span>
                  </div>
                </div>

                {/* Footer Timestamp */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/50 text-[10px] text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Settled on {syn.concludedDate}
                  </span>
                  <Link
                    href="/"
                    className="text-[#67E5EE] hover:underline flex items-center gap-0.5 font-semibold"
                  >
                    <span>View Trade Details</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
