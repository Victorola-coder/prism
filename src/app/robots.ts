import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/analyze"],
    },
    sitemap: "https://prism.dev/sitemap.xml",
  }
}
