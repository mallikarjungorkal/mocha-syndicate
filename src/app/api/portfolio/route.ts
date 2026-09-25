import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_MOCK_PORTFOLIO } from "@/lib/mockData";

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

    // If database has no user or no trades, return the rich mock portfolio
    if (!user || settlements.length === 0) {
      console.log("Empty database state in portfolio API, returning Dr. AIT mock portfolio fallback");
      return NextResponse.json({
        success: true,
        data: DEFAULT_MOCK_PORTFOLIO,
      });
    }

    // Compute metrics
    const totalPledged = settlements.reduce((acc, s) => acc + (s.initialPledge || 0), 0);
    const totalPayout = settlements.reduce((acc, s) => acc + (s.netPayout || 0), 0);
    const netPnl = totalPayout - totalPledged;

    // Capital saved by circuit breaker
    const capitalSaved = settlements
      .filter((s) => s.position?.exitReason === "CIRCUIT_BREAKER")
      .reduce((acc, s) => acc + (s.netPayout || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        user,
        activePledges: DEFAULT_MOCK_PORTFOLIO.activePledges,
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
    console.error("Error querying portfolio from DB, returning mock fallback:", error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_MOCK_PORTFOLIO,
    });
  }
}
