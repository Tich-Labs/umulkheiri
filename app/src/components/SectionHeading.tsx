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
      {label && (
        <p className="text-pine text-sm uppercase font-medium mb-2.5" style={{ letterSpacing: "3px" }}>
          {label}
        </p>
      )}
      <h2 className="font-sans text-[28px] font-semibold text-espresso leading-snug">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-text-dark text-base max-w-[700px] mb-[50px]" style={{ lineHeight: "1.7" }}>
          {description}
        </p>
      )}
    </div>
  );
}
