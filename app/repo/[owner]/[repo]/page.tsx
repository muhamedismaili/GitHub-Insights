import { GithubRepo } from "@/app/lib/definitions";
import ErrorMessage from "@/app/ui/error-message";
import BackButton from "@/app/ui/back-button";
import WatchlistButton from "@/app/ui/watchlist-button";
import { auth } from "@/auth";
import { getBaseUrl } from "@/app/lib/base-url";

export default async function RepoDetailPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const session = await auth();
  const { owner, repo } = await params;

  const res = await fetch(
    `${getBaseUrl()}/api/github/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
  );

  if (!res.ok) {
    const errorData = await res.json();
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <BackButton />
        <ErrorMessage message={errorData.error ?? "Something went wrong."} />
      </main>
    );
  }

  const repoData: GithubRepo = await res.json();

  const watchlistRes = await fetch(`${getBaseUrl()}/api/watchlist`, {
    cache: "no-store",
  });
  const watchlistData = watchlistRes.ok
    ? await watchlistRes.json()
    : { watchlist: [] };
  const existingItem = watchlistData.watchlist.find(
    (item: { id: string; owner: string; repo: string }) =>
      item.owner === owner && item.repo === repoData.name,
  );

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
        initialItemId={existingItem?.id ?? null}
        isLoggedIn={!!session?.user}
      />
    </main>
  );
}
