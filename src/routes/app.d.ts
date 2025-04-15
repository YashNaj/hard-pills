import { Role } from "./lib/server/roles";
// src/app.d.ts
/// <reference types="@sveltejs/kit" />
declare global {
  namespace App {
    interface Locals {
      supabase: ReturnType<typeof createServerClient>;
      safeGetSession: () => Promise<{
        session: Session | null;
        user: User | null;
      }>;
      session: Session | null;
      db: PrismaClient; // zenstack enhanced client
      userRole: string | null; // Add this line
    }
    interface PageData {
      session: Session | null;
    }
  }
}
