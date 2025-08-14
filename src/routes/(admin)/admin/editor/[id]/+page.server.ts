import { redirect } from '@sveltejs/kit';
import { getPost } from '$lib/server/db/posts.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.id) {
		throw redirect(302, '/admin');
	}

	try {
		const post = await getPost(params.id);
		
		if (!post) {
			throw redirect(302, '/admin');
		}

		return {
			post
		};
	} catch (error) {
		console.error('Error loading post:', error);
		throw redirect(302, '/admin');
	}
};
