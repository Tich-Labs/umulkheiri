import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import FeatureCard from "@/components/FeatureCard";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";

const features = [
  {
    icon: "🌸",
    iconColor: "pink" as const,
    title: "Ikigai Venn Diagram",
    description: "SVG diagram showing the four elements of the inner garden — Passion, Skills, Service, and Livelihood — at the intersection of your Ikigai.",
    tags: ["SVG Graphic", "Philosophy Visual"],
  },
  {
    icon: "📅",
    iconColor: "teal" as const,
    title: "Session Booking Modal",
    description: "Step-by-step booking flow for Discovery, Journey, Transformation, and VIP sessions. Select package, add-ons, and payment method.",
    tags: ["Booking Flow", "3-Step Modal"],
  },
  {
    icon: "✦",
    iconColor: "gold" as const,
    title: "Add-On & Discount System",
    description: "Optional add-ons like the Ikigai Toolkit PDF and Group Circle Pass. Discount codes (IKIGAI10, WELCOME20) for savings.",
    tags: ["Upsells", "Discount Codes"],
  },
  {
    icon: "💬",
    iconColor: "pink" as const,
    title: "Client Testimonial Spotlight",
    description: "Featured testimonial on the deep-night background — name, location, and coaching package included for social proof.",
    tags: ["Social Proof"],
  },
  {
    icon: "💳",
    iconColor: "gold" as const,
    title: "Multi-Method Payment Selection",
    description: "PayPal, M-Pesa, and Bank Transfer displayed. 50% deposit calculation with sliding scale option for students.",
    tags: ["PayPal", "M-Pesa", "Bank Transfer"],
  },
  {
    icon: "🎤",
    iconColor: "midnight" as const,
    title: "Corporate & Group Offerings",
    description: "Keynote speaking, corporate masterclasses, and executive retreats with clear pricing and enquiry flow.",
    tags: ["Corporate", "Group Programs"],
  },
];

const services = [
  {
    badge: "Discovery",
    badgeVariant: "pink" as const,
    price: "$50",
    priceLabel: "Waived — Currently Free",
    title: "Ikigai Discovery Session",
    description: "30 min deep dive into life purpose, core values & next direction. Perfect for clarity seekers.",
    cta: "Book Free Session",
    ctaVariant: "ghost" as const,
  },
  {
    badge: "Journey",
    badgeVariant: "teal" as const,
    price: "$555",
    priceLabel: "5 sessions · 90 mins each",
    title: "Ikigai Alignment Journey",
    description: "Purpose alignment, goal clarity & lifestyle design. Worksheets & follow-up included.",
    cta: "Start Journey",
    ctaVariant: "teal" as const,
  },
  {
    badge: "★ Transformation",
    badgeVariant: "night" as const,
    price: "$1,000",
    priceLabel: "12 sessions · 1 hr each",
    title: "Ikigai Transformation Path",
    description: "Full integration of purpose, mindset, habits & embodiment practices. Includes custom toolkit.",
    cta: "Begin Transformation",
    ctaVariant: "primary" as const,
    featured: true,
  },
  {
    badge: "VIP Day",
    badgeVariant: "gold" as const,
    price: "$400",
    priceLabel: "1 Full Day · 4 Hours",
    title: "Ikigai Intensive VIP Day",
    description: "Private immersion — vision mapping, energy work & strategy for your next life chapter.",
    cta: "Reserve Your Day",
    ctaVariant: "ghost" as const,
  },
];

const blogPosts = [
  {
    tag: "Purpose",
    title: "Finding Your Ikigai in a Noisy World",
    excerpt: "How to tune out the noise and tune into what truly matters — a practical guide to discovering your reason for being.",
    date: "Jun 8, 2026",
  },
  {
    tag: "Ubuntu",
    title: "I Am Because We Are — The Power of Connection",
    excerpt: "Exploring Ubuntu philosophy and how collective belonging shapes our sense of purpose and fulfillment.",
    date: "May 21, 2026",
  },
  {
    tag: "Leadership",
    title: "Feminine Leadership: Leading from the Heart",
    excerpt: "Why the world needs more feminine leadership — nurturing, intuitive, and deeply connected to purpose.",
    date: "May 5, 2026",
  },
];

