import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_HOST) throw new Error("DATABASE_HOST is not set");
if (!process.env.DATABASE_USER) throw new Error("DATABASE_USER is not set");
if (!process.env.DATABASE_PASSWORD)
  throw new Error("DATABASE_PASSWORD is not set");
if (!process.env.DATABASE_NAME) throw new Error("DATABASE_NAME is not set");

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || "6543"),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  },
  verbose: true,
  strict: true,
  schemaFilter: ["public", "auth", "storage"],
});
