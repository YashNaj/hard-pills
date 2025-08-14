import { createServerClient } from "@supabase/ssr";
import { type Handle, redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

const supabase: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        /**
         * SvelteKit's cookies API requires `path` to be explicitly set in
         * the cookie options. Setting `path` to `/` replicates previous/
         * standard behavior.
         */
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: "/" });
          });
        },
      },
    },
  );
  /**
   * Unlike `supabase.auth.getSession()`, which returns the session *without*
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    if (!session) {
      return { session: null, user: null };
    }
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (error) {
      // JWT validation has failed
      return { session: null, user: null };
    }
    return { session, user };
  };
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;

  // Define protected routes (admin routes)
  const isAdminRoute = event.url.pathname.startsWith('/admin');
  
  // Allow public routes
  const isPublicRoute = 
    event.url.pathname === '/' ||
    event.url.pathname === '/auth' ||
    event.url.pathname.startsWith('/post/') ||
    event.url.pathname.startsWith('/api/auth');

  // If accessing admin route without session, redirect to auth
  if (isAdminRoute && !session) {
    throw redirect(302, '/auth');
  }

  // Additional verification for admin routes - ensure single user restriction
  if (isAdminRoute && session && user) {
    // Replace with your actual phone number
    const ALLOWED_PHONE = '+19515883144';
    
    if (user.phone !== ALLOWED_PHONE) {
      // Sign out unauthorized user
      await event.locals.supabase.auth.signOut();
      throw redirect(302, '/auth');
    }
  }

  return resolve(event);
};

const themeHandler: Handle = async ({ event, resolve }) => {
  // Get theme from cookie
  const theme = event.cookies.get("app-theme") || "light";

  // Apply the theme in the HTML response
  return await resolve(event, {
    transformPageChunk: ({ html }) => {
      const darkClass = theme === "dark" ? "dark" : "";
      return html.replace("<html", `<html class="${darkClass}"`);
    },
  });
};

export const handle: Handle = sequence(supabase, authGuard, themeHandler);
