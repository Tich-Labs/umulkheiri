"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import BookingModal from "./BookingModal";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-deep-night sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-white text-xl font-semibold tracking-tight"
          >
            Umulkheiri Jalo
          </Link>

          <button
            className="md:hidden text-white text-2xl leading-none"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>

          <div
            className={cn(
              "absolute top-16 left-0 w-full bg-deep-night md:static md:w-auto md:flex md:items-center md:bg-transparent md:gap-1",
              open ? "block" : "hidden"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-1 px-6 pb-4 pt-2 md:p-0">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 transition-colors",
                      isActive
                        ? "text-white font-medium underline underline-offset-4 decoration-bloom-pink"
                        : "text-white/60 hover:text-white"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setOpen(false);
                  setShowBooking(true);
                }}
                className="bg-bloom-pink text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-bloom-pink-dark transition-colors md:ml-3 cursor-pointer"
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
      </nav>

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </>
  );
}
