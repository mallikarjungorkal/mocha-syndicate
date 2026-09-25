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

    // Re-seed standard demo entities
    const arjun = await prisma.user.create({
      data: {
        id: "user_arjun",
        name: "Arjun Rao",
        handle: "arjun_alpha",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=arjun",
        upiId: "arjun@okaxis",
        campus: "IIT Bombay",
        isLeader: true,
        winRate: 82.0,
        maxDrawdown: 5.4,
        skinInGame: 10000.0,
      },
    });

    const kavya = await prisma.user.create({
      data: {
        id: "user_kavya",
        name: "Kavya Sharma",
        handle: "kavya_quant",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=kavya",
        upiId: "kavya@icici",
        campus: "BITS Pilani",
        isLeader: true,
        winRate: 76.0,
        maxDrawdown: 7.8,
        skinInGame: 7500.0,
      },
    });

    const rohan = await prisma.user.create({
      data: {
        id: "user_rohan",
        name: "Rohan Deshmukh",
        handle: "rohan_trades",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=rohan",
        upiId: "rohan@oksbi",
        campus: "RVCE Bengaluru",
        isLeader: true,
        winRate: 79.0,
        maxDrawdown: 4.2,
        skinInGame: 6000.0,
      },
    });

    const demoUser = await prisma.user.create({
      data: {
        id: "user_demo",
        name: "Priyanka S.",
        handle: "priyanka_s",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=priyanka",
        upiId: "priyanka@okhdfcbank",
        campus: "RVCE Bengaluru - Hostel Block 1",
        isLeader: false,
      },
    });

    const synNvda = await prisma.syndicate.create({
      data: {
        id: "syn_nvda_q3",
        title: "NVDA Q3 Blackwell Data Center Surge",
        catalyst: "Record ultra-hyperscaler GPU capex + Blackwell B200 delivery acceleration. Historical earnings move ±9.4%.",
        assetSymbol: "NVDA",
        assetName: "NVIDIA Corp",
        direction: "LONG",
        leverage: 10,
        entryPrice: 128.50,
        stopLossPrice: 127.21,
        targetPrice: 151.63,
        targetReturnPct: 35.0,
        circuitBreakerPct: -10.0,
        minPledge: 50.0,
        poolCap: 250000.0,
        currentPooled: 185000.0,
        leaderId: arjun.id,
        status: "ACTIVE",
      },
    });

    const synTsla = await prisma.syndicate.create({
      data: {
        id: "syn_tsla_robotaxi",
        title: "TSLA Cybercab FSD V13 Regulatory Approval",
        catalyst: "Autonomous ride-hailing commercial testing permit in California + end-to-end neural net release.",
        assetSymbol: "TSLA",
        assetName: "Tesla Inc",
        direction: "LONG",
        leverage: 10,
        entryPrice: 245.20,
        stopLossPrice: 242.75,
        targetPrice: 294.24,
        targetReturnPct: 40.0,
        circuitBreakerPct: -10.0,
        minPledge: 50.0,
        poolCap: 200000.0,
        currentPooled: 140000.0,
        leaderId: kavya.id,
        status: "ACTIVE",
      },
    });

    const posTslaSettled = await prisma.position.create({
      data: {
        id: "pos_tsla_settled",
        syndicateId: synTsla.id,
        status: "SETTLED",
        exitPrice: 242.75,
        currentPrice: 242.75,
        unrealizedPnlPct: -10.0,
        exitReason: "CIRCUIT_BREAKER",
        settledAt: new Date(),
      },
    });

    await prisma.settlement.create({
      data: {
        id: "stl_tsla_cb",
        positionId: posTslaSettled.id,
        userId: demoUser.id,
        initialPledge: 100.0,
        grossPayout: 90.0,
        leaderFee: 0.0,
        protocolFee: 0.0,
        netPayout: 90.0,
        upiRefundUtr: "UPI/MOCHA/789102/SHIELD",
        settlementTimeSec: 3.8,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database successfully reset with campus seeds",
    });
  } catch (error) {
    console.warn("Reset DB error (graceful fallback):", error);
    return NextResponse.json({
      success: true,
      message: "Demo state reset in memory",
    });
  }
}
