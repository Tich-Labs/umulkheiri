import { cn } from "@/lib/utils";
import Button from "./Button";

interface ServiceCardProps {
  badge: string;
  badgeVariant: "pink" | "teal" | "gold" | "night";
  price: string;
  priceLabel: string;
  title: string;
  description: string;
  cta: string;
  ctaVariant?: "primary" | "ghost" | "teal";
  featured?: boolean;
  onSelect?: () => void;
}

const badgeStyles = {
  pink: "bg-bloom-pink-light text-[#993356]",
  teal: "bg-garden-teal-light text-[#0f6e56]",
  gold: "bg-[#fef3dc] text-[#854f0b]",
  night: "bg-bloom-pink/20 text-bloom-pink",
};

export default function ServiceCard({
  badge,
  badgeVariant,
  price,
  priceLabel,
  title,
  description,
  cta,
  ctaVariant = "ghost",
  featured,
  onSelect,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 border border-black/6 flex flex-col",
        featured ? "bg-deep-night text-white" : "bg-white"
      )}
    >
      <span
        className={cn(
          "inline-block text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3 w-fit",
          badgeStyles[badgeVariant]
        )}
      >
        {badge}
      </span>
      <p className={cn("font-serif text-2xl font-semibold", featured && "text-white")}>
        {price}
      </p>
      <p className={cn("text-xs mb-3", featured ? "text-white/65" : "text-text-muted")}>
        {priceLabel}
      </p>
      <h3
        className={cn(
          "font-medium text-base mb-2",
          featured ? "text-white" : "text-text-dark"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "text-sm leading-relaxed flex-1",
          featured ? "text-white/70" : "text-text-muted"
        )}
      >
        {description}
      </p>
      <div className="mt-4">
        <Button
          href={onSelect ? undefined : "/contact"}
          variant={ctaVariant}
          className="w-full text-center block cursor-pointer"
          onClick={onSelect}
        >
          {cta}
        </Button>
      </div>
    </div>
  );
}
