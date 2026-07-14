import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCreations, getCreation } from "@/lib/creations";
import Lightbox from "@/components/Lightbox";

export async function generateStaticParams() {
  const creations = await getAllCreations();
  return creations.map((c) => ({ slug: c.slug }));
}

export default async function CreationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let creation;
  try {
    creation = await getCreation(slug);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        ← Back to gallery
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {creation.title}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
        <span>{creation.theme}</span>
        <span>·</span>
        <span>
          {new Date(creation.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        {creation.setNumber && (
          <>
            <span>·</span>
            <span>Set #{creation.setNumber}</span>
          </>
        )}
        {creation.pieceCount && (
          <>
            <span>·</span>
            <span>{creation.pieceCount.toLocaleString()} pieces</span>
          </>
        )}
      </div>

      {creation.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {creation.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-200 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Lightbox
          images={
            creation.gallery.length > 0
              ? creation.gallery
              : [creation.coverImage]
          }
          alt={creation.title}
        />
      </div>

      {creation.contentHtml && (
        <div
          className="prose prose-zinc mt-8 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: creation.contentHtml }}
        />
      )}
    </div>
  );
}
