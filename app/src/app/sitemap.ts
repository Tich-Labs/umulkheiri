import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-server";
import { toSlug } from "@/lib/slug";

export const dynamic = "force-static";

const BASE = "https://umulkheiri.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabaseAdmin.from("content").select("data").single();
  const blog: { title: string; date?: string }[] = data?.data?.blog ?? [];

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
