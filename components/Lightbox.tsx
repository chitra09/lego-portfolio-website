"use client";

import { useState } from "react";
import Image from "next/image";

export default function Lightbox({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setOpenIndex(i)}
            className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
          >
            <Image
              src={src}
              alt={`${alt} photo ${i + 1}`}
              fill
              sizes="33vw"
              className="object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            className="absolute right-6 top-6 text-3xl text-white/80 hover:text-white"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
          >
            ×
          </button>
          {openIndex > 0 && (
            <button
              className="absolute left-4 text-4xl text-white/80 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex(openIndex - 1);
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}
          <div
            className="relative h-[80vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex]}
              alt={`${alt} photo ${openIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {openIndex < images.length - 1 && (
            <button
              className="absolute right-4 text-4xl text-white/80 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex(openIndex + 1);
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
