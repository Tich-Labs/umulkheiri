/**
 * One-time seed: pushes content.json into the Supabase `content` table.
 * Run from the `app/` directory: node scripts/seed-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const content = JSON.parse(readFileSync(join(__dirname, "..", "content.json"), "utf-8"));

const supabase = createClient(
  "https://srpiijgniyvlzfktaaie.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycGlpamduaXl2bHpma3RhYWllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMxNDU1NSwiZXhwIjoyMDkzODkwNTU1fQ.PR7HEBYQZCB6mnxzm6hmOchofjYLDTuLuOTlGXJDvs8"
);

const { error } = await supabase
  .from("content")
  .upsert({ id: 1, data: content, updated_at: new Date().toISOString() });

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log("✓ content.json seeded into Supabase successfully.");
