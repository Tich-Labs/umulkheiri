import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "pine";

const variants: Record<Variant, string> = {
  primary:   "bg-saffron text-white hover:bg-[#c97508] hover:-translate-y-0.5",
  secondary: "bg-transparent text-saffron border-2 border-saffron hover:bg-saffron-tint",
  ghost:     "bg-transparent border border-saffron text-saffron hover:bg-saffron-tint",
  pine:      "bg-pine text-white hover:opacity-90",
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
    "inline-block px-8 py-3.5 rounded-lg text-[15px] font-semibold transition-all text-center cursor-pointer",
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
