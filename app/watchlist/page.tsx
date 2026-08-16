import Link from "next/link";
import ErrorMessage from "@/app/ui/error-message";
import AddNoteForm from "@/app/ui/add-note-form";
import RemoveItemButton from "@/app/ui/remove-item-button";
import RemoveNoteButton from "@/app/ui/remove-note-button";
import Card from "../ui/card";
import EmptyState from "../ui/empty-state";

type WatchlistNote = {
  id: string;
  content: string;
  createdAt: string;
};

type WatchlistItem = {
  id: string;
  owner: string;
  repo: string;
  addedAt: string;
  notes: WatchlistNote[];
};

export default async function WatchlistPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const res = await fetch(
    `http://localhost:3000/api/watchlist?page=${currentPage}`,
    { cache: "no-store" }
  );

  let watchlist: WatchlistItem[] = [];
  let hasNextPage = false;
  let errorMessage: string | null = null;

  if (res.ok) {
    const data = await res.json();
    watchlist = data.watchlist;
    hasNextPage = data.hasNextPage;
  } else {
    const errorData = await res.json();
    errorMessage = errorData.error ?? "Something went wrong.";
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Your Watchlist</h1>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {!errorMessage && watchlist.length === 0 && currentPage === 1 && (
        <EmptyState message="Nothing in your watchlist yet — browse a repo and add it." />
      )}

      <div className="mt-8 flex flex-col gap-4">
        {watchlist.map((item) => (
          <Card
            key={item.id}
            className="relative"
          >
            <RemoveItemButton itemId={item.id} />
            <Link
              href={`/repo/${item.owner}/${item.repo}`}
              className="font-semibold text-zinc-900 hover:underline"
            >
              {item.owner}/{item.repo}
            </Link>
            <p className="mt-1 text-xs text-zinc-400">
              Added {new Date(item.addedAt).toLocaleDateString()}
            </p>
            {item.notes.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1">
                {item.notes.map((note) => (
                  <li
                    key={note.id}
                    className="flex items-start justify-between gap-2 text-sm text-zinc-600"
                  >
                    <span className="min-w-0 break-words">{note.content}</span>
                    <RemoveNoteButton itemId={item.id} noteId={note.id} />
                  </li>
                ))}
              </ul>
            )}
            <AddNoteForm itemId={item.id} />
          </Card>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        {currentPage > 1 ? (
          <Link
            href={`/watchlist?page=${currentPage - 1}`}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}

        {hasNextPage && (
          <Link
            href={`/watchlist?page=${currentPage + 1}`}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            Next →
          </Link>
        )}
      </div>
    </main>
  );
}