import SkeletonCard from "@/app/ui/skeleton-card";

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <SkeletonCard className="h-8 w-48" />
      <div className="mt-8 flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} className="h-28" />
        ))}
      </div>
    </main>
  );
}