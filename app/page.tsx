import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ authRequired?: string }>;
}) {
  const { authRequired } = await searchParams;

  return (
    <main className="mx-auto flex max-w-5xl flex-col items-start px-6 py-24">
      {authRequired && (
        <p className="mb-6 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Please sign in to view that page.
        </p>
      )}
      <span className="mb-3 text-sm font-medium text-zinc-500">
        Capstone Project
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
        GitHub Insights Dashboard
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-500">
        Search GitHub users and repos, build a personal watchlist, and visualize
        activity across the repos you care about.
      </p>
      <Link
        href="/search"
        className="mt-8 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Start searching →
      </Link>
    </main>
  );
}
