import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

async function verifyOwnership(itemId: string, userId: string) {
  const item = await prisma.watchlistItem.findUnique({
    where: { id: itemId },
  });
  return item && item.userId === userId;
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id, noteId } = await params;

  const owns = await verifyOwnership(id, session.user.id);
  if (!owns) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.note.delete({
    where: { id: noteId },
  });

  return NextResponse.json({ success: true });
}