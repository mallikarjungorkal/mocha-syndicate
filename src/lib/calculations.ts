export interface PnlResult {
  assetReturnPct: number;
  positionReturnPct: number;
  unrealizedPnlInr: number;
  currentValueInr: number;
  isCircuitBreakerHit: boolean;
  isTakeProfitHit: boolean;
}

export function calculatePnl(
  pledgeAmount: number,
  leverage: number,
  entryPrice: number,
  currentPrice: number,
  direction: "LONG" | "SHORT" = "LONG",
  circuitBreakerPct: number = -10.0,
  targetReturnPct: number = 18.0
): PnlResult {
  const priceDiff = direction === "LONG" 
    ? currentPrice - entryPrice 
    : entryPrice - currentPrice;
  
  const assetReturnPct = (priceDiff / entryPrice) * 100;
  const positionReturnPct = assetReturnPct * leverage;
  const unrealizedPnlInr = (pledgeAmount * positionReturnPct) / 100;
  const currentValueInr = Math.max(0, pledgeAmount + unrealizedPnlInr);

  const isCircuitBreakerHit = positionReturnPct <= circuitBreakerPct;
  const isTakeProfitHit = positionReturnPct >= targetReturnPct;

  return {
    assetReturnPct: Number(assetReturnPct.toFixed(2)),
    positionReturnPct: Number(positionReturnPct.toFixed(2)),
    unrealizedPnlInr: Number(unrealizedPnlInr.toFixed(2)),
    currentValueInr: Number(currentValueInr.toFixed(2)),
    isCircuitBreakerHit,
    isTakeProfitHit,
  };
}

export interface SettlementBreakdown {
  initialPledge: number;
  grossPayout: number;
  profitOrLoss: number;
  leaderFee: number;      // 5% cut on net profit only
  protocolFee: number;    // 0.05% on notional
  netPayout: number;
  capitalProtectedAmount: number;
}

export function calculateSettlement(
  pledgeAmount: number,
  leverage: number,
  positionReturnPct: number
): SettlementBreakdown {
  const notionalVolume = pledgeAmount * leverage;
  const profitOrLoss = (pledgeAmount * positionReturnPct) / 100;
  const grossPayout = Math.max(0, pledgeAmount + profitOrLoss);

  let leaderFee = 0;
  if (profitOrLoss > 0) {
    // 5% cut on profit
    leaderFee = Number((profitOrLoss * 0.05).toFixed(2));
  }

  // 0.05% exchange fee on notional volume, capped reasonably for micro-tickets
  const protocolFee = Number((notionalVolume * 0.0005).toFixed(2));

  const netPayout = Number(Math.max(0, grossPayout - leaderFee - protocolFee).toFixed(2));
  
  // If circuit breaker saved capital vs a complete 100% loss:
  const capitalProtectedAmount = positionReturnPct <= -10 
    ? Number((pledgeAmount * 0.9).toFixed(2)) 
    : 0;

  return {
    initialPledge: pledgeAmount,
    grossPayout: Number(grossPayout.toFixed(2)),
    profitOrLoss: Number(profitOrLoss.toFixed(2)),
    leaderFee,
    protocolFee,
    netPayout,
    capitalProtectedAmount,
  };
}
