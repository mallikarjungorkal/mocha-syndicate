import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePnl, calculateSettlement } from "@/lib/calculations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { positionId, action, targetPrice: customPrice } = body;

    const position = await prisma.position.findUnique({
      where: { id: positionId },
      include: { syndicate: true },
    });

    if (!position) {
      return NextResponse.json(
        { success: false, error: "Position not found" },
        { status: 404 }
      );
    }

    if (position.status !== "ACTIVE") {
      return NextResponse.json({
        success: true,
        data: {
          position,
          message: "Position already settled",
        },
      });
    }

    const { entryPrice, leverage, targetPrice: tpPrice, stopLossPrice: slPrice } = position.syndicate;
    let newPrice = position.currentPrice;

    if (action === "BULLISH_TP") {
      // Set to exactly hit or exceed target price (+18% ROI)
      newPrice = tpPrice;
    } else if (action === "CIRCUIT_BREAKER_DROP") {
      // Set to exactly hit or breach circuit breaker (-10% ROI)
      newPrice = slPrice;
    } else if (action === "CUSTOM_PRICE" && typeof customPrice === "number") {
      newPrice = Number(customPrice.toFixed(2));
    } else if (action === "RANDOM_TICK") {
      // Small tick between -0.2% and +0.2%
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

    // Update position in DB
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
      // Fetch latest user pledge
      const pledge = await prisma.pledge.findFirst({
        where: { syndicateId: position.syndicateId },
        orderBy: { createdAt: "desc" },
      });

      const pledgeAmount = pledge?.amount || 100.0;
      const breakdown = calculateSettlement(pledgeAmount, leverage, pnl.positionReturnPct);
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      const refundUtr = `UPI/REFUND/${randomCode}/ICICI`;

      // Record settlement
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
          settlementTimeSec: 3.82, // < 4.2s benchmark
        },
      });

      // Update pledge escrow status
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
  } catch (error) {
    console.error("Error updating price tick:", error);
    return NextResponse.json(
      { success: false, error: "Tick simulation failed" },
      { status: 500 }
    );
  }
}
