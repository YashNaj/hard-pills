import { json } from '@sveltejs/kit';
import { updateSubmission, getSubmission, deleteSubmission } from '$lib/server/db/submissions.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		
		if (!id) {
			return json({ error: 'Submission ID is required' }, { status: 400 });
		}
		
		const submission = await getSubmission(id);
		
		if (!submission) {
			return json({ error: 'Submission not found' }, { status: 404 });
		}
		
		return json({ submission });
	} catch (error) {
		console.error('Error fetching submission:', error);
		return json({ error: 'Failed to fetch submission' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const { id } = params;
		const data = await request.json();
		
		if (!id) {
			return json({ error: 'Submission ID is required' }, { status: 400 });
		}
		
		const updatedSubmission = await updateSubmission(id, data);
		
		if (!updatedSubmission) {
			return json({ error: 'Submission not found' }, { status: 404 });
		}
		
		return json({ submission: updatedSubmission });
	} catch (error) {
		console.error('Error updating submission:', error);
		return json({ error: 'Failed to update submission' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		
		if (!id) {
			return json({ error: 'Submission ID is required' }, { status: 400 });
		}
		
		await deleteSubmission(id);
		
		return json({ message: 'Submission deleted successfully' });
	} catch (error) {
		console.error('Error deleting submission:', error);
		return json({ error: 'Failed to delete submission' }, { status: 500 });
	}
};