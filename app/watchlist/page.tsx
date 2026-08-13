import Link from "next/link";
import ErrorMessage from "@/app/ui/error-message";
import AddNoteForm from "@/app/ui/add-note-form";
import RemoveItemButton from "../ui/remove-item-button";

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

export default async function WatchlistPage() {
  const res = await fetch("http://localhost:3000/api/watchlist", {
    cache: "no-store",
  });

  let watchlist: WatchlistItem[] = [];
  let errorMessage: string | null = null;

  if (res.ok) {
    watchlist = await res.json();
  } else {
    const errorData = await res.json();
    errorMessage = errorData.error ?? "Something went wrong.";
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Your Watchlist</h1>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {!errorMessage && watchlist.length === 0 && (
        <p className="mt-8 text-zinc-500">
          Nothing in your watchlist yet — browse a repo and add it.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {watchlist.map((item) => (
          <div key={item.id} className="relative rounded-lg border border-zinc-200 p-4">
            <RemoveItemButton itemId={item.id}/>
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
                  <li key={note.id} className="text-sm text-zinc-600">
                    {note.content}
                  </li>
                ))}
              </ul>
            )}

            <AddNoteForm itemId={item.id} />
          </div>
        ))}
      </div>
    </main>
  );
}