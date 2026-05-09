export default function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-bloom-pink-dark text-xs uppercase tracking-widest font-medium mb-2">
        {label}
      </p>
      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-deep-night">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-text-muted max-w-2xl text-base leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
