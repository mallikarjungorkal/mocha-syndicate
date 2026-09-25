import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const syndicate = await prisma.syndicate.findUnique({
      where: { id: syndicateId },
    });

    if (!syndicate) {
      return NextResponse.json(
        { success: false, error: "Syndicate not found" },
        { status: 404 }
      );
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

    // Create the pledge locked in non-custodial smart escrow
    const pledge = await prisma.pledge.create({
      data: {
        syndicateId,
        userId,
        amount: numAmount,
        upiUtr,
        escrowStatus: "LOCKED",
      },
    });

    // Update syndicate pooled volume
    await prisma.syndicate.update({
      where: { id: syndicateId },
      data: {
        currentPooled: { increment: numAmount },
      },
    });

    // Create or activate a mirrored Position for this trading session
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
  } catch (error) {
    console.error("Error creating pledge:", error);
    return NextResponse.json(
      { success: false, error: "Escrow pledge failed" },
      { status: 500 }
    );
  }
}
