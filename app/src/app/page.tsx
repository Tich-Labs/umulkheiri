import { supabaseAdmin } from "@/lib/supabase-server";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import NewsletterForm from "@/components/NewsletterForm";
import { toSlug } from "@/lib/slug";
import { img } from "@/lib/path";

async function getContent() {
  const { data } = await supabaseAdmin.from("content").select("data").single();
  return data?.data ?? {};
}

const pillarStyles: Record<string, { color: string; bg: string }> = {
  Ikigai:  { color: "text-saffron",  bg: "bg-saffron-tint" },
  Ubuntu:  { color: "text-pine",     bg: "bg-pine-tint" },
  Kihooto: { color: "text-cinnamon", bg: "bg-sand-tint" },
};

const elementStyles: Record<string, { color: string; bg: string }> = {
  Passion:    { color: "text-saffron",  bg: "bg-saffron-tint" },
  Skills:     { color: "text-cinnamon", bg: "bg-sand-tint" },
  Service:    { color: "text-pine",     bg: "bg-pine-tint" },
  Livelihood: { color: "text-espresso", bg: "bg-espresso-tint" },
};

export default async function HomePage() {
  const c = await getContent();
  const hero = c.hero;
  const cms = {
    services: c.services,
    testimonials: c.testimonials,
    blog: c.blog,
    community: c.community,
    pillars: c.pillars,
    elements: c.elements,
    credentials: c.credentials ?? [],
    newsletter: c.newsletter ?? { heading: "The Inner Garden Letter", body: "" },
  };
  const heroImage = hero.image || "/images/Umulkheiri.jpg";
  const pillarsImage = c.pillarsImage || "/images/pillars.jpg";
  const servicesImage = c.servicesImage || "/images/services.jpg";
  const communityImage = c.communityImage || "/images/community.jpeg";
  const journalImage = c.journalImage || "/images/journal.jpg";

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Umulkheiri Jalo",
    jobTitle: "Ikigai Alignment Coach",
    description: "Certified Ikigai Alignment Coach blending Japanese purpose philosophy, Ubuntu belonging, and Kihooto justice into personal transformation.",
    url: "https://umulkheiri.com",
    image: "https://umulkheiri.com/images/Umulkheiri.jpg",
    knowsAbout: ["Ikigai", "Ubuntu", "Kihooto", "Purpose Coaching", "Feminine Leadership", "Life Alignment"],
    offers: { "@type": "Offer", url: "https://umulkheiri.com/services" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      {/* ── HERO ── */}
      <section style={{ background: "linear-gradient(135deg, #1E1208 0%, rgba(30,18,8,0.97) 100%)" }}>
        <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Left: text */}
            <div className="flex-[0_0_55%] text-center md:text-left">
              <h1 className="font-display text-[42px] font-semibold text-white mb-5" style={{ lineHeight: 1.2 }}>
                {hero.headline.split("Align").map((part: string, i: number) =>
                  i === 0
                    ? <span key={i}>{part}<em className="text-saffron not-italic">Align</em></span>
                    : <span key={i}>{part}</span>
                )}
              </h1>
              <p className="text-white/80 text-[18px] mb-6" style={{ lineHeight: 1.8 }}>
                {hero.subtitle}
              </p>
              <p className="text-white/60 text-[15px] italic mb-8 leading-relaxed">
                {hero.emotionalHook}
              </p>
              <div className="flex gap-5 justify-center md:justify-start flex-wrap mb-8">
                <Button href="/services" variant="primary">Begin Your Journey</Button>
                <Button href="/services" variant="pine">Explore Services</Button>
              </div>
              <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                {hero.pills.map((text: string) => (
                  <span key={text} className="text-white text-sm px-5 py-3 rounded-full" style={{ background: "rgba(74,94,53,0.2)" }}>{text}</span>
                ))}
              </div>
            </div>
            {/* Right: coach photo with overlay */}
            <div className="w-full md:w-[45%] shrink-0 rounded-2xl overflow-hidden relative h-80 md:h-140">
              <Image src={img(heroImage)} alt="Umulkheiri Jalo, Ikigai Alignment Coach" fill className="object-cover" style={{ objectPosition: "center 38%" }} />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-28">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-6 h-px bg-saffron shrink-0" />
                  <span className="text-saffron text-xs uppercase tracking-wider font-semibold">Meet Your Coach</span>
                </div>
                <p className="text-white font-display text-2xl font-semibold">Umulkheiri Jalo</p>
                <p className="text-white/80 text-sm italic mt-1">&ldquo;I don&rsquo;t just help you find purpose — I help you design a life that feels aligned, abundant, and alive.&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CREDENTIALS STRIP ── */}
      <section className="bg-cream py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-text-dark uppercase tracking-wider">
            <span className="font-semibold text-text-dark">Certified Excellence</span>
            {cms.credentials.map((cred: string) => (
              <span key={cred} className="flex items-center gap-x-2">
                <span className="text-saffron">✦</span>
                <span>{cred}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 PILLARS ── */}
      <section className="bg-warm-sand py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-pine text-sm uppercase font-medium mb-2" style={{ letterSpacing: "3px" }}>The Framework</p>
            <h2 className="font-sans text-[28px] font-semibold text-espresso leading-snug mb-2">Three Pillars of Transformation</h2>
            <p className="text-text-dark text-base" style={{ lineHeight: "1.7" }}>Ikigai, Ubuntu, and Kihooto form the triangle of wholeness — a complete approach to purpose, belonging, and right action.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-stretch">
            {/* Left: image */}
            <div className="w-full md:w-[45%] shrink-0 rounded-2xl overflow-hidden">
              <img src={img(pillarsImage)} alt="Three botanical pillars: Ikigai bamboo, Ubuntu baobab, Kihooto leaf scales" className="w-full h-auto" />
            </div>
            {/* Right: pillar cards */}
            <div className="flex-1 flex flex-col gap-4 justify-center">
              {cms.pillars.map((pillar: { icon: string; title: string; subtitle: string; desc: string }) => {
                  const s = pillarStyles[pillar.title] ?? { color: "text-espresso", bg: "bg-sand-tint" };
                  return (
                  <div key={pillar.title} className="bg-white rounded-xl p-5 border border-black/6 flex gap-4 items-start">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${s.bg}`}>{pillar.icon}</div>
                    <div>
                      <h3 className={`font-display text-lg font-semibold ${s.color}`}>{pillar.title}</h3>
                      <p className="text-sm uppercase tracking-wider text-text-muted mb-1">{pillar.subtitle}</p>
                      <p className="text-base text-text-mid leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* ── IKIGAI VENN ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="The Inner Garden" title="Four Elements of Ikigai" description="Ikigai lives at the intersection of four circles — Passion, Skills, Service, and Livelihood." />
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Left col: Passion + Service */}
            <div className="flex flex-col gap-4 flex-1 w-full">
              {[cms.elements[0], cms.elements[2]].map((el: { icon: string; title: string; subtitle: string; desc: string }) => {
                const s = elementStyles[el.title] ?? { color: "text-espresso", bg: "bg-sand-tint" };
                return (
                  <div key={el.title} className="bg-white rounded-xl p-5 border border-black/6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.bg}`}>{el.icon}</div>
                    <h3 className={`font-display text-base font-semibold ${s.color}`}>{el.title}</h3>
                    <p className="text-sm uppercase tracking-wider text-text-muted mb-1">{el.subtitle}</p>
                    <p className="text-sm text-text-mid leading-relaxed">{el.desc}</p>
                  </div>
                );
              })}
            </div>
            {/* Center col: Venn SVG */}
            <div className="w-full md:w-80 shrink-0 rounded-2xl overflow-hidden">
              <Image src={img("/images/ikigai.jpg")} alt="Ikigai Venn diagram" width={400} height={400} className="w-full h-auto" />
            </div>
            {/* Right col: Skills + Livelihood */}
            <div className="flex flex-col gap-4 flex-1 w-full">
              {[cms.elements[1], cms.elements[3]].map((el: { icon: string; title: string; subtitle: string; desc: string }) => {
                const s = elementStyles[el.title] ?? { color: "text-espresso", bg: "bg-sand-tint" };
                return (
                  <div key={el.title} className="bg-white rounded-xl p-5 border border-black/6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.bg}`}>{el.icon}</div>
                    <h3 className={`font-display text-base font-semibold ${s.color}`}>{el.title}</h3>
                    <p className="text-sm uppercase tracking-wider text-text-muted mb-1">{el.subtitle}</p>
                    <p className="text-sm text-text-mid leading-relaxed">{el.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="bg-warm-sand py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="Services" title="Choose Your Path" description="From a free discovery session to a full transformation journey — find the container that fits where you are." />
          <div className="rounded-2xl overflow-hidden mb-10 max-w-2xl mx-auto">
            <Image src={img(servicesImage)} alt="Coaching conversation — intimate scene with coach and client" width={1200} height={800} className="w-full h-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cms.services.map((s: Parameters<typeof ServiceCard>[0]) => <ServiceCard key={s.title} {...s} />)}
          </div>
          <div className="mt-6 text-center">
            <Button href="/services" variant="ghost">View All Packages &amp; Details</Button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "#f9f7f2" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="Social Proof" title="What Clients Say" />
          {cms.testimonials.length > 3 ? (
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6">
              {cms.testimonials.map((t: Parameters<typeof TestimonialCard>[0], i: number) => (
                <div key={i} className="snap-start shrink-0 w-[85vw] md:w-[480px]">
                  <TestimonialCard {...t} />
                </div>
              ))}
            </div>
          ) : (
            <div className={cms.testimonials.length > 1 ? "grid md:grid-cols-2 gap-6" : ""}>
              {cms.testimonials.map((t: Parameters<typeof TestimonialCard>[0], i: number) => (
                <TestimonialCard key={i} {...t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="bg-warm-sand py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="Community" title="We Grow Together" description="Purpose flourishes in community. Join a circle of women and leaders committed to living with alignment, belonging, and impact." />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden relative h-full">
              <Image src={img(communityImage)} alt="Circle of women in purpose exploration" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-4">
              {cms.community.map((p: { icon: string; title: string; desc: string; date: string }, i: number) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-black/6 flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 bg-saffron-tint">{p.icon}</div>
                  <div>
                     <h3 className="font-semibold text-espresso mb-1">{p.title}</h3>
                     {p.date && <p className="text-sm text-saffron font-medium mb-2">{p.date}</p>}
                    <p className="text-base text-text-mid leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
              <div className="bg-espresso rounded-xl p-6 text-center">
                <p className="text-white/80 text-sm mb-4">Circles are currently forming — add your name to the list and we&apos;ll reach out with dates.</p>
                <a href="mailto:umulkheiri@yahoo.com?subject=Community Circle — Join the Waitlist"
                  className="inline-block bg-saffron hover:bg-cinnamon text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors">
                  Join the Waitlist
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-start mb-8">
            {/* Left: heading + cards */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-pine text-sm uppercase font-medium mb-2.5" style={{ letterSpacing: "3px" }}>The Ikigai Journal</p>
                <h2 className="font-sans text-[28px] font-semibold text-espresso leading-snug mb-3">Latest Wisdom</h2>
                <p className="text-text-dark text-base" style={{ lineHeight: "1.7" }}>Reflections on purpose, leadership, Ubuntu, and living an aligned life.</p>
              </div>
              <div className="flex flex-col gap-3">
                {cms.blog.filter((p: { featured?: boolean }) => p.featured).length > 0
                  ? cms.blog.filter((p: { featured?: boolean }) => p.featured).map((post: { tag: string; title: string; excerpt: string; date: string; coverImage?: string }) => {
                  const slug = toSlug(post.title);
                  return (
                    <Link key={slug} href={`/journal/${slug}`} className="group flex items-start gap-4 bg-white rounded-xl px-5 py-4 border border-warm-sand hover:-translate-y-0.5 transition-transform" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                      <span className="inline-block bg-pine text-white text-sm font-semibold px-2.5 py-1 rounded-full shrink-0 mt-0.5">{post.tag}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans text-[15px] font-medium text-espresso leading-snug group-hover:text-pine transition-colors">{post.title}</h3>
                        <p className="text-sm text-text-muted mt-0.5">{post.date}</p>
                      </div>
                      <span className="text-pine/40 group-hover:text-pine transition-colors shrink-0 mt-0.5">→</span>
                    </Link>
                  );
                  })
                  : <p className="text-espresso/40 text-sm">No featured articles selected yet.</p>
                }
              </div>
            </div>
            {/* Right: image */}
            <div className="rounded-2xl overflow-hidden">
              <Image src={img(journalImage)} alt="The Living Desk — open journals, chai, hands writing in afternoon light" width={1200} height={900} className="w-full h-auto" />
            </div>
          </div>
          <div className="text-center">
            <Button href="/journal" variant="pine">Read more articles →</Button>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-warm-sand py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="max-w-md mx-auto">
            <span className="text-3xl mb-4 block">🌿</span>
            <h2 className="font-display text-2xl font-semibold text-espresso mb-2">{cms.newsletter.heading}</h2>
            <p className="text-base text-text-muted mb-6">{cms.newsletter.body}</p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
