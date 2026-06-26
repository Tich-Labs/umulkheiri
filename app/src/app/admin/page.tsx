"use client";

import { useState, useEffect, useCallback, Fragment, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ServiceCard from "@/components/ServiceCard";

/* ── types ── */
type Service = {
  badge: string; badgeVariant?: "pink" | "teal" | "gold" | "night"; price: string; priceLabel: string;
  title: string; description: string; cta: string; ctaVariant?: "primary" | "ghost" | "teal"; featured?: boolean;
};
type Testimonial   = { quote: string; name: string; location: string; package: string };
type BlogPost      = { tag: string; title: string; excerpt: string; date: string; coverImage?: string; body?: string; featured?: boolean };
type CommunityItem = { icon: string; title: string; desc: string };
type Extra         = { name: string; price: string; desc: string };
type Corporate     = { name: string; price: string; duration: string; desc: string };
type Content = {
  hero:       { badge: string; headline: string; subtitle: string; emotionalHook: string; pills: string[]; image: string };
  coachIntro: { label: string; heading: string; body: string; photo: string };
  services:   Service[];
  extras:     Extra[];
  corporate:  Corporate[];
  testimonials: Testimonial[];
  blog:       BlogPost[];
  community:  CommunityItem[];
  pillarsImage: string;
  servicesImage: string;
  communityImage: string;
  journalImage: string;
};

const EMPTY: Content = {
  hero: { badge: "", headline: "", subtitle: "", emotionalHook: "", pills: [], image: "" },
  coachIntro: { label: "", heading: "", body: "", photo: "" },
  services: [], extras: [], corporate: [], testimonials: [], blog: [], community: [],
  pillarsImage: "", servicesImage: "", communityImage: "", journalImage: "",
};

const SECTIONS = [
  { id: "hero",        label: "Hero" },
  { id: "coach",       label: "Coach Intro" },
  { id: "services",    label: "Services" },
  { id: "extras",      label: "Add-Ons" },
  { id: "corporate",   label: "Corporate" },
  { id: "testimonials",label: "Testimonials" },
  { id: "blog",        label: "Journal" },
  { id: "community",   label: "Community" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/* ── UI components ── */
function PreviewShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden border border-saffron/20">
      <div className="bg-espresso px-4 py-2 flex items-center gap-2.5">
        <span className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-saffron/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#C8852A]/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-pine/50" />
        </span>
        <span className="text-sm text-white font-mono tracking-wide">preview · {title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function EditShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cream border border-saffron/20 rounded-xl px-6 py-5">
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-espresso/50 uppercase tracking-wider mb-1">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full bg-white border border-saffron/20 rounded-lg px-3 py-2 text-sm text-espresso placeholder-espresso/30 focus:outline-none focus:border-saffron transition-colors";
const ta  = inp + " resize-y min-h-[80px]";

/* ── main ── */
export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex h-screen bg-white items-center justify-center text-espresso/50">Loading…</div>}>
      <AdminContent />
    </Suspense>
  );
}

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent]     = useState<Content>(EMPTY);
  const [status, setStatus]       = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing]     = useState("");
  const activeSection: SectionId  = (searchParams.get("section") as SectionId) || "hero";

  function goToSection(id: SectionId) {
    router.push(`/admin?section=${id}`, { scroll: false });
  }

  const fetchContent = useCallback(async () => {
    const res = await fetch("/api/admin/content");
    if (res.ok) setContent(await res.json());
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  async function handleSave() {
    setStatus("saving");
    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setStatus(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setStatus("idle"), 2500);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, onUrl: (url: string) => void) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      onUrl(url);
    }
    setUploading(false);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setContent(c => ({ ...c, coachIntro: { ...c.coachIntro, photo: url } }));
    }
    setUploading(false);
  }

  async function handleCoverUpload(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setBlog(i, "coverImage", url);
    }
  }

  function setHero(k: keyof Content["hero"], v: string | string[]) {
    setContent(c => ({ ...c, hero: { ...c.hero, [k]: v } }));
  }
  function setCoach(k: keyof Content["coachIntro"], v: string) {
    setContent(c => ({ ...c, coachIntro: { ...c.coachIntro, [k]: v } }));
  }
  function setService(i: number, k: keyof Service, v: string | boolean) {
    setContent(c => { const s = [...c.services]; s[i] = { ...s[i], [k]: v }; return { ...c, services: s }; });
  }
  function setTestimonial(i: number, k: keyof Testimonial, v: string) {
    setContent(c => { const t = [...c.testimonials]; t[i] = { ...t[i], [k]: v }; return { ...c, testimonials: t }; });
  }
  function setBlog(i: number, k: keyof BlogPost, v: string | boolean) {
    setContent(c => { const b = [...c.blog]; b[i] = { ...b[i], [k]: v }; return { ...c, blog: b }; });
  }
  function setCommunity(i: number, k: keyof CommunityItem, v: string) {
    setContent(c => { const cm = [...c.community]; cm[i] = { ...cm[i], [k]: v }; return { ...c, community: cm }; });
  }
  function setExtra(i: number, k: keyof Extra, v: string) {
    setContent(c => { const ex = [...(c.extras ?? [])]; ex[i] = { ...ex[i], [k]: v }; return { ...c, extras: ex }; });
  }
  function setCorporate(i: number, k: keyof Corporate, v: string) {
    setContent(c => { const co = [...(c.corporate ?? [])]; co[i] = { ...co[i], [k]: v }; return { ...c, corporate: co }; });
  }

  const { hero, coachIntro: coach, services, extras = [], corporate = [], testimonials, blog, community, pillarsImage, servicesImage, communityImage, journalImage } = content;

  const saveBtn = (
    <button onClick={handleSave} disabled={status === "saving"}
      className="bg-saffron hover:bg-[#c97508] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
      {status === "saving" ? "Saving…" : status === "saved" ? "✓ Saved" : status === "error" ? "Error — retry" : "Save Changes"}
    </button>
  );

  return (
    <div className="flex h-screen bg-white">

      {/* ── SIDEBAR ── */}
      <aside className="w-56 flex-shrink-0 bg-cream flex flex-col border-r border-saffron/20">
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-saffron/20">
          <span className="font-display font-semibold text-sm leading-tight text-espresso">Umulkheiri<br/>Jalo</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => goToSection(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                activeSection === s.id
                  ? "bg-espresso/10 text-espresso font-medium"
                  : "text-espresso/50 hover:text-espresso hover:bg-espresso/5"
              }`}>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-saffron/20">
          <div className="text-sm text-espresso/30 px-3">Site Editor</div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* top bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-saffron/10 px-6 h-14 flex items-center justify-between">
          <h2 className="font-semibold text-espresso text-base">
            {SECTIONS.find(s => s.id === activeSection)?.label}
          </h2>
          {saveBtn}
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ─── HERO ─── */}
          {activeSection === "hero" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="Hero">
                <div style={{ background: "linear-gradient(135deg, #1E1208 0%, rgba(30,18,8,0.97) 100%)" }}>
                  <div className="grid md:grid-cols-2 gap-6 items-center" style={{ padding: "40px 30px" }}>
                    <div className="text-center md:text-left">
                      <h1 className="font-display text-[22px] font-semibold text-white mb-3" style={{ lineHeight: 1.2 }}>
                        {hero.headline || <span className="opacity-30">Your Sacred Garden Awaits…</span>}
                      </h1>
                      <p className="text-white/80 text-sm mb-5" style={{ lineHeight: 1.8 }}>
                        {hero.subtitle || <span className="opacity-40">Subtitle text…</span>}
                      </p>
                      <div className="flex gap-2 justify-center md:justify-start flex-wrap mb-5">
                        <span className="bg-saffron text-white text-sm font-semibold px-5 py-2 rounded-lg">Begin Your Journey</span>
                        <span className="border-2 border-saffron text-saffron text-sm font-semibold px-5 py-2 rounded-lg">Explore Services</span>
                      </div>
                      {hero.pills.length > 0 && (
                        <div className="flex gap-2 justify-center md:justify-start flex-wrap">
                          {hero.pills.map((p, i) => (
                            <span key={i} className="text-white text-sm px-3 py-1.5 rounded-full" style={{ background: "rgba(212,134,10,0.15)" }}>{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <img src={hero.image || "/images/hero_bg.png"} alt="Woman in deep listening" className="w-full h-auto" />
                    </div>
                  </div>
                </div>
              </PreviewShell>
              <EditShell>
                <Field label="Headline">
                  <input className={inp} value={hero.headline} onChange={e => setHero("headline", e.target.value)} placeholder="Your Sacred Garden Awaits — Align with your Ikigai" />
                </Field>
                <Field label="Subtitle">
                  <textarea className={ta} value={hero.subtitle} onChange={e => setHero("subtitle", e.target.value)} placeholder="Certified Ikigai Alignment Coach blending…" />
                </Field>
                <Field label="Pills — comma separated">
                  <input className={inp} value={hero.pills.join(", ")} onChange={e => setHero("pills", e.target.value.split(",").map(p => p.trim()).filter(Boolean))} placeholder="✦ Purpose Discovery, 🌿 Feminine Leadership…" />
                </Field>
                <Field label="Hero illustration">
                  {hero.image && <img src={hero.image} alt="" className="w-full h-28 object-cover rounded-lg mb-2 border border-saffron/20" />}
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setHero("image", url))}
                    className="block text-sm text-espresso/50 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-saffron file:text-white hover:file:bg-cinnamon file:cursor-pointer" />
                </Field>
              </EditShell>
            </div>
          )}

          {/* ─── COACH INTRO ─── */}
          {activeSection === "coach" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="About / Coach Introduction">
                <div className="bg-white px-8 py-10">
                  <div className="flex flex-col sm:flex-row gap-6 items-start" style={{ maxWidth: 700, margin: "0 auto" }}>
                    <div className="w-40 h-40 rounded-full bg-warm-sand flex items-center justify-center flex-shrink-0 overflow-hidden border-4 border-saffron/20">
                      {coach.photo
                        ? <img src={coach.photo} alt="Coach" className="w-full h-full object-cover" />
                        : <span className="text-3xl">🌸</span>}
                    </div>
                    <div>
                      <p className="text-pine text-sm uppercase font-medium mb-2" style={{ letterSpacing: "3px" }}>{coach.label || "Meet Umulkheiri"}</p>
                      <h2 className="font-sans text-[22px] font-semibold text-espresso mb-3" style={{ lineHeight: 1.3 }}>
                        {coach.heading || <span className="opacity-30">Heading…</span>}
                      </h2>
                      <p className="text-[13px] text-text-dark leading-relaxed">
                        {coach.body || <span className="opacity-30">Body paragraph…</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </PreviewShell>
              <EditShell>
                <Field label="Label (e.g. 'Meet Umulkheiri')">
                  <input className={inp} value={coach.label} onChange={e => setCoach("label", e.target.value)} />
                </Field>
                <Field label="Heading">
                  <textarea className={ta} value={coach.heading} onChange={e => setCoach("heading", e.target.value)} />
                </Field>
                <Field label="Body paragraph">
                  <textarea className={ta + " min-h-[100px]"} value={coach.body} onChange={e => setCoach("body", e.target.value)} />
                </Field>
                <Field label="Photo">
                  {coach.photo && <img src={coach.photo} alt="Coach" className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-saffron/30" />}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload}
                    className="block text-sm text-espresso/50 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-saffron file:text-white hover:file:bg-cinnamon file:cursor-pointer" />
                  {uploading && <p className="text-saffron text-sm mt-1">Uploading…</p>}
                </Field>
              </EditShell>
            </div>
          )}

          {/* ─── SERVICES ─── */}
          {activeSection === "services" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="Services & Packages">
                <div className="bg-white">
                  <img src={servicesImage || "/images/services.png"} alt="Coaching conversation" className="w-full h-auto" />
                  <div className="px-5 py-8">
                    <div style={{ maxWidth: 900, margin: "0 auto" }}>
                      <h2 className="font-sans text-[22px] font-semibold text-espresso mb-2">Individual Coaching Packages</h2>
                      <p className="text-text-dark text-sm mb-8">Choose the path that resonates with your current season of life.</p>
                      <div className="grid grid-cols-2 gap-4">
                      {services.length === 0
                        ? <p className="text-espresso/30 text-sm col-span-2">No services yet</p>
                        : services.map((s, i) => <ServiceCard key={i} {...s} />)}
                    </div>
                    </div>
                  </div>
                  </div>
                </PreviewShell>
                <EditShell>
                  <Field label="Section image">
                    {servicesImage && <img src={servicesImage} alt="" className="w-full h-24 object-cover rounded-lg mb-2 border border-saffron/20" />}
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setContent(c => ({ ...c, servicesImage: url })))}
                      className="block text-sm text-espresso/50 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-saffron file:text-white hover:file:bg-cinnamon file:cursor-pointer" />
                  </Field>
                  {services.map((s, i) => (
                  <div key={i} className="mb-5 pb-5 border-b border-saffron/10 last:border-0 last:mb-0 last:pb-0">
                    <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Package {i + 1}{s.featured ? " ★ Featured" : ""}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Badge"><input className={inp} value={s.badge} onChange={e => setService(i, "badge", e.target.value)} /></Field>
                      <Field label="Price"><input className={inp} value={s.price} onChange={e => setService(i, "price", e.target.value)} /></Field>
                      <Field label="Price label"><input className={inp} value={s.priceLabel} onChange={e => setService(i, "priceLabel", e.target.value)} /></Field>
                      <Field label="CTA text"><input className={inp} value={s.cta} onChange={e => setService(i, "cta", e.target.value)} /></Field>
                    </div>
                    <Field label="Title"><input className={inp} value={s.title} onChange={e => setService(i, "title", e.target.value)} /></Field>
                    <Field label="Description"><textarea className={ta} value={s.description} onChange={e => setService(i, "description", e.target.value)} /></Field>
                    <label className="flex items-center gap-2 text-sm text-espresso/60 mt-2 cursor-pointer">
                      <input type="checkbox" checked={!!s.featured} onChange={e => setService(i, "featured", e.target.checked)} className="accent-saffron" />
                      Featured card (dark background)
                    </label>
                  </div>
                ))}
              </EditShell>
            </div>
          )}

          {/* ─── EXTRAS / ADD-ONS ─── */}
          {activeSection === "extras" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="Add-Ons — as shown on /services">
                <div className="bg-white px-6 py-8">
                  <h2 className="font-sans text-[22px] font-semibold text-espresso mb-2">Add-Ons</h2>
                  <p className="text-text-dark text-sm mb-6">Deepen your coaching experience with these optional additions.</p>
                  <div className="grid gap-4">
                    {extras.length === 0
                      ? <p className="text-espresso/30 text-sm">No add-ons yet</p>
                      : extras.map((ex, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 border-t-4 border-saffron" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                          <p className="font-display text-[28px] font-semibold text-saffron mb-1">{ex.price || "$—"}</p>
                          <h3 className="font-sans text-[16px] font-medium text-espresso mb-2">{ex.name || <span className="opacity-30">Name…</span>}</h3>
                          <p className="text-[13px] text-text-dark leading-relaxed">{ex.desc || <span className="opacity-30">Description…</span>}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </PreviewShell>
              <EditShell>
                {extras.map((ex, i) => (
                  <div key={i} className="mb-5 pb-5 border-b border-saffron/10 last:border-0 last:mb-0 last:pb-0">
                    <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Add-On {i + 1}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Name"><input className={inp} value={ex.name} onChange={e => setExtra(i, "name", e.target.value)} /></Field>
                      <Field label="Price"><input className={inp} value={ex.price} onChange={e => setExtra(i, "price", e.target.value)} /></Field>
                    </div>
                    <Field label="Description"><textarea className={ta} value={ex.desc} onChange={e => setExtra(i, "desc", e.target.value)} /></Field>
                  </div>
                ))}
                <div className="flex gap-4 pt-1">
                  <button onClick={() => setContent(c => ({ ...c, extras: [...(c.extras ?? []), { name: "", price: "", desc: "" }] }))}
                    className="text-sm text-saffron hover:text-cinnamon transition-colors cursor-pointer">+ Add add-on</button>
                  {extras.length > 0 && (
                    <button onClick={() => setContent(c => ({ ...c, extras: (c.extras ?? []).slice(0, -1) }))}
                      className="text-sm text-espresso/40 hover:text-saffron transition-colors cursor-pointer">Remove last</button>
                  )}
                </div>
              </EditShell>
            </div>
          )}

          {/* ─── CORPORATE ─── */}
          {activeSection === "corporate" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="Corporate & Group — as shown on /services">
                <div className="bg-cream px-6 py-8">
                  <h2 className="font-sans text-[22px] font-semibold text-espresso mb-2">Corporate &amp; Group</h2>
                  <p className="text-text-dark text-sm mb-6">Bring Ikigai alignment to your team, company, or community.</p>
                  <div className="grid gap-4">
                    {corporate.length === 0
                      ? <p className="text-espresso/30 text-sm">No corporate offerings yet</p>
                      : corporate.map((co, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 border border-warm-sand flex flex-col" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                          <p className="font-display text-[28px] font-semibold text-pine mb-0.5">{co.price || "—"}</p>
                          <p className="text-sm text-text-muted mb-3">{co.duration || "Duration"}</p>
                          <h3 className="font-sans text-[16px] font-medium text-espresso mb-2">{co.name || <span className="opacity-30">Name…</span>}</h3>
                          <p className="text-[13px] text-text-dark leading-relaxed">{co.desc || <span className="opacity-30">Description…</span>}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </PreviewShell>
              <EditShell>
                {corporate.map((co, i) => (
                  <div key={i} className="mb-5 pb-5 border-b border-saffron/10 last:border-0 last:mb-0 last:pb-0">
                    <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Offering {i + 1}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Name"><input className={inp} value={co.name} onChange={e => setCorporate(i, "name", e.target.value)} /></Field>
                      <Field label="Price"><input className={inp} value={co.price} onChange={e => setCorporate(i, "price", e.target.value)} placeholder="From $555 / Custom" /></Field>
                      <Field label="Duration"><input className={inp} value={co.duration} onChange={e => setCorporate(i, "duration", e.target.value)} placeholder="30-60 min / Half Day / 2-3 Days" /></Field>
                    </div>
                    <Field label="Description"><textarea className={ta} value={co.desc} onChange={e => setCorporate(i, "desc", e.target.value)} /></Field>
                  </div>
                ))}
                <div className="flex gap-4 pt-1">
                  <button onClick={() => setContent(c => ({ ...c, corporate: [...(c.corporate ?? []), { name: "", price: "", duration: "", desc: "" }] }))}
                    className="text-sm text-saffron hover:text-cinnamon transition-colors cursor-pointer">+ Add offering</button>
                  {corporate.length > 0 && (
                    <button onClick={() => setContent(c => ({ ...c, corporate: (c.corporate ?? []).slice(0, -1) }))}
                      className="text-sm text-espresso/40 hover:text-saffron transition-colors cursor-pointer">Remove last</button>
                  )}
                </div>
              </EditShell>
            </div>
          )}

          {/* ─── TESTIMONIALS ─── */}
          {activeSection === "testimonials" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="Testimonials">
                <div className="bg-white px-8 py-8">
                  <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 className="font-sans text-[22px] font-semibold text-espresso mb-8">What Clients Say</h2>
                    {testimonials.length === 0
                      ? <div className="bg-espresso/8 rounded-xl p-8 text-center text-espresso/30 text-sm">No testimonials yet</div>
                      : testimonials.map((t, i) => (
                        <div key={i} className="bg-espresso rounded-xl p-8 mb-4">
                          <p className="font-display text-[18px] italic text-white mb-4" style={{ lineHeight: 1.8 }}>
                            &ldquo;{t.quote || <span className="opacity-30">Quote text…</span>}&rdquo;
                          </p>
                          <p className="text-sm text-white/60">
                            <strong className="text-saffron">{t.name || "Name"}</strong>
                            {t.location && `, ${t.location}`}
                            {t.package && ` · ${t.package}`}
                          </p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </PreviewShell>
              <EditShell>
                {testimonials.map((t, i) => (
                  <div key={i} className="mb-5 pb-5 border-b border-saffron/10 last:border-0 last:mb-0 last:pb-0">
                    <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Testimonial {i + 1}</p>
                    <Field label="Quote"><textarea className={ta + " min-h-[100px]"} value={t.quote} onChange={e => setTestimonial(i, "quote", e.target.value)} /></Field>
                    <div className="grid grid-cols-3 gap-3">
                      <Field label="Name"><input className={inp} value={t.name} onChange={e => setTestimonial(i, "name", e.target.value)} /></Field>
                      <Field label="Location"><input className={inp} value={t.location} onChange={e => setTestimonial(i, "location", e.target.value)} /></Field>
                      <Field label="Package"><input className={inp} value={t.package} onChange={e => setTestimonial(i, "package", e.target.value)} /></Field>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 pt-1">
                  <button onClick={() => setContent(c => ({ ...c, testimonials: [...c.testimonials, { quote: "", name: "", location: "", package: "" }] }))}
                    className="text-sm text-saffron hover:text-cinnamon transition-colors cursor-pointer">+ Add testimonial</button>
                  {testimonials.length > 0 && (
                    <button onClick={() => setContent(c => ({ ...c, testimonials: c.testimonials.slice(0, -1) }))}
                      className="text-sm text-espresso/40 hover:text-saffron transition-colors cursor-pointer">Remove last</button>
                  )}
                </div>
              </EditShell>
            </div>
          )}

          {/* ─── BLOG ─── */}
          {activeSection === "blog" && (
            <div className="space-y-6">
              {/* Card previews */}
              <PreviewShell title="Journal listing — card previews">
                <div style={{ background: "#EDE8E1", padding: "24px" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#8B4513", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Cards as shown on /journal</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    {blog.length === 0
                      ? <div style={{ gridColumn: "span 3", color: "#C4BAB0", fontSize: 13, textAlign: "center", padding: "32px 0" }}>No articles yet — add one below</div>
                      : blog.map((p, i) => (
                        <div key={i} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #C4BAB0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                          {p.coverImage
                            ? <div style={{ height: 120, overflow: "hidden" }}><img src={p.coverImage} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
                            : <div style={{ height: 120, background: "linear-gradient(135deg, rgba(212,134,10,0.15) 0%, rgba(74,94,53,0.15) 100%)", display: "flex", alignItems: "flex-end", padding: 12 }}>
                                <span style={{ background: "#D4860A", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{p.tag || "Tag"}</span>
                              </div>
                          }
                          <div style={{ padding: 12 }}>
                            {p.coverImage && <span style={{ display: "inline-block", background: "#D4860A", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, marginBottom: 6 }}>{p.tag || "Tag"}</span>}
                            <p style={{ fontSize: 13, fontWeight: 500, color: "#1E1208", lineHeight: 1.4, marginBottom: 4 }}>{p.title || "Untitled"}</p>
                            <p style={{ fontSize: 12, color: "#C4BAB0" }}>{p.date || "No date"}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </PreviewShell>

              {/* Section image */}
              <div className="bg-cream border border-saffron/20 rounded-xl px-6 py-5">
                <Field label="Journal section image">
                  {journalImage && <img src={journalImage} alt="" className="w-full h-28 object-cover rounded-lg mb-2 border border-saffron/20" />}
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setContent(c => ({ ...c, journalImage: url })))}
                    className="block text-sm text-espresso/50 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-saffron file:text-white hover:file:bg-cinnamon file:cursor-pointer" />
                </Field>
              </div>

              {/* Edit forms — collapsible table */}
              <div className="bg-cream border border-saffron/20 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-saffron/20 text-espresso/50 text-sm uppercase tracking-wider">
                        <th className="text-left px-4 py-3 font-medium w-8">#</th>
                        <th className="text-left px-4 py-3 font-medium w-14">Img</th>
                        <th className="text-left px-4 py-3 font-medium">Title</th>
                        <th className="text-center px-4 py-3 font-medium w-14">Feat</th>
                        <th className="text-left px-4 py-3 font-medium w-28">Tag</th>
                        <th className="text-left px-4 py-3 font-medium w-24">Date</th>
                        <th className="text-right px-4 py-3 font-medium w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                          {blog.length === 0 && (
                            <tr><td colSpan={7} className="text-center text-espresso/30 py-8 text-sm">No articles yet</td></tr>
                          )}
                          {blog.map((b, i) => (
                            <Fragment key={i}>
                              <tr className="border-b border-saffron/10 hover:bg-white/60 cursor-pointer transition-colors"
                                onClick={() => setEditing(String(editing === String(i) ? "" : i))}>
                                <td className="px-4 py-3 text-espresso/40">{i + 1}</td>
                                <td className="px-4 py-3">
                                  {b.coverImage
                                    ? <img src={b.coverImage} alt="" className="w-10 h-7 rounded object-cover border border-saffron/20" />
                                    : <div className="w-10 h-7 rounded bg-saffron/10" />
                                  }
                                </td>
                                <td className="px-4 py-3 font-medium text-espresso">{b.title || <span className="opacity-30 italic">Untitled</span>}</td>
                                <td className="px-4 py-3 text-center">{b.featured ? <span className="text-saffron" title="Featured">★</span> : <span className="text-espresso/20">☆</span>}</td>
                                <td className="px-4 py-3 text-espresso/60">{b.tag || "—"}</td>
                                <td className="px-4 py-3 text-espresso/50">{b.date || "—"}</td>
                                <td className="px-4 py-3 text-right">
                                  <button onClick={e => { e.stopPropagation(); setContent(c => ({ ...c, blog: c.blog.filter((_, idx) => idx !== i) })); }}
                                    className="text-espresso/30 hover:text-saffron transition-colors cursor-pointer text-sm">✕</button>
                                </td>
                              </tr>
                          {editing === String(i) && (
                            <tr>
                              <td colSpan={6} className="px-4 py-4 bg-white">
                                <div className="grid grid-cols-2 gap-6">
                                  {/* Left column: cover image (big preview) */}
                                  <div>
                                    <Field label="Cover image">
                                      {b.coverImage
                                        ? <div className="relative mb-2 rounded-lg overflow-hidden border border-saffron/20" style={{ maxHeight: 260 }}>
                                            <img src={b.coverImage} alt="" className="w-full h-auto object-cover" />
                                            <button onClick={() => setBlog(i, "coverImage", "")}
                                              className="absolute top-2 right-2 bg-espresso/60 text-white text-sm px-2 py-1 rounded hover:bg-espresso/80 cursor-pointer">Remove</button>
                                          </div>
                                        : <div className="w-full h-40 rounded-lg bg-saffron/5 border border-dashed border-saffron/30 flex items-center justify-center text-espresso/30 text-sm mb-2">No cover image</div>
                                      }
                                      <input type="file" accept="image/*" onChange={e => handleCoverUpload(i, e)}
                                        className="block w-full text-sm text-espresso/50 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-saffron file:text-white hover:file:bg-cinnamon file:cursor-pointer" />
                                    </Field>
                                  </div>
                                  {/* Right column: featured, tag, date, title, excerpt */}
                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                      <label className="flex items-center gap-2 text-sm text-espresso cursor-pointer">
                                        <input type="checkbox" checked={!!b.featured} onChange={e => setBlog(i, "featured", e.target.checked)}
                                          className="accent-saffron w-4 h-4 rounded border-saffron/30" />
                                        <span>Featured on home page</span>
                                      </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <Field label="Tag / Category"><input className={inp} value={b.tag} onChange={e => setBlog(i, "tag", e.target.value)} /></Field>
                                      <Field label="Date"><input className={inp} value={b.date} onChange={e => setBlog(i, "date", e.target.value)} /></Field>
                                    </div>
                                    <Field label="Title"><input className={inp} value={b.title} onChange={e => setBlog(i, "title", e.target.value)} /></Field>
                                    <Field label="Excerpt (shown on listing card)"><textarea className={ta} value={b.excerpt} onChange={e => setBlog(i, "excerpt", e.target.value)} /></Field>
                                  </div>
                                </div>
                                <Field label="Full article body (paragraphs separated by blank lines)">
                                  <textarea className={ta + " min-h-[160px]"} value={b.body ?? ""} onChange={e => setBlog(i, "body", e.target.value)} placeholder="Write the full article here…&#10;&#10;Separate paragraphs with a blank line." />
                                </Field>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-4 px-1">
                <button onClick={() => setContent(c => ({ ...c, blog: [...c.blog, { tag: "", title: "", excerpt: "", date: "", coverImage: "", body: "", featured: false }] }))}
                  className="text-sm text-saffron hover:text-cinnamon transition-colors cursor-pointer">+ Add article</button>
                {blog.length > 0 && (
                  <button onClick={() => setContent(c => ({ ...c, blog: c.blog.slice(0, -1) }))}
                    className="text-sm text-espresso/40 hover:text-saffron transition-colors cursor-pointer">Remove last</button>
                )}
              </div>
            </div>
          )}

          {/* ─── COMMUNITY ─── */}
          {activeSection === "community" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="Community Programs">
                <div className="bg-white px-6 py-8">
                  <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <h2 className="font-sans text-[22px] font-semibold text-espresso mb-2">Group &amp; Community</h2>
                    <p className="text-text-dark text-sm mb-6">Workshops for circles, ALX alumni, and community groups.</p>
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      <div className="rounded-2xl overflow-hidden" style={{ maxHeight: 380 }}>
                        <img src={communityImage || "/images/community.jpeg"} alt="Circle of women in purpose exploration" className="w-full h-full object-cover" style={{ maxHeight: 380 }} />
                      </div>
                      <div className="grid gap-3">
                        {community.map((p, i) => (
                          <div key={i} className="bg-white rounded-xl p-4 border border-saffron/10 flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-saffron-tint">{p.icon || "✦"}</div>
                            <div>
                              <h3 className="font-sans text-[14px] font-medium text-text-dark mb-1">{p.title || <span className="opacity-30">Program title</span>}</h3>
                              <p className="text-sm text-text-dark leading-relaxed">{p.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </PreviewShell>
              <EditShell>
                <Field label="Section image">
                  {communityImage && <img src={communityImage} alt="" className="w-full h-24 object-cover rounded-lg mb-2 border border-saffron/20" />}
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setContent(c => ({ ...c, communityImage: url })))}
                    className="block text-sm text-espresso/50 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-saffron file:text-white hover:file:bg-cinnamon file:cursor-pointer" />
                </Field>
                {community.map((cm, i) => (
                  <div key={i} className="mb-4 pb-4 border-b border-saffron/10 last:border-0 last:mb-0 last:pb-0">
                    <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Program {i + 1}</p>
                    <div className="grid grid-cols-4 gap-3">
                      <Field label="Icon (emoji)"><input className={inp} value={cm.icon} onChange={e => setCommunity(i, "icon", e.target.value)} /></Field>
                      <div className="col-span-3"><Field label="Title"><input className={inp} value={cm.title} onChange={e => setCommunity(i, "title", e.target.value)} /></Field></div>
                    </div>
                    <Field label="Description"><textarea className={ta} value={cm.desc} onChange={e => setCommunity(i, "desc", e.target.value)} /></Field>
                  </div>
                ))}
              </EditShell>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
