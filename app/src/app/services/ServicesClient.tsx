"use client";

import { useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import SectionHeading from "@/components/SectionHeading";
import BookingModal from "@/components/BookingModal";

type Service   = { badge: string; badgeVariant?: string; price: string; priceLabel: string; title: string; description: string; cta: string; ctaVariant?: string; featured?: boolean };
type Extra     = { name: string; price: string; desc: string };
type Corporate = { name: string; price: string; duration: string; desc: string };
type Faq       = { q: string; a: string };

export default function ServicesClient({ services, extras, corporate, faq, heroImage, currency }: { services: Service[]; extras: Extra[]; corporate: Corporate[]; faq: Faq[]; heroImage: string; currency: string }) {
  const [modalOpen, setModalOpen]       = useState(false);
  const [modalKey, setModalKey]         = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [selectedAddons, setSelectedAddons]   = useState<string[]>([]);

  function openModal(service: string, addons: string[] = []) {
    setSelectedService(service);
    setSelectedAddons(addons);
    setModalKey(k => k + 1);
    setModalOpen(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative" style={{ padding: "100px 40px 60px", textAlign: "center" }}>
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroImage} alt="" className="w-full h-full object-cover" style={{ objectPosition: "center 33%" }} aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(30,18,8,0.50) 0%, rgba(30,18,8,0.30) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-225 mx-auto text-center">
          <p className="text-white text-base uppercase font-bold mb-4" style={{ letterSpacing: "3px" }}>Services</p>
          <h1 className="font-display text-[42px] font-semibold text-white mb-4" style={{ lineHeight: 1.2 }}>
            Find the Container That Fits <em className="text-saffron not-italic">Where You Are</em>
          </h1>
          <p className="text-white/80 text-[18px]" style={{ lineHeight: 1.8 }}>
            From a single session to full transformation — each package meets you where you are.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#fff", padding: "80px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <SectionHeading label="How It Works" title="Three Steps to Begin" description="Booking is simple — no pressure, no complexity." />
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden max-w-xs mx-auto">
              <img src="/images/hero_bg.png" alt="Woman in deep listening, surrounded by an indigenous garden" className="w-full h-auto" />
            </div>
            <div className="grid sm:grid-cols-3 md:grid-cols-1 gap-6">
              {[
                { step: "1", title: "Explore Your Options", desc: "Browse packages, compare paths, and choose what resonates." },
                { step: "2", title: "Book & Personalise",   desc: "Select add-ons, apply a discount, and pick your payment method." },
                { step: "3", title: "Begin Your Journey",   desc: "Receive your prep guide, schedule sessions, and start blooming." },
              ].map(item => (
                <div key={item.step} className="flex md:flex-row gap-4 items-start text-left">
                  <span className="w-10 h-10 rounded-full bg-saffron text-white font-semibold flex items-center justify-center shrink-0 mt-0.5 text-sm">{item.step}</span>
                  <div>
                    <h3 className="font-sans font-medium text-espresso text-[18px] mb-1">{item.title}</h3>
                    <p className="text-sm text-text-dark">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Individual packages */}
      <section style={{ background: "var(--color-cream, #F9F7F2)", padding: "80px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-sm text-espresso/50">All prices in</span>
            <span className="text-sm font-semibold text-pine bg-pine/10 px-3 py-1 rounded-full">{currency}</span>
          </div>
          <SectionHeading label="For Individuals" title="Individual Coaching Packages" description="From a single session to a full transformation — each package is designed to meet you where you are." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(pkg => (
              <ServiceCard key={pkg.title} {...(pkg as Parameters<typeof ServiceCard>[0])} onSelect={() => openModal(pkg.title)} />
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons / Extras */}
      <section style={{ background: "#fff", padding: "80px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-sm text-espresso/50">All prices in</span>
            <span className="text-sm font-semibold text-pine bg-pine/10 px-3 py-1 rounded-full">{currency}</span>
          </div>
          <SectionHeading label="Extras" title="Add-Ons" description="Deepen your coaching experience with these optional additions — select any in the booking form." />
          <div className="grid sm:grid-cols-3 gap-6">
            {extras.map(item => (
              <div key={item.name} className="bg-white rounded-xl p-8 border border-warm-sand flex flex-col" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                <p className="font-display text-[36px] font-semibold text-saffron mb-1">{item.price}</p>
                <h3 className="font-sans text-[18px] font-medium text-espresso mb-3">{item.name}</h3>
                <p className="text-[15px] text-text-dark leading-relaxed flex-1">{item.desc}</p>
                <button onClick={() => openModal("", [`${item.name} (${item.price})`])}
                  className="mt-6 w-full py-3 rounded-lg border-2 border-saffron text-saffron text-sm font-semibold hover:bg-saffron-tint transition-colors cursor-pointer">
                  Add to My Journey
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate */}
      <section style={{ background: "var(--color-cream, #F9F7F2)", padding: "80px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <SectionHeading label="For Organizations" title="Corporate &amp; Group" description="Bring Ikigai alignment to your team, company, or community." />
          <div className="grid sm:grid-cols-3 gap-6">
            {corporate.map(item => (
              <div key={item.name} className="bg-white rounded-xl p-8 border border-warm-sand flex flex-col" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                <p className="font-display text-[36px] font-semibold text-pine mb-0.5">{item.price}</p>
                <p className="text-[13px] text-text-muted mb-4">{item.duration}</p>
                <h3 className="font-sans text-[18px] font-medium text-espresso mb-3">{item.name}</h3>
                <p className="text-[15px] text-text-dark leading-relaxed flex-1">{item.desc}</p>
                <button onClick={() => openModal(item.name)}
                  className="mt-6 w-full py-3 rounded-lg bg-pine text-white text-sm font-semibold hover:opacity-90 transition-colors cursor-pointer">
                  Submit Enquiry
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment */}
      <section style={{ background: "#fff", padding: "80px 40px" }}>
        <div className="max-w-[1200px] mx-auto text-center">
          <h3 className="font-sans font-medium text-espresso text-[18px] mb-4">Accepted Payment Methods</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {["PayPal", "M-Pesa", "Bank Transfer"].map(p => (
              <span key={p} className="text-sm px-5 py-2 rounded-full border border-warm-sand text-text-muted">{p}</span>
            ))}
          </div>
          <p className="text-sm text-text-muted mb-6">50% deposit secures your spot. Sliding scale available for students.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-text-dark">
            <span>📧 <a href="mailto:umulkheiri@yahoo.com" className="text-pine hover:underline">umulkheiri@yahoo.com</a></span>
            <span>💬 <a href="https://wa.me/254140565335" className="text-pine hover:underline">+254 140 565 335</a></span>
            <span>📍 Nairobi, Kenya</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--color-cream, #F9F7F2)", padding: "80px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <SectionHeading label="Questions" title="Frequently Asked Questions" />
          <div className="max-w-2xl mx-auto space-y-3">
            {faq.map(item => (
              <details key={item.q} className="bg-white rounded-xl border border-warm-sand group">
                <summary className="px-6 py-4 font-sans font-medium text-sm text-espresso cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-saffron text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-4 text-sm text-text-dark leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#1E1208", padding: "80px 40px", textAlign: "center" }}>
        <div className="max-w-225 mx-auto">
          <h2 className="font-sans text-[28px] font-semibold text-white mb-4">Ready to Align with Your Purpose?</h2>
          <p className="text-white/80 text-base mb-8">Let&apos;s explore how coaching can serve your transformation.</p>
          <button onClick={() => openModal("")}
            className="bg-saffron text-white text-[15px] font-semibold px-8 py-3.5 rounded-lg hover:bg-[#c97508] transition-colors cursor-pointer">
            Book a Discovery Session
          </button>
        </div>
      </section>

      <BookingModal key={modalKey} isOpen={modalOpen} onClose={() => setModalOpen(false)}
        preselectedService={selectedService} preselectedAddons={selectedAddons} />
    </>
  );
}
