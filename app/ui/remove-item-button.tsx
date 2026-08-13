"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RemoveItemButton({ itemId }: { itemId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRemove() {
    const confirmed = window.confirm(
      "Remove this repo from your watchlist? This will also delete any notes on it."
    );
    if (!confirmed) return;

    setLoading(true);

    const res = await fetch(`/api/watchlist/${itemId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      aria-label="Remove from watchlist"
      className="absolute right-3 top-3 text-zinc-400 transition-colors hover:text-red-600 disabled:opacity-50"
    >
      ✕
    </button>
  );
}