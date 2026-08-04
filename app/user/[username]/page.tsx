import { GithubRepo } from "@/app/lib/definitions";

export default async function UserReposPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const res = await fetch(
    `http://localhost:3000/api/github/repos?username=${encodeURIComponent(username)}`
  );
  const repos: GithubRepo[] = await res.json();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">{username}&apos;s Repositories</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {repos.map((repo) => (
          <div key={repo.id} className="rounded-lg border border-zinc-200 p-4">
            <h2 className="font-semibold text-zinc-900">{repo.name}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {repo.description ?? "No description"}
            </p>
            <div className="mt-3 flex gap-4 text-xs text-zinc-500">
              <span>⭐ {repo.stargazers_count}</span>
              <span>🍴 {repo.forks_count}</span>
              {repo.language && <span>{repo.language}</span>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}