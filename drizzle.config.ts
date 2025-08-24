import { defineConfig } from "drizzle-kit";

import { config } from "dotenv";

config({ path: ".env" });

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  schemaFilter: ["public", "auth", "storage"],
});
