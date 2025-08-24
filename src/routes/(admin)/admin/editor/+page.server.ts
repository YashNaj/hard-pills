import { fail } from '@sveltejs/kit';
import { deleteSubmission } from '$lib/server/db/submissions.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Don't pass supabase directly - it's not serializable
	// The Supabase client will be available from the parent layout
	return {};
};

export const actions: Actions = {
	deleteSubmission: async ({ request }) => {
		const data = await request.formData();
		const submissionId = data.get('submissionId') as string;

		if (!submissionId) {
			return fail(400, { error: 'Submission ID is required' });
		}

		try {
			await deleteSubmission(submissionId);
			return { success: true };
		} catch (error) {
			console.error('Error deleting submission:', error);
			return fail(500, { error: 'Failed to delete submission' });
		}
	}
};