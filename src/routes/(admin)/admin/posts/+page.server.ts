import { getAllPosts } from '$lib/server/db/posts.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const posts = await getAllPosts();
		
		return {
			posts: posts || [],
			meta: {
				total: posts?.length || 0,
				published: posts?.filter(p => p.status === 'published').length || 0,
				draft: posts?.filter(p => p.status === 'draft').length || 0,
				scheduled: posts?.filter(p => p.status === 'scheduled').length || 0
			}
		};
	} catch (error) {
		console.error('Failed to load posts:', error);
		return {
			posts: [],
			meta: { total: 0, published: 0, draft: 0, scheduled: 0 }
		};
	}
};