import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_MOCK_SYNDICATES } from "@/lib/mockData";

export async function GET() {
  try {
    const syndicates = await prisma.syndicate.findMany({
      include: {
        leader: true,
        positions: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!syndicates || syndicates.length < 20) {
      return NextResponse.json({ success: true, data: DEFAULT_MOCK_SYNDICATES });
    }

    return NextResponse.json({ success: true, data: syndicates });
  } catch (error) {
    console.error("Error fetching syndicates from DB, using fallback:", error);
    return NextResponse.json({ success: true, data: DEFAULT_MOCK_SYNDICATES });
  }
}
