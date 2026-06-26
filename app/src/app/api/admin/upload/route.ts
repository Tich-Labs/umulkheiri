import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import sharp from "sharp";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

  const uploadsDir = join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

  let ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const arrayBuffer = await file.arrayBuffer();

  if (ext === "heic" || ext === "heif") {
    const jpgBuffer = await sharp(Buffer.from(arrayBuffer)).jpeg({ quality: 90 }).toBuffer();
    ext = "jpg";
    const filename = `${Date.now()}.${ext}`;
    writeFileSync(join(uploadsDir, filename), jpgBuffer);
    return Response.json({ url: `/uploads/${filename}` });
  }

  const filename = `${Date.now()}.${ext}`;
  writeFileSync(join(uploadsDir, filename), Buffer.from(arrayBuffer));

  return Response.json({ url: `/uploads/${filename}` });
}
