"use client";

import { useState } from "react";
import Link from "next/link";
import BookingModal from "./BookingModal";

export default function Footer() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <footer className="bg-espresso text-white/70">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row gap-10 items-start justify-between">
            <div className="max-w-sm">
              <Link href="/" className="font-display text-white text-xl font-semibold">
                Umulkheiri Jalo
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Certified Ikigai Alignment Coach. Helping you design a life that feels aligned, abundant, and alive.
              </p>
            </div>

            <div className="flex gap-10">
              <div>
                <h4 className="text-white/90 text-sm uppercase tracking-widest font-medium mb-4">Navigation</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/services" className="text-sm text-white/70 hover:text-white transition-colors">Services</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white/90 text-sm uppercase tracking-widest font-medium mb-4">Philosophy</h4>
                <ul className="space-y-2">
                  <li><span className="text-sm text-white/50">Ikigai</span></li>
                  <li><span className="text-sm text-white/50">Ubuntu</span></li>
                  <li><span className="text-sm text-white/50">Kihooto</span></li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowBooking(true)}
              className="bg-saffron text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-cinnamon transition-colors cursor-pointer"
            >
              Book a Session
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} Umulkheiri Jalo. All rights reserved.</p>
            <p>Ikigai &middot; Ubuntu &middot; Kihooto</p>
          </div>
        </div>
      </footer>

      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </>
  );
}
