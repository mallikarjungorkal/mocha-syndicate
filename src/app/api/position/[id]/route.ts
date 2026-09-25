import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePnl } from "@/lib/calculations";
import { getFallbackPosition } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
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
      console.log(`Position ${id} not found in DB, using mock fallback`);
      return NextResponse.json({ success: true, data: getFallbackPosition(id) });
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
    console.error(`Error fetching position ${id} from DB, using fallback:`, error);
    return NextResponse.json({ success: true, data: getFallbackPosition(id) });
  }
}
