import { json } from '@sveltejs/kit';
import { createPost } from '$lib/server/db/posts.js';
import { updateSubmission } from '$lib/server/db/submissions.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { submissionId, title, content, author } = await request.json();
		
		if (!submissionId || !title || !content || !author) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}
		
		// Generate slug from title
		const slug = title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
		
		// Create the post
		const newPost = await createPost({
			title,
			content,
			slug,
			author,
			status: 'draft',
			submissionId
		});
		
		// Update submission status to converted
		await updateSubmission(submissionId, { status: 'converted' });
		
		return json({ post: newPost }, { status: 201 });
	} catch (error) {
		console.error('Error converting submission:', error);
		return json({ error: 'Failed to convert submission' }, { status: 500 });
	}
};