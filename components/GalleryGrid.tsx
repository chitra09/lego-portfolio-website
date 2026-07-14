"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Creation } from "@/lib/creations";

export default function GalleryGrid({
  creations,
  themes,
}: {
  creations: Creation[];
  themes: string[];
}) {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("All");

  const filtered = useMemo(() => {
    return creations.filter((c) => {
      const matchesTheme = theme === "All" || c.theme === theme;
      const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());
      return matchesTheme && matchesQuery;
    });
  }, [creations, query, theme]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {["All", ...themes].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                theme === t
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-zinc-500 dark:text-zinc-400">
          No creations match yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((creation) => (
            <Link
              key={creation.slug}
              href={`/creations/${creation.slug}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={creation.coverImage}
                  alt={creation.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="font-medium">
                  {creation.title}
                  {creation.pieceCount && (
                    <span className="font-normal text-zinc-500 dark:text-zinc-400">
                      {" "}
                      ({creation.pieceCount.toLocaleString()} pcs)
                    </span>
                  )}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {creation.theme} ·{" "}
                  {new Date(creation.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
