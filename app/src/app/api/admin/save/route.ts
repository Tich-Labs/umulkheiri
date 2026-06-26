import { writeFileSync } from "fs";
import { join } from "path";

export async function POST(request: Request) {
  const { content } = await request.json();
  writeFileSync(join(process.cwd(), "content.json"), JSON.stringify(content, null, 2));
  return Response.json({ ok: true });
}
