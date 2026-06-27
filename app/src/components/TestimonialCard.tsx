export default function TestimonialCard({
  quote,
  name,
  location,
  package: pkg,
}: {
  quote: string;
  name: string;
  location: string;
  package: string;
}) {
  return (
    <div className="bg-espresso rounded-xl px-10 pt-20 pb-10 md:px-12 md:pt-24 md:pb-12 relative overflow-hidden">
      <span
        className="absolute top-2 left-6 font-display text-[160px] leading-none text-saffron/70 pointer-events-none select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <p className="font-display text-xl italic text-white leading-relaxed max-w-xl relative z-10 mb-5">
        {quote}
      </p>
      <p className="text-sm text-white/85 relative z-10">
        <strong className="text-saffron">{name}</strong>, {location} &middot; {pkg}
      </p>
    </div>
  );
}
