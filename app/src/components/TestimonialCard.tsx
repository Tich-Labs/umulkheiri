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
    <div className="bg-deep-night rounded-xl p-10 md:p-12 relative overflow-hidden">
      <span
        className="absolute -top-6 left-6 font-serif text-[160px] leading-none text-bloom-pink/20 pointer-events-none select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <p className="font-serif text-xl italic text-white leading-relaxed max-w-xl relative z-10 mb-5">
        {quote}
      </p>
      <p className="text-sm text-white/65 relative z-10">
        <strong className="text-bloom-pink">{name}</strong>, {location} &middot; {pkg}
      </p>
    </div>
  );
}
