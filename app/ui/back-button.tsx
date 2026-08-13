"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-4 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
    >
      ← Back
    </button>
  );
}