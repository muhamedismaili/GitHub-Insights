import SearchBox from "@/app/ui/search-box";
import { GithubUserSearchResult } from "@/app/lib/definitions";
import Link from "next/link";
import ErrorMessage from "@/app/ui/error-message";
import { searchGithubUsers } from "@/app/lib/github-search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let results: GithubUserSearchResult | null = null;
  let errorMessage: string | null = null;

  if (q) {
    try {
      results = await searchGithubUsers(q);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : "Something went wrong.";
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Search GitHub</h1>
      <div className="mt-6">
        <SearchBox placeholder="Search users or orgs..." />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {results?.items.map((user) => (
          <Link
            key={user.id}
            href={`/user/${user.login}`}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400"
          >
            <img
              src={user.avatar_url}
              alt={user.login}
              className="h-10 w-10 rounded-full"
            />
            <span className="font-medium text-zinc-900">{user.login}</span>
          </Link>
        ))}
      </div>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {q && results?.items.length === 0 && (
        <p className="mt-8 text-zinc-500">No results for &quot;{q}&quot;.</p>
      )}
    </main>
  );
}
