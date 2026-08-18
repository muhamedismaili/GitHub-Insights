import ErrorMessage from "@/app/ui/error-message";
import LanguageChart from "@/app/ui/language-chart";
import CommitActivityChart from "@/app/ui/commit-activity-chart";
import Card from "@/app/ui/card";
import EmptyState from "@/app/ui/empty-state";
import { auth } from "@/auth";
import { getDashboardData } from "@/app/lib/dashboard-data";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  let data: Awaited<ReturnType<typeof getDashboardData>> | null = null;
  let errorMessage: string | null = null;

  try {
    data = await getDashboardData(session.user.id);
  } catch {
    errorMessage = "Something went wrong loading your dashboard.";
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {data && data.totalWatched === 0 && (
        <EmptyState message="Nothing in your watchlist yet — add some repos to see stats here." />
      )}

      {data && data.totalWatched > 0 && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-xs text-zinc-500">Total watched</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">
                {data.totalWatched}
              </p>
            </Card>
            <Card>
              <p className="text-xs text-zinc-500">Most starred</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {data.mostStarred
                  ? `${data.mostStarred.owner}/${data.mostStarred.repo}`
                  : "—"}
              </p>
              {data.mostStarred && (
                <p className="text-xs text-zinc-500">⭐ {data.mostStarred.stars}</p>
              )}
            </Card>
            <Card>
              <p className="text-xs text-zinc-500">Most recently added</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {data.mostRecent
                  ? `${data.mostRecent.owner}/${data.mostRecent.repo}`
                  : "—"}
              </p>
            </Card>
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
                <Card key={item.id}>
                  <p className="text-sm font-medium text-zinc-900">
                    {item.owner}/{item.repo}
                  </p>
                  <div className="mt-2">
                    <CommitActivityChart owner={item.owner} repo={item.repo} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}