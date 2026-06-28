import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-server";
import ServicesClient from "./ServicesClient";
import { img } from "@/lib/path";

export const metadata: Metadata = {
  title: "Services",
  description: "Individual coaching packages, add-ons, and corporate programmes. From a free Discovery Session to a full Ikigai Transformation Path.",
  openGraph: { title: "Services | Umulkheiri Jalo", images: [img("/images/community.jpeg")] },
};

export default async function ServicesPage() {
  const { data: rows } = await supabaseAdmin.from("content").select("data").limit(1);
  const c = rows?.[0]?.data ?? {};
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
