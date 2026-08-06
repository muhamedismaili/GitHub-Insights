import { GithubRepo } from "@/app/lib/definitions";
import Link from "next/link";
import ErrorMessage from "@/app/ui/error-message";

export default async function UserReposPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const res = await fetch(
    `http://localhost:3000/api/github/repos?username=${encodeURIComponent(username)}`,
  );

  let repos: GithubRepo[] = [];
  let errorMessage: string | null = null;

  if (res.ok) {
    repos = await res.json();
  } else {
    const errorData = await res.json();
    errorMessage = errorData.error ?? "Something went wrong.";
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">
        {username}&apos;s Repositories
      </h1>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {repos.map((repo) => (
          <Link
            key={repo.id}
            href={`/repo/${repo.full_name}`}
            className="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400"
          >
            <h2 className="font-semibold text-zinc-900">{repo.name}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {repo.description ?? "No description"}
            </p>
            <div className="mt-3 flex gap-4 text-xs text-zinc-500">
              <span>⭐ {repo.stargazers_count}</span>
              <span>🍴 {repo.forks_count}</span>
              {repo.language && <span>{repo.language}</span>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
