"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import BookingModal from "./BookingModal";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/journal", label: "Journal" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-cream/95 fixed top-0 w-full z-50 border-b border-saffron/20" style={{ backdropFilter: "blur(10px)" }}>
        <div className="max-w-[1400px] mx-auto px-10 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-espresso text-[22px] font-semibold">
            Umulkheiri Jalo
          </Link>

          <button
            className="md:hidden text-espresso text-2xl leading-none"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className={cn(
            "absolute top-16 left-0 w-full md:static md:w-auto md:flex md:items-center",
            open ? "block" : "hidden md:flex"
          )}>
            <div className="flex flex-col md:flex-row md:items-center gap-1 px-6 pb-4 pt-2 md:p-0 md:gap-8 bg-cream md:bg-transparent border-b border-saffron/20 md:border-0">
              {links.map((link) => {
                const isActive = pathname.replace(/\/+$/, "") === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm transition-colors px-3 py-2 md:px-0 md:py-0",
                      isActive ? "text-saffron font-medium" : "text-espresso/60 hover:text-saffron"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <button
                onClick={() => { setOpen(false); setShowBooking(true); }}
                className="bg-saffron text-white text-[13px] font-semibold px-6 py-[10px] rounded-full hover:bg-[#c97508] transition-colors md:ml-4 cursor-pointer"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16" />

      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </>
  );
}
