import SkeletonCard from "@/app/ui/skeleton-card";

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <SkeletonCard className="h-8 w-48" />
      <SkeletonCard className="mt-6 h-10 w-full" />
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} className="h-16" />
        ))}
      </div>
    </main>
  );
}