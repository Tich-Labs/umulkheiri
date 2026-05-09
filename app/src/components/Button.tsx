import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "teal";

const variants: Record<Variant, string> = {
  primary: "bg-bloom-pink text-white hover:bg-bloom-pink-dark",
  secondary: "bg-deep-night text-white hover:bg-midnight-bloom",
  ghost: "bg-transparent border border-bloom-pink text-bloom-pink hover:bg-bloom-pink-light",
  teal: "bg-garden-teal text-white hover:opacity-90",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className,
  ...props
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes = cn(
    "inline-block px-5 py-3 rounded-lg text-sm font-medium transition-all text-center",
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
