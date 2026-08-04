export default function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col items-start px-6 py-24">
      <span className="mb-3 text-sm font-medium text-zinc-500">
        Capstone Project
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
        GitHub Insights Dashboard
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-500">
        Search GitHub users and repos, build a personal watchlist, and
        visualize activity across the repos you care about.
      </p>
    </main>
  );
}