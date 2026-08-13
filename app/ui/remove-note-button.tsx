"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RemoveNoteButton({
  itemId,
  noteId,
}: {
  itemId: string;
  noteId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRemove() {
    const confirm = window.confirm("Delete this note?");

    if (!confirm) return;

    setLoading(true);

    const res = await fetch(`api/watchlist/${itemId}/notes/${noteId}`, {
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
      aria-label="Delete note"
      className="text-zinc-400 transition-colors px-4 hover:text-red-600 disabled:opacity-50"
    >✕</button>
  );
}
