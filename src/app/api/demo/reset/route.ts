import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Delete existing volatile data
    await prisma.settlement.deleteMany();
    await prisma.position.deleteMany();
    await prisma.pledge.deleteMany();
    await prisma.syndicate.deleteMany();
    await prisma.user.deleteMany();

    // Re-seed standard demo entities for Dr. AIT
    const namith = await prisma.user.create({
      data: {
        id: "user_namith",
        name: "Namith DR",
        handle: "drait_lead",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=namith",
        upiId: "namith@okaxis",
        campus: "Dr. AIT Bangalore (Computer Science)",
        isLeader: true,
        winRate: 78.4,
        maxDrawdown: 6.2,
        skinInGame: 5000.0,
      },
    });

    const mallikarjun = await prisma.user.create({
      data: {
        id: "user_mallu",
        name: "Mallikarjun",
        handle: "drait_quant",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=mallu",
        upiId: "mallu@icici",
        campus: "Dr. AIT Alumni (Algorithmic Trading)",
        isLeader: true,
        winRate: 81.2,
        maxDrawdown: 5.1,
        skinInGame: 10000.0,
      },
    });

    const pruthvi = await prisma.user.create({
      data: {
        id: "user_pruthvi",
        name: "Pruthvi Prakash Rao",
        handle: "macro_pruthvi",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=pruthvi",
        upiId: "pruthvi@oksbi",
        campus: "Dr. AIT FinTech Society",
        isLeader: true,
        winRate: 74.5,
        maxDrawdown: 7.4,
        skinInGame: 3500.0,
      },
    });

    await prisma.user.create({
      data: {
        id: "user_demo",
        name: "Priyanka Sutar",
        handle: "priyanka_s",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=priyanka",
        upiId: "priyanka@oksbi",
        campus: "Dr. AIT Bangalore - Hostel Block 1",
        isLeader: false,
      },
    });

    const nvda = await prisma.syndicate.create({
      data: {
        id: "synd_nvda_q3",
        title: "Nvidia Q3 Earnings Breakout",
        catalyst: "NVDA Q3 Earnings & Blackwell GPU Demand Surge",
        assetSymbol: "NVDA",
        assetName: "NVIDIA Corporation",
        direction: "LONG",
        leverage: 10,
        entryPrice: 140.0,
        targetPrice: 142.52,
        stopLossPrice: 138.6,
        circuitBreakerPct: -10.0,
        targetReturnPct: 18.0,
        minPledge: 50.0,
        leaderPledge: 5000.0,
        poolCap: 50000.0,
        currentPooled: 38400.0,
        status: "OPEN",
        leaderId: namith.id,
      },
    });

    await prisma.syndicate.create({
      data: {
        id: "synd_tsla_robotaxi",
        title: "Tesla Robotaxi Momentum Swing",
        catalyst: "Autonomous Fleet Regulatory Approval Milestone",
        assetSymbol: "TSLA",
        assetName: "Tesla, Inc.",
        direction: "LONG",
        leverage: 5,
        entryPrice: 220.0,
        targetPrice: 226.6,
        stopLossPrice: 215.6,
        circuitBreakerPct: -10.0,
        targetReturnPct: 15.0,
        minPledge: 100.0,
        leaderPledge: 10000.0,
        poolCap: 75000.0,
        currentPooled: 62000.0,
        status: "OPEN",
        leaderId: mallikarjun.id,
      },
    });

    await prisma.syndicate.create({
      data: {
        id: "synd_aapl_ai",
        title: "Apple AI Hardware Supercycle",
        catalyst: "M4 Ultra Silicon Launch & Device Upgrades",
        assetSymbol: "AAPL",
        assetName: "Apple Inc.",
        direction: "LONG",
        leverage: 5,
        entryPrice: 230.0,
        targetPrice: 235.52,
        stopLossPrice: 225.4,
        circuitBreakerPct: -10.0,
        targetReturnPct: 12.0,
        minPledge: 50.0,
        leaderPledge: 3500.0,
        poolCap: 30000.0,
        currentPooled: 14500.0,
        status: "OPEN",
        leaderId: pruthvi.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Prototype state cleanly reset and re-seeded with Dr. AIT profiles.",
      featuredSyndicateId: nvda.id,
    });
  } catch (error) {
    console.error("Error resetting demo state:", error);
    return NextResponse.json(
      { success: false, error: "Demo reset failed" },
      { status: 500 }
    );
  }
}
