import { json } from '@sveltejs/kit';
import { deletePost, getPost } from '$lib/server/db/posts.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		
		if (!id) {
			return json({ error: 'Post ID is required' }, { status: 400 });
		}
		
		const post = await getPost(id);
		
		if (!post) {
			return json({ error: 'Post not found' }, { status: 404 });
		}
		
		return json({ post });
	} catch (error) {
		console.error('Error fetching post:', error);
		return json({ error: 'Failed to fetch post' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		
		if (!id) {
			return json({ error: 'Post ID is required' }, { status: 400 });
		}
		
		await deletePost(id);
		
		return json({ message: 'Post deleted successfully' });
	} catch (error) {
		console.error('Error deleting post:', error);
		return json({ error: 'Failed to delete post' }, { status: 500 });
	}
};