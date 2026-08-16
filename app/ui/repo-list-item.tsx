import Link from "next/link";
import Card from "@/app/ui/card";

export default function RepoListItem({
  href,
  name,
  description,
  stars,
  forks,
  language,
}: {
  href: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
}) {
  return (
    <Link href={href} className="block">
      <Card className="transition-colors hover:border-zinc-400">
        <h2 className="font-semibold text-zinc-900">{name}</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {description ?? "No description"}
        </p>
        <div className="mt-3 flex gap-4 text-xs text-zinc-500">
          <span>⭐ {stars}</span>
          <span>🍴 {forks}</span>
          {language && <span>{language}</span>}
        </div>
      </Card>
    </Link>
  );
}