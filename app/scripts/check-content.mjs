import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ── manual env load ── */
function loadEnv() {
  const envPath = join(__dirname, "..", ".env.local");
  try {
    const text = readFileSync(envPath, "utf8");
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
  } catch { /* ignore */ }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key);

const { data: rows, error } = await supabase.from("content").select("data").limit(1);
if (error) { console.error("Error:", error.message); process.exit(1); }
const row = rows?.[0];
if (!row?.data) { console.log("No content data found"); process.exit(0); }

const data = row.data;

function findUploadRefs(obj, path = "") {
  const refs = [];
  for (const [k, v] of Object.entries(obj)) {
    const cur = path ? `${path}.${k}` : k;
    if (typeof v === "string" && v.includes("/uploads/")) {
      refs.push({ path: cur, value: v });
    } else if (typeof v === "object" && v !== null) {
      refs.push(...findUploadRefs(v, cur));
    }
  }
  return refs;
}

const refs = findUploadRefs(data);
if (refs.length === 0) {
  console.log("No /uploads/ references found in Supabase content data.");
} else {
  console.log("Found /uploads/ references in content data:");
  for (const r of refs) {
    console.log(`  ${r.path}: ${r.value}`);
  }
}

console.log("\n--- All image-like paths in data ---");
function findAllImagePaths(obj, path = "") {
  const refs = [];
  for (const [k, v] of Object.entries(obj)) {
    const cur = path ? `${path}.${k}` : k;
    if (typeof v === "string" && (v.startsWith("/") || v.startsWith("http"))) {
      const ext = v.split(".").pop()?.toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "webp", "svg", "heic", "ico"].includes(ext)) {
        refs.push({ path: cur, value: v });
      }
    } else if (typeof v === "object" && v !== null) {
      refs.push(...findAllImagePaths(v, cur));
    }
  }
  return refs;
}
const allImages = findAllImagePaths(data);
for (const r of allImages) {
  console.log(`  ${r.path}: ${r.value}`);
}
