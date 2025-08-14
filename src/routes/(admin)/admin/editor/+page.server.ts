import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Don't pass supabase directly - it's not serializable
	// The Supabase client will be available from the parent layout
	return {};
};