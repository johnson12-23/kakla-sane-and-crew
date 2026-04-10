"use client";

import { useEffect, useState } from "react";
import * as mammoth from "mammoth/mammoth.browser";

type TourPackagesViewerProps = {
  docPublicPath: string | null;
};

export function TourPackagesViewer({ docPublicPath }: TourPackagesViewerProps) {
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDoc() {
      if (!docPublicPath) {
        if (isMounted) {
          setError(
            "No DOCX file was found in public/tour-packages. Add your document there and refresh this page."
          );
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(docPublicPath, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("The tour package document could not be found.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });

        if (isMounted) {
          setHtmlContent(result.value);
        }
      } catch {
        if (isMounted) {
          setError(
            "Unable to preview this document right now. Confirm the DOCX file is in public/tour-packages and try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDoc();
    return () => {
      isMounted = false;
    };
  }, [docPublicPath]);

  return (
    <section className="section-wrap pb-12 pt-8 md:pb-16">
      <div className="page-intro">
        <h1 className="page-title">Tour Package</h1>
        <p className="page-subtitle">
          View the official tour package document directly on this page. No download is required.
        </p>
      </div>

      <div className="surface-card rounded-2xl p-3 md:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-sand/70 md:text-xs">
            Kakla Sane & Crew Tour Document
          </p>
          <a
            href={docPublicPath ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!docPublicPath}
            className="rounded-full border border-[color:var(--gold-lux)] px-3 py-1 text-[0.66rem] font-semibold tracking-[0.08em] text-[color:var(--gold-lux)] transition hover:bg-[color:var(--gold-lux)] hover:text-black md:text-xs"
          >
            Open Original
          </a>
        </div>

        {loading && (
          <div className="rounded-xl border border-white/15 bg-black/35 px-4 py-12 text-center text-sm text-sand/80">
            Loading document preview...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-300/40 bg-black/35 px-4 py-8 text-sm text-red-100">
            {error}
          </div>
        )}

        {!loading && !error && (
          <article className="rounded-xl border border-white/15 bg-black/35 p-5 text-sm leading-7 text-sand/90 md:p-8 md:text-base [&_h1]:mb-3 [&_h1]:font-display [&_h1]:text-2xl [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-semibold [&_li]:mb-1 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:mb-3 [&_strong]:text-[color:var(--gold-lux)] [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-white/15 [&_td]:p-2 [&_th]:border [&_th]:border-white/20 [&_th]:bg-white/5 [&_th]:p-2 [&_ul]:ml-6 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}

        <p className="mt-3 text-[0.68rem] text-sand/65 md:text-xs">
          Source file path:
          <span className="ml-1 font-semibold text-sand">{docPublicPath ?? "public/tour-packages/*.docx"}</span>
        </p>
      </div>
    </section>
  );
}
