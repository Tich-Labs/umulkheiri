import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const STORAGE_BASE = `${url}/storage/v1/object/public/uploads`;

const replacements = {
  "/uploads/1782475898468.heic": `${STORAGE_BASE}/1782475898468.heic`,
  "/uploads/1782476354553.jpeg": `${STORAGE_BASE}/1782476354553.jpeg`,
  "/uploads/1782476414369.jpeg": `${STORAGE_BASE}/1782476414369.jpeg`,
  "/uploads/1782476424350.jpeg": `${STORAGE_BASE}/1782476424350.jpeg`,
};

/* ── read current content ── */
const { data: rows, error: readErr } = await supabase.from("content").select("id, data").limit(1);
if (readErr) { console.error("Read error:", readErr.message); process.exit(1); }
const row = rows?.[0];
if (!row) { console.log("No content row found"); process.exit(0); }

const oldData = JSON.stringify(row.data);
let newData = oldData;
let count = 0;

for (const [oldPath, newUrl] of Object.entries(replacements)) {
  const escaped = oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "g");
  const matches = newData.match(regex);
  if (matches) {
    count += matches.length;
    console.log(`  ${oldPath} -> ${newUrl} (${matches.length} occurrence${matches.length > 1 ? "s" : ""})`);
  }
  newData = newData.replace(regex, newUrl);
}

if (count === 0) {
  console.log("No /uploads/ references found — nothing to update.");
  process.exit(0);
}

/* ── write back ── */
const { error: writeErr } = await supabase
  .from("content")
  .update({ data: JSON.parse(newData) })
  .eq("id", row.id);

if (writeErr) {
  console.error("Update failed:", writeErr.message);
  process.exit(1);
}

console.log(`\n✅ Updated ${count} image references in content table (row id: ${row.id})`);
