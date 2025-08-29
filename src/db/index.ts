import { drizzle } from "drizzle-orm/postgres-js";
import { DATABASE_URL } from "$env/static/private";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";

console.log("🔗 [DB] Initializing database connection...");
console.log("🔗 [DB] DATABASE_URL exists:", !!DATABASE_URL);
console.log(
  "🔗 [DB] DATABASE_URL preview:",
  DATABASE_URL?.slice(0, 20) + "...",
);

const client = postgres(DATABASE_URL, { prepare: false }); // if using Supabase connection pooling
export const db = drizzle({ client, schema });

console.log("🔗 [DB] Database client initialized successfully");
