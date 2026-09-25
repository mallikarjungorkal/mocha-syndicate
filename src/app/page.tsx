"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Users, 
  ArrowRight, 
  Award, 
  CheckCircle2,
  Search,
  X,
  Filter,
  GraduationCap
} from "lucide-react";
import { SyndicateCard } from "@/components/syndicate/SyndicateCard";
import { UpiModal } from "@/components/payment/UpiModal";
import { DEFAULT_MOCK_SYNDICATES } from "@/lib/mockData";

export default function DiscoveryHub() {
  const router = useRouter();
  const [syndicates, setSyndicates] = useState<any[]>(DEFAULT_MOCK_SYNDICATES);
  const [loading, setLoading] = useState(false);
  const [selectedSyndicate, setSelectedSyndicate] = useState<any | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

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

  // Client-side combined Search & Filter
  const filteredSyndicates = useMemo(() => {
    return syndicates.filter((syn) => {
      const leader = syn.leader || syn.lead || {};
      const leadName = (leader.name || "").toLowerCase();
      const leadHandle = (leader.handle || "").toLowerCase();
      const campus = (leader.campus || "").toLowerCase();
      const ticker = (syn.assetSymbol || syn.ticker || "").toLowerCase();
      const assetName = (syn.assetName || "").toLowerCase();
      const title = (syn.title || "").toLowerCase();
      const catalyst = (syn.catalyst || "").toLowerCase();
      const category = (syn.category || "").toLowerCase();

      // Category filter check
      if (categoryFilter === "TECH_AI") {
        if (!category.includes("tech") && !catalyst.includes("ai") && !title.includes("ai") && !ticker.match(/nvda|msft|googl|meta|amd|pltr|arm|tsm|avgo/i)) {
          return false;
        }
      } else if (categoryFilter === "CRYPTO") {
        if (!category.includes("crypto") && !ticker.match(/btc|eth|coin/i)) {
          return false;
        }
      } else if (categoryFilter === "EARNINGS") {
        if (!catalyst.includes("earning") && !title.includes("earning") && !category.includes("earnings")) {
          return false;
        }
      } else if (categoryFilter === "HIGH_BETA") {
        if ((syn.leverage || 0) < 10 && !category.includes("high-beta")) {
          return false;
        }
      }

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          leadName.includes(query) ||
          leadHandle.includes(query) ||
          campus.includes(query) ||
          ticker.includes(query) ||
          assetName.includes(query) ||
          title.includes(query) ||
          catalyst.includes(query);

        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [syndicates, searchQuery, categoryFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("ALL");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-gradient-to-b from-[#0E1424] via-[#070A11] to-[#070A11] p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-[#67E5EE]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-72 w-72 rounded-full bg-[#FF914D]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#67E5EE]/10 px-3.5 py-1 text-xs font-semibold text-[#67E5EE] border border-[#67E5EE]/30 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>MochaTrade · Catalyst Syndicates</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Re-engineering Retail Leverage into{" "}
            <span className="bg-gradient-to-r from-[#67E5EE] via-[#22D3EE] to-[#FF914D] bg-clip-text text-transparent">
              Trust-Anchored Campus Micro-Syndicates.
            </span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Follow audited student quant leads from top universities (IIT Bombay, BITS Pilani, RVCE, IIT Madras).
            Mirror-trade US equities and crypto perps with pooled 10x leverage, non-custodial escrow, and automated -10% circuit breakers preserving 90% capital.
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

      {/* Search, Filter & Section Header Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Active Catalyst Syndicates
              <span className="rounded-full bg-[#67E5EE]/20 px-2.5 py-0.5 text-xs font-mono text-[#67E5EE] font-bold">
                {filteredSyndicates.length} Available
              </span>
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Discover student leads, check audited win-rates, and mirror verified trades
            </p>
          </div>

          {/* Interactive Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trader, college, asset (NVDA, BTC)..."
              className="w-full rounded-xl border border-[#1E293B] bg-[#0E1424] pl-9 pr-8 py-2 text-xs text-white placeholder-[#64748B] focus:border-[#67E5EE] focus:outline-none focus:ring-1 focus:ring-[#67E5EE] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "All Syndicates" },
              { id: "TECH_AI", label: "Tech & AI" },
              { id: "CRYPTO", label: "Crypto Perps" },
              { id: "EARNINGS", label: "Earnings Breakouts" },
              { id: "HIGH_BETA", label: "10x High Beta" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  categoryFilter === tab.id
                    ? "bg-[#67E5EE]/15 text-[#67E5EE] border-[#67E5EE]"
                    : "bg-[#0E1424] text-[#94A3B8] border-[#1E293B] hover:text-white hover:border-[#64748B]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-[#64748B]">
            Showing <strong className="text-white">{filteredSyndicates.length}</strong> of {syndicates.length} syndicates
          </div>
        </div>
      </div>

      {/* Syndicates Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-84 rounded-2xl border border-[#1E293B] bg-[#0E1424] animate-pulse p-6"
            />
          ))}
        </div>
      ) : filteredSyndicates.length === 0 ? (
        <div className="rounded-3xl border border-[#1E293B] bg-[#0E1424] p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E293B]/80 text-[#94A3B8]">
            <Search className="h-6 w-6 text-[#67E5EE]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No syndicates match your search</h3>
            <p className="text-xs text-[#94A3B8]">
              No active syndicates found for &quot;{searchQuery || categoryFilter}&quot;. Try searching another ticker, college, or trader name.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="rounded-xl bg-[#67E5EE] px-4 py-2 text-xs font-bold text-black hover:bg-[#22D3EE] transition-colors cursor-pointer"
          >
            Clear Search & Filters
          </button>
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
