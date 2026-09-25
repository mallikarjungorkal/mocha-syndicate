import { Shield, CheckCircle2 } from "lucide-react";

interface ShieldBadgeProps {
  threshold?: number;
  className?: string;
  showDetails?: boolean;
}

export function ShieldBadge({
  threshold = -10.0,
  className = "",
  showDetails = false,
}: ShieldBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#48D297]/15 border border-[#48D297]/40 px-2.5 py-1 text-xs font-semibold text-[#48D297] shadow-sm ${className}`}
    >
      <Shield className="h-3.5 w-3.5 fill-[#48D297]/20 text-[#48D297]" />
      <span>{threshold}% Circuit Breaker</span>
      {showDetails && (
        <span className="text-[10px] text-[#A1AEC5] font-normal border-l border-[#48D297]/30 pl-1.5">
          90% Capital Guaranteed Refund
        </span>
      )}
    </div>
  );
}
