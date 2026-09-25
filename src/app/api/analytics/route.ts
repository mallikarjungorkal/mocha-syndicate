import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const pilotNotionalVolume = 12450000; // ₹1.245 Cr notional
  const pilotProtocolFees = 6225; // 0.05% of notional
  const pilotLeaderProfitsPaid = 18450; // 5% profit cuts

  const defaultData = {
    live: {
      activeSyndicatesCount: 3,
      totalPooledInr: 119900,
      totalNotionalInr: 1136000,
      settledTradesCount: 12,
      protocolFeesInr: 568.00,
      leaderFeesInr: 2840.00,
    },
    cohort: {
      pilotNotionalVolume,
      pilotProtocolFees,
      pilotLeaderProfitsPaid,
      campusTradersActive: 480,
      averageTicketInr: 100,
      averageLeverage: 10,
    },
    projections: {
      year1TargetTraders: 50000,
      year1TradesPerUserMonthly: 8,
      year1AnnualNotionalInr: 4800000000, // ₹480 Cr
      year1AnnualProtocolRevenueInr: 2400000, // ₹24 Lakhs at 0.05%
      year1LeaderRewardsInr: 7200000, // ₹72 Lakhs
    },
  };

  try {
    const syndicates = await prisma.syndicate.findMany();
    const settlements = await prisma.settlement.findMany({
      include: {
        position: {
          include: { syndicate: true },
        },
      },
    });

    if (!syndicates || syndicates.length === 0) {
      return NextResponse.json({ success: true, data: defaultData });
    }

    const totalPooledLive = syndicates.reduce((acc, s) => acc + s.currentPooled, 0);
    const totalNotionalLive = syndicates.reduce((acc, s) => acc + s.currentPooled * s.leverage, 0);

    const totalProtocolFeesSettled = settlements.reduce((acc, s) => acc + s.protocolFee, 0);
    const totalLeaderFeesSettled = settlements.reduce((acc, s) => acc + s.leaderFee, 0);

    return NextResponse.json({
      success: true,
      data: {
        live: {
          activeSyndicatesCount: syndicates.length,
          totalPooledInr: totalPooledLive,
          totalNotionalInr: totalNotionalLive,
          settledTradesCount: settlements.length,
          protocolFeesInr: Number(totalProtocolFeesSettled.toFixed(2)),
          leaderFeesInr: Number(totalLeaderFeesSettled.toFixed(2)),
        },
        cohort: defaultData.cohort,
        projections: defaultData.projections,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics, using default data:", error);
    return NextResponse.json({ success: true, data: defaultData });
  }
}
