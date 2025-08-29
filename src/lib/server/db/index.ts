import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../../../drizzle/schema";
import { DATABASE_URL } from "$env/static/private";

console.log("🔗 [DB] Initializing database connection...");
console.log("🔗 [DB] DATABASE_URL exists:", !!DATABASE_URL);

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

// Use transaction mode connection (port 6543) for Vercel serverless deployment
// Disable prepared statements as required by Supabase connection pooler
const client = postgres(DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });

console.log("🔗 [DB] Database client initialized successfully");
