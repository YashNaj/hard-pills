import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import * as schema from "../../drizzle/schema";

config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL!, { prepare: false }); // if using Supabase connection pooling
export const db = drizzle({ client, schema });

console.log("🔗 [DB] Database client initialized successfully");
