import { prisma } from "@/app/lib/prisma";

export async function getDashboardData(userId: string) {
  const watchlist = await prisma.watchlistItem.findMany({
    where: { userId },
    orderBy: { addedAt: "desc" },
  });

  if (watchlist.length === 0) {
    return {
      totalWatched: 0,
      mostStarred: null,
      mostRecent: null,
      languages: {},
      watchlistItems: [],
    };
  }

  const repoDetails = await Promise.all(
    watchlist.map(async (item) => {
      const res = await fetch(
        `https://api.github.com/repos/${item.owner}/${item.repo}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );
      return res.ok ? res.json() : null;
    })
  );

  const validRepos = repoDetails.filter((r) => r !== null);

  const mostStarred = validRepos.reduce(
    (max, r) => (r.stargazers_count > (max?.stargazers_count ?? -1) ? r : max),
    null
  );

  const languageResults = await Promise.all(
    watchlist.map(async (item) => {
      const res = await fetch(
        `https://api.github.com/repos/${item.owner}/${item.repo}/languages`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );
      return res.ok ? res.json() : {};
    })
  );

  const languages: Record<string, number> = {};
  for (const langData of languageResults) {
    for (const [lang, bytes] of Object.entries(langData)) {
      languages[lang] = (languages[lang] ?? 0) + (bytes as number);
    }
  }

  return {
    totalWatched: watchlist.length,
    mostStarred: mostStarred
      ? { owner: mostStarred.owner.login, repo: mostStarred.name, stars: mostStarred.stargazers_count }
      : null,
    mostRecent: { owner: watchlist[0].owner, repo: watchlist[0].repo },
    languages,
    watchlistItems: watchlist,
  };
}