export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { readFileSync } from "fs";
import { join } from "path";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services",
  description: "Individual coaching packages, add-ons, and corporate programmes. From a free Discovery Session to a full Ikigai Transformation Path.",
  openGraph: { title: "Services | Umulkheiri Jalo", images: ["/images/community.jpeg"] },
};

export default function ServicesPage() {
  const c = JSON.parse(readFileSync(join(process.cwd(), "content.json"), "utf-8"));
  return (
    <ServicesClient
      services={c.services ?? []}
      extras={c.extras ?? []}
      corporate={c.corporate ?? []}
      faq={c.faq ?? []}
      heroImage={c.servicesHeroImage ?? "/images/community.jpeg"}
      currency={c.currency ?? "KES"}
    />
  );
}
