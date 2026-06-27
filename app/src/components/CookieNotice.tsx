"use client";

import { useState, useEffect } from "react";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-ok")) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-ok", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-espresso text-white/80 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-sm leading-relaxed max-w-xl">
        This site uses cookies to improve your experience. By continuing to browse you agree to our use of cookies.{" "}
        <a href="/privacy" className="text-saffron underline hover:text-white transition-colors">Privacy policy</a>.
      </p>
      <button
        onClick={accept}
        className="shrink-0 bg-saffron hover:bg-cinnamon text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors cursor-pointer"
      >
        Got it
      </button>
    </div>
  );
}
