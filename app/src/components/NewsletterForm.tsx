"use client";

export default function NewsletterForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex gap-3">
      <input
        type="email"
        placeholder="Your email address"
        required
        className="flex-1 px-4 py-3 rounded-lg border border-black/12 text-sm outline-none focus:border-saffron transition-colors bg-white"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-lg bg-saffron text-white text-sm font-medium hover:bg-cinnamon transition-colors cursor-pointer"
      >
        Subscribe
      </button>
    </form>
  );
}
