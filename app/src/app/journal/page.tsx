import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-server";
import Link from "next/link";
import { toSlug } from "@/lib/slug";
import { img } from "@/lib/path";

export const metadata: Metadata = {
  title: "Journal",
  description: "Reflections on Ikigai, Ubuntu, feminine leadership, and living a life aligned with your deepest calling.",
  openGraph: { title: "The Ikigai Journal | Umulkheiri Jalo", images: [img("/images/journal.jpg")] },
};

type Post = { tag: string; title: string; excerpt: string; date: string; coverImage?: string; body?: string };

export default async function JournalPage() {
  const { data } = await supabaseAdmin.from("content").select("data").single();
  const posts: Post[] = (data?.data?.blog ?? []);

  return (
    <>
      {/* Hero */}
      <section className="relative" style={{ padding: "100px 40px 60px" }}>
        <div className="absolute inset-0 overflow-hidden">
          <img src={img("/images/journal.jpg")} alt="" className="w-full h-full object-cover object-top" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(30,18,8,0.45) 0%, rgba(30,18,8,0.25) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto text-center">
          <p className="text-white text-base uppercase font-bold mb-4" style={{ letterSpacing: "3px" }}>The Ikigai Journal</p>
          <h1 className="font-display text-[42px] font-semibold text-white mb-4" style={{ lineHeight: 1.2 }}>
            Wisdom, Reflection &amp; Purpose
          </h1>
          <p className="text-white/80 text-[18px]" style={{ lineHeight: 1.8 }}>
            Insights on Ikigai, Ubuntu, and living a life aligned with your deepest calling.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section style={{ background: "var(--color-cream, #F9F7F2)", padding: "80px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          {posts.length === 0 ? (
            <p className="text-text-muted text-center py-20">No articles yet — check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => {
                const slug = toSlug(post.title);
                return (
                  <Link key={slug} href={`/journal/${slug}`} className="group block bg-white rounded-xl overflow-hidden border border-warm-sand hover:-translate-y-1 transition-transform" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                    {/* Cover image / gradient header */}
                    {post.coverImage ? (
                      <div className="h-48 overflow-hidden">
                        <img src={img(post.coverImage)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="h-48 flex items-end px-5 pb-5" style={{ background: "linear-gradient(135deg, rgba(212,134,10,0.15) 0%, rgba(74,94,53,0.15) 100%)" }}>
                        <span className="inline-block bg-saffron text-white text-sm font-semibold px-3 py-1 rounded-full">{post.tag}</span>
                      </div>
                    )}
                    <div className="p-6">
                      {post.coverImage && (
                        <span className="inline-block bg-saffron text-white text-sm font-semibold px-3 py-1 rounded-full mb-3">{post.tag}</span>
                      )}
                      <h2 className="font-sans text-[18px] font-medium text-espresso mb-2 leading-snug">{post.title}</h2>
                      <p className="text-[13px] text-text-dark leading-relaxed mb-4">{post.excerpt}</p>
                      <p className="text-sm text-text-muted">{post.date}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
