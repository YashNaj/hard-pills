import { drizzle } from "drizzle-orm/postgres-js";
import { DATABASE_URL } from "$env/static/private";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";

const client = postgres(DATABASE_URL, { prepare: false }); // if using Supabase connection pooling
export const db = drizzle({ client, schema });
