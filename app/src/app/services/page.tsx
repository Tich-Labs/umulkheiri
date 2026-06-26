export const dynamic = "force-dynamic";

import { readFileSync } from "fs";
import { join } from "path";
import ServicesClient from "./ServicesClient";

export default function ServicesPage() {
  const c = JSON.parse(readFileSync(join(process.cwd(), "content.json"), "utf-8"));
  return (
    <ServicesClient
      services={c.services ?? []}
      extras={c.extras ?? []}
      corporate={c.corporate ?? []}
      faq={c.faq ?? []}
      heroImage={c.servicesHeroImage ?? "/images/community.jpeg"}
    />
  );
}
