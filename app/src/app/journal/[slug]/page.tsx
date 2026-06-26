export const dynamic = "force-dynamic";

import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toSlug } from "@/lib/slug";

type Post = { tag: string; title: string; excerpt: string; date: string; coverImage?: string; body?: string };

function getContent() {
  return JSON.parse(readFileSync(join(process.cwd(), "content.json"), "utf-8"));
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts: Post[] = getContent().blog ?? [];
  const post = posts.find((p) => toSlug(p.title) === slug);
  if (!post) notFound();

  return (
    <>
      {/* Hero — cover image or gradient fallback */}
      {post.coverImage ? (
        <section className="relative" style={{ height: 480 }}>
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(30,18,8,0.15) 0%, rgba(30,18,8,0.45) 100%)" }} />
          <div className="absolute inset-0 flex flex-col justify-end px-10 pb-12" style={{ maxWidth: 900, margin: "0 auto", left: 0, right: 0 }}>
            <span className="inline-block bg-saffron text-white text-sm font-semibold px-3 py-1 rounded-full mb-4 w-fit">{post.tag}</span>
            <h1 className="font-display text-[38px] font-semibold text-white mb-3" style={{ lineHeight: 1.2 }}>{post.title}</h1>
            <p className="text-white/70 text-[13px]">{post.date}</p>
          </div>
        </section>
      ) : (
        <section style={{ background: "linear-gradient(135deg, #1E1208 0%, rgba(30,18,8,0.95) 100%)", padding: "100px 40px 60px" }}>
          <div className="max-w-[900px] mx-auto">
            <span className="inline-block bg-saffron text-white text-sm font-semibold px-3 py-1 rounded-full mb-6">{post.tag}</span>
            <h1 className="font-display text-[42px] font-semibold text-white mb-4" style={{ lineHeight: 1.2 }}>{post.title}</h1>
            <p className="text-white/60 text-[13px]">{post.date}</p>
          </div>
        </section>
      )}

      {/* Body */}
      <section style={{ background: "#fff", padding: "80px 40px" }}>
        <div className="max-w-[720px] mx-auto">
          {/* Excerpt / standfirst */}
          <p className="text-[18px] text-text-dark leading-relaxed mb-10 font-sans" style={{ borderLeft: "3px solid #D4860A", paddingLeft: 20 }}>
            {post.excerpt}
          </p>

          {/* Full body */}
          {post.body ? (
            <div className="prose text-text-dark leading-relaxed text-[16px]" style={{ lineHeight: 1.9 }}>
              {post.body.split("\n\n").map((para, i) => (
                <p key={i} className="mb-6">{para}</p>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm italic">Full article coming soon.</p>
          )}

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-warm-sand">
            <Link href="/journal" className="text-saffron text-sm font-medium hover:text-cinnamon transition-colors">
              ← Back to Journal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
