import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../../../drizzle/schema";
import { DATABASE_URL } from "$env/static/private";

console.log("🔗 [DB] Initializing database connection...");
console.log("🔗 [DB] DATABASE_URL exists:", !!DATABASE_URL);

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

// Parse DATABASE_URL to check configuration
const url = new URL(DATABASE_URL);
console.log("🔗 [DB] Host:", url.hostname);
console.log("🔗 [DB] Port:", url.port);
console.log("🔗 [DB] Database:", url.pathname.substring(1));
console.log("🔗 [DB] Username:", url.username);
console.log("🔗 [DB] Password exists:", !!url.password);
console.log("🔗 [DB] Password length:", url.password?.length || 0);

// Check for special characters in password that might cause SASL issues
if (url.password) {
  const hasSpecialChars = /[@#$%^&*()+=\[\]{}|\\:";'<>?,./`~]/.test(url.password);
  console.log("🔗 [DB] Password has special characters:", hasSpecialChars);
  if (hasSpecialChars) {
    console.log("🔗 [DB] Special characters found in password - this may cause SASL issues");
  }
}

// Use transaction mode connection (port 6543) for Vercel serverless deployment
// Disable prepared statements as required by Supabase connection pooler
const isProduction = process.env.NODE_ENV === 'production';
console.log("🔗 [DB] Production mode:", isProduction);

const client = postgres(DATABASE_URL, { 
  prepare: false,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 1, // Limit connections for serverless
  idle_timeout: 20, // Close idle connections quickly
  connect_timeout: 10, // Timeout connection attempts
  onnotice: (notice) => console.log("🔗 [DB] Notice:", notice),
  debug: false, // Disable debug in production to reduce noise
  onconnect: (connection) => {
    console.log("🔗 [DB] Successfully connected to database");
  }
});

// Note: postgres-js client doesn't support .on() event listeners
// Error handling will be done at the query level instead

export const db = drizzle(client, { schema });

console.log("🔗 [DB] Database client initialized successfully");
