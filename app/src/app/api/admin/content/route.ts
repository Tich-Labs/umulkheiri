import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("content")
    .select("data")
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data.data);
}
