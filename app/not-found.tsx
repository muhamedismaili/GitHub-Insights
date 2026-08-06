import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
      <span className="text-6xl">🔍</span>
      <h1 className="mt-6 text-2xl font-bold text-zinc-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
      >
        Back to home
      </Link>
    </main>
  );
}