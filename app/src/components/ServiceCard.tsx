import { cn } from "@/lib/utils";
import Button from "./Button";

interface ServiceCardProps {
  badge: string;
  badgeVariant?: "pink" | "teal" | "gold" | "night";
  price: string;
  priceLabel: string;
  title: string;
  description: string;
  cta: string;
  ctaVariant?: "primary" | "ghost" | "teal";
  featured?: boolean;
  onSelect?: () => void;
}

export default function ServiceCard({
  badge,
  price,
  priceLabel,
  title,
  description,
  cta,
  featured,
  onSelect,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-8 flex flex-col",
        featured
          ? "bg-espresso text-white border-t-4 border-espresso scale-[1.02]"
          : "bg-white border-t-4 border-saffron shadow-sm"
      )}
      style={{ boxShadow: featured ? undefined : "0 4px 12px rgba(0,0,0,0.08)" }}
    >
      <span className="inline-block bg-saffron/10 text-saffron text-sm font-semibold px-4 py-1.5 rounded-full mb-4 w-fit">
        {badge}
      </span>
      <p className={cn("font-display text-[36px] font-semibold mb-0.5", featured ? "text-saffron" : "text-saffron")}>
        {price}
      </p>
      <p className={cn("text-[13px] mb-4", featured ? "text-white/60" : "text-text-muted")}>
        {priceLabel}
      </p>
      <h3 className={cn("font-sans text-[18px] font-medium mb-3", featured ? "text-white" : "text-espresso")}>
        {title}
      </h3>
      <p className={cn("text-[14px] leading-relaxed flex-1 mb-6", featured ? "text-white/85" : "text-text-dark")}>
        {description}
      </p>
      <Button
        href={onSelect ? undefined : "/services"}
        variant="primary"
        className="w-full text-center block cursor-pointer"
        onClick={onSelect}
      >
        {cta}
      </Button>
    </div>
  );
}
