"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Sparkles, TrendingUp, Zap, Users, ArrowRight, Award, CheckCircle2 } from "lucide-react";
import { SyndicateCard } from "@/components/syndicate/SyndicateCard";
import { UpiModal } from "@/components/payment/UpiModal";
import { DEFAULT_MOCK_SYNDICATES } from "@/lib/mockData";

export default function DiscoveryHub() {
  const router = useRouter();
  const [syndicates, setSyndicates] = useState<any[]>(DEFAULT_MOCK_SYNDICATES);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [selectedSyndicate, setSelectedSyndicate] = useState<any | null>(null);

  useEffect(() => {
    fetchSyndicates();
  }, []);

  const fetchSyndicates = async () => {
    try {
      const res = await fetch("/api/syndicates");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setSyndicates(data.data);
      } else {
        setSyndicates(DEFAULT_MOCK_SYNDICATES);
      }
    } catch (err) {
      console.warn("Using fallback syndicates due to fetch error:", err);
      setSyndicates(DEFAULT_MOCK_SYNDICATES);
    } finally {
      setLoading(false);
    }
  };

  const filteredSyndicates = syndicates.filter((syn) => {
    if (filter === "EARNINGS") return syn.catalyst?.toLowerCase().includes("earnings");
    if (filter === "HIGH_BETA") return (syn.leverage || 0) >= 10;
    if (filter === "CAMPUS") return (syn.leader?.campus || syn.lead?.campus || "").includes("Dr. AIT");
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-gradient-to-b from-[#0E1424] via-[#070A11] to-[#070A11] p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-[#67E5EE]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-72 w-72 rounded-full bg-[#FF914D]/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#67E5EE]/10 px-3.5 py-1 text-xs font-semibold text-[#67E5EE] border border-[#67E5EE]/30 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>MarketSphere Track 2 · Growth & Monetization</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Re-engineering Retail Leverage into{" "}
            <span className="bg-gradient-to-r from-[#67E5EE] via-[#22D3EE] to-[#FF914D] bg-clip-text text-transparent">
              Trust-Anchored Micro-Syndicates.
            </span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Turn speculative solo leverage into 1-tap, peer-vouched copy trades on US equities (NVDA, TSLA, AAPL).
            Protected by non-custodial smart escrow, automated -10% circuit breakers, and instant domestic UPI settlement.
          </p>

          {/* Value Prop Badges */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-[#1E293B] bg-[#070A11]/80 p-3">
              <span className="text-[10px] text-[#64748B] block font-medium">Downside Cap</span>
              <span className="text-sm sm:text-base font-extrabold text-[#48D297] flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" /> -10% Max Loss
              </span>
              <span className="text-[9px] text-[#94A3B8]">Hard stop-loss protection</span>
            </div>

            <div className="rounded-xl border border-[#1E293B] bg-[#070A11]/80 p-3">
              <span className="text-[10px] text-[#64748B] block font-medium">Settlement Speed</span>
              <span className="text-sm sm:text-base font-extrabold text-[#FF914D]">
                &lt; 4.2 sec
              </span>
              <span className="text-[9px] text-[#94A3B8]">Direct UPI refund & credit</span>
            </div>

            <div className="rounded-xl border border-[#1E293B] bg-[#070A11]/80 p-3">
              <span className="text-[10px] text-[#64748B] block font-medium">Zero-Custody Escrow</span>
              <span className="text-sm sm:text-base font-extrabold text-white">
                100% Locked
              </span>
              <span className="text-[9px] text-[#94A3B8]">Lead never touches funds</span>
            </div>

            <div className="rounded-xl border border-[#1E293B] bg-[#070A11]/80 p-3">
              <span className="text-[10px] text-[#64748B] block font-medium">Leader Performance Cut</span>
              <span className="text-sm sm:text-base font-extrabold text-[#67E5EE]">
                5% on Profit
              </span>
              <span className="text-[9px] text-[#94A3B8]">Zero fee on losing trades</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Active Catalyst Syndicates
            <span className="rounded-full bg-[#67E5EE]/20 px-2 py-0.5 text-[11px] font-mono text-[#67E5EE]">
              {filteredSyndicates.length} Live
            </span>
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Organized around real-world market catalysts with audited lead win-rates
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Catalysts" },
            { id: "EARNINGS", label: "Earnings Breakouts" },
            { id: "HIGH_BETA", label: "10x High Beta" },
            { id: "CAMPUS", label: "Dr. AIT Verified Leads" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                filter === tab.id
                  ? "bg-[#67E5EE]/15 text-[#67E5EE] border-[#67E5EE]"
                  : "bg-[#0E1424] text-[#94A3B8] border-[#1E293B] hover:text-white hover:border-[#64748B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Syndicates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl border border-[#1E293B] bg-[#0E1424] animate-pulse p-6"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSyndicates.map((syndicate) => (
            <SyndicateCard
              key={syndicate.id}
              syndicate={syndicate}
              onQuickPledge={(syn) => setSelectedSyndicate(syn)}
            />
          ))}
        </div>
      )}

      {/* 1-Tap UPI Ingress Modal */}
      {selectedSyndicate && (
        <UpiModal
          syndicate={selectedSyndicate}
          isOpen={!!selectedSyndicate}
          onClose={() => setSelectedSyndicate(null)}
          onSuccess={(positionId) => {
            setSelectedSyndicate(null);
            router.push(`/position/${positionId}`);
          }}
        />
      )}
    </div>
  );
}
