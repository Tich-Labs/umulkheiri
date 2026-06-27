import sharp from "sharp";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

  let ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const arrayBuffer = await file.arrayBuffer();
  let buffer: Buffer = Buffer.from(new Uint8Array(arrayBuffer));

  if (ext === "heic" || ext === "heif") {
    buffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
    ext = "jpg";
  }

  const filename = `${Date.now()}.${ext}`;
  const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg"
    : ext === "png" ? "image/png"
    : ext === "webp" ? "image/webp"
    : "application/octet-stream";

  const { error } = await supabaseAdmin.storage
    .from("uploads")
    .upload(filename, buffer, { contentType, upsert: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from("uploads").getPublicUrl(filename);
  return Response.json({ url: data.publicUrl });
}
