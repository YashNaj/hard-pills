import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";

if (!env.SESSION_URL) throw new Error("DATABASE_URL is not set");

const client = postgres(env.SESSION_URL);

export const db = drizzle(client, { schema });
