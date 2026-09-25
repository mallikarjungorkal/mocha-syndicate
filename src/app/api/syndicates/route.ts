import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json({ success: true, data: syndicates });
  } catch (error) {
    console.error("Error fetching syndicates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch syndicates" },
      { status: 500 }
    );
  }
}
