import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession },
  cookies,
  url,
}) => {
  if (url.pathname === "/") throw redirect(303, "/admin");
  const { session } = await safeGetSession();
  return {
    session,
    cookies: cookies.getAll(),
  };
};
