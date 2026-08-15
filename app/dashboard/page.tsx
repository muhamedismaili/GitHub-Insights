import ErrorMessage from "@/app/ui/error-message";
import LanguageChart from "@/app/ui/language-chart";
import CommitActivityChart from "@/app/ui/commit-activity-chart";

type DashboardData = {
  totalWatched: number;
  mostStarred: { owner: string; repo: string; stars: number } | null;
  mostRecent: { owner: string; repo: string } | null;
  languages: Record<string, number>;
  watchlistItems: { id: string; owner: string; repo: string }[];
};

export default async function DashboardPage() {
  const res = await fetch("http://localhost:3000/api/dashboard", {
    cache: "no-store",
  });

  let data: DashboardData | null = null;
  let errorMessage: string | null = null;

  if (res.ok) {
    data = await res.json();
  } else {
    const errorData = await res.json();
    errorMessage = errorData.error ?? "Something went wrong.";
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {data && data.totalWatched === 0 && (
        <p className="mt-8 text-zinc-500">
          Nothing in your watchlist yet — add some repos to see stats here.
        </p>
      )}

      {data && data.totalWatched > 0 && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-xs text-zinc-500">Total watched</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">
                {data.totalWatched}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-xs text-zinc-500">Most starred</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {data.mostStarred
                  ? `${data.mostStarred.owner}/${data.mostStarred.repo}`
                  : "—"}
              </p>
              {data.mostStarred && (
                <p className="text-xs text-zinc-500">
                  ⭐ {data.mostStarred.stars}
                </p>
              )}
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-xs text-zinc-500">Most recently added</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {data.mostRecent
                  ? `${data.mostRecent.owner}/${data.mostRecent.repo}`
                  : "—"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-900">
              Language Breakdown
            </h2>
            <LanguageChart languages={data.languages} />
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-900">
              Commit Activity
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {data.watchlistItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-zinc-200 p-4"
                >
                  <p className="text-sm font-medium text-zinc-900">
                    {item.owner}/{item.repo}
                  </p>
                  <div className="mt-2">
                    <CommitActivityChart owner={item.owner} repo={item.repo} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
