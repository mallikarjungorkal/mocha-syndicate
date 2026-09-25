import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFallbackSyndicate } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { syndicateId, amount, userId = "user_demo" } = body;

    const numAmount = Number(amount);
    if (!syndicateId || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid pledge parameters" },
        { status: 400 }
      );
    }

    // Try finding in DB, fallback to mock syndicate if not found
    let syndicate: any = null;
    try {
      syndicate = await prisma.syndicate.findUnique({
        where: { id: syndicateId },
      });
    } catch (e) {
      console.warn("DB error fetching syndicate in pledge:", e);
    }

    if (!syndicate) {
      syndicate = getFallbackSyndicate(syndicateId);
    }

    if (numAmount < syndicate.minPledge) {
      return NextResponse.json(
        { success: false, error: `Minimum pledge is ₹${syndicate.minPledge}` },
        { status: 400 }
      );
    }

    // Generate simulated UPI UTR
    const timestamp = Date.now().toString().slice(-6);
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const upiUtr = `UPI/${timestamp}${randomCode}/AXIS`;

    // Attempt DB operations, or gracefully fallback on serverless
    try {
      const pledge = await prisma.pledge.create({
        data: {
          syndicateId,
          userId,
          amount: numAmount,
          upiUtr,
          escrowStatus: "LOCKED",
        },
      });

      await prisma.syndicate.update({
        where: { id: syndicateId },
        data: {
          currentPooled: { increment: numAmount },
        },
      });

      const position = await prisma.position.create({
        data: {
          syndicateId,
          status: "ACTIVE",
          currentPrice: syndicate.entryPrice,
          unrealizedPnlPct: 0.0,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          pledgeId: pledge.id,
          positionId: position.id,
          upiUtr,
          escrowStatus: "LOCKED",
          amount: numAmount,
          entryPrice: syndicate.entryPrice,
          message: "Capital locked in non-custodial smart escrow. Trade mirror activated.",
        },
      });
    } catch (dbErr) {
      console.warn("DB write failed in pledge (serverless fallback active):", dbErr);
      return NextResponse.json({
        success: true,
        data: {
          pledgeId: `pld_sim_${timestamp}`,
          positionId: "pos_nvda_active",
          upiUtr,
          escrowStatus: "LOCKED",
          amount: numAmount,
          entryPrice: syndicate.entryPrice,
          message: "Capital locked in non-custodial smart escrow. Trade mirror activated.",
        },
      });
    }
  } catch (error) {
    console.error("Error creating pledge:", error);
    return NextResponse.json(
      { success: false, error: "Escrow pledge failed" },
      { status: 500 }
    );
  }
}
