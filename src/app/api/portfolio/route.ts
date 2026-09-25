import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: "user_demo" },
      include: {
        pledges: {
          include: {
            syndicate: {
              include: { leader: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const settlements = await prisma.settlement.findMany({
      include: {
        position: {
          include: {
            syndicate: {
              include: { leader: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute metrics
    const totalPledged = settlements.reduce((acc, s) => acc + s.initialPledge, 0);
    const totalPayout = settlements.reduce((acc, s) => acc + s.netPayout, 0);
    const netPnl = totalPayout - totalPledged;
    
    // Capital saved by circuit breaker
    const capitalSaved = settlements
      .filter((s) => s.position.exitReason === "CIRCUIT_BREAKER")
      .reduce((acc, s) => acc + s.netPayout, 0);

    return NextResponse.json({
      success: true,
      data: {
        user,
        settlements,
        metrics: {
          totalPledged,
          totalPayout,
          netPnl,
          capitalSaved,
          tradesCount: settlements.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}
