import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const { content } = await request.json();
  const { error } = await supabaseAdmin
    .from("content")
    .upsert({ id: 1, data: content, updated_at: new Date().toISOString() });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
