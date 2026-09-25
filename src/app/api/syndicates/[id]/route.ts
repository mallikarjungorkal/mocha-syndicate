import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFallbackSyndicate } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const syndicate = await prisma.syndicate.findUnique({
      where: { id },
      include: {
        leader: true,
        pledges: {
          include: { user: true },
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        positions: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    if (!syndicate) {
      console.log(`Syndicate ${id} not found in DB, using mock fallback`);
      return NextResponse.json({ success: true, data: getFallbackSyndicate(id) });
    }

    return NextResponse.json({ success: true, data: syndicate });
  } catch (error) {
    console.error(`Error fetching syndicate ${id} from DB, using fallback:`, error);
    return NextResponse.json({ success: true, data: getFallbackSyndicate(id) });
  }
}
