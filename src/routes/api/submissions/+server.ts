import { json } from '@sveltejs/kit';
import { getAllSubmissions, createSubmission } from '$lib/server/db/submissions.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const submissions = await getAllSubmissions();
		return json({ submissions });
	} catch (error) {
		console.error('Error fetching submissions:', error);
		return json({ error: 'Failed to fetch submissions' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		
		if (!data.content) {
			return json({ error: 'Content is required' }, { status: 400 });
		}
		
		const newSubmission = await createSubmission(data);
		
		return json({ submission: newSubmission }, { status: 201 });
	} catch (error) {
		console.error('Error creating submission:', error);
		return json({ error: 'Failed to create submission' }, { status: 500 });
	}
};