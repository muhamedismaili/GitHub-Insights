import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { owner, repo } = body;

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing required fields: owner, repo" },
      { status: 400 }
    );
  }

  const existing = await prisma.watchlistItem.findFirst({
    where: { owner, repo },
  });

  if (existing) {
    return NextResponse.json(
      { error: "This repo is already in your watchlist." },
      { status: 409 }
    );
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: { owner, repo },
  });

  return NextResponse.json(watchlistItem, { status: 201 });
}
export async function GET() {
  const watchlist = await prisma.watchlistItem.findMany({
    include: { notes: true },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json(watchlist);
}