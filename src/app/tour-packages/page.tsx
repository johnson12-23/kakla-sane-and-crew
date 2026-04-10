import { Metadata } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { TourPackagesViewer } from "@/components/tour-packages-viewer";

export const metadata: Metadata = {
  title: "Tour Package | Kakla Sane & Crew",
  description: "View the Kakla Sane & Crew tour package document directly in your browser."
};

export const dynamic = "force-dynamic";

async function getDocPublicPath() {
  const docsDir = path.join(process.cwd(), "public", "tour-packages");

  try {
    const files = await readdir(docsDir);
    const docxFiles = files
      .filter((fileName) => fileName.toLowerCase().endsWith(".docx"))
      .sort((a, b) => a.localeCompare(b));

    if (docxFiles.length === 0) {
      return null;
    }

    return `/tour-packages/${encodeURIComponent(docxFiles[0])}`;
  } catch {
    return null;
  }
}

export default async function TourPackagesPage() {
  const docPublicPath = await getDocPublicPath();

  return <TourPackagesViewer docPublicPath={docPublicPath} />;
}
