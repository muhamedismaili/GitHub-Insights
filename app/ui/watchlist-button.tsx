"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./loading-spinner";

export default function WatchlistButton({
  owner,
  repo,
  initialItemId,
}: {
  owner: string;
  repo: string;
  initialItemId: string | null;
}) {
  const [itemId, setItemId] = useState<string | null>(initialItemId);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const router = useRouter();

  async function handleAdd() {
    setStatus("loading");

    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, repo }),
    });

    if (res.ok) {
      const created = await res.json();
      setItemId(created.id);
    } else {
      setStatus("error");
      return;
    }

    setStatus("idle");
  }

  async function handleRemove() {
    if (!itemId) return;

    const confirmed = window.confirm(
      "Remove this repo from your watchlist? This will also delete any notes on it.",
    );
    if (!confirmed) return;

    setStatus("loading");

    const res = await fetch(`/api/watchlist/${itemId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setItemId(null);
      router.refresh();
    } else {
      setStatus("error");
    }

    setStatus("idle");
  }

  if (itemId) {
    return (
      <button
        onClick={handleRemove}
        disabled={status === "loading"}
        className="mt-8 ml-3 inline-block rounded-full border border-red-300 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-1.5">
            <LoadingSpinner className="h-3.5 w-3.5" />
            Removing...
          </span>
        ) : (
          "✕ Remove from watchlist"
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={status === "loading"}
      className="mt-8 ml-3 inline-block rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:opacity-50"
    >
      {status === "loading" ? (
        <span className="flex items-center gap-1.5">
          <LoadingSpinner className="h-3.5 w-3.5" />
          Adding...
        </span>
      ) : (
        "+ Add to watchlist"
      )}
    </button>
  );
}
