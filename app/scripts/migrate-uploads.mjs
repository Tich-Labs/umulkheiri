import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, readFileSync as readEnv } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ── manual env load (no dotenv dependency) ── */
function loadEnv() {
  const envPath = join(__dirname, "..", ".env.local");
  try {
    const text = readEnv(envPath, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*export\s+([^=]+)=(.*)$/);
      const m2 = line.match(/^\s*([^#][^=]+)=(.*)$/);
      const match = m || m2;
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  } catch {
    // .env.local not found, rely on existing env vars
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing Supabase env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY are set.");
  process.exit(1);
}

const supabase = createClient(url, key);

const uploadsDir = join(__dirname, "..", "public", "uploads");
const files = readdirSync(uploadsDir).filter(f => f !== ".gitkeep");

console.log(`Found ${files.length} files to upload`);

const results = [];

for (const file of files) {
  const filePath = join(uploadsDir, file);
  const content = readFileSync(filePath);
  const ext = extname(file).slice(1) || "jpg";

  console.log(`Uploading ${file}...`);

  const { error: upErr } = await supabase.storage
    .from("uploads")
    .upload(file, content, {
      contentType: `image/${ext === "heic" ? "heic" : ext}`,
      upsert: true,
    });

  if (upErr) {
    if (upErr.message.includes("bucket") && upErr.message.includes("not found")) {
      console.log("  -> 'uploads' bucket doesn't exist. Creating it...");
      const { error: createErr } = await supabase.storage.createBucket("uploads", {
        public: true,
      });
      if (createErr) {
        console.error(`  -> Failed to create bucket: ${createErr.message}`);
        continue;
      }
      console.log("  -> Bucket created. Retrying upload...");
      const { error: retryErr } = await supabase.storage
        .from("uploads")
        .upload(file, content, {
          contentType: `image/${ext === "heic" ? "heic" : ext}`,
          upsert: true,
        });
      if (retryErr) {
        console.error(`  -> Upload failed: ${retryErr.message}`);
        continue;
      }
    } else {
      console.error(`  -> Upload failed: ${upErr.message}`);
      continue;
    }
  }

  const { data: { publicUrl } } = supabase.storage
    .from("uploads")
    .getPublicUrl(file);

  console.log(`  -> ${publicUrl}`);
  results.push({ file, url: publicUrl });
}

console.log("\n=== Migration Complete ===");
console.log("Image URL mappings (old -> new):");
for (const r of results) {
  console.log(`  /uploads/${r.file} -> ${r.url}`);
}

if (results.length > 0) {
  console.log("\nNext step: Update the Supabase content table 'data' column to replace");
  console.log("/uploads/... references with the new Supabase Storage URLs above.");
  console.log("\nYou can do this in the Supabase dashboard SQL editor or via the admin page once deployed.");
}
