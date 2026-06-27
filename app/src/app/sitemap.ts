import { MetadataRoute } from "next";
import { readFileSync } from "fs";
import { join } from "path";
import { toSlug } from "@/lib/slug";

const BASE = "https://umulkheiri.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const content = JSON.parse(readFileSync(join(process.cwd(), "content.json"), "utf-8"));
  const blog: { title: string; date?: string }[] = content.blog ?? [];

  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/services`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/journal`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  ];

  const blog_pages: MetadataRoute.Sitemap = blog.map(post => ({
    url: `${BASE}/journal/${toSlug(post.title)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...static_pages, ...blog_pages];
}
