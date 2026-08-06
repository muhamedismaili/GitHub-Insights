import SkeletonCard from "@/app/ui/skeleton-card";

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <SkeletonCard className="h-4 w-24" />
      <SkeletonCard className="mt-2 h-9 w-64" />
      <SkeletonCard className="mt-4 h-16 w-full max-w-xl" />
      <div className="mt-6 flex gap-6">
        <SkeletonCard className="h-5 w-20" />
        <SkeletonCard className="h-5 w-20" />
        <SkeletonCard className="h-5 w-20" />
      </div>
      <SkeletonCard className="mt-8 h-10 w-40" />
    </main>
  );
}