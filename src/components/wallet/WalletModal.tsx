"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import {
  Wallet,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Shield,
  CheckCircle2,
  Lock,
  Smartphone,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Building2,
  Info,
  Clock,
} from "lucide-react";

export function WalletModal() {
  const {
    availableBalance,
    escrowLocked,
    totalNetWorth,
    transactions,
    isWalletOpen,
    setIsWalletOpen,
    deposit,
    withdraw,
  } = useWallet();

  const [activeTab, setActiveTab] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");
  
  // Deposit form state
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [depositMethod, setDepositMethod] = useState<"GPay" | "PhonePe" | "Paytm" | "UPI">("GPay");
  const [customUpi, setCustomUpi] = useState<string>("priyanka@okhdfcbank");
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawDestination, setWithdrawDestination] = useState<string>("priyanka@okhdfcbank");
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawFeedback, setWithdrawFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isWalletOpen) return null;

  const handleQuickChip = (amt: number) => {
    setDepositAmount(amt);
    setDepositSuccessMsg(null);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;

    setIsDepositing(true);
    setDepositSuccessMsg(null);
    try {
      await deposit(depositAmount, depositMethod, depositMethod === "UPI" ? customUpi : undefined);
      setDepositSuccessMsg(`₹${depositAmount.toFixed(2)} added instantly via ${depositMethod}!`);
      setTimeout(() => setDepositSuccessMsg(null), 4000);
    } catch {
      // Handle error
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(withdrawAmount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setWithdrawFeedback({ success: false, message: "Please enter a valid amount." });
      return;
    }

    setIsWithdrawing(true);
    setWithdrawFeedback(null);
    try {
      const res = await withdraw(numAmt, withdrawDestination);
      setWithdrawFeedback(res);
      if (res.success) {
        setWithdrawAmount("");
        setTimeout(() => setWithdrawFeedback(null), 4000);
      }
    } catch {
      setWithdrawFeedback({ success: false, message: "Network error occurred." });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWalletOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#1E293B] bg-[#0E1424] p-5 sm:p-7 shadow-2xl z-10 space-y-6 text-white custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#67E5EE]/20 to-[#48D297]/20 border border-[#67E5EE]/30">
              <Wallet className="h-5 w-5 text-[#67E5EE]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">Mocha Syndicate Wallet</h2>
                <span className="rounded-full bg-[#48D297]/15 border border-[#48D297]/30 px-2 py-0.5 text-[10px] font-bold text-[#48D297]">
                  Verified UPI 2.0
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">Priyanka S. · @priyanka_s</p>
            </div>
          </div>
          <button
            onClick={() => setIsWalletOpen(false)}
            className="rounded-xl border border-[#1E293B] bg-[#070A11] p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Available Cash */}
          <div className="rounded-2xl border border-[#67E5EE]/30 bg-gradient-to-b from-[#67E5EE]/10 to-[#070A11] p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#67E5EE] uppercase tracking-wider">Available Cash</span>
              <Sparkles className="h-3.5 w-3.5 text-[#67E5EE]" />
            </div>
            <p className="mt-2 font-mono text-2xl font-black text-white">
              ₹{availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="inline-block mt-1 text-[10px] text-[#48D297] font-medium">1-Tap Ingress Ready</span>
          </div>

          {/* Escrow Locked */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#070A11] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Escrow Locked</span>
              <Lock className="h-3.5 w-3.5 text-[#FF914D]" />
            </div>
            <p className="mt-2 font-mono text-2xl font-black text-white">
              ₹{escrowLocked.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="inline-block mt-1 text-[10px] text-[#FF914D] font-medium">NVDA 10x Catalyst</span>
          </div>

          {/* Total Net Worth */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#070A11] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Total Net Worth</span>
              <Shield className="h-3.5 w-3.5 text-[#48D297]" />
            </div>
            <p className="mt-2 font-mono text-2xl font-black text-white">
              ₹{totalNetWorth.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="inline-block mt-1 text-[10px] text-[#94A3B8] font-medium">90% Capital Shielded</span>
          </div>
        </div>

        {/* Action Tabs: Deposit vs Withdraw */}
        <div className="flex rounded-2xl border border-[#1E293B] bg-[#070A11] p-1">
          <button
            onClick={() => setActiveTab("DEPOSIT")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "DEPOSIT"
                ? "bg-[#67E5EE] text-black shadow-lg shadow-[#67E5EE]/20"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <ArrowDownLeft className="h-3.5 w-3.5" />
            Quick Deposit (1-Tap UPI)
          </button>
          <button
            onClick={() => setActiveTab("WITHDRAW")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "WITHDRAW"
                ? "bg-[#67E5EE] text-black shadow-lg shadow-[#67E5EE]/20"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Withdraw to Bank / UPI
          </button>
        </div>

        {/* TAB 1: DEPOSIT */}
        {activeTab === "DEPOSIT" && (
          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Select Amount to Add (₹)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[100, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickChip(amt)}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                      depositAmount === amt
                        ? "border-[#67E5EE] bg-[#67E5EE]/15 text-[#67E5EE]"
                        : "border-[#1E293B] bg-[#070A11] text-[#94A3B8] hover:text-white hover:border-[#334155]"
                    }`}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-[#94A3B8]">
                  ₹
                </span>
                <input
                  type="number"
                  min="50"
                  max="100000"
                  value={depositAmount || ""}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  placeholder="Custom amount"
                  className="w-full rounded-xl border border-[#1E293B] bg-[#070A11] py-2.5 pl-8 pr-4 font-mono text-sm text-white focus:border-[#67E5EE] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["GPay", "PhonePe", "Paytm", "UPI"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setDepositMethod(method)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      depositMethod === method
                        ? "border-[#67E5EE] bg-[#67E5EE]/15 text-white"
                        : "border-[#1E293B] bg-[#070A11] text-[#94A3B8] hover:border-[#334155]"
                    }`}
                  >
                    <Smartphone className="h-3 w-3 text-[#67E5EE]" />
                    {method}
                  </button>
                ))}
              </div>
              {depositMethod === "UPI" && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customUpi}
                    onChange={(e) => setCustomUpi(e.target.value)}
                    placeholder="Enter UPI VPA (e.g. user@okhdfcbank)"
                    className="w-full rounded-xl border border-[#1E293B] bg-[#070A11] py-2 px-3 text-xs text-white focus:border-[#67E5EE] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Notification / Feedback */}
            {depositSuccessMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-[#48D297]/10 border border-[#48D297]/30 p-3 text-xs text-[#48D297]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{depositSuccessMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isDepositing || depositAmount <= 0}
              className="w-full rounded-xl bg-gradient-to-r from-[#67E5EE] to-[#22D3EE] py-3 text-xs font-extrabold text-black hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#67E5EE]/20"
            >
              {isDepositing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processing Domestic UPI Ingress...</span>
                </>
              ) : (
                <>
                  <ArrowDownLeft className="h-4 w-4" />
                  <span>Add ₹{depositAmount || 0} Cash via {depositMethod}</span>
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-[#94A3B8] flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3 text-[#48D297]" />
              Zero forex LRS fees · Verified domestic UPI webhook · Instant settlement
            </p>
          </form>
        )}

        {/* TAB 2: WITHDRAW */}
        {activeTab === "WITHDRAW" && (
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#94A3B8]">
                  Amount to Withdraw (₹)
                </label>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(availableBalance.toString())}
                  className="text-[11px] font-bold text-[#67E5EE] hover:underline"
                >
                  MAX (₹{availableBalance.toFixed(2)})
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-[#94A3B8]">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  max={availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-[#1E293B] bg-[#070A11] py-2.5 pl-8 pr-4 font-mono text-sm text-white focus:border-[#67E5EE] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Recipient UPI ID or Bank Account
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="text"
                  value={withdrawDestination}
                  onChange={(e) => setWithdrawDestination(e.target.value)}
                  placeholder="e.g. priyanka@okhdfcbank or HDFC0001234:918237..."
                  className="w-full rounded-xl border border-[#1E293B] bg-[#070A11] py-2.5 pl-10 pr-4 text-xs text-white focus:border-[#67E5EE] focus:outline-none font-mono"
                />
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-[#070A11] border border-[#1E293B] px-3 py-2 text-[11px] text-[#94A3B8]">
                <span>Exit Fee: <strong className="text-[#48D297]">0% (Free)</strong></span>
                <span>Payout Speed: <strong className="text-[#67E5EE]">&lt; 4.2s IMPS/UPI</strong></span>
              </div>
            </div>

            {withdrawFeedback && (
              <div
                className={`flex items-center gap-2 rounded-xl p-3 text-xs border ${
                  withdrawFeedback.success
                    ? "bg-[#48D297]/10 border-[#48D297]/30 text-[#48D297]"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {withdrawFeedback.success ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <Info className="h-4 w-4 shrink-0" />
                )}
                <span>{withdrawFeedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
              className="w-full rounded-xl bg-gradient-to-r from-[#67E5EE] to-[#22D3EE] py-3 text-xs font-extrabold text-black hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#67E5EE]/20"
            >
              {isWithdrawing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Initiating IMPS/UPI Webhook Transfer...</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Withdraw Now ({withdrawAmount ? `₹${parseFloat(withdrawAmount).toFixed(2)}` : "₹0"})</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* RECENT TRANSACTION LEDGER */}
        <div className="space-y-3 pt-2 border-t border-[#1E293B]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#67E5EE]" />
              Recent Transaction Ledger
            </h3>
            <span className="text-[10px] text-[#94A3B8]">Immutable Webhook Log</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {transactions.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#070A11] p-3 text-xs transition-colors hover:border-[#334155]"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        isPositive
                          ? "bg-[#48D297]/15 text-[#48D297]"
                          : "bg-[#FF914D]/15 text-[#FF914D]"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{tx.description}</p>
                      <p className="text-[10px] font-mono text-[#94A3B8]">{tx.utr} · {tx.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-mono font-bold ${
                        isPositive ? "text-[#48D297]" : "text-white"
                      }`}
                    >
                      {isPositive ? "+" : ""}₹{Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <span className="text-[9px] uppercase tracking-wider text-[#67E5EE] font-medium">
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#070A11] p-3 flex items-center gap-2.5 text-xs text-[#94A3B8]">
          <Shield className="h-4 w-4 text-[#48D297] shrink-0" />
          <p className="text-[11px] leading-relaxed">
            Non-custodial smart escrow protocol. Downside is hard-bounded at <strong>-10%</strong> with 90% capital preservation on all open catalyst syndicates.
          </p>
        </div>
      </div>
    </div>
  );
}
