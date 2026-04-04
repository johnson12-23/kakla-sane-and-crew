import { Metadata } from "next";
import { GalleryShowcase } from "../../components/gallery-showcase";

export const metadata: Metadata = {
  title: "Gallery | Kakla Sane & Crew"
};

export default function GalleryPage() {
  return <GalleryShowcase />;
}
