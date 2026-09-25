"use client";

import { useState } from "react";
import { Shield, Check, Lock, Smartphone, ArrowRight, Loader2, X } from "lucide-react";

interface UpiModalProps {
  syndicate: {
    id: string;
    title: string;
    assetSymbol: string;
    leverage: number;
    minPledge: number;
    circuitBreakerPct: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (positionId: string) => void;
}

export function UpiModal({ syndicate, isOpen, onClose, onSuccess }: UpiModalProps) {
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<string>("gpay");
  const [status, setStatus] = useState<"SELECT" | "PROCESSING" | "SUCCESS">("SELECT");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!isOpen) return null;

  const currentAmount = customAmount ? Number(customAmount) : amount;

  const handlePay = async () => {
    if (currentAmount < syndicate.minPledge) {
      setErrorMsg(`Minimum pledge is ₹${syndicate.minPledge}`);
      return;
    }

    setStatus("PROCESSING");
    setErrorMsg("");

    try {
      // Simulate UPI intent call & NPCI switch delay
      await new Promise((res) => setTimeout(res, 1400));

      const res = await fetch("/api/escrow/pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syndicateId: syndicate.id,
          amount: currentAmount,
          userId: "user_demo",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Pledge failed");
      }

      setUtrNumber(data.data.upiUtr);
      setStatus("SUCCESS");

      // After 1.2s on success state, proceed to trade room
      setTimeout(() => {
        onSuccess(data.data.positionId);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to process simulated UPI payment");
      setStatus("SELECT");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0E1424] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-4 bg-[#070A11]/60">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#67E5EE]/10 border border-[#67E5EE]/30">
              <Smartphone className="h-4 w-4 text-[#67E5EE]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">1-Tap UPI Micro-Pledge</h3>
              <p className="text-[11px] text-[#94A3B8]">Non-Custodial Smart Escrow Ingress</p>
            </div>
          </div>
          {status !== "PROCESSING" && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content based on state */}
        {status === "SELECT" && (
          <div className="p-6 space-y-5">
            {/* Syndicate Context */}
            <div className="rounded-xl border border-[#1E293B] bg-[#070A11]/50 p-3.5 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#94A3B8]">Syndicate</p>
                <p className="text-xs font-semibold text-white">{syndicate.title}</p>
              </div>
              <div className="text-right">
                <span className="rounded bg-[#FF914D]/20 px-2 py-0.5 text-[10px] font-bold text-[#FF914D]">
                  {syndicate.leverage}x Lev
                </span>
              </div>
            </div>

            {/* Quick Amount Selector */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-2">
                Select Pledge Amount (INR)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[50, 100, 250].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      amount === amt && !customAmount
                        ? "bg-[#67E5EE]/15 text-[#67E5EE] border-[#67E5EE] shadow-sm shadow-[#67E5EE]/20"
                        : "bg-[#070A11] text-[#94A3B8] border-[#1E293B] hover:border-[#67E5EE]/50 hover:text-white"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="mt-2.5">
                <input
                  type="number"
                  placeholder="Or enter custom (e.g. ₹500)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full rounded-xl border border-[#1E293B] bg-[#070A11] px-3.5 py-2 text-xs text-white placeholder-[#64748B] focus:border-[#67E5EE] focus:outline-none"
                />
              </div>
            </div>

            {/* UPI App Selection */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-2">
                Simulated UPI Provider
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "gpay", name: "Google Pay", color: "#4285F4" },
                  { id: "phonepe", name: "PhonePe", color: "#5F259F" },
                  { id: "paytm", name: "Paytm", color: "#00BAF2" },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedApp(app.id)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      selectedApp === app.id
                        ? "bg-[#070A11] text-white border-[#67E5EE]"
                        : "bg-[#070A11]/60 text-[#94A3B8] border-[#1E293B] hover:text-white"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: app.color }}
                    />
                    {app.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Downside Protection Guarantee Notice */}
            <div className="rounded-xl border border-[#48D297]/30 bg-[#48D297]/5 p-3 flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-[#48D297] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#A1AEC5] leading-relaxed">
                <strong className="text-white">Non-Custodial Circuit Breaker:</strong> If this position reaches{" "}
                <span className="text-[#48D297] font-semibold">{syndicate.circuitBreakerPct}%</span>, the smart escrow automatically squares off and returns{" "}
                <span className="text-white font-semibold">₹{(currentAmount * 0.9).toFixed(0)} (90%)</span> to your UPI ID.
              </p>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-800/40 p-2 rounded-lg">
                {errorMsg}
              </p>
            )}

            {/* Action Button */}
            <button
              onClick={handlePay}
              className="w-full rounded-xl bg-gradient-to-r from-[#67E5EE] to-[#22D3EE] py-3 text-xs font-bold text-black shadow-lg shadow-[#67E5EE]/25 hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5" />
              Pay ₹{currentAmount} via 1-Tap UPI
            </button>
          </div>
        )}

        {status === "PROCESSING" && (
          <div className="p-10 text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#67E5EE]/10 border border-[#67E5EE]/30">
                <Loader2 className="h-8 w-8 text-[#67E5EE] animate-spin" />
              </div>
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Processing UPI Transaction</h4>
              <p className="text-xs text-[#94A3B8] mt-1">
                Authenticating with NPCI switch & locking escrow...
              </p>
            </div>
            <div className="text-[11px] font-mono text-[#67E5EE] bg-[#070A11] py-1.5 px-3 rounded-lg inline-block border border-[#1E293B]">
              VPA: mochatrade.escrow@icici
            </div>
          </div>
        )}

        {status === "SUCCESS" && (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#48D297]/20 border border-[#48D297] text-[#48D297]">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Escrow Deposit Confirmed!</h4>
              <p className="text-xs text-[#94A3B8] mt-1">
                ₹{currentAmount} locked in non-custodial smart escrow
              </p>
            </div>
            <div className="rounded-xl border border-[#1E293B] bg-[#070A11] p-3 text-left space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94A3B8]">Reference / UTR:</span>
                <span className="font-mono text-[#67E5EE]">{utrNumber}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94A3B8]">Protection Shield:</span>
                <span className="text-[#48D297] font-semibold">-10% Hard Stop Active</span>
              </div>
            </div>
            <p className="text-[11px] text-[#48D297] flex items-center justify-center gap-1">
              Launching live trade room <ArrowRight className="h-3 w-3" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
