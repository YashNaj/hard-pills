import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();

	// If already logged in, redirect to admin
	if (session) {
		throw redirect(302, '/admin');
	}

	return {
		session
	};
};