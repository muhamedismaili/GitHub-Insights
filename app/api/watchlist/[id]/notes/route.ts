import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content) {
    return NextResponse.json(
      { error: "Missing required field: content" },
      { status: 400 }
    );
  }

  const note = await prisma.note.create({
    data: {
      content,
      watchlistItemId: id,
    },
  });

  return NextResponse.json(note, { status: 201 });
}