const elements = [
  { icon: "❤️", title: "Passion", subtitle: "What you love", desc: "The things that bring you joy, energy, and a sense of flow.", color: "text-bloom-pink", bg: "bg-bloom-pink-light" },
  { icon: "⭐", title: "Skills", subtitle: "What you're good at", desc: "Your natural talents and cultivated abilities.", color: "text-sunset-gold", bg: "bg-[#fef3dc]" },
  { icon: "🌍", title: "Service", subtitle: "What the world needs", desc: "The contribution only you can make.", color: "text-garden-teal", bg: "bg-garden-teal-light" },
  { icon: "💰", title: "Livelihood", subtitle: "What you can be rewarded for", desc: "Creating value the world will sustain.", color: "text-midnight-bloom", bg: "bg-midnight-bloom/8" },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-deep-night relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(244,123,180,0.18) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-16 left-10 w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(29,158,117,0.14) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 relative z-10">
          <span className="inline-block bg-bloom-pink/18 border border-bloom-pink/35 text-bloom-pink text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
            Certified Ikigai Alignment Coach
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-tight max-w-xl mb-3">
            Your Sacred Garden Awaits &mdash; <em className="text-bloom-pink not-italic">Align</em> with your Ikigai
          </h1>
          <p className="text-white/70 text-base max-w-md mb-7">
            Certified Ikigai Alignment Coach blending Japanese purpose philosophy, Ubuntu belonging, and Kihooto justice into your transformation.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/services" variant="primary">
              Begin Your Journey
            </Button>
            <Button href="/services" variant="secondary">
              Explore Services
            </Button>
          </div>
          <div className="flex flex-wrap gap-2.5 mt-9">
            {[["✦", "Purpose Discovery"], ["🌿", "Feminine Leadership"], ["⚖️", "Authentic Life Design"], ["🌍", "Ubuntu & Community"]].map(([icon, text]) => (
              <span key={text} className="bg-white/8 border border-white/15 text-white/70 text-xs px-3.5 py-1.5 rounded-full">
                <span className="text-bloom-pink mr-1">{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDENTIALS STRIP ── */}
      <section className="bg-warm-sand py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-text-muted uppercase tracking-wider">
            <span className="font-semibold text-text-dark">Certified Excellence</span>
            <span className="text-bloom-pink">✦</span>
            <span>IPHM Accredited</span>
            <span className="text-bloom-pink">✦</span>
            <span>IAOTH Member</span>
            <span className="text-bloom-pink">✦</span>
            <span>CMA Certified</span>
          </div>
        </div>
      </section>

      {/* ── COACH INTRO ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-warm-sand flex items-center justify-center flex-shrink-0">
              <span className="text-5xl">🌸</span>
            </div>
            <div>
              <SectionHeading label="Meet Umulkheiri" title="I don't just help you find purpose — I help you design a life that feels aligned, abundant, and alive." />
              <p className="text-text-mid leading-relaxed mb-6">
                As a certified Ikigai Alignment Coach, I blend the Japanese philosophy of purpose with Ubuntu&rsquo;s deep sense of belonging and Kihooto&rsquo;s call to right action. Together, we&rsquo;ll cultivate your inner garden so you can bloom where you&rsquo;re planted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 PILLARS ── */}
      <section className="bg-warm-sand py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="The Framework" title="Three Pillars of Transformation" description="Ikigai, Ubuntu, and Kihooto form the triangle of wholeness — a complete approach to purpose, belonging, and right action." />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🌸", title: "Ikigai", subtitle: "Purpose & Passion", color: "text-bloom-pink", bg: "bg-bloom-pink-light", desc: "Discover your reason for being at the intersection of what you love, what you're good at, what the world needs, and what you can be rewarded for." },
              { icon: "🌍", title: "Ubuntu", subtitle: "Belonging & Community", color: "text-garden-teal", bg: "bg-garden-teal-light", desc: '"I am because we are." Your purpose is inseparable from the community around you. We heal and grow together.' },
              { icon: "⚖️", title: "Kihooto", subtitle: "Justice & Right Action", color: "text-sunset-gold", bg: "bg-[#fef3dc]", desc: "Align your life with integrity. Kihooto is the call to right action — to live in alignment with your deepest values." },
            ].map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-xl p-6 border border-black/6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${pillar.bg}`}>{pillar.icon}</div>
                <h3 className={`font-serif text-xl font-semibold ${pillar.color}`}>{pillar.title}</h3>
                <p className="text-xs uppercase tracking-wider text-text-muted mb-3">{pillar.subtitle}</p>
                <p className="text-base text-text-mid leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IKIGAI VENN ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="The Inner Garden" title="Four Elements of Ikigai" description="Ikigai lives at the intersection of four circles — Passion, Skills, Service, and Livelihood." />
          <div className="max-w-lg mx-auto mb-12">
            <svg viewBox="0 0 400 400" className="w-full h-auto">
              <defs>
                <radialGradient id="g-pink" cx="35%" cy="35%">
                  <stop offset="0%" stopColor="#fce4f0" />
                  <stop offset="100%" stopColor="#f47bb4" stopOpacity="0.15" />
                </radialGradient>
                <radialGradient id="g-gold" cx="65%" cy="35%">
                  <stop offset="0%" stopColor="#fef3dc" />
                  <stop offset="100%" stopColor="#f5a623" stopOpacity="0.15" />
                </radialGradient>
                <radialGradient id="g-teal" cx="35%" cy="65%">
                  <stop offset="0%" stopColor="#e1f5ee" />
                  <stop offset="100%" stopColor="#1d9e75" stopOpacity="0.15" />
                </radialGradient>
                <radialGradient id="g-midnight" cx="65%" cy="65%">
                  <stop offset="0%" stopColor="rgba(46,26,71,0.12)" />
                  <stop offset="100%" stopColor="#2e1a47" stopOpacity="0.1" />
                </radialGradient>
              </defs>
              <circle cx="160" cy="160" r="110" fill="url(#g-pink)" stroke="#f47bb4" strokeWidth="2" opacity="0.8" />
              <circle cx="240" cy="160" r="110" fill="url(#g-gold)" stroke="#f5a623" strokeWidth="2" opacity="0.8" />
              <circle cx="160" cy="240" r="110" fill="url(#g-teal)" stroke="#1d9e75" strokeWidth="2" opacity="0.8" />
              <circle cx="240" cy="240" r="110" fill="url(#g-midnight)" stroke="#2e1a47" strokeWidth="2" opacity="0.8" />
              <text x="160" y="130" textAnchor="middle" fill="#b83e7a" fontSize="11" fontWeight="600" fontFamily="DM Sans, sans-serif">Passion</text>
              <text x="240" y="130" textAnchor="middle" fill="#854f0b" fontSize="11" fontWeight="600" fontFamily="DM Sans, sans-serif">Skills</text>
              <text x="160" y="280" textAnchor="middle" fill="#0f6e56" fontSize="11" fontWeight="600" fontFamily="DM Sans, sans-serif">Service</text>
              <text x="240" y="280" textAnchor="middle" fill="#2e1a47" fontSize="11" fontWeight="600" fontFamily="DM Sans, sans-serif">Livelihood</text>
              <text x="200" y="205" textAnchor="middle" fill="#1a1028" fontSize="14" fontWeight="700" fontFamily="Playfair Display, serif">Ikigai</text>
            </svg>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {elements.map((el) => (
              <div key={el.title} className="bg-white rounded-xl p-6 border border-black/6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${el.bg}`}>{el.icon}</div>
                <h3 className={`font-serif text-lg font-semibold ${el.color}`}>{el.title}</h3>
                <p className="text-xs uppercase tracking-wider text-text-muted mb-2">{el.subtitle}</p>
                <p className="text-base text-text-mid leading-relaxed">{el.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-warm-sand py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="Key Features" title="What the Website Offers" description="Every feature is designed to convert visitors into clients, build trust through philosophy, and make booking frictionless." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="Services" title="Choose Your Path" description="From a free discovery session to a full transformation journey — find the container that fits where you are." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s) => <ServiceCard key={s.title} {...s} />)}
          </div>
          <div className="mt-6 text-center">
            <Button href="/services" variant="ghost">View All Packages &amp; Details</Button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="bg-warm-sand py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="Social Proof" title="What Clients Say" />
          <TestimonialCard
            quote="Working with Umulkheiri didn't just bring clarity — it brought me home to myself. The weaving of Ikigai, Ubuntu, and Kihooto created a compass I carry with me every single day."
            name="Grace M."
            location="Nairobi"
            package="Ikigai Transformation Path"
          />
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="Community" title="We Grow Together" description="Purpose flourishes in community. Join a circle of women and leaders committed to living with alignment, belonging, and impact." />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🌸", title: "Ikigai Alignment Circles", desc: "Weekly group coaching circles where women gather to explore purpose, share wisdom, and grow together.", bg: "bg-bloom-pink-light" },
              { icon: "👑", title: "Women&rsquo;s Leadership Program", desc: "A 6-week immersive program for women ready to step into feminine leadership.", bg: "bg-garden-teal-light" },
              { icon: "🎓", title: "Youth & ALX Alumni Programs", desc: "Tailored sessions for young professionals navigating career purpose and impact-driven leadership.", bg: "bg-[#fef3dc]" },
              { icon: "🌍", title: "Community Retreats", desc: "Immersive weekend retreats combining Ikigai alignment with nature, connection, and collective healing.", bg: "bg-midnight-bloom/8" },
            ].map((p) => (
              <div key={p.title} className="bg-white rounded-xl p-6 border border-black/6 flex gap-5 items-start">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${p.bg}`}>{p.icon}</div>
                <div>
                  <h3 className="font-medium text-text-dark mb-2">{p.title}</h3>
                  <p className="text-base text-text-mid leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section className="bg-warm-sand py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading label="The Ikigai Journal" title="Latest Wisdom" description="Reflections on purpose, leadership, Ubuntu, and living an aligned life." />
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post.title} className="bg-white rounded-xl p-6 border border-black/6 hover:border-bloom-pink/30 transition-colors group">
                <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-bloom-pink-light text-[#993356] font-medium mb-3">{post.tag}</span>
                <h3 className="font-medium text-text-dark mb-2">{post.title}</h3>
                <p className="text-base text-text-muted leading-relaxed mb-3">{post.excerpt}</p>
                <span className="text-xs text-text-muted">{post.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="max-w-md mx-auto">
            <span className="text-3xl mb-4 block">🌿</span>
            <h2 className="font-serif text-2xl font-semibold text-deep-night mb-2">The Inner Garden Letter</h2>
            <p className="text-base text-text-muted mb-6">Monthly reflections on purpose, belonging, and right action. Delivered to your inbox with care.</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-3"
            >
              <input
                type="email"
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-black/12 text-sm outline-none focus:border-bloom-pink transition-colors bg-white"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-bloom-pink text-white text-sm font-medium hover:bg-bloom-pink-dark transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
