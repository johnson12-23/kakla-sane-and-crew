"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  description: string;
  tone: "emerald" | "gold" | "sand";
};

const mediaItems: MediaItem[] = [
  {
    id: "image-01",
    type: "image",
    src: "/gallery/image-01.jpeg",
    title: "Welcome Energy",
    description: "The first arrival moments with smiles, hugs, and trip-day excitement.",
    tone: "gold"
  },
  {
    id: "video-01",
    type: "video",
    src: "/gallery/video-03.mp4",
    poster: "/gallery/image-08.jpeg",
    title: "Live Walkthrough",
    description: "A moving look at the location ambience as the experience unfolds live.",
    tone: "emerald"
  },
  {
    id: "image-02",
    type: "image",
    src: "/gallery/image-02.jpeg",
    title: "Travel Glam",
    description: "Styled group portraits that set the premium tone for the entire journey.",
    tone: "emerald"
  },
  {
    id: "image-03",
    type: "image",
    src: "/gallery/image-03.jpeg",
    title: "Crew Portrait",
    description: "A reflective stop honoring the paths our forefathers endured through slavery and resilience.",
    tone: "sand"
  },
  {
    id: "video-02",
    type: "video",
    src: "/gallery/video-02.mp4",
    poster: "/gallery/image-08.jpeg",
    title: "Crew Highlights",
    description: "Short cinematic highlights of movement, laughter, and shared moments.",
    tone: "gold"
  },
  {
    id: "image-04",
    type: "image",
    src: "/gallery/image-04.jpeg",
    title: "Golden Hour Pose",
    description: "Soft evening light and coordinated outfits creating a postcard-perfect view.",
    tone: "gold"
  },
  {
    id: "image-05",
    type: "image",
    src: "/gallery/image-05.jpeg",
    title: "Luxury Moments",
    description: "Premium travel details captured with elegant, candid confidence.",
    tone: "emerald"
  },
  {
    id: "final-vibe",
    type: "image",
    src: "/gallery/image-10.jpeg",
    title: "Final Vibe Reel",
    description: "Closing style frame that captures the signature energy of the trip.",
    tone: "sand"
  },
  {
    id: "image-06",
    type: "image",
    src: "/gallery/image-07.jpeg",
    title: "Nature Glow",
    description: "Visit to a heritage site, where history and identity meet in one powerful moment.",
    tone: "sand"
  },
  {
    id: "image-07",
    type: "image",
    src: "/gallery/image-02.jpeg",
    title: "Main Character Shot",
    description: "A hero-style still that highlights confidence and travel elegance.",
    tone: "gold"
  },
  {
    id: "image-08",
    type: "image",
    src: "/gallery/image-09.jpeg",
    title: "Crew Together",
    description: "Group chemistry in one frame, full of laughter and memorable vibes.",
    tone: "emerald"
  },
  {
    id: "image-09",
    type: "image",
    src: "/gallery/image-08.jpeg",
    title: "Scenic Focus",
    description: "An immersive scene showing the rich atmosphere of the destination.",
    tone: "sand"
  },
  {
    id: "signature-look",
    type: "video",
    src: "/gallery/video-01.mp4",
    poster: "/gallery/image-10.jpeg",
    title: "Signature Look",
    description: "A moving signature moment with confidence, style, and premium trip vibes.",
    tone: "gold"
  }
];

type FilterMode = "all" | "image" | "video";

const filterOptions: { label: string; value: FilterMode }[] = [
  { label: "All", value: "all" },
  { label: "Photos", value: "image" },
  { label: "Videos", value: "video" }
];

const toneClasses: Record<MediaItem["tone"], string> = {
  emerald: "from-emerald-500/70 to-emerald-900/60",
  gold: "from-amber-300/80 to-yellow-700/60",
  sand: "from-[#f3e9d2]/80 to-[#8c7a56]/60"
};

export function GalleryShowcase() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const filteredItems = useMemo(
    () => mediaItems.filter((item) => (filter === "all" ? true : item.type === filter)),
    [filter]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Ignore autoplay rejections in restrictive browser contexts.
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.55,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [filteredItems]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMedia(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <section className="section-wrap page-fade gallery-shell relative overflow-hidden">
      <div className="gallery-orb gallery-orb-a" />
      <div className="gallery-orb gallery-orb-b" />

      <header className="relative z-10 page-intro">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-gold-lux/90">Immersive Memories</p>
        <h1 className="page-title mt-2">Gallery</h1>
        <p className="page-subtitle max-w-3xl">
          Every still and reel from the trip collection, designed as a cinematic wall of moments. Videos begin
          playing when they enter your viewport for a true live-preview feel.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`gallery-filter-chip ${filter === option.value ? "gallery-filter-chip-active" : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div className="relative z-10 mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item, index) => (
          <article key={item.id} className="gallery-card group" style={{ animationDelay: `${index * 70}ms` }}>
            <div className={`pointer-events-none absolute inset-0 opacity-80 bg-gradient-to-br ${toneClasses[item.tone]}`} />

            <div className="relative h-[16rem] overflow-hidden rounded-[1.2rem] sm:h-[17.5rem]">
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt={item.title}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={item.src}
                  poster={item.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <span className="absolute left-3 top-3 rounded-full border border-sand/45 bg-black/55 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-sand">
                {item.type === "video" ? "Video" : "Photo"}
              </span>

              <button
                type="button"
                onClick={() => setActiveMedia(item)}
                className="absolute bottom-3 right-3 rounded-full border border-sand/35 bg-black/60 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-sand opacity-0 transition duration-300 group-hover:opacity-100"
              >
                Expand
              </button>
            </div>

            <div className="relative mt-3 px-1 pb-1">
              <h2 className="text-base font-semibold text-sand">{item.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-sand/85">{item.description}</p>
            </div>
          </article>
        ))}
      </div>

      {activeMedia ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeMedia.title} preview`}
          onClick={() => setActiveMedia(null)}
        >
          <div className="gallery-lightbox-card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveMedia(null)}
              className="gallery-lightbox-close"
              aria-label="Close gallery preview"
            >
              Close
            </button>

            <div className="relative overflow-hidden rounded-2xl">
              {activeMedia.type === "image" ? (
                <Image
                  src={activeMedia.src}
                  alt={activeMedia.title}
                  width={1600}
                  height={1200}
                  className="h-[55vh] w-full object-cover sm:h-[65vh]"
                />
              ) : (
                <video
                  src={activeMedia.src}
                  poster={activeMedia.poster}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="h-[55vh] w-full object-cover sm:h-[65vh]"
                />
              )}
            </div>

            <div className="mt-3 px-1">
              <h3 className="text-lg font-semibold text-sand">{activeMedia.title}</h3>
              <p className="mt-1 text-sm text-sand/85">{activeMedia.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
