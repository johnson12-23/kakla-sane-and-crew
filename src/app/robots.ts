import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://kaklasanecrewtrip.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/login"]
    },
    sitemap: `${base}/sitemap.xml`
  };
}
