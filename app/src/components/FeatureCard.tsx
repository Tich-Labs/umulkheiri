import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: string;
  iconColor: "pink" | "teal" | "gold" | "midnight";
  title: string;
  description: string;
  tags: string[];
}

const iconStyles = {
  pink:     "bg-saffron-tint",
  teal:     "bg-pine-tint",
  gold:     "bg-sand-tint",
  midnight: "bg-espresso-tint",
};

export default function FeatureCard({ icon, iconColor, title, description, tags }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-black/6">
      <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center text-xl mb-4", iconStyles[iconColor])}>
        {icon}
      </div>
      <h3 className="font-medium text-sm text-text-dark mb-2">{title}</h3>
      <p className="text-base text-text-muted leading-relaxed">{description}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span key={tag} className="text-sm px-2.5 py-1 rounded-full border border-black/8 text-text-muted">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
