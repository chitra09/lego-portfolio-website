import { getAllCreations, getAllThemes } from "@/lib/creations";
import GalleryGrid from "@/components/GalleryGrid";

export default async function Home() {
  const creations = await getAllCreations();
  const themes = getAllThemes(creations);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Every Lego creation, in one place
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {creations.length} build{creations.length === 1 ? "" : "s"} and counting.
        </p>
      </div>
      <GalleryGrid creations={creations} themes={themes} />
    </div>
  );
}
