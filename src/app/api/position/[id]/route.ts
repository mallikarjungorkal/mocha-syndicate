import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePnl } from "@/lib/calculations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const position = await prisma.position.findUnique({
      where: { id },
      include: {
        syndicate: {
          include: {
            leader: true,
          },
        },
        settlements: true,
      },
    });

    if (!position) {
      return NextResponse.json(
        { success: false, error: "Position not found" },
        { status: 404 }
      );
    }

    // Find the latest user pledge for this syndicate
    const latestPledge = await prisma.pledge.findFirst({
      where: { syndicateId: position.syndicateId },
      orderBy: { createdAt: "desc" },
    });

    const pledgeAmount = latestPledge?.amount || 100.0;
    const pnl = calculatePnl(
      pledgeAmount,
      position.syndicate.leverage,
      position.syndicate.entryPrice,
      position.currentPrice,
      position.syndicate.direction as "LONG" | "SHORT",
      position.syndicate.circuitBreakerPct,
      position.syndicate.targetReturnPct
    );

    return NextResponse.json({
      success: true,
      data: {
        ...position,
        pledgeAmount,
        pnl,
        latestPledge,
      },
    });
  } catch (error) {
    console.error("Error fetching position:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch position" },
      { status: 500 }
    );
  }
}
