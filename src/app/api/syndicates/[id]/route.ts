import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      return NextResponse.json(
        { success: false, error: "Syndicate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: syndicate });
  } catch (error) {
    console.error("Error fetching syndicate detail:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch syndicate detail" },
      { status: 500 }
    );
  }
}
