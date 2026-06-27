import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-server";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services",
  description: "Individual coaching packages, add-ons, and corporate programmes. From a free Discovery Session to a full Ikigai Transformation Path.",
  openGraph: { title: "Services | Umulkheiri Jalo", images: ["/images/community.jpeg"] },
};

export default async function ServicesPage() {
  const { data } = await supabaseAdmin.from("content").select("data").single();
  const c = data?.data ?? {};
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
