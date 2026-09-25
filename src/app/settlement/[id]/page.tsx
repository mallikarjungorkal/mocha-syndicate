"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Shield, 
  ArrowRight, 
  Receipt, 
  Clock, 
  Share2, 
  BookOpen, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  X,
  MessageCircle,
  Send,
  Flame
} from "lucide-react";

export default function SettlementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [settlement, setSettlement] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSettlement();
  }, [resolvedParams.id]);

  const fetchSettlement = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/settlement/${resolvedParams.id}`);
      const result = await res.json();
      if (result.success) {
        setSettlement(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 animate-pulse space-y-6">
        <div className="h-40 bg-[#0E1424] rounded-3xl" />
        <div className="h-64 bg-[#0E1424] rounded-2xl" />
      </div>
    );
  }

  if (!settlement) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <p className="text-sm text-red-400">Settlement record not found.</p>
        <Link href="/" className="text-xs text-[#67E5EE]">← Back to Feed</Link>
      </div>
    );
  }

  const { position } = settlement;
  const isCircuitBreaker = position.exitReason === "CIRCUIT_BREAKER";
  const isTakeProfit = position.exitReason === "TARGET_PROFIT";
  const isProfit = settlement.netPayout > settlement.initialPledge;

  const referralLink = `https://mocha.trade/drait/priyanka_s`;
  const shareMessage = isCircuitBreaker
    ? `🛡️ Tested Mocha Syndicate on NVDA 10x! Market dipped, but the -10% Circuit Breaker fired and refunded 90% (₹${settlement.netPayout.toFixed(2)}) straight to my UPI in 3.8s! No liquidation wipeouts. Join my Dr. AIT Hostel Block 1 cohort: ${referralLink}`
    : `🚀 Hit +18% on NVDA 10x with Mocha Syndicate! ₹${settlement.netPayout.toFixed(2)} settled straight to my UPI. Zero Telegram scammers, pure audited campus alpha. Join: ${referralLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Simulated UPI Credit Notification */}
      <div className="rounded-3xl border border-[#48D297]/40 bg-gradient-to-b from-[#48D297]/15 via-[#0E1424] to-[#070A11] p-6 sm:p-8 text-center space-y-4 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#48D297]/20 border border-[#48D297] text-[#48D297]">
          {isCircuitBreaker ? (
            <Shield className="h-8 w-8 text-[#48D297]" />
          ) : (
            <CheckCircle2 className="h-8 w-8 text-[#48D297]" />
          )}
        </div>

        <div>
          <span className="inline-block rounded-full bg-[#48D297]/20 px-3 py-1 text-xs font-bold text-[#48D297] border border-[#48D297]/40 mb-2">
            {isCircuitBreaker ? "-10% Circuit Breaker Executed" : "Target Exit Settled"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            ₹{settlement.netPayout.toFixed(2)} Credited to UPI
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Simulated credit sent to <span className="text-white font-medium">priyanka@oksbi</span>
          </p>
        </div>

        {/* UPI Settlement Velocity Benchmark (<4.2s) & Share Button */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <div className="inline-flex items-center gap-2 rounded-xl bg-[#070A11] px-4 py-2 border border-[#1E293B] text-xs">
            <Clock className="h-4 w-4 text-[#FF914D]" />
            <span className="text-[#94A3B8]">UPI Webhook Roundtrip:</span>
            <span className="font-bold text-[#FF914D] font-mono">
              {settlement.settlementTimeSec}s
            </span>
            <span className="text-[10px] text-[#48D297] bg-[#48D297]/10 px-1.5 py-0.5 rounded border border-[#48D297]/30">
              Beats &lt; 4.2s Target
            </span>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="rounded-xl bg-gradient-to-r from-[#67E5EE] via-[#22D3EE] to-[#FF914D] p-0.5 shadow-lg shadow-[#67E5EE]/20 hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-1.5 rounded-[10px] bg-[#070A11] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-transparent hover:text-black transition-colors">
              <Share2 className="h-3.5 w-3.5 text-[#67E5EE]" />
              <span>Share P&L & Shield Receipt</span>
            </div>
          </button>
        </div>
      </div>

      {/* Itemized Settlement Receipt Card */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Receipt className="h-4 w-4 text-[#67E5EE]" />
            Itemized Settlement Ledger
          </h3>
          <span className="text-[10px] font-mono text-[#94A3B8]">{settlement.upiRefundUtr}</span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Initial User Pledge:</span>
            <span className="font-mono text-white font-semibold">₹{settlement.initialPledge.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Gross Position Exit Value:</span>
            <span className={`font-mono font-semibold ${isProfit ? "text-[#48D297]" : "text-white"}`}>
              ₹{settlement.grossPayout.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Leader Performance Fee (5% of Net Profit):</span>
            <span className="font-mono text-[#FF914D]">
              -₹{settlement.leaderFee.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#94A3B8]">MochaTrade Protocol Fee (0.05% on Notional):</span>
            <span className="font-mono text-[#94A3B8]">
              -₹{settlement.protocolFee.toFixed(2)}
            </span>
          </div>

          <div className="pt-2 border-t border-[#1E293B] flex justify-between text-sm font-bold">
            <span className="text-white">Net UPI Refund / Payout:</span>
            <span className="text-[#48D297] font-mono">₹{settlement.netPayout.toFixed(2)}</span>
          </div>
        </div>

        {isCircuitBreaker && (
          <div className="rounded-xl border border-[#48D297]/30 bg-[#48D297]/10 p-3 flex items-start gap-2.5 mt-3">
            <Shield className="h-4 w-4 text-[#48D297] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#A1AEC5]">
              <strong className="text-white">Capital Saved:</strong> On traditional leveraged venues, an adverse move could wipe out 100% of your ₹{settlement.initialPledge}.
              The MochaTrade circuit breaker preserved <strong className="text-[#48D297]">₹{settlement.netPayout.toFixed(2)} (90%)</strong> of your principal.
            </p>
          </div>
        )}
      </div>

      {/* Post-Trade Educational Teardown */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0E1424] p-6 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#67E5EE]" />
          Post-Trade Learning Teardown
        </h3>

        <div className="rounded-xl border border-[#1E293B] bg-[#070A11] p-4 space-y-2">
          <p className="text-xs font-bold text-white">
            {isTakeProfit ? "Why this trade achieved its target:" : "Why the circuit breaker fired:"}
          </p>
          <p className="text-xs text-[#A1AEC5] leading-relaxed">
            {isTakeProfit ? (
              <>
                The Nvidia Q3 catalyst played out cleanly with data center demand surging above expectations.
                The syndicate's 10x leveraged position reached +18.0% ROI ($142.52 mark price), triggering the automated limit take-profit order without manual intervention.
              </>
            ) : (
              <>
                Intraday market turbulence caused Nvidia shares to dip by 1.0% ($138.60).
                Because 10x leverage magnifies losses, the -10% hard stop fired programmatically, shutting down the position before further liquidation could occur.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="w-full sm:flex-1 rounded-xl bg-gradient-to-r from-[#67E5EE] to-[#22D3EE] py-3 text-center text-xs font-bold text-black shadow-lg shadow-[#67E5EE]/20 hover:opacity-95 transition-opacity"
        >
          Explore Next Syndicate
        </Link>
        <button
          onClick={() => setShowShareModal(true)}
          className="w-full sm:flex-1 rounded-xl border border-[#67E5EE]/40 bg-[#0E1424] hover:bg-[#67E5EE]/10 py-3 text-center text-xs font-semibold text-[#67E5EE] transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share Referral Card (Viral Loop)
        </button>
      </div>

      {/* Viral Share Card & Referral Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#1E293B] bg-[#0E1424] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF914D]/15 text-[#FF914D]">
                  <Flame className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Campus Viral Referral Engine</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="rounded-lg p-1 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Visual Social Card Preview */}
            <div className="rounded-2xl border-2 border-[#67E5EE]/40 bg-gradient-to-br from-[#070A11] via-[#0E1424] to-[#070A11] p-5 shadow-inner space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-wider text-[#67E5EE] uppercase">
                  MOCHA SYNDICATE · DR. AIT COHORT
                </span>
                <span className="rounded-full bg-[#48D297]/15 px-2 py-0.5 text-[9px] font-bold text-[#48D297] border border-[#48D297]/30">
                  VERIFIED AUDIT
                </span>
              </div>

              <div>
                <span className="text-xs text-[#94A3B8] block">Trade Asset & Catalyst</span>
                <h4 className="text-sm font-black text-white">
                  {position.syndicate.assetSymbol} ({position.syndicate.leverage}x Leverage)
                </h4>
              </div>

              {/* Big Outcome Banner */}
              <div className={`p-3.5 rounded-xl border ${
                isCircuitBreaker
                  ? "bg-[#48D297]/10 border-[#48D297]/40 text-[#48D297]"
                  : "bg-[#67E5EE]/10 border-[#67E5EE]/40 text-[#67E5EE]"
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-wider block">Outcome</span>
                <p className="text-lg font-black font-mono">
                  {isCircuitBreaker ? "90% Capital Preserved" : `+₹${(settlement.netPayout - settlement.initialPledge).toFixed(2)} Net Profit`}
                </p>
                <p className="text-[11px] text-[#A1AEC5] mt-0.5">
                  {isCircuitBreaker
                    ? `Circuit Breaker refunded ₹${settlement.netPayout.toFixed(2)} in 3.82s`
                    : `+18% Target reached with lead @${position.syndicate.leader.handle}`}
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-[#94A3B8] pt-1">
                <span>Trader: Priyanka S. (Hostel Block 1)</span>
                <span className="font-mono text-[#67E5EE]">{settlement.upiRefundUtr}</span>
              </div>
            </div>

            {/* Referral Link & 1-Click Copy */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#94A3B8]">
                Your Campus Invite Link (Negative-CAC Loop)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 rounded-xl border border-[#1E293B] bg-[#070A11] px-3 py-2 text-xs font-mono text-[#67E5EE] select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="rounded-xl bg-[#67E5EE] hover:bg-[#67E5EE]/90 py-2 px-3 text-xs font-bold text-black flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Direct Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 py-2.5 px-3 text-xs font-bold text-[#25D366] flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Share
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-[#0088CC]/40 bg-[#0088CC]/10 hover:bg-[#0088CC]/20 py-2.5 px-3 text-xs font-bold text-[#0088CC] flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="h-4 w-4" />
                Telegram Share
              </a>
            </div>

            {/* K-Factor Viral Engine Callout */}
            <div className="rounded-xl border border-[#FF914D]/30 bg-[#FF914D]/5 p-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Hostel Viral Coefficient: K = 1.34</span>
                <span className="text-[10px] text-[#A1AEC5]">Every verified trade receipt shared brings 1.34 new campus traders</span>
              </div>
              <span className="rounded-full bg-[#FF914D]/20 px-2 py-0.5 text-[10px] font-bold text-[#FF914D]">
                Negative CAC
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
