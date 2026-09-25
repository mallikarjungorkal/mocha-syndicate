"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Sparkles, Wallet, Users, Flame, BarChart3, Scale, TrendingUp, Trophy } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

export function Navbar() {
  const pathname = usePathname();
  const { availableBalance, setIsWalletOpen } = useWallet();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#070A11]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & MarketSphere Info */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#67E5EE] via-[#22D3EE] to-[#FF914D] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#070A11]">
                <Shield className="h-5 w-5 text-[#67E5EE]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  MOCHA<span className="text-[#67E5EE]">SYNDICATE</span>
                </span>
              </div>
              <p className="text-[10px] text-[#94A3B8]">TradeX Labs · MarketSphere</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              pathname === "/"
                ? "bg-[#0E1424] text-[#67E5EE] border border-[#67E5EE]/30"
                : "text-[#94A3B8] hover:text-white hover:bg-[#0E1424]/60"
            }`}
          >
            Syndicates
          </Link>
          <Link
            href="/simulator"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              pathname === "/simulator" || pathname === "/analytics"
                ? "bg-[#0E1424] text-[#67E5EE] border border-[#67E5EE]/30"
                : "text-[#94A3B8] hover:text-white hover:bg-[#0E1424]/60"
            }`}
          >
            <TrendingUp className="h-3 w-3 text-[#67E5EE]" />
            Growth Simulator
          </Link>
          <Link
            href="/benchmark"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              pathname === "/benchmark"
                ? "bg-[#0E1424] text-[#48D297] border border-[#48D297]/30"
                : "text-[#94A3B8] hover:text-[#48D297] hover:bg-[#0E1424]/60"
            }`}
          >
            <Scale className="h-3 w-3 text-[#48D297]" />
            Strategy Benchmark
          </Link>
          <Link
            href="/leaderboard"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              pathname === "/leaderboard"
                ? "bg-[#0E1424] text-[#FF914D] border border-[#FF914D]/30"
                : "text-[#94A3B8] hover:text-[#FF914D] hover:bg-[#0E1424]/60"
            }`}
          >
            <Trophy className="h-3 w-3 text-[#FF914D]" />
            Leaderboard
          </Link>
          <Link
            href="/portfolio"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              pathname === "/portfolio"
                ? "bg-[#0E1424] text-[#67E5EE] border border-[#67E5EE]/30"
                : "text-[#94A3B8] hover:text-white hover:bg-[#0E1424]/60"
            }`}
          >
            Portfolio
          </Link>
        </nav>

        {/* User Pill & Shield Status */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-[#48D297]/10 px-3 py-1 border border-[#48D297]/30 text-[11px] text-[#48D297]">
            <Shield className="h-3.5 w-3.5" />
            <span className="font-semibold">-10% Hard Stop Active</span>
          </div>

          {/* Interactive Wallet Badge */}
          <button
            type="button"
            onClick={() => setIsWalletOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#0E1424] px-3 py-1.5 border border-[#1E293B] hover:border-[#67E5EE]/50 hover:bg-[#141C30] transition-all cursor-pointer shadow-sm group"
            title="Open Mocha Vault Wallet"
          >
            <div className="h-2 w-2 rounded-full bg-[#48D297] animate-pulse" />
            <div className="text-right">
              <p className="text-[11px] font-medium text-white group-hover:text-[#67E5EE] transition-colors">
                Priyanka S.
              </p>
              <p className="text-[10px] text-[#94A3B8] flex items-center gap-1 justify-end font-mono">
                <Wallet className="h-2.5 w-2.5 text-[#67E5EE]" />
                ₹{availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
