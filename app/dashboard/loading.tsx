import SkeletonCard from "@/app/ui/skeleton-card";

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <SkeletonCard className="h-8 w-40" />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <SkeletonCard className="h-20" />
        <SkeletonCard className="h-20" />
        <SkeletonCard className="h-20" />
      </div>

      <div className="mt-8">
        <SkeletonCard className="h-6 w-48" />
        <SkeletonCard className="mt-4 h-64" />
      </div>

      <div className="mt-8">
        <SkeletonCard className="h-6 w-40" />
        <div className="mt-4 flex flex-col gap-4">
          <SkeletonCard className="h-32" />
          <SkeletonCard className="h-32" />
        </div>
      </div>
    </main>
  );
}