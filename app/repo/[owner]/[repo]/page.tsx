import { GithubRepo } from "@/app/lib/definitions";
import ErrorMessage from "@/app/ui/error-message";
import BackButton from "@/app/ui/back-button";
import WatchlistButton from "@/app/ui/watchlist-button";
import { auth } from "@/auth";
import { getRepo } from "@/app/lib/github-api";
import { prisma } from "@/app/lib/prisma";

export default async function RepoDetailPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const session = await auth();
  const { owner, repo } = await params;

  let repoData: GithubRepo;
  try {
    repoData = await getRepo(owner, repo);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <BackButton />
        <ErrorMessage message={message} />
      </main>
    );
  }

  let existingItemId: string | null = null;
  if (session?.user) {
    const existingItem = await prisma.watchlistItem.findFirst({
      where: {
        userId: session.user.id!,
        owner,
        repo: repoData.name,
      },
    });
    existingItemId = existingItem?.id ?? null;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <BackButton />
      <p className="text-sm text-zinc-500">{owner}</p>
      <h1 className="text-3xl font-bold text-zinc-900">{repoData.name}</h1>
      <p className="mt-3 max-w-xl text-zinc-600">
        {repoData.description ?? "No description"}
      </p>

      <div className="mt-6 flex gap-6 text-sm text-zinc-500">
        <span>⭐ {repoData.stargazers_count} stars</span>
        <span>🍴 {repoData.forks_count} forks</span>
        {repoData.language && <span>{repoData.language}</span>}
      </div>

      <a
        href={repoData.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
      >
        View on GitHub
      </a>
      <WatchlistButton
        owner={owner}
        repo={repoData.name}
        initialItemId={existingItemId}
        isLoggedIn={!!session?.user}
      />
    </main>
  );
}
