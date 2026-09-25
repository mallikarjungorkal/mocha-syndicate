import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFallbackSettlement } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
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
      console.log(`Settlement ${id} not found in DB, using mock fallback`);
      return NextResponse.json({ success: true, data: getFallbackSettlement(id) });
    }

    return NextResponse.json({ success: true, data: settlement });
  } catch (error) {
    console.error(`Error fetching settlement ${id} from DB, using fallback:`, error);
    return NextResponse.json({ success: true, data: getFallbackSettlement(id) });
  }
}
