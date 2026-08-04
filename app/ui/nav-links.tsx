"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "Home", href: "/" },
  { name: "Search", href: "/search" },
  { name: "Watchlist", href: "/watchlist" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(
            "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 sm:py-2",
            pathname === link.href
              ? "bg-zinc-900 text-white"
              : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
