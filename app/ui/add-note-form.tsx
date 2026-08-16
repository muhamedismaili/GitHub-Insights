"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./loading-spinner";

export default function AddNoteForm({ itemId }: { itemId: string }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim())

    setSubmitting(true);
    setError(null);

    const res = await fetch(`/api/watchlist/${itemId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setContent("");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to add note.");
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-zinc-900"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? <LoadingSpinner className="h-3.5 w-3.5" /> : "Add"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}