import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { owner, repo } = body;

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing required fields: owner, repo" },
      { status: 400 }
    );
  }

  const existing = await prisma.watchlistItem.findFirst({
    where: { owner, repo, userId: session.user.id},
  });

  if (existing) {
    return NextResponse.json(
      { error: "This repo is already in your watchlist." },
      { status: 409 }
    );
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: { owner, repo, userId: session.user.id },
  });

  return NextResponse.json(watchlistItem, { status: 201 });
}
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const page = Number(request.nextUrl.searchParams.get("page")) || 1;
  const perPage = 8;

  const [watchlist, totalCount] = await Promise.all([
    prisma.watchlistItem.findMany({
      where: { userId: session.user.id },
      include: { notes: true },
      orderBy: { addedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.watchlistItem.count({
      where: { userId: session.user.id },
    }),
  ]);

  const hasNextPage = page * perPage < totalCount;

  return NextResponse.json({ watchlist, hasNextPage });
}