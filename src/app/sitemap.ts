import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kaklasanecrewtrip.com";

  return ["", "/about", "/faq", "/itinerary", "/tour-packages", "/gallery", "/contact", "/book"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8
  }));
}
