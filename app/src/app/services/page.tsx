"use client";

import { useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import SectionHeading from "@/components/SectionHeading";
import BookingModal from "@/components/BookingModal";

const individualPackages = [
  {
    badge: "Discovery",
    badgeVariant: "pink" as const,
    price: "$50",
    priceLabel: "Waived — Currently Free",
    title: "Ikigai Discovery Session",
    description: "30 min deep dive into life purpose, core values & next direction. Perfect for clarity seekers.",
    cta: "Book Free Session",
  },
  {
    badge: "Journey",
    badgeVariant: "teal" as const,
    price: "$555",
    priceLabel: "5 sessions · 90 mins each",
    title: "Ikigai Alignment Journey",
    description: "Purpose alignment, goal clarity & lifestyle design. Worksheets & follow-up included.",
    cta: "Start Journey",
  },
  {
    badge: "★ Transformation",
    badgeVariant: "night" as const,
    price: "$1,000",
    priceLabel: "12 sessions · 1 hr each",
    title: "Ikigai Transformation Path",
    description: "Full integration of purpose, mindset, habits & embodiment practices. Includes custom toolkit.",
    cta: "Begin Transformation",
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
  },
];

const extras = [
  { name: "Ikigai Toolkit PDF", price: "$75", modalValue: "Ikigai Toolkit PDF ($75)", desc: "Downloadable workbook with exercises, journal prompts, and the Inner Garden framework." },
  { name: "Email Check-In Add-On", price: "$50", modalValue: "Email Check-In Add-On ($50)", desc: "Weekly email support between sessions to keep you on track with your alignment goals." },
  { name: "Group Circle Pass", price: "$100", modalValue: "Group Circle Pass ($100)", desc: "Access to 4 weekly group coaching circles for shared purpose exploration." },
];

const corporateOfferings = [
  { name: "Keynote Speaking", price: "From $555", duration: "30-60 min", desc: "Inspirational keynote on Ikigai, Ubuntu, and purpose-led leadership for your team or event." },
  { name: "Corporate Masterclass", price: "From $600", duration: "Half/Full Day", desc: "Immersive workshop combining Ikigai alignment with team-building and leadership development." },
  { name: "Executive Retreat", price: "Custom", duration: "2-3 Days", desc: "Bespoke retreat for leadership teams — purpose discovery, strategic visioning, and embodiment." },
];

const faqs = [
  { q: "What happens in a Discovery Session?", a: "A relaxed, no-pressure 30-minute conversation where we explore where you are, what's calling you, and whether we're a good fit to work together." },
  { q: "Do I need to know my purpose already?", a: "Not at all. Most clients come because they feel a sense of misalignment or curiosity. The process is designed to uncover your purpose together." },
  { q: "Are sessions online or in-person?", a: "Sessions are held via video call, so you can join from anywhere in the world. In-person intensives can be arranged upon request." },
  { q: "What if I can't afford the full price?", a: "I offer a sliding scale for students and those facing financial hardship. Reach out and we'll find something that works." },
  { q: "Can I add extras to any package?", a: "Absolutely. You can mix and match any add-on with any package. The booking form lets you select your main service and check any add-ons you'd like." },
];

export default function ServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const openModal = (service: string, addons: string[] = []) => {
    setSelectedService(service);
    setSelectedAddons(addons);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  };

  return (
    <>
      <section className="bg-deep-night py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block bg-bloom-pink/18 border border-bloom-pink/35 text-bloom-pink text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Services
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white max-w-2xl mx-auto leading-tight">
            Find the Container That Fits{" "}
            <em className="text-bloom-pink not-italic">Where You Are</em>
          </h1>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="How It Works"
            title="Three Steps to Begin"
            description="Booking is simple — no pressure, no complexity."
          />
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { step: "1", title: "Explore Your Options", desc: "Browse packages, compare paths, and choose what resonates." },
                { step: "2", title: "Book & Personalise", desc: "Select add-ons, apply a discount, and pick your payment method." },
                { step: "3", title: "Begin Your Journey", desc: "Receive your prep guide, schedule sessions, and start blooming." },
              ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="w-10 h-10 rounded-full bg-bloom-pink text-white font-semibold flex items-center justify-center mx-auto mb-3 text-sm">
                  {item.step}
                </span>
                <h3 className="font-medium text-text-dark text-sm mb-1">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual */}
      <section className="bg-warm-sand py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="For Individuals"
            title="Coaching Packages"
            description="From a single session to a full transformation — each package is designed to meet you where you are."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {individualPackages.map((pkg) => (
              <ServiceCard
                key={pkg.title}
                {...pkg}
                onSelect={() => openModal(pkg.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Extras */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="Extras"
            title="Add-Ons"
            description="Deepen your coaching experience with these optional additions — select any in the booking form."
          />
          <div className="grid sm:grid-cols-3 gap-4">
            {extras.map((item) => (
              <div key={item.name} className="bg-white rounded-xl p-6 border border-black/6 flex flex-col">
                <p className="font-serif text-2xl font-semibold text-bloom-pink mb-1">{item.price}</p>
                <h3 className="font-medium text-base text-text-dark mb-2">{item.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed flex-1">{item.desc}</p>
                <button
                  onClick={() => openModal("", [item.modalValue])}
                  className="mt-4 w-full py-3 rounded-lg border border-bloom-pink text-bloom-pink text-sm font-medium hover:bg-bloom-pink-light transition-colors cursor-pointer"
                >
                  Add to My Journey
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate */}
      <section className="bg-warm-sand py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="For Organizations"
            title="Corporate & Group"
            description="Bring Ikigai alignment to your team, company, or community."
          />
          <div className="grid sm:grid-cols-3 gap-4">
            {corporateOfferings.map((item) => (
              <div key={item.name} className="bg-white rounded-xl p-6 border border-black/6 flex flex-col">
                <p className="font-serif text-2xl font-semibold text-garden-teal mb-1">{item.price}</p>
                <p className="text-xs text-text-muted mb-3">{item.duration}</p>
                <h3 className="font-medium text-base text-text-dark mb-2">{item.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed flex-1">{item.desc}</p>
                <button
                  onClick={() => openModal(item.name)}
                  className="mt-4 w-full py-3 rounded-lg bg-garden-teal text-white text-sm font-medium hover:opacity-90 transition-colors cursor-pointer"
                >
                  Submit Enquiry
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Info */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-medium text-text-dark text-sm mb-3">Accepted Payment Methods</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {["PayPal", "M-Pesa", "Bank Transfer"].map((p) => (
                <span key={p} className="text-sm px-4 py-2 rounded-full border border-black/10 text-text-muted">{p}</span>
              ))}
            </div>
            <p className="text-sm text-text-muted mb-6">50% deposit secures your spot. Sliding scale available for students.</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-text-muted">
              <span>📧 <a href="mailto:umulkheiri@yahoo.com" className="text-bloom-pink-dark hover:underline">umulkheiri@yahoo.com</a></span>
              <span>💬 <a href="https://wa.me/254140565335" className="text-bloom-pink-dark hover:underline">+254 140 565 335</a></span>
              <span>📍 Nairobi, Kenya</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-warm-sand py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            label="Questions"
            title="Frequently Asked Questions"
          />
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-white rounded-xl border border-black/6 group">
                <summary className="px-6 py-4 font-medium text-sm text-text-dark cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-bloom-pink text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-4 text-sm text-text-mid leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Promise */}
      <section className="bg-deep-night py-20 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mx-auto">
            <span className="text-bloom-pink text-4xl mb-4 block">🌸</span>
            <h2 className="font-serif text-2xl text-white mb-4">Signature Promise</h2>
            <p className="text-white/85 text-lg leading-relaxed font-serif italic">
              &ldquo;I don&rsquo;t just help you find purpose &mdash; I help you design a life that
              feels aligned, abundant, and alive.&rdquo;
            </p>
            <p className="text-white/60 text-sm mt-6">&mdash; Umulkheiri Jalo</p>
          </div>
        </div>
      </section>

      <BookingModal
        key={modalKey}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={selectedService}
        preselectedAddons={selectedAddons}
      />
    </>
  );
}
