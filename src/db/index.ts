import { drizzle } from "drizzle-orm/postgres-js";
import { DATABASE_URL } from "$env/static/private";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";

const connectionString = `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}?options=reference%3D${process.env.SUPABASE_PROJECT_REF}`;
const client = postgres(connectionString, { prepare: false }); // if using Supabase connection pooling
export const db = drizzle({ client, schema });
