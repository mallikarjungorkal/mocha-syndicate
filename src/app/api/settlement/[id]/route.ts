import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Look up either by settlement ID or position ID
    let settlement = await prisma.settlement.findUnique({
      where: { id },
      include: {
        position: {
          include: {
            syndicate: {
              include: { leader: true },
            },
          },
        },
      },
    });

    if (!settlement) {
      settlement = await prisma.settlement.findFirst({
        where: { positionId: id },
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
    }

    if (!settlement) {
      return NextResponse.json(
        { success: false, error: "Settlement record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: settlement });
  } catch (error) {
    console.error("Error fetching settlement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settlement" },
      { status: 500 }
    );
  }
}
