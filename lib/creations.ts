import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content", "creations");

export interface Creation {
  slug: string;
  title: string;
  date: string;
  theme: string;
  setNumber?: string;
  pieceCount?: number;
  tags: string[];
  coverImage: string;
  gallery: string[];
  contentHtml: string;
}

function readSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export async function getCreation(slug: string): Promise<Creation> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);

  return {
    slug,
    title: data.title,
    date: data.date instanceof Date ? data.date.toISOString() : data.date,
    theme: data.theme,
    setNumber: data.setNumber,
    pieceCount: data.pieceCount,
    tags: data.tags ?? [],
    coverImage: data.coverImage,
    gallery: data.gallery ?? [],
    contentHtml: processed.toString(),
  };
}

export async function getAllCreations(): Promise<Creation[]> {
  const slugs = readSlugs();
  const creations = await Promise.all(slugs.map(getCreation));
  return creations.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllThemes(creations: Creation[]): string[] {
  return Array.from(new Set(creations.map((c) => c.theme))).sort();
}
