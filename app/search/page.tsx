import SearchBox from "@/app/ui/search-box";
import { GithubUserSearchResult } from "@/app/lib/definitions";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let results: GithubUserSearchResult | null = null;

  if (q) {
    const res = await fetch(
      `http://localhost:3000/api/github/search?q=${encodeURIComponent(q)}`
    );
    results = await res.json();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Search GitHub</h1>
      <div className="mt-6">
        <SearchBox placeholder="Search users or orgs..." />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {results?.items.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4"
          >
            <img
              src={user.avatar_url}
              alt={user.login}
              className="h-10 w-10 rounded-full"
            />
            <span className="font-medium text-zinc-900">{user.login}</span>
          </div>
        ))}
      </div>

      {q && results?.items.length === 0 && (
        <p className="mt-8 text-zinc-500">No results for &quot;{q}&quot;.</p>
      )}
    </main>
  );
}