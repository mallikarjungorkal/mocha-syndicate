import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePnl, calculateSettlement } from "@/lib/calculations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const position = await prisma.position.findUnique({
      where: { id },
      include: { syndicate: true },
    });

    if (!position) {
      return NextResponse.json(
        { success: false, error: "Position not found" },
        { status: 404 }
      );
    }

    if (position.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "Position already closed" },
        { status: 400 }
      );
    }

    const pledge = await prisma.pledge.findFirst({
      where: { syndicateId: position.syndicateId },
      orderBy: { createdAt: "desc" },
    });

    const pledgeAmount = pledge?.amount || 100.0;
    const pnl = calculatePnl(
      pledgeAmount,
      position.syndicate.leverage,
      position.syndicate.entryPrice,
      position.currentPrice,
      position.syndicate.direction as "LONG" | "SHORT",
      position.syndicate.circuitBreakerPct,
      position.syndicate.targetReturnPct
    );

    const breakdown = calculateSettlement(
      pledgeAmount,
      position.syndicate.leverage,
      pnl.positionReturnPct
    );

    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const refundUtr = `UPI/MANUAL/${randomCode}/AXIS`;

    // Create settlement record
    const settlement = await prisma.settlement.create({
      data: {
        positionId: position.id,
        userId: pledge?.userId || "user_demo",
        initialPledge: pledgeAmount,
        grossPayout: breakdown.grossPayout,
        leaderFee: breakdown.leaderFee,
        protocolFee: breakdown.protocolFee,
        netPayout: breakdown.netPayout,
        upiRefundUtr: refundUtr,
        settlementTimeSec: 3.5,
      },
    });

    // Update position
    const updatedPosition = await prisma.position.update({
      where: { id: position.id },
      data: {
        status: "SETTLED",
        exitPrice: position.currentPrice,
        exitReason: "MANUAL",
        settledAt: new Date(),
      },
    });

    // Update pledge status
    if (pledge) {
      await prisma.pledge.update({
        where: { id: pledge.id },
        data: { escrowStatus: "RELEASED" },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        position: updatedPosition,
        settlement,
        breakdown,
      },
    });
  } catch (error) {
    console.error("Error squaring off position:", error);
    return NextResponse.json(
      { success: false, error: "Failed to square off position" },
      { status: 500 }
    );
  }
}
