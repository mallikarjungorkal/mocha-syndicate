import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePnl, calculateSettlement } from "@/lib/calculations";
import { getFallbackPosition, getFallbackSettlement } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { positionId, action, targetPrice: customPrice } = body;

    let position: any = null;
    try {
      position = await prisma.position.findUnique({
        where: { id: positionId },
        include: { syndicate: true },
      });
    } catch (e) {
      console.warn("DB position lookup error in tick:", e);
    }

    if (!position) {
      position = getFallbackPosition(positionId);
    }

    const { entryPrice, leverage, targetPrice: tpPrice = entryPrice * 1.035, stopLossPrice: slPrice = entryPrice * 0.99 } = position.syndicate;
    let newPrice = position.currentPrice;

    if (action === "BULLISH_TP") {
      newPrice = tpPrice;
    } else if (action === "CIRCUIT_BREAKER_DROP") {
      newPrice = slPrice;
    } else if (action === "CUSTOM_PRICE" && typeof customPrice === "number") {
      newPrice = Number(customPrice.toFixed(2));
    } else if (action === "RANDOM_TICK") {
      const jitter = (Math.random() - 0.48) * 0.004 * entryPrice;
      newPrice = Number((position.currentPrice + jitter).toFixed(2));
    }

    // Check PnL and triggers
    const pnl = calculatePnl(
      100, // normalized reference
      leverage,
      entryPrice,
      newPrice,
      position.syndicate.direction as "LONG" | "SHORT",
      position.syndicate.circuitBreakerPct,
      position.syndicate.targetReturnPct
    );

    let updatedStatus = "ACTIVE";
    let exitReason: string | null = null;
    let settled = false;
    let settlementData = null;

    if (pnl.isCircuitBreakerHit) {
      updatedStatus = "TRIGGERED_CB";
      exitReason = "CIRCUIT_BREAKER";
      settled = true;
    } else if (pnl.isTakeProfitHit) {
      updatedStatus = "TRIGGERED_TP";
      exitReason = "TARGET_PROFIT";
      settled = true;
    }

    try {
      const updatedPosition = await prisma.position.update({
        where: { id: positionId },
        data: {
          currentPrice: newPrice,
          unrealizedPnlPct: pnl.positionReturnPct,
          status: updatedStatus,
          exitPrice: settled ? newPrice : null,
          exitReason: settled ? exitReason : null,
          settledAt: settled ? new Date() : null,
        },
      });

      if (settled) {
        const pledge = await prisma.pledge.findFirst({
          where: { syndicateId: position.syndicateId },
          orderBy: { createdAt: "desc" },
        });

        const pledgeAmount = pledge?.amount || 100.0;
        const breakdown = calculateSettlement(pledgeAmount, leverage, pnl.positionReturnPct);
        const randomCode = Math.floor(100000 + Math.random() * 900000);
        const refundUtr = `UPI/REFUND/${randomCode}/ICICI`;

        settlementData = await prisma.settlement.create({
          data: {
            positionId: position.id,
            userId: pledge?.userId || "user_demo",
            initialPledge: pledgeAmount,
            grossPayout: breakdown.grossPayout,
            leaderFee: breakdown.leaderFee,
            protocolFee: breakdown.protocolFee,
            netPayout: breakdown.netPayout,
            upiRefundUtr: refundUtr,
            settlementTimeSec: 3.82,
          },
        });

        if (pledge) {
          await prisma.pledge.update({
            where: { id: pledge.id },
            data: {
              escrowStatus: pnl.isCircuitBreakerHit ? "REFUNDED" : "RELEASED",
            },
          });
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          position: updatedPosition,
          currentPrice: newPrice,
          pnl,
          settled,
          settlement: settlementData,
        },
      });
    } catch (dbWriteErr) {
      console.warn("DB write failed in tick simulator (using mock response):", dbWriteErr);
      const simulatedPosition = {
        ...position,
        currentPrice: newPrice,
        unrealizedPnlPct: pnl.positionReturnPct,
        status: updatedStatus,
        exitPrice: settled ? newPrice : null,
        exitReason: settled ? exitReason : null,
      };

      if (settled) {
        settlementData = {
          ...getFallbackSettlement(positionId),
          id: `stl_sim_${Date.now()}`,
          positionId: position.id,
          initialPledge: 100.0,
          grossPayout: pnl.isCircuitBreakerHit ? 90.0 : 118.0,
          netPayout: pnl.isCircuitBreakerHit ? 90.0 : 117.05,
          upiRefundUtr: `UPI/SIM/${Date.now().toString().slice(-6)}/SHIELD`,
          settlementTimeSec: 3.82,
        };
      }

      return NextResponse.json({
        success: true,
        data: {
          position: simulatedPosition,
          currentPrice: newPrice,
          pnl,
          settled,
          settlement: settlementData,
        },
      });
    }
  } catch (error) {
    console.error("Error updating price tick:", error);
    return NextResponse.json(
      { success: false, error: "Tick simulation failed" },
      { status: 500 }
    );
  }
}
