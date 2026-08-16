import Link from "next/link";
import { GithubRepo } from "@/app/lib/definitions";
import ErrorMessage from "@/app/ui/error-message";
import BackButton from "@/app/ui/back-button";
import EmptyState from "@/app/ui/empty-state";
import RepoListItem from "@/app/ui/repo-list-item";

export default async function UserReposPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { username } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const res = await fetch(
    `http://localhost:3000/api/github/repos?username=${encodeURIComponent(username)}&page=${currentPage}`,
  );

  let repos: GithubRepo[] = [];
  let hasNextPage = false;
  let errorMessage: string | null = null;

  if (res.ok) {
    const data = await res.json();
    repos = data.repos;
    hasNextPage = data.hasNextPage;
  } else {
    const errorData = await res.json();
    errorMessage = errorData.error ?? "Something went wrong.";
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <BackButton />
      <h1 className="text-2xl font-bold text-zinc-900">
        {username}&apos;s Repositories
      </h1>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {!errorMessage && repos.length === 0 && (
        <EmptyState message={`${username} doesn't have any repositories.`} />
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {repos.map((repo) => (
          <RepoListItem
            key={repo.id}
            href={`/repo/${repo.full_name}`}
            name={repo.name}
            description={repo.description}
            stars={repo.stargazers_count}
            forks={repo.forks_count}
            language={repo.language}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        {currentPage > 1 ? (
          <Link
            href={`/user/${username}?page=${currentPage - 1}`}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}

        {hasNextPage && (
          <Link
            href={`/user/${username}?page=${currentPage + 1}`}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            Next →
          </Link>
        )}
      </div>
    </main>
  );
}
