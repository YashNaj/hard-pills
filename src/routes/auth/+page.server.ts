import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();

	// If already logged in, redirect to admin
	if (session) {
		throw redirect(302, "/admin");
	}

	return {};
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get("email")?.toString();
		const password = formData.get("password")?.toString();

		if (!email || !password) {
			return fail(400, {
				error: "Email and password are required.",
			});
		}

		const { data, error } = await locals.supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return fail(400, {
				error: "Invalid email or password.",
			});
		}

		throw redirect(302, "/admin");
	},
};
