import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Gallery | Kakla Sane & Crew"
};

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1493244040629-496f6d136cc3?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1000&q=80"
];

export default function GalleryPage() {
  return (
    <section className="section-wrap page-fade">
      <h1 className="page-title">Gallery</h1>
      <p className="page-subtitle">A glimpse into the waterfall magic, group energy, and premium travel moments.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, index) => (
          <article key={src} className="group relative overflow-hidden rounded-2xl border border-sand/20 shadow-[0_14px_32px_rgba(0,0,0,0.22)]">
            <Image
              src={src}
              alt={`Trip gallery ${index + 1}`}
              width={800}
              height={800}
              className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-0 transition group-hover:opacity-100" />
          </article>
        ))}
      </div>
    </section>
  );
}
