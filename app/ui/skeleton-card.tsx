export default function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-zinc-100 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}