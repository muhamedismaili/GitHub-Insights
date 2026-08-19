import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const item = await prisma.watchlistItem.findUnique({
    where: { id },
  });

  if (!item || item.userId !== session.user.id!) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.watchlistItem.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}