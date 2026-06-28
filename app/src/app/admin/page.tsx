"use client";

import { useState, useEffect, useCallback, useRef, Fragment, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ServiceCard from "@/components/ServiceCard";
import { supabaseAdminClient } from "@/lib/supabase-admin-client";
import { supabase } from "@/lib/supabase";
import { img } from "@/lib/path";

/* ── types ── */
type Service = {
  badge: string; badgeVariant?: "pink" | "teal" | "gold" | "night"; price: string; priceLabel: string;
  title: string; description: string; cta: string; ctaVariant?: "primary" | "ghost" | "teal"; featured?: boolean;
};
type Testimonial   = { quote: string; name: string; location: string; package: string };
type BlogPost      = { tag: string; title: string; excerpt: string; date: string; coverImage?: string; body?: string; featured?: boolean; seoTitle?: string; seoDescription?: string };
type CommunityItem = { icon: string; title: string; desc: string; date: string };
type Faq          = { q: string; a: string };
type Extra         = { name: string; price: string; desc: string };
type Corporate     = { name: string; price: string; duration: string; desc: string };
type Pillar        = { icon: string; title: string; subtitle: string; desc: string };
type Element       = { icon: string; title: string; subtitle: string; desc: string };
type Newsletter    = { heading: string; body: string };
type Content = {
  currency:   string;
  hero:       { badge: string; headline: string; subtitle: string; emotionalHook: string; pills: string[]; image: string };
  coachIntro: { label: string; heading: string; body: string; photo: string };
  services:   Service[];
  extras:     Extra[];
  corporate:  Corporate[];
  testimonials: Testimonial[];
  blog:       BlogPost[];
  community:  CommunityItem[];
  faq:        Faq[];
  pillars:    Pillar[];
  elements:   Element[];
  credentials: string[];
  newsletter: Newsletter;
  pillarsImage: string;
  servicesImage: string;
  communityImage: string;
  journalImage: string;
};

const EMPTY: Content = {
  currency: "KES",
  hero: { badge: "", headline: "", subtitle: "", emotionalHook: "", pills: [], image: "" },
  coachIntro: { label: "", heading: "", body: "", photo: "" },
  services: [], extras: [], corporate: [], testimonials: [], blog: [], community: [], faq: [],
  pillars: [
    { icon: "🌸", title: "Ikigai", subtitle: "Purpose & Passion", desc: "" },
    { icon: "🌍", title: "Ubuntu", subtitle: "Belonging & Community", desc: "" },
    { icon: "⚖️", title: "Kihooto", subtitle: "Justice & Right Action", desc: "" },
  ],
  elements: [
    { icon: "❤️", title: "Passion", subtitle: "What you love", desc: "" },
    { icon: "⭐", title: "Skills", subtitle: "What you're good at", desc: "" },
    { icon: "🌍", title: "Service", subtitle: "What the world needs", desc: "" },
    { icon: "💰", title: "Livelihood", subtitle: "What you can be rewarded for", desc: "" },
  ],
  credentials: [],
  newsletter: { heading: "The Inner Garden Letter", body: "" },
  pillarsImage: "", servicesImage: "", communityImage: "", journalImage: "",
};

const SECTIONS = [
  { id: "manual",      label: "⭐ Start Here" },
  { id: "hero",        label: "Hero" },
  { id: "pillars",     label: "Three Pillars" },
  { id: "elements",    label: "Ikigai Elements" },
  { id: "services",    label: "Services" },
  { id: "extras",      label: "Add-Ons" },
  { id: "corporate",   label: "Corporate" },
  { id: "testimonials",label: "Testimonials" },
  { id: "community",   label: "Community" },
  { id: "blog",        label: "Journal" },
  { id: "faq",         label: "FAQ" },
  { id: "newsletter",  label: "Newsletter" },
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

/* ── ImageUpload ── */
function ImageUpload({ value, onChange, placeholder }: { value: string; onChange: (url: string) => void; placeholder?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabaseAdminClient.storage
        .from("uploads")
        .upload(name, file, { upsert: false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabaseAdminClient.storage
        .from("uploads")
        .getPublicUrl(name);
      onChange(publicUrl);
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <input className={inp} value={value} readOnly placeholder={placeholder ?? "Upload or enter URL"} />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="mt-1.5 text-xs bg-saffron/10 hover:bg-saffron/20 text-saffron px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50">
        {uploading ? "Uploading…" : "↑ Upload image"}
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

/* ── PasswordGate ── */
function PasswordGate({ children }: { children: React.ReactNode }) {
  const required = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [authed, setAuthed] = useState(!required);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (required && sessionStorage.getItem("admin-authed") === "1") setAuthed(true);
  }, [required]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === required) {
      setAuthed(true);
      sessionStorage.setItem("admin-authed", "1");
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 2000);
    }
  }

  if (!required || authed) return <>{children}</>;

  return (
    <div className="flex h-screen bg-cream items-center justify-center">
      <div className="bg-white rounded-2xl p-10 w-80 shadow-lg border border-saffron/20">
        <h1 className="font-display text-xl font-semibold text-espresso mb-1">Umulkheiri Jalo</h1>
        <p className="text-sm text-espresso/40 mb-6">Site Editor</p>
          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <input type={showPw ? "text" : "password"} className={inp + " pr-10"} placeholder="Password" value={pw}
                onChange={e => { setPw(e.target.value); setErr(false); }} autoFocus />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-espresso/40 hover:text-espresso/70 cursor-pointer">
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          {err && <p className="text-red-500 text-xs">Incorrect password</p>}
          <button type="submit" className="w-full bg-espresso text-white text-sm font-medium py-2.5 rounded-lg hover:bg-espresso/90 transition-colors cursor-pointer">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── main ── */
export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex h-screen bg-white items-center justify-center text-espresso/50">Loading…</div>}>
      <PasswordGate>
        <AdminContent />
      </PasswordGate>
    </Suspense>
  );
}

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent]     = useState<Content>(EMPTY);
  const [editing, setEditing]     = useState("");
  const [activeManualTab, setActiveManualTab] = useState("hero");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [loadErr, setLoadErr]     = useState<string | null>(null);
  const activeSection: SectionId  = (searchParams.get("section") as SectionId) || "hero";

  function goToSection(id: SectionId) {
    router.push(`/admin?section=${id}`, { scroll: false });
  }

  const fetchContent = useCallback(async () => {
    setLoadErr(null);
    const client = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? supabaseAdminClient : supabase;
    const { data: rows, error } = await client.from("content").select("data").limit(1);
    if (error) {
      console.error("Content load error:", error.message);
      setLoadErr(error.message);
    }
    const row = rows?.[0];
    if (row?.data) setContent(row.data as Content);
  }, []);

  async function saveContent() {
    setSaving(true);
    setSaved(false);
    try {
      const { data: rows, error: readErr } = await supabaseAdminClient.from("content").select("id").limit(1);
      if (readErr) throw readErr;
      const existing = rows?.[0];
      if (!existing) throw new Error("No content row found to update");
      const { error } = await supabaseAdminClient.from("content").update({ data: content }).eq("id", existing.id);
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(`Save failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { fetchContent(); }, [fetchContent]);

  function setHero(k: keyof Content["hero"], v: string | string[]) {
    setContent(c => ({ ...c, hero: { ...c.hero, [k]: v } }));
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
  function setFaq(i: number, k: keyof Faq, v: string) {
    setContent(c => { const f = [...(c.faq ?? [])]; f[i] = { ...f[i], [k]: v }; return { ...c, faq: f }; });
  }
  function setPillar(i: number, k: keyof Pillar, v: string) {
    setContent(c => { const p = [...c.pillars]; p[i] = { ...p[i], [k]: v }; return { ...c, pillars: p }; });
  }
  function setElement(i: number, k: keyof Element, v: string) {
    setContent(c => { const e = [...c.elements]; e[i] = { ...e[i], [k]: v }; return { ...c, elements: e }; });
  }
  function setCredential(i: number, v: string) {
    setContent(c => { const cr = [...c.credentials]; cr[i] = v; return { ...c, credentials: cr }; });
  }

  const { hero, services, extras = [], corporate = [], testimonials, blog, community, faq = [], pillars, elements, credentials = [], newsletter = { heading: "", body: "" }, pillarsImage, servicesImage, communityImage, journalImage, currency } = content;

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
          <button onClick={saveContent} disabled={saving}
            className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 ${saved ? "bg-pine text-white" : "bg-espresso hover:bg-espresso/90 text-white"}`}>
            {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>

        {/* error banner */}
        {loadErr && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg">
            Content load failed: {loadErr}
          </div>
        )}

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
                      <p className="text-white/80 text-sm mb-3" style={{ lineHeight: 1.8 }}>
                        {hero.subtitle || <span className="opacity-40">Subtitle text…</span>}
                      </p>
                      {hero.emotionalHook && (
                        <p className="text-white/50 text-sm italic mb-4 leading-relaxed">
                          {hero.emotionalHook}
                        </p>
                      )}
                      <div className="flex gap-2 justify-center md:justify-start flex-wrap mb-5">
                        <span className="bg-saffron text-white text-sm font-semibold px-5 py-2 rounded-lg">Begin Your Journey</span>
                        <span className="border-2 border-saffron text-saffron text-sm font-semibold px-5 py-2 rounded-lg">Explore Services</span>
                      </div>
                      {hero.pills.length > 0 && (
                        <div className="flex gap-2 justify-center md:justify-start flex-wrap">
                          {hero.pills.map((p, i) => (
                            <span key={i} className="text-white text-sm px-3 py-1.5 rounded-full" style={{ background: "rgba(74,94,53,0.2)" }}>{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
                      {hero.image
                        ? <img src={img(hero.image)} alt="Coach" className="w-full h-full object-cover" style={{ objectPosition: "center 38%" }} />
                        : <div className="w-full h-full bg-espresso/50 flex items-center justify-center text-white/30 text-sm">No photo</div>
                      }
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 pt-12">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-4 h-px bg-saffron shrink-0" />
                          <span className="text-saffron text-xs uppercase tracking-wider font-semibold">Meet Your Coach</span>
                        </div>
                        <p className="text-white font-display text-base font-semibold">Umulkheiri Jalo</p>
                        <p className="text-white/70 text-xs italic mt-0.5">&ldquo;I don&rsquo;t just help you find purpose&hellip;&rdquo;</p>
                      </div>
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
                <Field label="Emotional hook (optional)">
                  <textarea className={ta + " min-h-[80px]"} value={hero.emotionalHook} onChange={e => setHero("emotionalHook", e.target.value)} placeholder="You've built the resume, checked the boxes…" />
                </Field>
                <Field label="Pills — comma separated">
                  <input className={inp} value={hero.pills.join(", ")} onChange={e => setHero("pills", e.target.value.split(",").map(p => p.trim()).filter(Boolean))} placeholder="Purpose Discovery, Feminine Leadership…" />
                </Field>
                <Field label="Coach photo">
                  {hero.image && <img src={img(hero.image)} alt="" className="w-full h-28 object-cover rounded-lg mb-2 border border-saffron/20" style={{ objectPosition: "center 38%" }} />}
                  <ImageUpload value={hero.image} onChange={v => setHero("image", v)} placeholder="/images/Umulkheiri.jpg" />
                </Field>
                <div className="border-t border-saffron/10 pt-4 mt-4">
                  <p className="text-sm font-semibold text-espresso mb-3">Credentials strip (below hero)</p>
                  <textarea className={ta + " min-h-[80px]"} value={credentials.join("\n")}
                    onChange={e => setContent(c => ({ ...c, credentials: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) }))}
                    placeholder="IPHM&#10;IAOTH&#10;CMA" />
                  <p className="text-xs text-text-mid mt-1">Each line becomes a badge in the gold strip.</p>
                </div>
              </EditShell>
            </div>
          )}

          {/* ─── PILLARS ─── */}
          {activeSection === "pillars" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="Three Pillars — as shown on home page">
                <div className="bg-warm-sand px-6 py-8">
                  <p className="text-pine text-sm uppercase font-medium mb-2 tracking-widest">The Framework</p>
                  <h2 className="font-sans text-[22px] font-semibold text-espresso mb-1">Three Pillars of Transformation</h2>
                  <p className="text-text-dark text-sm mb-6">Ikigai, Ubuntu, and Kihooto — purpose, belonging, and right action.</p>
                  <div className="flex flex-col gap-4">
                    {pillars.length === 0
                      ? <p className="text-espresso/30 text-sm">No pillars defined</p>
                      : pillars.map((p, i) => {
                          const colors = [
                            { color: "text-saffron", bg: "bg-saffron-tint" },
                            { color: "text-pine", bg: "bg-pine-tint" },
                            { color: "text-cinnamon", bg: "bg-sand-tint" },
                          ][i] ?? { color: "text-espresso", bg: "bg-sand-tint" };
                          return (
                            <div key={i} className="bg-white rounded-xl p-5 border border-black/6 flex gap-4 items-start">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${colors.bg}`}>{p.icon || "✦"}</div>
                              <div>
                                <h3 className={`font-display text-lg font-semibold ${colors.color}`}>{p.title || <span className="opacity-30">Title…</span>}</h3>
                                <p className="text-sm uppercase tracking-wider text-text-muted mb-1">{p.subtitle || <span className="opacity-30">Subtitle…</span>}</p>
                                <p className="text-base text-text-mid leading-relaxed">{p.desc || <span className="opacity-30">Description…</span>}</p>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
              </PreviewShell>
              <EditShell>
                <Field label="Section image">
                  {pillarsImage && <img src={img(pillarsImage)} alt="" className="w-full h-24 object-cover rounded-lg mb-2 border border-saffron/20" />}
                  <input className={inp} value={pillarsImage} readOnly placeholder="/images/pillars.jpg" />
                </Field>
                {pillars.map((p, i) => (
                  <div key={i} className="mb-5 pb-5 border-b border-saffron/10 last:border-0 last:mb-0 last:pb-0">
                    <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Pillar {i + 1}</p>
                    <div className="grid grid-cols-4 gap-3">
                      <Field label="Icon (emoji)"><input className={inp} value={p.icon} onChange={e => setPillar(i, "icon", e.target.value)} /></Field>
                      <div className="col-span-3"><Field label="Title"><input className={inp} value={p.title} onChange={e => setPillar(i, "title", e.target.value)} /></Field></div>
                    </div>
                    <Field label="Subtitle"><input className={inp} value={p.subtitle} onChange={e => setPillar(i, "subtitle", e.target.value)} placeholder="Purpose & Passion" /></Field>
                    <Field label="Description"><textarea className={ta} value={p.desc} onChange={e => setPillar(i, "desc", e.target.value)} /></Field>
                  </div>
                ))}
              </EditShell>
            </div>
          )}

          {/* ─── IKIGAI ELEMENTS ─── */}
          {activeSection === "elements" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="Ikigai Elements — as shown on home page">
                <div className="bg-white px-6 py-8">
                  <h2 className="font-sans text-[22px] font-semibold text-espresso mb-1">Four Elements of Ikigai</h2>
                  <p className="text-text-dark text-sm mb-6">Passion, Skills, Service, Livelihood — the four circles.</p>
                  <div className="grid grid-cols-2 gap-4">
                    {elements.length === 0
                      ? <p className="text-espresso/30 text-sm col-span-2">No elements defined</p>
                      : elements.map((el, i) => {
                          const colors = [
                            { color: "text-saffron", bg: "bg-saffron-tint" },
                            { color: "text-cinnamon", bg: "bg-sand-tint" },
                            { color: "text-pine", bg: "bg-pine-tint" },
                            { color: "text-espresso", bg: "bg-espresso-tint" },
                          ][i] ?? { color: "text-espresso", bg: "bg-sand-tint" };
                          return (
                            <div key={i} className="bg-white rounded-xl p-5 border border-black/6">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${colors.bg}`}>{el.icon || "✦"}</div>
                              <h3 className={`font-display text-base font-semibold ${colors.color}`}>{el.title || <span className="opacity-30">Title…</span>}</h3>
                              <p className="text-sm uppercase tracking-wider text-text-muted mb-1">{el.subtitle || <span className="opacity-30">Subtitle…</span>}</p>
                              <p className="text-sm text-text-mid leading-relaxed">{el.desc || <span className="opacity-30">Description…</span>}</p>
                            </div>
                          );
                        })}
                  </div>
                </div>
              </PreviewShell>
              <EditShell>
                {elements.map((el, i) => (
                  <div key={i} className="mb-5 pb-5 border-b border-saffron/10 last:border-0 last:mb-0 last:pb-0">
                    <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Element {i + 1}</p>
                    <div className="grid grid-cols-4 gap-3">
                      <Field label="Icon (emoji)"><input className={inp} value={el.icon} onChange={e => setElement(i, "icon", e.target.value)} /></Field>
                      <div className="col-span-3"><Field label="Title"><input className={inp} value={el.title} onChange={e => setElement(i, "title", e.target.value)} /></Field></div>
                    </div>
                    <Field label="Subtitle"><input className={inp} value={el.subtitle} onChange={e => setElement(i, "subtitle", e.target.value)} placeholder="What you love" /></Field>
                    <Field label="Description"><textarea className={ta} value={el.desc} onChange={e => setElement(i, "desc", e.target.value)} /></Field>
                  </div>
                ))}
              </EditShell>
            </div>
          )}

          {/* ─── SERVICES ─── */}
          {activeSection === "services" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="Services & Packages">
                <div className="bg-white">
                  <img src={img(servicesImage || "/images/services.png")} alt="Coaching conversation" className="w-full h-auto" />
                  <div className="px-5 py-8">
                    <div style={{ maxWidth: 900, margin: "0 auto" }}>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-sm text-espresso/50">All prices in</span>
                        <span className="text-sm font-semibold text-pine bg-pine/10 px-3 py-0.5 rounded-full">{currency}</span>
                      </div>
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
                  <Field label="Display currency">
                    <div className="flex gap-3">
                      {["KES", "USD"].map(curr => (
                        <label key={curr} className="flex items-center gap-2 text-sm text-espresso cursor-pointer">
                          <input type="radio" name="currency" value={curr} checked={currency === curr}
                            onChange={() => setContent(c => ({ ...c, currency: curr }))} className="accent-saffron" />
                          <span className={currency === curr ? "text-espresso font-medium" : "text-espresso/50"}>{curr}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
                  <Field label="Section image">
                    {servicesImage && <img src={img(servicesImage)} alt="" className="w-full h-24 object-cover rounded-lg mb-2 border border-saffron/20" />}
                    <ImageUpload value={servicesImage} onChange={v => setContent(c => ({ ...c, servicesImage: v }))} placeholder="/images/services.png" />
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
                          <p className="font-display text-[28px] font-semibold text-saffron mb-1">{ex.price || "—"}</p>
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
                      <Field label="Price"><input className={inp} value={co.price} onChange={e => setCorporate(i, "price", e.target.value)} placeholder="From KES 40,000 / Custom" /></Field>
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
                            ? <div style={{ height: 120, overflow: "hidden" }}><img src={img(p.coverImage)} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
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
                  {journalImage && <img src={img(journalImage)} alt="" className="w-full h-28 object-cover rounded-lg mb-2 border border-saffron/20" />}
                  <ImageUpload value={journalImage} onChange={v => setContent(c => ({ ...c, journalImage: v }))} placeholder="/images/journal.jpg" />
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
                                    ? <img src={img(b.coverImage)} alt="" className="w-10 h-7 rounded object-cover border border-saffron/20" />
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
                                            <img src={img(b.coverImage)} alt="" className="w-full h-auto object-cover" />
                                            <button onClick={() => setBlog(i, "coverImage", "")}
                                              className="absolute top-2 right-2 bg-espresso/60 text-white text-sm px-2 py-1 rounded hover:bg-espresso/80 cursor-pointer">Remove</button>
                                          </div>
                                        : <div className="w-full h-40 rounded-lg bg-saffron/5 border border-dashed border-saffron/30 flex items-center justify-center text-espresso/30 text-sm mb-2">No cover image</div>
                                      }
                                      <ImageUpload value={b.coverImage ?? ""} onChange={v => setBlog(i, "coverImage", v)} placeholder="Upload cover image" />
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
                                      <Field label="Tag / Category">
                                        <input className={inp} list="tag-suggestions" value={b.tag} onChange={e => setBlog(i, "tag", e.target.value)} placeholder="e.g. Purpose" />
                                        <datalist id="tag-suggestions">
                                          {["Purpose","Ubuntu","Ikigai","Leadership","Feminine Leadership","Mindfulness","Healing","Career","Community","Kihooto"].map(t => <option key={t} value={t} />)}
                                        </datalist>
                                      </Field>
                                      <Field label="Date"><input className={inp} value={b.date} onChange={e => setBlog(i, "date", e.target.value)} /></Field>
                                    </div>
                                    <Field label="Title"><input className={inp} value={b.title} onChange={e => setBlog(i, "title", e.target.value)} /></Field>
                                    <Field label="Excerpt (shown on listing card)"><textarea className={ta} value={b.excerpt} onChange={e => setBlog(i, "excerpt", e.target.value)} /></Field>
                                  </div>
                                </div>
                                <Field label="Full article body (paragraphs separated by blank lines)">
                                  <textarea className={ta + " min-h-[160px]"} value={b.body ?? ""} onChange={e => setBlog(i, "body", e.target.value)} placeholder="Write the full article here…&#10;&#10;Separate paragraphs with a blank line." />
                                </Field>
                                <div className="border-t border-saffron/10 pt-4 mt-2">
                                  <p className="text-xs font-semibold text-espresso/40 uppercase tracking-wider mb-3">SEO — leave blank to use title &amp; excerpt automatically</p>
                                  <div className="grid grid-cols-1 gap-3">
                                    <Field label={`SEO Title (max 60 chars) ${b.seoTitle ? `— ${b.seoTitle.length}/60` : ""}`}>
                                      <input className={inp} value={b.seoTitle ?? ""} maxLength={60} onChange={e => setBlog(i, "seoTitle", e.target.value)} placeholder={b.title || "Defaults to article title"} />
                                    </Field>
                                    <Field label={`Meta Description (max 160 chars) ${b.seoDescription ? `— ${b.seoDescription.length}/160` : ""}`}>
                                      <textarea className={ta} value={b.seoDescription ?? ""} maxLength={160} onChange={e => setBlog(i, "seoDescription", e.target.value)} placeholder={b.excerpt || "Defaults to excerpt — aim for 120–160 chars"} />
                                    </Field>
                                  </div>
                                </div>
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
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                      <div className="rounded-2xl overflow-hidden">
                        <img src={img(communityImage || "/images/community.jpeg")} alt="Circle of women in purpose exploration" className="w-full h-auto object-cover" />
                      </div>
                      <div className="grid gap-3">
                        {community.map((p, i) => (
                          <div key={i} className="bg-white rounded-xl p-4 border border-saffron/10 flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 bg-saffron-tint">{p.icon || "✦"}</div>
                            <div>
                              <h3 className="font-sans text-[14px] font-medium text-text-dark mb-1">{p.title || <span className="opacity-30">Program title</span>}</h3>
                              {p.date && <p className="text-xs text-saffron font-medium mb-0.5">{p.date}</p>}
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
                  {communityImage && <img src={img(communityImage)} alt="" className="w-full h-24 object-cover rounded-lg mb-2 border border-saffron/20" />}
                  <ImageUpload value={communityImage} onChange={v => setContent(c => ({ ...c, communityImage: v }))} placeholder="/images/community.jpeg" />
                </Field>
                {community.map((cm, i) => (
                  <div key={i} className="mb-4 pb-4 border-b border-saffron/10 last:border-0 last:mb-0 last:pb-0">
                    <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Program {i + 1}</p>
                    <div className="grid grid-cols-4 gap-3">
                      <Field label="Icon (emoji)"><input className={inp} value={cm.icon} onChange={e => setCommunity(i, "icon", e.target.value)} /></Field>
                      <div className="col-span-3"><Field label="Title"><input className={inp} value={cm.title} onChange={e => setCommunity(i, "title", e.target.value)} /></Field></div>
                    </div>
                    <Field label="Date"><input className={inp} value={cm.date} onChange={e => setCommunity(i, "date", e.target.value)} placeholder='e.g. "Every Thursday" or "July 10, 2026"' />
                      <p className="text-xs text-text-mid mt-1">Leave blank to hide. Shows in saffron under the title on the home page.</p></Field>
                    <Field label="Description"><textarea className={ta} value={cm.desc} onChange={e => setCommunity(i, "desc", e.target.value)} /></Field>
                  </div>
                ))}
                <div className="flex gap-4 pt-1">
                  <button onClick={() => setContent(c => ({ ...c, community: [...c.community, { icon: "", title: "", desc: "", date: "" }] }))}
                    className="text-sm text-saffron hover:text-cinnamon transition-colors cursor-pointer">+ Add program</button>
                  {community.length > 0 && (
                    <button onClick={() => setContent(c => ({ ...c, community: c.community.slice(0, -1) }))}
                      className="text-sm text-espresso/40 hover:text-saffron transition-colors cursor-pointer">Remove last</button>
                  )}
                </div>
              </EditShell>
            </div>
          )}

          {/* ─── FAQ ─── */}
          {activeSection === "faq" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="FAQ — as shown on /services">
                <div className="bg-cream px-6 py-8">
                  <div className="max-w-2xl mx-auto space-y-3">
                    {faq.length === 0
                      ? <p className="text-espresso/30 text-sm">No FAQs yet</p>
                      : faq.map(item => (
                        <details key={item.q} className="bg-white rounded-xl border border-warm-sand group">
                          <summary className="px-6 py-4 font-sans font-medium text-sm text-espresso cursor-pointer list-none flex items-center justify-between">
                            {item.q || <span className="opacity-30">Question…</span>}
                            <span className="text-saffron text-lg group-open:rotate-45 transition-transform">+</span>
                          </summary>
                          <div className="px-6 pb-4 text-sm text-text-dark leading-relaxed">{item.a || <span className="opacity-30">Answer…</span>}</div>
                        </details>
                      ))
                    }
                  </div>
                </div>
              </PreviewShell>
              <EditShell>
                {faq.map((item, i) => (
                  <div key={i} className="mb-5 pb-5 border-b border-saffron/10 last:border-0 last:mb-0 last:pb-0">
                    <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">FAQ {i + 1}</p>
                    <Field label="Question"><input className={inp} value={item.q} onChange={e => setFaq(i, "q", e.target.value)} placeholder="What happens in a Discovery Session?" /></Field>
                    <Field label="Answer"><textarea className={ta + " min-h-[100px]"} value={item.a} onChange={e => setFaq(i, "a", e.target.value)} placeholder="A relaxed, no-pressure 30-minute conversation…" /></Field>
                  </div>
                ))}
                <div className="flex gap-4 pt-1">
                  <button onClick={() => setContent(c => ({ ...c, faq: [...(c.faq ?? []), { q: "", a: "" }] }))}
                    className="text-sm text-saffron hover:text-cinnamon transition-colors cursor-pointer">+ Add FAQ</button>
                  {faq.length > 0 && (
                    <button onClick={() => setContent(c => ({ ...c, faq: (c.faq ?? []).slice(0, -1) }))}
                      className="text-sm text-espresso/40 hover:text-saffron transition-colors cursor-pointer">Remove last</button>
                  )}
                </div>
              </EditShell>
            </div>
          )}

          {/* ─── NEWSLETTER ─── */}
          {activeSection === "newsletter" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PreviewShell title="Newsletter — as shown on home page">
                <div className="bg-cream px-8 py-10">
                  <div className="max-w-md mx-auto text-center">
                    <h3 className="font-display text-2xl font-semibold text-espresso mb-2">{newsletter.heading || <span className="opacity-30">The Inner Garden Letter</span>}</h3>
                    <p className="text-text-dark text-sm leading-relaxed mb-6">{newsletter.body || <span className="opacity-30">Tagline…</span>}</p>
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 rounded-lg bg-white border border-saffron/20" />
                      <div className="bg-espresso text-white text-sm font-medium px-5 py-2 rounded-lg">Subscribe</div>
                    </div>
                  </div>
                </div>
              </PreviewShell>
              <EditShell>
                <Field label="Heading">
                  <input className={inp} value={newsletter.heading} onChange={e => setContent(c => ({ ...c, newsletter: { ...c.newsletter, heading: e.target.value } }))} placeholder="The Inner Garden Letter" />
                </Field>
                <Field label="Body / tagline">
                  <textarea className={ta} value={newsletter.body} onChange={e => setContent(c => ({ ...c, newsletter: { ...c.newsletter, body: e.target.value } }))}
                    placeholder="Weekly reflections on purpose, belonging, and right action — delivered to your inbox." />
                </Field>
              </EditShell>
            </div>
          )}

          {/* ─── MANUAL ─── */}
          {activeSection === "manual" && (
            <div className="space-y-6 text-sm leading-relaxed">
            {(() => {
            const activeTab = activeManualTab;
            return (<>

              <div className="grid grid-cols-2 gap-6">
              {/* Welcome + Placeholder merged */}
              <div className="bg-cream border border-saffron/20 rounded-xl px-6 py-5 flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-espresso text-lg mb-1">Welcome to your site editor</h3>
                  <p className="text-text-mid">Everything on your website is editable here. Consider all current text and prices as placeholders — replace them with your own words. No coding needed.</p>
                </div>
                <div className="rounded-xl px-5 py-4" style={{ background: "#FFFBF0", border: "1px solid #D4860A" }}>
                  <p className="font-semibold text-sm" style={{ color: "#8A5700" }}>Everything here is placeholder content</p>
                  <p className="text-sm mt-1" style={{ color: "#7A5A00" }}>All the text, prices, images, and articles you see on the site are sample content I created to show the layout. Feel free to change anything — that's what this panel is for. If you're unsure what to put in a field, just ask.</p>
                </div>
              </div>

              {/* How to use */}
              <div className="bg-white border border-saffron/20 rounded-xl overflow-hidden">
                <div className="bg-pine px-5 py-3">
                  <p className="text-white text-sm font-semibold">How to use this panel</p>
                </div>
                <div className="px-5 py-4 space-y-4">
                  <div className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-saffron text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div><p className="font-semibold text-espresso">Click a section in the left sidebar</p><p className="text-text-mid">Each tab controls a different part of your site — Hero, Services, Journal, etc.</p></div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-saffron text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div><p className="font-semibold text-espresso">Edit the fields on the right</p><p className="text-text-mid">Type new text, upload images, toggle options. The preview on the left updates as you type.</p></div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-saffron text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div><p className="font-semibold text-espresso">Click "Save Changes" (top-right)</p><p className="text-text-mid">Your site updates immediately. Refresh the live page to see your changes.</p></div>
                  </div>
                </div>
              </div>
              </div>

              {/* Section guides — tabs */}
              <div className="bg-white border border-saffron/20 rounded-xl overflow-hidden">
                <div className="bg-espresso px-5 py-3">
                  <p className="text-white text-sm font-semibold">Section-by-section guide</p>
                </div>
                <div className="flex flex-wrap gap-1.5 px-5 pt-4 pb-2 border-b border-saffron/10">
                  {["hero","services","addons","corporate","testimonials","journal","community"].map(id => (
                    <button key={id} onClick={() => setActiveManualTab(id)}
                      className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === id ? "bg-pine text-white" : "bg-cream text-text-mid hover:bg-saffron/20"}`}>
                      {id === "hero" ? "Hero" : id === "services" ? "Services" : id === "addons" ? "Add-Ons" : id === "corporate" ? "Corporate" : id === "testimonials" ? "Testimonials" : id === "journal" ? "Journal" : "Community"}
                    </button>
                  ))}
                </div>
                <div className="divide-y divide-saffron/10">
                  {/* Hero */}
                  {activeTab === "hero" && (
                    <div className="px-5 py-4">
                      <p className="text-text-mid mb-3">The first thing visitors see — bold headline, your photo on the right with a &quot;Meet Your Coach&quot; overlay, and the emotional hook below.</p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span className="font-semibold text-espresso">Headline</span><br/><span className="text-text-mid">Your main title. The word &quot;Align&quot; automatically turns gold wherever it appears.</span></div>
                        <div><span className="font-semibold text-espresso">Subtitle</span><br/><span className="text-text-mid">One sentence below the headline — describe what you do and who you serve.</span></div>
                        <div><span className="font-semibold text-espresso">Emotional hook</span><br/><span className="text-text-mid">A paragraph that speaks to your client&apos;s inner ache. Replace the sample text with your own words.</span></div>
                        <div><span className="font-semibold text-espresso">Pills</span><br/><span className="text-text-mid">Comma-separated topic tags below the buttons. E.g. &quot;Purpose Discovery, Feminine Leadership&quot;.</span></div>
                        <div><span className="font-semibold text-espresso">Coach photo</span><br/><span className="text-text-mid">Upload your portrait — appears in the hero right column and again in the coach intro section.</span></div>
                      </div>
                    </div>
                    )}

                  {/* Services */}
                  {activeTab === "services" && (
                    <div className="px-5 py-4">
                      <p className="text-text-mid mb-3">Your 4 coaching packages on the /services page. Each card is fully editable.</p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span className="font-semibold text-espresso">Display currency</span><br/><span className="text-text-mid">Toggle KES / USD. Switching won&apos;t auto-convert price strings — update those too.</span></div>
                        <div><span className="font-semibold text-espresso">Services hero image</span><br/><span className="text-text-mid">Background photo on the /services page banner. Upload a new image to change it.</span></div>
                      </div>
                      <p className="font-semibold text-espresso text-sm mt-3 mb-2">Each package has:</p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span className="font-semibold text-espresso">Badge</span><br/><span className="text-text-mid">Tag at the top of the card. E.g. &quot;Discovery&quot;, &quot;★ Transformation&quot;</span></div>
                        <div><span className="font-semibold text-espresso">Price + label</span><br/><span className="text-text-mid">Big number (&quot;KES 40,000&quot;) + small text below (&quot;5 sessions · 90 mins each&quot;)</span></div>
                        <div><span className="font-semibold text-espresso">Title &amp; Description</span><br/><span className="text-text-mid">Package name and 1-2 sentences on what&apos;s included</span></div>
                        <div><span className="font-semibold text-espresso">CTA text</span><br/><span className="text-text-mid">Button label. E.g. &quot;Book Free Session&quot;, &quot;Start Journey&quot;</span></div>
                        <div><span className="font-semibold text-espresso">Featured</span><br/><span className="text-text-mid">Tick for a dark background card — makes one package stand out as the recommended choice.</span></div>
                      </div>
                    </div>
                    )}

                  {/* Add-Ons */}
                  {activeTab === "addons" && (
                    <div className="px-5 py-4">
                      <p className="text-text-mid mb-3">Extra items clients can add to any package. Shown on /services and in the booking modal.</p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span className="font-semibold text-espresso">Name</span><br/><span className="text-text-mid">Add-on title. E.g. "Ikigai Toolkit PDF"</span></div>
                        <div><span className="font-semibold text-espresso">Price</span><br/><span className="text-text-mid">Format as "KES 5,000"</span></div>
                        <div><span className="font-semibold text-espresso">Description</span><br/><span className="text-text-mid">Brief explanation of what it includes.</span></div>
                      </div>
                      <p className="text-text-mid text-sm mt-2">Use <strong>"+ Add add-on"</strong> and <strong>"Remove last"</strong> at the bottom to add or remove items.</p>
                    </div>
                    )}

                  {/* Corporate */}
                  {activeTab === "corporate" && (
                    <div className="px-5 py-4">
                      <p className="text-text-mid mb-3">Group and organisational offerings. Shown on /services.</p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span className="font-semibold text-espresso">Name</span><br/><span className="text-text-mid">E.g. "Keynote Speaking", "Corporate Masterclass"</span></div>
                        <div><span className="font-semibold text-espresso">Price</span><br/><span className="text-text-mid">E.g. "From KES 40,000" or "Custom"</span></div>
                        <div><span className="font-semibold text-espresso">Duration</span><br/><span className="text-text-mid">E.g. "30-60 min", "Half/Full Day", "2-3 Days"</span></div>
                        <div><span className="font-semibold text-espresso">Description</span><br/><span className="text-text-mid">What the offering includes.</span></div>
                      </div>
                    </div>
                    )}

                  {/* Testimonials */}
                  {activeTab === "testimonials" && (
                    <div className="px-5 py-4">
                      <p className="text-text-mid mb-3">Client quotes on the home page. Currently 1 — aim for 3–4. Adding a 5th automatically switches the layout to a horizontal scroll carousel.</p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span className="font-semibold text-espresso">Quote</span><br/><span className="text-text-mid">Full testimonial in the client&apos;s own words. Decorative quote marks are added automatically.</span></div>
                        <div><span className="font-semibold text-espresso">Name</span><br/><span className="text-text-mid">First name or full name with permission. Shown in gold.</span></div>
                        <div><span className="font-semibold text-espresso">Location</span><br/><span className="text-text-mid">E.g. &quot;Nairobi&quot; — adds local credibility.</span></div>
                        <div><span className="font-semibold text-espresso">Package</span><br/><span className="text-text-mid">Which package they used. Shown beside the name.</span></div>
                      </div>
                    </div>
                    )}

                  {/* Journal */}
                  {activeTab === "journal" && (
                    <div className="px-5 py-4">
                      <p className="text-text-mid mb-3">Your articles — listed at /journal, each at /journal/article-title. Articles with ★ Featured also appear on the home page.</p>
                      <p className="font-semibold text-espresso text-sm mb-2">Click any row to expand all fields:</p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span className="font-semibold text-espresso">Featured (★)</span><br/><span className="text-text-mid">Shows on home page too. Toggle in the expanded row.</span></div>
                        <div><span className="font-semibold text-espresso">Tag / Category</span><br/><span className="text-text-mid">Start typing for suggestions (Purpose, Ubuntu, Ikigai, Leadership…) or enter your own.</span></div>
                        <div><span className="font-semibold text-espresso">Cover image</span><br/><span className="text-text-mid">Shown on the listing card and as the article hero banner.</span></div>
                        <div><span className="font-semibold text-espresso">Title &amp; Excerpt</span><br/><span className="text-text-mid">Title is the headline. Excerpt is the short preview on the listing card (1–2 sentences).</span></div>
                        <div><span className="font-semibold text-espresso">Full body</span><br/><span className="text-text-mid">Complete article text. Separate paragraphs with a blank line.</span></div>
                      </div>
                      <p className="font-semibold text-espresso text-sm mt-4 mb-2">SEO fields — scroll down inside an expanded article:</p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span className="font-semibold text-espresso">SEO Title</span><br/><span className="text-text-mid">The blue headline in Google results. Max 60 chars. Blank = uses article title.</span></div>
                        <div><span className="font-semibold text-espresso">Meta Description</span><br/><span className="text-text-mid">The grey snippet in Google. Max 160 chars. Write something that makes someone click. Blank = uses excerpt.</span></div>
                      </div>
                      <p className="text-text-mid text-sm mt-3">The 3 current articles are sample content — replace them with your own writing.</p>
                    </div>
                    )}

                  {/* Community */}
                  {activeTab === "community" && (
                    <div className="px-5 py-4">
                      <p className="text-text-mid mb-3">Group programs on the home page. A &quot;Join the Waitlist&quot; button appears automatically below the cards — it pre-fills an email to you so clients can reach out before dates are confirmed.</p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span className="font-semibold text-espresso">Icon (emoji)</span><br/><span className="text-text-mid">A single emoji fills the icon square. E.g. 🌸 👑 🌍 🎓</span></div>
                        <div><span className="font-semibold text-espresso">Title</span><br/><span className="text-text-mid">Program name in bold. E.g. &quot;Ikigai Alignment Circles&quot;</span></div>
                        <div><span className="font-semibold text-espresso">Date</span><br/><span className="text-text-mid">Shown in gold. E.g. &quot;Every Thursday at 6pm&quot; or &quot;Next: July 10, 2026&quot;. Leave blank until dates are confirmed.</span></div>
                        <div><span className="font-semibold text-espresso">Description</span><br/><span className="text-text-mid">What the program involves — frequency, format, audience.</span></div>
                      </div>
                    </div>
                    )}
                  </div>
                </div>

              {/* Not in admin yet */}
              <div className="bg-white border border-saffron/20 rounded-xl px-5 py-4">
                <p className="font-semibold text-espresso text-sm mb-1">Things not in this panel — reach out to update</p>
                <p className="text-text-mid text-sm mb-3">These parts of the site exist but aren&apos;t editable here yet. Send me the new content and I&apos;ll update them:</p>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg border border-saffron/10" style={{ background: "#FFFBF0" }}>
                    <p className="font-medium text-espresso">Custom domain (e.g. umulkheiri.com)</p>
                    <ol className="text-text-mid mt-1 ml-4 list-decimal space-y-0.5">
                      <li>Buy the domain from Namecheap / GoDaddy / any registrar.</li>
                      <li>Tell me the domain name or share registrar access.</li>
                      <li>I&apos;ll configure DNS and update GitHub Pages settings.</li>
                    </ol>
                  </div>
                  <div className="p-3 rounded-lg border border-saffron/10" style={{ background: "#FFFBF0" }}>
                    <p className="font-medium text-espresso">Contact email</p>
                    <ol className="text-text-mid mt-1 ml-4 list-decimal space-y-0.5">
                      <li>Set up a professional email (e.g. hello@umulkheiri.com) or share the one you want to use.</li>
                      <li>I&apos;ll update the contact email throughout the site — &quot;Join the Waitlist&quot; buttons, footer links, and the booking modal will all point to it.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </>);
            })()}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
