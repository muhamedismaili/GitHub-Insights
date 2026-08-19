import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { getBaseUrl } from "@/app/lib/base-url";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const watchlist = await prisma.watchlistItem.findMany({
    where: { userId: session.user.id! },
    orderBy: { addedAt: "desc" },
  });

  if (watchlist.length === 0) {
    return NextResponse.json({
      totalWatched: 0,
      mostStarred: null,
      mostRecent: null,
      languages: {},
      commitActivity: [],
      watchlistItems: [],
    });
  }

  const repoDetails = await Promise.all(
    watchlist.map(async (item) => {
      const res = await fetch(
        `${getBaseUrl()}/api/github/languages?owner=${item.owner}&repo=${item.repo}`,
      );
      return res.ok ? res.json() : null;
    }),
  );

  const validRepos = repoDetails.filter((r) => r !== null);

  const mostStarred = validRepos.reduce(
    (max, r) => (r.stargazers_count > (max?.stargazers_count ?? -1) ? r : max),
    null,
  );

  const languageResults = await Promise.all(
    watchlist.map(async (item) => {
      const res = await fetch(
        `${getBaseUrl()}/api/github/languages?owner=${item.owner}&repo=${item.repo}`,
      );
      return res.ok ? res.json() : {};
    }),
  );

  const languages: Record<string, number> = {};
  for (const langData of languageResults) {
    for (const [lang, bytes] of Object.entries(langData)) {
      languages[lang] = (languages[lang] ?? 0) + (bytes as number);
    }
  }

  return NextResponse.json({
    totalWatched: watchlist.length,
    mostStarred: mostStarred
      ? {
          owner: mostStarred.owner.login,
          repo: mostStarred.name,
          stars: mostStarred.stargazers_count,
        }
      : null,
    mostRecent: { owner: watchlist[0].owner, repo: watchlist[0].repo },
    languages,
    watchlistItems: watchlist,
  });
}
